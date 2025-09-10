// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  afterEach,
  vi,
} from "vitest";
import { SceneClient } from "../src/client";
import {
  GET_SCENES_DEFAULTS,
  OrderByProperties,
  PagingLinks,
  SceneInfoResponse,
  SceneListResponse,
  SceneObjectListResponse,
  SceneObjectPagedResponse,
  SceneObjectResponse,
  SceneResponse,
  ScenesApiError,
} from "../src/models/index";

const BASE_DOMAIN = "https://api.bentley.com/scenes";

const fetchMock = vi.fn();
beforeAll(() => vi.stubGlobal("fetch", fetchMock));
afterAll(() => vi.unstubAllGlobals());
afterEach(() => fetchMock.mockReset());

describe("Scenes Operations", () => {
  it("getScene()", async () => {
    fetchMock.mockImplementation(() =>
      createSuccessfulResponse(exampleSceneResponse),
    );
    const client = new SceneClient(getAccessToken);
    await client.getScene({
      iTwinId: "itw-1",
      sceneId: "scene-1",
    });
    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1?iTwinId=itw-1`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
    });
  });

  it("getSceneInfo()", async () => {
    fetchMock.mockImplementation((url: string) => {
      if (url.includes("/objects?")) {
        // Mock the getAllObjects call
        return createSuccessfulResponse(exampleSceneObjectPagedResponse);
      } else {
        // Mock the getScene call
        return createSuccessfulResponse(exampleSceneResponse);
      }
    });

    const client = new SceneClient(getAccessToken);
    const result = await client.getSceneInfo({
      iTwinId: "itw-1",
      sceneId: "scene-1",
      orderBy: OrderByProperties.NAME,
    });

    // Verify returned SceneInfoResponse format
    expect(result).toMatchObject({
      scene: {
        ...exampleSceneResponse.scene,
        isPartial: exampleSceneObjectPagedResponse.sceneContext.isPartial,
        sceneData: { objects: exampleSceneObjectPagedResponse.objects },
      },
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    // First internal call should have been to get the scene
    verifyNthFetch(fetchMock, 1, {
      url: `${BASE_DOMAIN}/scene-1?iTwinId=itw-1`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
    });
    // Second internal call should have been to get the objects
    verifyNthFetch(fetchMock, 2, {
      url: `${BASE_DOMAIN}/scene-1/objects?iTwinId=itw-1&$top=100&$skip=0&orderBy=displayName`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
    });
  });

  it("getScenes()", async () => {
    fetchMock.mockImplementation(() =>
      createSuccessfulResponse(exampleSceneListResponse),
    );
    const client = new SceneClient(getAccessToken);
    const scenes = await client.getScenes({
      iTwinId: "itw-1",
      top: 10,
      skip: 2,
    });
    expect(scenes).toEqual(exampleSceneListResponse);

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}?iTwinId=itw-1&$top=10&$skip=2`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
    });
  });

  it("getAllScenes()", async () => {
    fetchMock.mockImplementation(() =>
      createSuccessfulResponse(exampleSceneListResponse),
    );
    const client = new SceneClient(getAccessToken);
    const it = await client.getAllScenes({ iTwinId: "itw-1" });
    await it.next();

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}?iTwinId=itw-1&$top=${GET_SCENES_DEFAULTS.top}&$skip=${GET_SCENES_DEFAULTS.skip}`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
    });
  });

  it("getAllScenes() respects top & skip params", async () => {
    fetchMock.mockImplementation(() =>
      createSuccessfulResponse(exampleSceneListResponse),
    );
    const client = new SceneClient(getAccessToken);
    const it = await client.getAllScenes({
      iTwinId: "itw-1",
      top: 50,
      skip: 25,
    });
    await it.next();
    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}?iTwinId=itw-1&$top=50&$skip=25`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
    });
  });

  it("postScene()", async () => {
    fetchMock.mockImplementation(() =>
      createSuccessfulResponse(exampleSceneInfoResponse),
    );
    const client = new SceneClient(getAccessToken);
    await client.postScene({
      iTwinId: "itw-1",
      scene: {
        displayName: "My Scene",
        sceneData: { objects: [] },
      },
    });

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}?iTwinId=itw-1`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.bentley.itwin-platform.v1+json",
      },
      method: "POST",
      body: JSON.stringify({
        displayName: "My Scene",
        sceneData: { objects: [] },
      }),
    });
  });

  it("patchScene()", async () => {
    fetchMock.mockImplementation(() =>
      createSuccessfulResponse(exampleSceneResponse),
    );
    const client = new SceneClient(getAccessToken);
    const updateData = {
      displayName: "Updated Scene",
      description: "Updated Description",
    };
    await client.patchScene({
      iTwinId: "itw-1",
      sceneId: "scene-1",
      scene: updateData,
    });

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1?iTwinId=itw-1`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.bentley.itwin-platform.v1+json",
      },
      method: "PATCH",
      body: JSON.stringify(updateData),
    });
  });

  it("deleteScene()", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse({}));
    const client = new SceneClient(getAccessToken);
    await client.deleteScene({ iTwinId: "itw-1", sceneId: "scene-1" });

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1?iTwinId=itw-1`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
      method: "DELETE",
    });
  });
});

describe("Scene Object Operations", () => {
  it("getObject()", async () => {
    fetchMock.mockImplementation(() =>
      createSuccessfulResponse(exampleSceneObjectResponse),
    );
    const client = new SceneClient(getAccessToken);
    await client.getObject({
      iTwinId: "itw-1",
      sceneId: "scene-1",
      objectId: "object-1",
    });

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1/objects/object-1?iTwinId=itw-1`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
    });
  });

  it("getObjects()", async () => {
    fetchMock.mockImplementation(() =>
      createSuccessfulResponse(exampleSceneObjectListResponse),
    );
    const client = new SceneClient(getAccessToken);
    const objects = await client.getObjects({
      iTwinId: "itw-1",
      sceneId: "scene-1",
      top: 24,
      skip: 77,
      orderBy: OrderByProperties.NAME,
    });
    expect(objects).toEqual(exampleSceneObjectListResponse);

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1/objects?iTwinId=itw-1&$top=24&$skip=77&orderBy=displayName`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
    });
  });

  it("getAllObjects()", async () => {
    fetchMock.mockImplementation(() =>
      createSuccessfulResponse(exampleSceneObjectPagedResponse),
    );
    const client = new SceneClient(getAccessToken);
    const it = await client.getAllObjects({
      iTwinId: "itw-1",
      sceneId: "scene-1",
    });
    await it.next();

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1/objects?iTwinId=itw-1&$top=100&$skip=0&orderBy=kind`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
    });
  });

  it("postObjects()", async () => {
    fetchMock.mockImplementation(() =>
      createSuccessfulResponse(exampleSceneObjectListResponse),
    );
    const client = new SceneClient(getAccessToken);
    await client.postObjects({
      iTwinId: "itw-1",
      sceneId: "scene-1",
      objects: [
        {
          id: "1",
          kind: "Layer",
          version: "1.0.0",
          data: { visible: true },
        },
      ],
    });

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1/objects?iTwinId=itw-1`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.bentley.itwin-platform.v1+json",
      },
      method: "POST",
      body: JSON.stringify({
        objects: [
          {
            id: "1",
            kind: "Layer",
            version: "1.0.0",
            data: { visible: true },
          },
        ],
      }),
    });
  });

  it("patchObject()", async () => {
    fetchMock.mockImplementation(() =>
      createSuccessfulResponse(exampleSceneObjectResponse),
    );
    const client = new SceneClient(getAccessToken);
    await client.patchObject({
      iTwinId: "itw-1",
      sceneId: "scene-1",
      objectId: "object-1",
      object: {
        displayName: "UpdatedObject1",
      },
    });
    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1/objects/object-1?iTwinId=itw-1`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.bentley.itwin-platform.v1+json",
      },
      method: "PATCH",
      body: JSON.stringify({
        displayName: "UpdatedObject1",
      }),
    });
  });

  it("patchObjects()", async () => {
    fetchMock.mockImplementation(() =>
      createSuccessfulResponse({ objects: [] }),
    );
    const objects = [
      {
        id: "object-1",
        displayName: "UpdatedObject1",
        data: { visible: true },
      },
      {
        id: "object-2",
        displayName: "UpdatedObject2",
        data: { visible: true },
      },
    ];
    const client = new SceneClient(getAccessToken);
    await client.patchObjects({
      iTwinId: "itw-1",
      sceneId: "scene-1",
      objects,
    });

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1/objects?iTwinId=itw-1`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.bentley.itwin-platform.v1+json",
      },
      method: "PATCH",
      body: JSON.stringify({ objects }),
    });
  });

  it("deleteObject()", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse({}));
    const client = new SceneClient(getAccessToken);
    await client.deleteObject({
      iTwinId: "itw-1",
      sceneId: "scene-1",
      objectId: "object-1",
    });

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1/objects/object-1?iTwinId=itw-1`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
      method: "DELETE",
    });
  });

  it("deleteObjects()", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse({}));
    const client = new SceneClient(getAccessToken);
    await client.deleteObjects({
      iTwinId: "itw-1",
      sceneId: "scene-1",
      objectIds: ["object-1", "object-2"],
    });

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1/objects?iTwinId=itw-1&ids=object-1,object-2`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
      method: "DELETE",
    });
  });
});

describe("Error Handling", () => {
  const client = new SceneClient(getAccessToken);

  // Test different client methods to ensure error handling works across all endpoints
  const testCases = [
    {
      name: "scene operations",
      method: () => client.getScene({ iTwinId: "itw-1", sceneId: "scene-1" }),
    },
    {
      name: "scene list operations",
      method: () => client.getScenes({ iTwinId: "itw-1" }),
    },
    {
      name: "scene creation",
      method: () =>
        client.postScene({
          iTwinId: "itw-1",
          scene: { displayName: "Test", sceneData: { objects: [] } },
        }),
    },
    {
      name: "scene updates",
      method: () =>
        client.patchScene({
          iTwinId: "itw-1",
          sceneId: "scene-1",
          scene: { displayName: "Updated" },
        }),
    },
    {
      name: "scene deletion",
      method: () =>
        client.deleteScene({ iTwinId: "itw-1", sceneId: "scene-1" }),
    },
    {
      name: "object operations",
      method: () =>
        client.getObject({
          iTwinId: "itw-1",
          sceneId: "scene-1",
          objectId: "object-1",
        }),
    },
    {
      name: "object updates",
      method: () =>
        client.patchObject({
          iTwinId: "itw-1",
          sceneId: "scene-1",
          objectId: "object-1",
          object: { displayName: "Updated" },
        }),
    },
  ];

  it("should throw ScenesApiError for server errors", async () => {
    fetchMock.mockImplementation(() =>
      createErrorResponse(
        {
          code: "ServerError",
          message: "Internal server error occurred",
        },
        500,
      ),
    );

    // Test that all client methods properly handle server errors
    for (const testCase of testCases) {
      await expect(testCase.method()).rejects.toThrow(ScenesApiError);
    }
  });

  it("should throw ScenesApiError for invalid response format", async () => {
    fetchMock.mockImplementation(() =>
      createSuccessfulResponse({ invalidProperty: "invalid" }),
    );

    // Test methods that expect specific response formats
    const formatTestCases = testCases.filter(
      (tc) => !tc.name.includes("deletion"), // DELETE methods don't validate response format
    );

    for (const testCase of formatTestCases) {
      try {
        await testCase.method();
      } catch (error) {
        expect(error).toBeInstanceOf(ScenesApiError);
        expect((error as ScenesApiError).code).toBe("InvalidResponse");
        expect((error as ScenesApiError).message).toMatch(
          /unexpected response format/i,
        );
      }
    }
  });

  it("should properly parse error details (code, message, target, details)", async () => {
    const errorResponse = {
      code: "ValidationError",
      message: "Request validation failed",
      target: "requestBody",
      details: [
        {
          code: "Required",
          message: "displayName is required",
        },
        {
          code: "InvalidFormat",
          message: "iTwinId must be a valid UUID",
        },
      ],
    };

    fetchMock.mockImplementation(() => createErrorResponse(errorResponse, 422));

    try {
      await client.getScene({ iTwinId: "itw-1", sceneId: "scene-1" });
    } catch (error) {
      expect(error).toBeInstanceOf(ScenesApiError);
      const apiError = error as ScenesApiError;

      // Verify all error properties are correctly parsed
      expect(apiError.code).toBe("ValidationError");
      expect(apiError.message).toBe("Request validation failed");
      expect(apiError.status).toBe(422);
      expect(apiError.target).toBe("requestBody");
      expect(apiError.details).toHaveLength(2);

      // Verify error details array
      const details = apiError.details;
      expect(details).toBeDefined();
      expect(details).toHaveLength(2);
      expect(details?.[0]?.code).toBe("Required");
      expect(details?.[0]?.message).toBe("displayName is required");
      expect(details?.[1]?.code).toBe("InvalidFormat");
      expect(details?.[1]?.message).toBe("iTwinId must be a valid UUID");
    }
  });
});

async function getAccessToken(): Promise<string> {
  return "test_auth_token";
}

function createSuccessfulResponse(body: unknown) {
  return Promise.resolve({
    ok: true,
    json: async () => body,
  } as Response);
}

function createErrorResponse(errorBody: unknown, status: number) {
  return Promise.resolve({
    ok: false,
    status,
    json: async () => ({ error: errorBody }),
  } as Response);
}

interface VerifyFetchArgs {
  url: string;
  headers: Record<string, string>;
  method?: string; // fetchOptions default to GET
  body?: string;
}

function verifyFetch(mock: ReturnType<typeof vi.fn>, args: VerifyFetchArgs) {
  expect(mock).toHaveBeenCalledTimes(1);
  expect(mock).toHaveBeenCalledWith(args.url, {
    method: args.method,
    headers: {
      Authorization: "test_auth_token",
      ...args.headers,
    },
    ...(args.body !== undefined ? { body: args.body } : {}),
  });
}

function verifyNthFetch(
  mock: ReturnType<typeof vi.fn>,
  n: number,
  args: VerifyFetchArgs,
) {
  expect(mock).toHaveBeenNthCalledWith(n, args.url, {
    method: args.method,
    headers: {
      Authorization: "test_auth_token",
      ...args.headers,
    },
    ...(args.body !== undefined ? { body: args.body } : {}),
  });
}

// mock responses
const links: PagingLinks = {
  self: { href: "/scenes?page=1" },
};

const exampleSceneInfoResponse: SceneInfoResponse = {
  scene: {
    id: "scene-1",
    displayName: "Example Scene",
    description: "Some Description XYZ123",
    iTwinId: "itwin-1",
    createdById: "user-1",
    creationTime: "2025-07-16T15:00:00.000Z",
    lastModified: "2025-07-16T15:00:00.000Z",
    sceneData: {
      objects: [
        {
          id: "obj-1",
          kind: "Layer",
          version: "1.0.0",
          data: { visible: true },
        },
      ],
    },
  },
};

const exampleSceneResponse: SceneResponse = {
  scene: {
    id: "scene-1",
    displayName: "Example Scene",
    description: "Some Description XYZ123",
    iTwinId: "itwin-1",
    createdById: "user-1",
    creationTime: "2025-07-16T15:00:00.000Z",
    lastModified: "2025-07-16T15:00:00.000Z",
    sceneData: {
      objects: {
        href: `${BASE_DOMAIN}/scene-1/objects?iTwinId=itwin-1`,
      },
    },
  },
};

const exampleSceneListResponse: SceneListResponse = {
  scenes: [
    {
      id: "scene-1",
      displayName: "Example Scene",
      description: "Some Description XYZ123",
      iTwinId: "itwin-1",
      createdById: "user-1",
      creationTime: "2025-07-16T15:00:00.000Z",
      lastModified: "2025-07-16T15:00:00.000Z",
    },
  ],
  _links: links,
};

const exampleSceneObjectResponse: SceneObjectResponse = {
  object: {
    id: "obj-1",
    kind: "Layer",
    version: "1.0.0",
    data: { visible: true },
    sceneId: "scene-1",
    createdById: "user-1",
    creationTime: "2025-07-16T15:00:00.000Z",
    lastModified: "2025-07-16T15:00:00.000Z",
  },
};

const exampleSceneObjectListResponse: SceneObjectListResponse = {
  objects: [exampleSceneObjectResponse.object],
};

const exampleSceneObjectPagedResponse: SceneObjectPagedResponse = {
  ...exampleSceneObjectListResponse,
  _links: links,
  sceneContext: {
    displayName: exampleSceneResponse.scene.displayName,
    lastModified: exampleSceneResponse.scene.lastModified,
    isPartial: true,
  },
};
