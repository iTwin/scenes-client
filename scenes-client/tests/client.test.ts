/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from "vitest";
import { SceneClient } from "../src/client";
import { RequestArgs } from "../src/Fetch";

const BASE_DOMAIN = "itwinscenes-eus.bentley.com";
const urlPrefix = "dev-";

describe("Scenes Client", () => {
  const fetchMock = vi.fn();
  beforeAll(() => vi.stubGlobal("fetch", fetchMock));
  afterAll(() => vi.unstubAllGlobals());
  afterEach(() => fetchMock.mockReset());

  it("getScenes()", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse({ scenes: [] }));
    const client = new SceneClient({ getAccessToken, urlPrefix });
    await client.getScenes({ iTwinId: "itw-1" });

    verifyFetch(fetchMock, {
      url: `${makeBaseUrl(urlPrefix)}/v1/iTwins/itw-1/scenes`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
    });
  });

  it("getScene()", async() => {
    fetchMock.mockImplementation(() => createSuccessfulResponse({ scene: {} }));
    const client = new SceneClient({ getAccessToken, urlPrefix });
    await client.getScene({ iTwinId: "itw-1", sceneId: "scene-1" });
    verifyFetch(fetchMock, {
      url: `${makeBaseUrl(urlPrefix)}/v1/iTwins/itw-1/scenes/scene-1?orderBy=order`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
    });
  });

  it("postScene()", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse({ scene: {} }));
    const client = new SceneClient({ getAccessToken, urlPrefix });
    await client.postScene({
      iTwinId: "itw-1",
      scene: {
        displayName: "My Scene",
        sceneData: { objects: [] }
      }
    });

    verifyFetch(fetchMock, {
      url: `${makeBaseUrl(urlPrefix)}/v1/iTwins/itw-1/scenes`,
      headers: { 
        "Content-Type": "application/json",
        Accept: "application/vnd.bentley.itwin-platform.v1+json"
      },
      method: "POST",
      body: JSON.stringify({
        displayName: "My Scene",
        sceneData: { objects: [] }
      }),
    });
  })

  it("postObject()", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse({ object: {} }));
    const client = new SceneClient({ getAccessToken, urlPrefix });
    await client.postObject({
      iTwinId: "itw-1",
      sceneId: "scene-1",
      object: {
        iTwinId: "itw-1",
        kind: "TestObject",
        version: "1.0.0",
        data: { test: "data" },
      },  
    });
    
    verifyFetch(fetchMock, {
      url: `${makeBaseUrl(urlPrefix)}/v1/iTwins/itw-1/scenes/scene-1/objects`,
      headers: { 
        "Content-Type": "application/json",
        Accept: "application/vnd.bentley.itwin-platform.v1+json"
       },
      method: "POST",
      body: JSON.stringify({
        iTwinId: "itw-1",
        kind: "TestObject",
        version: "1.0.0",
        data: { test: "data" },
      }),
    });
  });

  it("patchScene()", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse({ scene: {} }));
    const client = new SceneClient({ getAccessToken, urlPrefix });
    await client.patchScene({
      iTwinId: "itw-1",
      sceneId: "scene-1",
      scene: { displayName: "Updated Scene" },
    });

    verifyFetch(fetchMock, {
      url: `${makeBaseUrl(urlPrefix)}/v1/iTwins/itw-1/scenes/scene-1`,
      headers: { 
        "Content-Type": "application/json",
        Accept: "application/vnd.bentley.itwin-platform.v1+json"
      },
      method: "PATCH",
      body: JSON.stringify({ displayName: "Updated Scene" }),
    });
  });

  it("patchObject()", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse({ object: {} }));
    const client = new SceneClient({ getAccessToken, urlPrefix });
    await client.patchObject({
      iTwinId: "itw-1",
      sceneId: "scene-1",
      objectId: "object-1",
      object: {
        kind: "UpdatedObject",
        data: { updated: "data" },
      },
    })

    verifyFetch(fetchMock, {
      url: `${makeBaseUrl(urlPrefix)}/v1/iTwins/itw-1/scenes/scene-1/objects/object-1`,
      headers: { 
        "Content-Type": "application/json",
        Accept: "application/vnd.bentley.itwin-platform.v1+json"
      },
      method: "PATCH",
      body: JSON.stringify({
        kind: "UpdatedObject",
        data: { updated: "data" },
      }),
    });
  });
  
  it("deleteScene()", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse({}));
    const client = new SceneClient({ getAccessToken, urlPrefix });
    await client.deleteScene({ iTwinId: "itw-1", sceneId: "scene-1" });

    verifyFetch(fetchMock, {
      url: `${makeBaseUrl(urlPrefix)}/v1/iTwins/itw-1/scenes/scene-1`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
      method: "DELETE",
    });
  });

  it("deleteObject()", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse({}));
    const client = new SceneClient({ getAccessToken, urlPrefix });
    await client.deleteObject({ iTwinId: "itw-1", sceneId: "scene-1", objectId: "object-1" });

    verifyFetch(fetchMock, {
      url: `${makeBaseUrl(urlPrefix)}/v1/iTwins/itw-1/scenes/scene-1/objects/object-1`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
      method: "DELETE",
    });
  });

  it("deleteObjects()", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse({}));
    const client = new SceneClient({ getAccessToken, urlPrefix });
    await client.deleteObjects({ iTwinId: "itw-1", sceneId: "scene-1", objectIds: ["object-1", "object-2"] });

    verifyFetch(fetchMock, {
      url: `${makeBaseUrl(urlPrefix)}/v1/iTwins/itw-1/scenes/scene-1/objects?ids=object-1,object-2`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
      method: "DELETE",
    });
  });
});

async function getAccessToken(): Promise<string> {
  return "test_auth_token";
}

function makeBaseUrl(urlPrefix: RequestArgs<any>["urlPrefix"] = ""): string {
  return `https://${urlPrefix}${BASE_DOMAIN}`;
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
  expect(mock).toHaveBeenCalledWith(
    args.url,
    {
      method: args.method,
      headers: {
        Authorization: "test_auth_token",
        ...args.headers,
      },
      ...(args.body !== undefined ? { body: args.body } : {}),
    }
  );
}