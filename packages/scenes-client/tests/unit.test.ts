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
  PagingLinks,
  SceneListResponse,
  SceneObjectListResponse,
  SceneObjectResponse,
  SceneResponse,

 } from "../src/models/index";

const BASE_DOMAIN = "https://itwinscenes-eus.bentley.com";

describe("Scenes Client", () => {
  const fetchMock = vi.fn();
  beforeAll(() => vi.stubGlobal("fetch", fetchMock));
  afterAll(() => vi.unstubAllGlobals());
  afterEach(() => fetchMock.mockReset());

  it("getScenes()", async () => {
    fetchMock.mockImplementation(() =>
      createSuccessfulResponse(exampleSceneListResponse),
    );
    const client = new SceneClient(getAccessToken);
    await client.getScenes({ iTwinId: "itw-1" });

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/v1/scenes?iTwinId=itw-1&$top=100&$skip=0`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
    });
  });

  it("getScene()", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse(exampleSceneResponse));
    const client = new SceneClient(getAccessToken);
    await client.getScene({ iTwinId: "itw-1", sceneId: "scene-1" });
    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/v1/scenes/scene-1?iTwinId=itw-1`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
    });
  });

  it("postScene()", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse(exampleSceneResponse));
    const client = new SceneClient(getAccessToken);
    await client.postScene({
      iTwinId: "itw-1",
      scene: {
        displayName: "My Scene",
        sceneData: { objects: [] },
      },
    });

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/v1/scenes?iTwinId=itw-1`,
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

  it("postObject()", async () => {
    fetchMock.mockImplementation(() =>
      createSuccessfulResponse(exampleSceneObjectResponse),
    );
    const client = new SceneClient(getAccessToken);
    await client.postObject({
      iTwinId: "itw-1",
      sceneId: "scene-1",
      object: {
        kind: "TestObject",
        version: "1.0.0",
        data: { test: "data" },
      },
    });

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/v1/scenes/scene-1/objects?iTwinId=itw-1`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.bentley.itwin-platform.v1+json",
      },
      method: "POST",
      body: JSON.stringify({
        kind: "TestObject",
        version: "1.0.0",
        data: { test: "data" },
      }),
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
          kind: "TestObject1",
          version: "1.0.0",
          data: { test: "data1" },
        },
        {
          iTwinId: "itw-1",
          kind: "TestObject2",
          version: "1.0.0",
          data: { test: "data2" },
        },
      ],
    });

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/v1/scenes/scene-1/objects?iTwinId=itw-1`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.bentley.itwin-platform.v1+json",
      },
      method: "POST",
      body: JSON.stringify([
        {
          kind: "TestObject1",
          version: "1.0.0",
          data: { test: "data1" },
        },
        {
          iTwinId: "itw-1",
          kind: "TestObject2",
          version: "1.0.0",
          data: { test: "data2" },
        },
      ]),
    });
  });

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
      url: `${BASE_DOMAIN}/v1/scenes/scene-1/objects/object-1?iTwinId=itw-1`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
    });
  });

  it("getObjects()", async () => {
    fetchMock.mockImplementation(() =>
      createSuccessfulResponse({ objects: [] }),
    );
    const client = new SceneClient(getAccessToken);
    await client.getObjects({ iTwinId: "itw-1", sceneId: "scene-1" });
    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/v1/scenes/scene-1/objects?iTwinId=itw-1`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
    });
  });

  it("patchScene()", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse(exampleSceneResponse));
    const client = new SceneClient(getAccessToken);
    await client.patchScene({
      iTwinId: "itw-1",
      sceneId: "scene-1",
      scene: { displayName: "Updated Scene" },
    });

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/v1/scenes/scene-1?iTwinId=itw-1`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.bentley.itwin-platform.v1+json",
      },
      method: "PATCH",
      body: JSON.stringify({ displayName: "Updated Scene" }),
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
        displayName: "UpdatedObject",
        data: { updated: "data" },
      },
    });

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/v1/scenes/scene-1/objects/object-1?iTwinId=itw-1`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.bentley.itwin-platform.v1+json",
      },
      method: "PATCH",
      body: JSON.stringify({
        displayName: "UpdatedObject",
        data: { updated: "data" },
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
      url: `${BASE_DOMAIN}/v1/scenes/scene-1/objects?iTwinId=itw-1`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.bentley.itwin-platform.v1+json",
      },
      method: "PATCH",
      body: JSON.stringify([
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
      ]),
    });
  });

  it("deleteScene()", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse({}));
    const client = new SceneClient(getAccessToken);
    await client.deleteScene({ iTwinId: "itw-1", sceneId: "scene-1" });

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/v1/scenes/scene-1?iTwinId=itw-1`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
      method: "DELETE",
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
      url: `${BASE_DOMAIN}/v1/scenes/scene-1/objects/object-1?iTwinId=itw-1`,
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
      url: `${BASE_DOMAIN}/v1/scenes/scene-1/objects?iTwinId=itw-1&ids=object-1,object-2`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
      method: "DELETE",
    });
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

interface VerifyFetchArgs {
  url: string;
  headers: Record<string, string>;
  method?: string; // cuz fetchOptions default to GET
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
  self: { href: "/scenes?page=1" }
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
          data: {}
        }
      ]
    }
  }
};

const exampleSceneListResponse: SceneListResponse = {
  scenes: [
    {
      id: "scene-1",
      displayName: "Example Scene",
      iTwinId: "itwin-1",
      createdById: "user-1",
      creationTime: "2025-07-16T15:00:00.000Z",
      lastModified: "2025-07-16T15:00:00.000Z"
    }
  ],
  _links: links
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
    lastModified: "2025-07-16T15:00:00.000Z"
  }
};

const exampleSceneObjectListResponse: SceneObjectListResponse = {
  objects: [
    {
      id: "obj-1",
      kind: "MyKind",
      version: "1.0.0",
      data: {},
      displayName: "Object 1",
      order: 1,
      parentId: "parent-1",
      relatedId: "related-1",
      iTwinId: "itwin-1",
      createdById: "user-1",
      creationTime: "2025-07-16T15:00:00.000Z",
      lastModified: "2025-07-16T15:00:00.000Z"
    }
  ],
  _links: links
};
