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
      orderBy: OrderByProperties.NAME,
    });
    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1?iTwinId=itw-1&orderBy=displayName`,
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
      createSuccessfulResponse(exampleSceneResponse),
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
    await client.patchScene({
      iTwinId: "itw-1",
      sceneId: "scene-1",
      scene: { displayName: "Updated Scene" },
    });

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1?iTwinId=itw-1`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.bentley.itwin-platform.v1+json",
      },
      method: "PATCH",
      body: JSON.stringify({ displayName: "Updated Scene" }),
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
          kind: "layer",
          version: "oldversion",
          data: { data: "" },
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
            kind: "layer",
            version: "oldversion",
            data: { data: "" },
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
    const client = new SceneClient(getAccessToken);
    await client.patchObjects({
      iTwinId: "itw-1",
      sceneId: "scene-1",
      objects: [
        {
          id: "object-1",
          displayName: "UpdatedObject1",
          data: { updated: "data1" },
        },
        {
          id: "object-2",
          displayName: "UpdatedObject2",
          data: { updated: "data2" },
        },
      ],
    });

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1/objects?iTwinId=itw-1`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.bentley.itwin-platform.v1+json",
      },
      method: "PATCH",
      body: JSON.stringify({
        objects: [
          {
            id: "object-1",
            displayName: "UpdatedObject1",
            data: { updated: "data1" },
          },
          {
            id: "object-2",
            displayName: "UpdatedObject2",
            data: { updated: "data2" },
          },
        ],
      }),
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
  it("should throw ScenesApiError for 404 Not Found", async () => {
    fetchMock.mockImplementation(() =>
      createErrorResponse(
        {
          code: "SceneNotFound",
          message: "Scene not found",
        },
        404,
      ),
    );
    const client = new SceneClient(getAccessToken);

    await expect(
      client.getScene({
        iTwinId: "itw-1",
        sceneId: "nonexistent-scene",
      }),
    ).rejects.toThrow(ScenesApiError);

    try {
      await client.getScene({
        iTwinId: "itw-1",
        sceneId: "nonexistent-scene",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ScenesApiError);
      expect((error as ScenesApiError).code).toBe("SceneNotFound");
      expect((error as ScenesApiError).message).toBe("Scene not found");
      expect((error as ScenesApiError).status).toBe(404);
    }
  });

  it("should throw ScenesApiError for 400 Bad Request with details", async () => {
    fetchMock.mockImplementation(() =>
      createErrorResponse(
        {
          code: "InvalidRequest",
          message: "The request is invalid",
          target: "iTwinId",
          details: [
            {
              code: "Required",
              message: "iTwinId is required",
            },
          ],
        },
        400,
      ),
    );
    const client = new SceneClient(getAccessToken);

    try {
      await client.getScenes({
        iTwinId: "", // Invalid empty iTwinId
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ScenesApiError);
      expect((error as ScenesApiError).code).toBe("InvalidRequest");
      expect((error as ScenesApiError).message).toBe("The request is invalid");
      expect((error as ScenesApiError).status).toBe(400);
      expect((error as ScenesApiError).target).toBe("iTwinId");
      expect((error as ScenesApiError).details).toHaveLength(1);
      const details = (error as ScenesApiError).details;
      expect(details?.[0]?.code).toBe("Required");
      expect(details?.[0]?.message).toBe("iTwinId is required");
    }
  });

  it("should throw ScenesApiError for 401 Unauthorized", async () => {
    fetchMock.mockImplementation(() =>
      createErrorResponse(
        {
          code: "Unauthorized",
          message: "Access token is invalid or expired",
        },
        401,
      ),
    );
    const client = new SceneClient(getAccessToken);

    try {
      await client.getScenes({
        iTwinId: "itw-1",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ScenesApiError);
      expect((error as ScenesApiError).code).toBe("Unauthorized");
      expect((error as ScenesApiError).message).toBe("Access token is invalid or expired");
      expect((error as ScenesApiError).status).toBe(401);
    }
  });

  it("should throw ScenesApiError for invalid response format", async () => {
    fetchMock.mockImplementation(() =>
      createSuccessfulResponse({ invalidProperty: "invalid" }),
    );
    const client = new SceneClient(getAccessToken);

    try {
      await client.getScene({
        iTwinId: "itw-1",
        sceneId: "scene-1",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ScenesApiError);
      expect((error as ScenesApiError).code).toBe("InvalidResponse");
      expect((error as ScenesApiError).message).toContain(
        "unexpected response format",
      );
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

// mock responses
const links: PagingLinks = {
  self: { href: "/scenes?page=1" },
};
const exampleSceneResponse: SceneResponse = {
  scene: {
    id: "scene-1",
    displayName: "Example Scene",
    iTwinId: "itwin-1",
    createdById: "user-1",
    creationTime: "2025-07-16T15:00:00.000Z",
    lastModified: "2025-07-16T15:00:00.000Z",
    sceneData: {
      objects: [
        {
          id: "obj-1",
          kind: "MyKind",
          version: "1.0.0",
          data: {},
        },
      ],
    },
  },
};

const exampleSceneListResponse: SceneListResponse = {
  scenes: [
    {
      id: "scene-1",
      displayName: "Example Scene",
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
    kind: "MyKind",
    version: "1.0.0",
    data: {},
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
};
