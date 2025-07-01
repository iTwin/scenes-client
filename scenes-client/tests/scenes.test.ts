/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from "vitest";
import { SceneClient } from "../src/client";
import { SceneMinimal, SceneObjectMinimal } from "../src/scenes";

const BASE_URL = "https://itwinscenes-eus.bentley.com";

function createJsonResponse(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function getAccessToken(): Promise<string> {
  return "test_auth_token";
}

describe("Scenes Client", () => {
  const fetchMock = vi.fn();
  beforeAll(() => vi.stubGlobal("fetch", fetchMock));
  afterAll(() => vi.unstubAllGlobals());
  afterEach(() => fetchMock.mockReset());

  it("getScenes()", async () => {
    const iTwinId = "itw-1";
    const now = new Date();
    const payload : SceneMinimal[] = [
      {
        id: "s1",
        iTwinId,
        displayName: "A",
        parentId: undefined,
        createdById: "user-123",
        creationTime: now,
        lastModified: now,
      },
    ];

    fetchMock.mockResolvedValueOnce(createJsonResponse({ scenes: payload }));

    const client = new SceneClient({ getAccessToken })
    const res = await client.getScenes({ iTwinId });
    
    // @naron: saved view client uses a verifyFetch function that encaps all equal checks, maybe I should do the same
    // parse converts Date to strings for comparison
    const jsonPayload = JSON.parse(JSON.stringify(payload));
    expect(res).toEqual(jsonPayload);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    
    const [url, init] = fetchMock.mock.calls[0]; // retrieve the fetch call arguments in callApi
    expect(url).toBe(`${BASE_URL}/v1/iTwins/${iTwinId}/scenes`);
    const method = init?.method ?? "GET"; // the fetchOptions defaults to Get
    expect(method).toBe("GET");
    expect(init?.headers).toMatchObject({
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
    });
    expect(init?.headers?.Authorization).toBe("test_auth_token");
  });

  // it("getScene()", async () => {
  //   const iTwinId = "itw-1";
  //   const sceneId = "s1";
  //   const now = new Date().toISOString();

  //   fetchMock.mockResolvedValueOnce(createJsonResponse({ scene: payload }));

  //   const client = new SceneClient({ getAccessToken });
  //   const res = await client.getScene({ iTwinId, sceneId });

  //   expect(res).toEqual({ scene: payload });
  //   expect(fetchMock).toHaveBeenCalledTimes(1);

  //   const [url, init] = fetchMock.mock.calls[0];
  //   expect(url).toBe(`${BASE_URL}/v1/iTwins/${iTwinId}/scenes/${sceneId}?orderBy=order`);
  //   const method = init?.method ?? "GET"; // the fetchOptions defaults to Get
  //   expect(method).toBe("GET");
  // });


});