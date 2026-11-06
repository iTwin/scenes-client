/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from "vitest";
import { RETRY_DEFAULTS } from "../src/api/retry/retryPolicy.js";
import { SceneClient } from "../src/client.js";
import {
  GET_SCENES_DEFAULTS,
  ImageResponse,
  ImageSize,
  OperationType,
  OrderByProperties,
  PagingLinks,
  RetryOptions,
  SceneListResponse,
  SceneMetadataResponse,
  SceneObjectListResponse,
  SceneObjectOperation,
  SceneObjectPagedResponse,
  SceneObjectResponse,
  SceneResponse,
  SceneShareListResponse,
  SceneShareResponse,
  SceneVisibility,
  ScenesApiError,
  TagListResponse,
  TagResponse,
} from "../src/models/index.js";

const BASE_DOMAIN = "https://api.bentley.com/scenes";

const fetchMock = vi.fn();
beforeAll(() => vi.stubGlobal("fetch", fetchMock));
afterAll(() => vi.unstubAllGlobals());
afterEach(() => fetchMock.mockReset());

describe("Client Construction", () => {
  const CUSTOM_BASE = "https://example.com/scenes";

  it.each([
    ["default base URL with no options", () => new SceneClient(getAccessToken), BASE_DOMAIN],
    ["baseUrl string", () => new SceneClient(getAccessToken, CUSTOM_BASE), CUSTOM_BASE],
    [
      "options.baseUrl",
      () => new SceneClient(getAccessToken, { baseUrl: CUSTOM_BASE }),
      CUSTOM_BASE,
    ],
    ["default base URL with empty options", () => new SceneClient(getAccessToken, {}), BASE_DOMAIN],
  ])("uses %s", async (_, createClient, expectedBase) => {
    fetchMock.mockImplementation(() => createSuccessfulResponse(exampleSceneMetadataResponse));
    await createClient().getSceneMetadata({ iTwinId: "itw-1", sceneId: "scene-1" });
    expect(fetchMock.mock.calls[0][0]).toBe(`${expectedBase}/scene-1?iTwinId=itw-1`);
  });

  it("applies options.retry", async () => {
    const client = new SceneClient(getAccessToken, { retry: { maxRetries: 0 } });
    fetchMock.mockImplementation(() =>
      createErrorResponse({ code: "ServerError", message: "boom" }, 500),
    );
    await expect(client.getScenes({ iTwinId: "itw-1" })).rejects.toThrow(ScenesApiError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("Scenes Operations", () => {
  it("getSceneMetadata()", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse(exampleSceneMetadataResponse));
    const client = new SceneClient(getAccessToken);
    await client.getSceneMetadata({
      iTwinId: "itw-1",
      sceneId: "scene-1",
    });
    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1?iTwinId=itw-1`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
    });
  });

  it("getScene()", async () => {
    fetchMock.mockImplementation((url: string) => {
      if (url.includes("/objects?")) {
        // Mock the getAllObjects call
        return createSuccessfulResponse(exampleSceneObjectPagedResponse);
      } else {
        // Mock the getScene call
        return createSuccessfulResponse(exampleSceneMetadataResponse);
      }
    });

    const client = new SceneClient(getAccessToken);
    const result = await client.getScene({
      iTwinId: "itw-1",
      sceneId: "scene-1",
      orderBy: OrderByProperties.NAME,
    });

    // Verify returned SceneResponse format
    expect(result).toMatchObject({
      scene: {
        ...exampleSceneMetadataResponse.scene,
        isPartial: exampleSceneObjectPagedResponse.sceneContext.isPartial,
        sceneData: { objects: exampleSceneObjectPagedResponse.objects },
      },
    });

    verifyFetch(fetchMock, [
      {
        url: `${BASE_DOMAIN}/scene-1?iTwinId=itw-1`,
        headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
      },
      {
        url: `${BASE_DOMAIN}/scene-1/objects?iTwinId=itw-1&$top=100&$skip=0&orderBy=displayName`,
        headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
      },
    ]);
  });

  it("getScenes()", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse(exampleSceneListResponse));
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
    fetchMock.mockImplementation(() => createSuccessfulResponse(exampleSceneListResponse));
    const client = new SceneClient(getAccessToken);
    const it = await client.getAllScenes({ iTwinId: "itw-1" });
    await it.next();

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}?iTwinId=itw-1&$top=${GET_SCENES_DEFAULTS.top}&$skip=${GET_SCENES_DEFAULTS.skip}`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
    });
  });

  it("getAllScenes() respects top & skip params", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse(exampleSceneListResponse));
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
    fetchMock.mockImplementation(() => createSuccessfulResponse(exampleSceneMetadataResponse));
    const client = new SceneClient(getAccessToken);
    const updateData = {
      displayName: "Updated Scene",
      description: "Updated Description",
      visibility: SceneVisibility.ITWIN,
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
    fetchMock.mockImplementation(() => createNoContentResponse());
    const client = new SceneClient(getAccessToken);
    await client.deleteScene({ iTwinId: "itw-1", sceneId: "scene-1" });

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1?iTwinId=itw-1`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
      method: "DELETE",
    });
  });
});

describe("Scene Image Operations", () => {
  it("getSceneImage() without size", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse(exampleImageResponse));
    const client = new SceneClient(getAccessToken);
    const result = await client.getSceneImage({
      iTwinId: "itw-1",
      sceneId: "scene-1",
    });
    expect(result).toEqual(exampleImageResponse);

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1/image?iTwinId=itw-1`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
    });
  });

  it("getSceneImage() with size", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse(exampleImageResponse));
    const client = new SceneClient(getAccessToken);
    await client.getSceneImage({
      iTwinId: "itw-1",
      sceneId: "scene-1",
      size: ImageSize.ORIGINAL,
    });

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1/image?iTwinId=itw-1&size=original`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
    });
  });

  it("uploadSceneImage()", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse(exampleImageResponse));
    const client = new SceneClient(getAccessToken);
    const image = new Uint8Array([1, 2, 3, 4]);
    const result = await client.uploadSceneImage({
      iTwinId: "itw-1",
      sceneId: "scene-1",
      image,
      contentType: "image/png",
    });
    expect(result).toEqual(exampleImageResponse);

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1/image?iTwinId=itw-1`,
      headers: {
        Accept: "application/vnd.bentley.itwin-platform.v1+json",
        "Content-Type": "image/png",
      },
      method: "PUT",
      body: image,
    });
  });

  it("deleteSceneImage()", async () => {
    fetchMock.mockImplementation(() => createNoContentResponse());
    const client = new SceneClient(getAccessToken);
    await client.deleteSceneImage({
      iTwinId: "itw-1",
      sceneId: "scene-1",
    });

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1/image?iTwinId=itw-1`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
      method: "DELETE",
    });
  });
});

describe("Scene Object Operations", () => {
  it("getObject()", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse(exampleSceneObjectResponse));
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
    fetchMock.mockImplementation(() => createSuccessfulResponse(exampleSceneObjectListResponse));
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
    fetchMock.mockImplementation(() => createSuccessfulResponse(exampleSceneObjectPagedResponse));
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
    fetchMock.mockImplementation(() => createSuccessfulResponse(exampleSceneObjectListResponse));
    const client = new SceneClient(getAccessToken);
    await client.postObjects({
      iTwinId: "itw-1",
      sceneId: "scene-1",
      objects: [
        {
          id: "1",
          kind: "Layer",
          version: "1.0.0",
          visible: true,
          data: {},
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
            visible: true,
            data: {},
          },
        ],
      }),
    });
  });

  it("patchObject()", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse(exampleSceneObjectResponse));
    const client = new SceneClient(getAccessToken);
    const updateData = {
      displayName: "Updated Object",
      description: "Updated Description",
    };
    await client.patchObject({
      iTwinId: "itw-1",
      sceneId: "scene-1",
      objectId: "object-1",
      object: updateData,
    });
    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1/objects/object-1?iTwinId=itw-1`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.bentley.itwin-platform.v1+json",
      },
      method: "PATCH",
      body: JSON.stringify(updateData),
    });
  });

  it("patchObjects()", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse({ objects: [] }));
    const objects = [
      {
        id: "object-1",
        displayName: "UpdatedObject1",
        visible: true,
      },
      {
        id: "object-2",
        displayName: "UpdatedObject2",
        visible: true,
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

  it("patchObjectsOperations()", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse({ objects: [] }));
    const operations: SceneObjectOperation[] = [
      // add
      {
        op: OperationType.CREATE,
        payload: {
          kind: "Layer",
          version: "1.0.0",
          displayName: "OpAdded",
          data: {},
        },
      },
      // update
      {
        op: OperationType.UPDATE,
        id: "object-1",
        payload: { displayName: "Updated" },
      },
      // remove
      {
        op: OperationType.DELETE,
        id: "object-2",
      },
    ];
    const client = new SceneClient(getAccessToken);
    await client.patchObjectsOperations({
      iTwinId: "itw-1",
      sceneId: "scene-1",
      operations,
    });

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1/objects?iTwinId=itw-1`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.bentley.itwin-platform.v1+json",
      },
      method: "PATCH",
      body: JSON.stringify({ operations }),
    });
  });

  it("deleteObject()", async () => {
    fetchMock.mockImplementation(() => createNoContentResponse());
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
    fetchMock.mockImplementation(() => createNoContentResponse());
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

describe("Scene Object Image Operations", () => {
  it("getObjectImage() without size", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse(exampleImageResponse));
    const client = new SceneClient(getAccessToken);
    const result = await client.getObjectImage({
      iTwinId: "itw-1",
      sceneId: "scene-1",
      objectId: "object-1",
    });
    expect(result).toEqual(exampleImageResponse);

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1/objects/object-1/image?iTwinId=itw-1`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
    });
  });

  it("getObjectImage() with size", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse(exampleImageResponse));
    const client = new SceneClient(getAccessToken);
    await client.getObjectImage({
      iTwinId: "itw-1",
      sceneId: "scene-1",
      objectId: "object-1",
      size: ImageSize.ORIGINAL,
    });

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1/objects/object-1/image?iTwinId=itw-1&size=original`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
    });
  });

  it("uploadObjectImage()", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse(exampleImageResponse));
    const client = new SceneClient(getAccessToken);
    const image = new Uint8Array([1, 2, 3, 4]);
    const result = await client.uploadObjectImage({
      iTwinId: "itw-1",
      sceneId: "scene-1",
      objectId: "object-1",
      image,
      contentType: "image/png",
    });
    expect(result).toEqual(exampleImageResponse);

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1/objects/object-1/image?iTwinId=itw-1`,
      headers: {
        Accept: "application/vnd.bentley.itwin-platform.v1+json",
        "Content-Type": "image/png",
      },
      method: "PUT",
      body: image,
    });
  });

  it("deleteObjectImage()", async () => {
    fetchMock.mockImplementation(() => createNoContentResponse());
    const client = new SceneClient(getAccessToken);
    await client.deleteObjectImage({
      iTwinId: "itw-1",
      sceneId: "scene-1",
      objectId: "object-1",
    });

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1/objects/object-1/image?iTwinId=itw-1`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
      method: "DELETE",
    });
  });
});

describe("Scene Share Operations", () => {
  it("getSceneShare()", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse(exampleSceneShareResponse));
    const client = new SceneClient(getAccessToken);
    const share = await client.getSceneShare({
      iTwinId: "itw-1",
      sceneId: "scene-1",
      shareId: "share-1",
    });
    expect(share).toEqual(exampleSceneShareResponse);

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1/shares/share-1?iTwinId=itw-1`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
    });
  });

  it("getAllSceneShares()", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse(exampleSceneShareListResponse));
    const client = new SceneClient(getAccessToken);
    const shares = await client.getAllSceneShares({ iTwinId: "itw-1", sceneId: "scene-1" });
    expect(shares).toEqual(exampleSceneShareListResponse);

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1/shares?iTwinId=itw-1`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
    });
  });

  it("postSceneShare()", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse(exampleSceneShareResponse));
    const client = new SceneClient(getAccessToken);
    await client.postSceneShare({
      iTwinId: "itw-1",
      sceneId: "scene-1",
      share: { expiration: "2125-07-16T15:00:00.000Z" },
    });

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1/shares?iTwinId=itw-1`,
      headers: {
        Accept: "application/vnd.bentley.itwin-platform.v1+json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ expiration: "2125-07-16T15:00:00.000Z" }),
    });
  });

  it("postSceneShare() with empty body", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse(exampleSceneShareResponse));
    const client = new SceneClient(getAccessToken);
    await client.postSceneShare({
      iTwinId: "itw-1",
      sceneId: "scene-1",
      share: {},
    });

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1/shares?iTwinId=itw-1`,
      headers: {
        Accept: "application/vnd.bentley.itwin-platform.v1+json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({}),
    });
  });

  it("postSceneShare() with no body", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse(exampleSceneShareResponse));
    const client = new SceneClient(getAccessToken);
    await client.postSceneShare({
      iTwinId: "itw-1",
      sceneId: "scene-1",
    });

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1/shares?iTwinId=itw-1`,
      headers: {
        Accept: "application/vnd.bentley.itwin-platform.v1+json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({}), // Sends empty object
    });
  });

  it("revokeSceneShare()", async () => {
    fetchMock.mockImplementation(() => createNoContentResponse());
    const client = new SceneClient(getAccessToken);
    await client.revokeSceneShare({
      iTwinId: "itw-1",
      sceneId: "scene-1",
      shareId: "share-1",
    });

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/scene-1/shares/share-1?iTwinId=itw-1`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
      method: "DELETE",
    });
  });
});

describe("Tag Operations", () => {
  it("getTag()", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse(exampleTagResponse));
    const client = new SceneClient(getAccessToken);
    await client.getTag({
      iTwinId: "itw-1",
      tagId: "tag-1",
    });

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/tags/tag-1?iTwinId=itw-1`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
    });
  });

  it("getTags()", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse(exampleTagListResponse));
    const client = new SceneClient(getAccessToken);
    const tags = await client.getTags({
      iTwinId: "itw-1",
      top: 10,
      skip: 2,
    });
    expect(tags).toEqual(exampleTagListResponse);

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/tags?iTwinId=itw-1&$top=10&$skip=2`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
    });
  });

  it("getAllTags()", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse(exampleTagListResponse));
    const client = new SceneClient(getAccessToken);
    const it = await client.getAllTags({ iTwinId: "itw-1" });
    await it.next();

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/tags?iTwinId=itw-1&$top=100&$skip=0`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
    });
  });

  it("postTag()", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse(exampleTagResponse));
    const client = new SceneClient(getAccessToken);
    await client.postTag({
      iTwinId: "itw-1",
      tag: { displayName: "Tag 1" },
    });

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/tags?iTwinId=itw-1`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.bentley.itwin-platform.v1+json",
      },
      method: "POST",
      body: JSON.stringify({
        displayName: "Tag 1",
      }),
    });
  });

  it("patchTag()", async () => {
    fetchMock.mockImplementation(() => createSuccessfulResponse(exampleTagResponse));
    const client = new SceneClient(getAccessToken);
    await client.patchTag({
      iTwinId: "itw-1",
      tagId: "tag-1",
      tag: { displayName: "Tag 2" },
    });

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/tags/tag-1?iTwinId=itw-1`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.bentley.itwin-platform.v1+json",
      },
      method: "PATCH",
      body: JSON.stringify({
        displayName: "Tag 2",
      }),
    });
  });

  it("deleteTag()", async () => {
    fetchMock.mockImplementation(() => createNoContentResponse());
    const client = new SceneClient(getAccessToken);
    await client.deleteTag({ iTwinId: "itw-1", tagId: "tag-1" });

    verifyFetch(fetchMock, {
      url: `${BASE_DOMAIN}/tags/tag-1?iTwinId=itw-1`,
      headers: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
      method: "DELETE",
    });
  });
});

describe("Error Handling", () => {
  // maxRetries: 0 keeps these tests focused on single-attempt error parsing/mapping;
  // retry behavior itself is covered by the "Retry Behavior" suite below.
  const client = new SceneClient(getAccessToken, { retry: { maxRetries: 0 } });

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
      method: () => client.deleteScene({ iTwinId: "itw-1", sceneId: "scene-1" }),
    },
    {
      name: "scene image operations",
      method: () => client.getSceneImage({ iTwinId: "itw-1", sceneId: "scene-1" }),
    },
    {
      name: "scene image upload",
      method: () =>
        client.uploadSceneImage({
          iTwinId: "itw-1",
          sceneId: "scene-1",
          image: new Uint8Array([1, 2, 3, 4]),
          contentType: "image/png",
        }),
    },
    {
      name: "scene image deletion",
      method: () => client.deleteSceneImage({ iTwinId: "itw-1", sceneId: "scene-1" }),
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
    {
      name: "object image operations",
      method: () =>
        client.getObjectImage({
          iTwinId: "itw-1",
          sceneId: "scene-1",
          objectId: "object-1",
        }),
    },
    {
      name: "object image upload",
      method: () =>
        client.uploadObjectImage({
          iTwinId: "itw-1",
          sceneId: "scene-1",
          objectId: "object-1",
          image: new Uint8Array([1, 2, 3, 4]),
          contentType: "image/png",
        }),
    },
    {
      name: "object image deletion",
      method: () =>
        client.deleteObjectImage({ iTwinId: "itw-1", sceneId: "scene-1", objectId: "object-1" }),
    },
    {
      name: "scene share operations",
      method: () =>
        client.getSceneShare({ iTwinId: "itw-1", sceneId: "scene-1", shareId: "share-1" }),
    },
    {
      name: "scene share list operations",
      method: () => client.getAllSceneShares({ iTwinId: "itw-1", sceneId: "scene-1" }),
    },
    {
      name: "scene share creation",
      method: () =>
        client.postSceneShare({
          iTwinId: "itw-1",
          sceneId: "scene-1",
          share: {},
        }),
    },
    {
      name: "scene share revocation",
      method: () =>
        client.revokeSceneShare({ iTwinId: "itw-1", sceneId: "scene-1", shareId: "share-1" }),
    },
    {
      name: "tag operations",
      method: () => client.getTag({ iTwinId: "itw-1", tagId: "tag-1" }),
    },
    {
      name: "tag list operations",
      method: () => client.getTags({ iTwinId: "itw-1" }),
    },
    {
      name: "tag creation",
      method: () =>
        client.postTag({
          iTwinId: "itw-1",
          tag: { displayName: "Tag 1" },
        }),
    },
    {
      name: "tag updates",
      method: () =>
        client.patchTag({
          iTwinId: "itw-1",
          tagId: "tag-1",
          tag: { displayName: "Tag 2" },
        }),
    },
    {
      name: "tag deletion",
      method: () => client.deleteTag({ iTwinId: "itw-1", tagId: "tag-1" }),
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
    fetchMock.mockImplementation(() => createSuccessfulResponse({ invalidProperty: "invalid" }));

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
        expect((error as ScenesApiError).message).toMatch(/unexpected response format/i);
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

  it("should populate activityId from the X-Correlation-Id response header", async () => {
    fetchMock.mockImplementation(() =>
      createErrorResponse({ code: "ServerError", message: "Internal server error occurred" }, 500, {
        "X-Correlation-Id": "test-activity-id",
      }),
    );

    try {
      await client.getScene({ iTwinId: "itw-1", sceneId: "scene-1" });
    } catch (error) {
      expect((error as ScenesApiError).activityId).toBe("test-activity-id");
    }
  });

  it("should leave activityId undefined when the X-Correlation-Id header is absent", async () => {
    fetchMock.mockImplementation(() =>
      createErrorResponse({ code: "ServerError", message: "Internal server error occurred" }, 500),
    );

    try {
      await client.getScene({ iTwinId: "itw-1", sceneId: "scene-1" });
    } catch (error) {
      expect((error as ScenesApiError).activityId).toBeUndefined();
    }
  });

  it("should populate activityId for invalid response format errors", async () => {
    fetchMock.mockImplementation(() =>
      createSuccessfulResponse(
        { invalidProperty: "invalid" },
        { "X-Correlation-Id": "test-activity-id" },
      ),
    );

    try {
      await client.getScene({ iTwinId: "itw-1", sceneId: "scene-1" });
    } catch (error) {
      expect((error as ScenesApiError).activityId).toBe("test-activity-id");
    }
  });
});

describe("Retry Behavior", () => {
  // A zero base delay makes every backoff delay 0ms, so tests don't wait on real backoff.
  const fastRetryOptions = { maxRetries: 2, baseDelayMs: 0 };
  const newScene = {
    iTwinId: "itw-1",
    scene: { displayName: "Test", sceneData: { objects: [] } },
  };
  const serverError = () => createErrorResponse({ code: "ServerError", message: "boom" }, 500);
  const client = () => new SceneClient(getAccessToken, { retry: fastRetryOptions });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe("configuration", () => {
    it("uses RETRY_DEFAULTS when no retry options are provided", async () => {
      vi.useFakeTimers();
      const client = new SceneClient(getAccessToken);
      fetchMock.mockImplementation(serverError);

      const promise = expect(client.getScenes({ iTwinId: "itw-1" })).rejects.toThrow(
        ScenesApiError,
      );
      await vi.runAllTimersAsync();
      await promise;

      expect(fetchMock).toHaveBeenCalledTimes(1 + RETRY_DEFAULTS.maxRetries);
    });

    it.each<[keyof RetryOptions, number]>([
      ["maxRetries", -1],
      ["maxRetries", NaN],
      ["maxRetries", 2.5],
      ["maxRetries", 11],
      ["baseDelayMs", -1],
      ["baseDelayMs", NaN],
      ["baseDelayMs", Infinity],
      ["maxDelayMs", -1],
      ["maxDelayMs", NaN],
      ["maxDelayMs", Infinity],
      ["maxRetryAfterMs", -1],
      ["maxRetryAfterMs", NaN],
      ["maxRetryAfterMs", Infinity],
    ])("throws a RangeError for an invalid %s (%s)", (name, value) => {
      const create = () => new SceneClient(getAccessToken, { retry: { [name]: value } });

      expect(create).toThrow(RangeError);
      expect(create).toThrow(`retry.${name}`);
    });

    it("accepts boundary values and explicitly undefined options", async () => {
      vi.useFakeTimers();
      const client = new SceneClient(getAccessToken, {
        retry: {
          maxRetries: 10,
          baseDelayMs: 0,
          maxDelayMs: undefined,
          maxRetryAfterMs: 0,
        },
      });
      fetchMock.mockImplementation(serverError);

      const promise = expect(client.getScenes({ iTwinId: "itw-1" })).rejects.toThrow(
        ScenesApiError,
      );
      await vi.runAllTimersAsync();
      await promise;

      expect(fetchMock).toHaveBeenCalledTimes(11);
    });
  });

  describe("only retryable requests", () => {
    it.each([408, 500, 502, 503, 504])("retries a GET on a %i response", async (status) => {
      const client = new SceneClient(getAccessToken, { retry: fastRetryOptions });
      fetchMock
        .mockImplementationOnce(() => createErrorResponse({}, status))
        .mockImplementationOnce(() => createSuccessfulResponse(exampleSceneListResponse));

      await expect(client.getScenes({ iTwinId: "itw-1" })).resolves.toEqual(
        exampleSceneListResponse,
      );
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("retries a GET on a thrown network error", async () => {
      const client = new SceneClient(getAccessToken, { retry: fastRetryOptions });
      fetchMock
        .mockImplementationOnce(() => Promise.reject(new TypeError("Failed to fetch")))
        .mockImplementationOnce(() => createSuccessfulResponse(exampleSceneListResponse));

      await expect(client.getScenes({ iTwinId: "itw-1" })).resolves.toEqual(
        exampleSceneListResponse,
      );
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("retries a GET when the connection is lost while reading the body", async () => {
      const client = new SceneClient(getAccessToken, { retry: fastRetryOptions });
      fetchMock
        .mockImplementationOnce(() => createBodyFailureResponse(new TypeError("terminated")))
        .mockImplementationOnce(() => createSuccessfulResponse(exampleSceneListResponse));

      await expect(client.getScenes({ iTwinId: "itw-1" })).resolves.toEqual(
        exampleSceneListResponse,
      );
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("throws the body read error once retries are exhausted", async () => {
      const client = new SceneClient(getAccessToken, { retry: fastRetryOptions });
      fetchMock.mockImplementation(() => createBodyFailureResponse(new TypeError("terminated")));

      await expect(client.getScenes({ iTwinId: "itw-1" })).rejects.toThrow("terminated");
      expect(fetchMock).toHaveBeenCalledTimes(1 + fastRetryOptions.maxRetries);
    });

    it.each([
      ["a GET", () => client().getScenes({ iTwinId: "itw-1" })],
      ["a POST", () => client().postScene(newScene)],
    ])("does not retry malformed JSON on %s", async (_, request) => {
      fetchMock.mockImplementation(() =>
        Promise.resolve(new Response("{ not json", { status: 200 })),
      );

      await expect(request()).rejects.toThrow(SyntaxError);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("does not retry a POST when the body read fails", async () => {
      fetchMock.mockImplementation(() => createBodyFailureResponse(new TypeError("terminated")));

      await expect(client().postScene(newScene)).rejects.toThrow("terminated");
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it.each([304, 400, 401, 403, 404, 422])(
      "does not retry a GET on a %i response",
      async (status) => {
        const client = new SceneClient(getAccessToken, { retry: fastRetryOptions });
        fetchMock.mockImplementation(() => createErrorResponse({}, status));

        await expect(client.getScenes({ iTwinId: "itw-1" })).rejects.toThrow(ScenesApiError);
        expect(fetchMock).toHaveBeenCalledTimes(1);
      },
    );

    it.each([500, 502, 503, 504])("retries a DELETE on a %i response", async (status) => {
      const client = new SceneClient(getAccessToken, { retry: fastRetryOptions });
      fetchMock
        .mockImplementationOnce(() => createErrorResponse({}, status))
        .mockImplementationOnce(() => createNoContentResponse());

      await client.deleteScene({ iTwinId: "itw-1", sceneId: "scene-1" });

      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("retries a POST on a 429 response", async () => {
      const client = new SceneClient(getAccessToken, { retry: fastRetryOptions });
      fetchMock
        .mockImplementationOnce(() =>
          createErrorResponse({ code: "TooManyRequests", message: "slow down" }, 429),
        )
        .mockImplementationOnce(() => createSuccessfulResponse(exampleSceneResponse));

      await client.postScene(newScene);

      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it.each([
      ["a network error", () => Promise.reject(new TypeError("Failed to fetch")), TypeError],
      ["a 5xx response", serverError, ScenesApiError],
    ])("does not retry a POST on %s", async (_, failure, expectedError) => {
      const client = new SceneClient(getAccessToken, { retry: fastRetryOptions });
      fetchMock.mockImplementation(failure);

      await expect(client.postScene(newScene)).rejects.toThrow(expectedError);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("retries a PUT image upload on a 503, resending the body", async () => {
      const client = new SceneClient(getAccessToken, { retry: fastRetryOptions });
      const image = new Uint8Array([1, 2, 3, 4]);
      fetchMock
        .mockImplementationOnce(() =>
          createErrorResponse({ code: "ServiceUnavailable", message: "busy" }, 503),
        )
        .mockImplementationOnce(() => createSuccessfulResponse(exampleImageResponse));

      const result = await client.uploadSceneImage({
        iTwinId: "itw-1",
        sceneId: "scene-1",
        image,
        contentType: "image/png",
      });

      expect(result).toEqual(exampleImageResponse);
      const expectedCall = {
        url: `${BASE_DOMAIN}/scene-1/image?iTwinId=itw-1`,
        headers: {
          Accept: "application/vnd.bentley.itwin-platform.v1+json",
          "Content-Type": "image/png",
        },
        method: "PUT",
        body: image,
      };
      verifyFetch(fetchMock, [expectedCall, expectedCall]);
    });
  });

  describe("Retry-After", () => {
    interface RetryAfterCase {
      name: string;
      status: number;
      retryAfter: string;
      waitMs: number;
      retry?: RetryOptions;
      now?: string;
    }

    it.each<RetryAfterCase>([
      { name: "seconds on a 429", status: 429, retryAfter: "5", waitMs: 5000 },
      { name: "seconds on a 503", status: 503, retryAfter: "2", waitMs: 2000 },
      {
        // maxDelayMs only caps backoff; it must not also cap how long a Retry-After is honored for.
        // Retry-After equal to the default maxRetryAfterMs (10s) is still honored.
        name: "up to maxRetryAfterMs, even beyond maxDelayMs",
        status: 429,
        retryAfter: "10",
        retry: { maxDelayMs: 1000 },
        waitMs: 10000,
      },
      {
        name: "an HTTP-date",
        status: 429,
        retryAfter: "Wed, 01 Jan 2025 00:00:05 GMT",
        now: "2025-01-01T00:00:00.000Z",
        waitMs: 5000,
      },
    ])(
      "waits exactly the requested duration: $name",
      async ({ status, retryAfter, retry, now, waitMs }) => {
        vi.useFakeTimers();
        if (now) {
          vi.setSystemTime(new Date(now));
        }
        const client = new SceneClient(getAccessToken, { retry: { maxRetries: 1, ...retry } });
        fetchMock
          .mockImplementationOnce(() =>
            createErrorResponse({ code: "Throttled", message: "retry later" }, status, {
              "Retry-After": retryAfter,
            }),
          )
          .mockImplementationOnce(() => createSuccessfulResponse(exampleSceneListResponse));

        const promise = client.getScenes({ iTwinId: "itw-1" });

        await vi.advanceTimersByTimeAsync(waitMs - 1);
        expect(fetchMock).toHaveBeenCalledTimes(1);

        await vi.advanceTimersByTimeAsync(1);
        await expect(promise).resolves.toEqual(exampleSceneListResponse);
        expect(fetchMock).toHaveBeenCalledTimes(2);
      },
    );

    it("treats a past HTTP-date as retry-now rather than invalid", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-01-01T00:00:05.000Z"));
      const client = new SceneClient(getAccessToken, { retry: { maxRetries: 1 } });
      fetchMock
        .mockImplementationOnce(() =>
          createErrorResponse({ code: "TooManyRequests", message: "slow down" }, 429, {
            "Retry-After": "Wed, 01 Jan 2025 00:00:00 GMT",
          }),
        )
        .mockImplementationOnce(() => createSuccessfulResponse(exampleSceneListResponse));

      const promise = client.getScenes({ iTwinId: "itw-1" });

      // The date is already in the past, so Retry-After resolves to 0ms.
      await vi.advanceTimersByTimeAsync(0);

      await expect(promise).resolves.toEqual(exampleSceneListResponse);
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it.each([
      ["the default 10s", {}, "11"],
      ["a custom maxRetryAfterMs", { maxRetryAfterMs: 1000 }, "2"],
    ])("gives up on a 429 when Retry-After exceeds %s", async (_, retry, retryAfter) => {
      const client = new SceneClient(getAccessToken, { retry: { ...fastRetryOptions, ...retry } });
      fetchMock.mockImplementation(() =>
        createErrorResponse({ code: "TooManyRequests", message: "slow down" }, 429, {
          "Retry-After": retryAfter,
        }),
      );

      await expect(client.getScenes({ iTwinId: "itw-1" })).rejects.toThrow(ScenesApiError);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("backoff and exhaustion", () => {
    it.each([
      // Default policy, Math.random() = 1: the full backoff, doubling from 500ms and capped at 5000ms.
      [{ maxRetries: 5 }, 1, [500, 1000, 2000, 4000, 5000]],
      // Default policy, Math.random() = 0: never less than half the backoff.
      [{ maxRetries: 5 }, 0, [250, 500, 1000, 2000, 2500]],
      // Custom baseDelayMs and maxDelayMs.
      [{ maxRetries: 3, baseDelayMs: 1000, maxDelayMs: 3000 }, 1, [1000, 2000, 3000]],
    ])(
      "waits exponential backoff with equal jitter (%o, random=%d)",
      async (retry, random, expectedDelays) => {
        vi.useFakeTimers();
        vi.spyOn(Math, "random").mockReturnValue(random);
        const client = new SceneClient(getAccessToken, { retry });
        fetchMock.mockImplementation(serverError);

        const promise = expect(client.getScenes({ iTwinId: "itw-1" })).rejects.toThrow(
          ScenesApiError,
        );
        await vi.advanceTimersByTimeAsync(0);
        for (const [i, delayMs] of expectedDelays.entries()) {
          await vi.advanceTimersByTimeAsync(delayMs - 1);
          expect(fetchMock).toHaveBeenCalledTimes(i + 1);
          await vi.advanceTimersByTimeAsync(1);
          expect(fetchMock).toHaveBeenCalledTimes(i + 2);
        }
        await promise;
      },
    );

    it("exhausts maxRetries and throws the final error", async () => {
      const client = new SceneClient(getAccessToken, { retry: fastRetryOptions });
      fetchMock.mockImplementation(serverError);

      await expect(client.getScenes({ iTwinId: "itw-1" })).rejects.toThrow(ScenesApiError);
      expect(fetchMock).toHaveBeenCalledTimes(1 + fastRetryOptions.maxRetries);
    });

    it("discards the response body before retrying a retryable error", async () => {
      const client = new SceneClient(getAccessToken, { retry: fastRetryOptions });
      const cancel = vi.fn().mockResolvedValue(undefined);
      fetchMock
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: false,
            status: 500,
            headers: { get: () => null },
            json: async () => ({ error: { code: "ServerError", message: "boom" } }),
            body: { cancel },
          } as unknown as Response),
        )
        .mockImplementationOnce(() => createSuccessfulResponse(exampleSceneListResponse));

      await client.getScenes({ iTwinId: "itw-1" });

      expect(cancel).toHaveBeenCalledTimes(1);
    });
  });
});

async function getAccessToken(): Promise<string> {
  return "test_auth_token";
}

function createSuccessfulResponse(body: unknown, headers?: Record<string, string>) {
  return Promise.resolve(new Response(JSON.stringify(body), { status: 200, headers }));
}

/** A 200 response whose headers arrive but whose body fails to read, like a connection lost mid-body. */
function createBodyFailureResponse(error: Error) {
  return Promise.resolve({
    ok: true,
    status: 200,
    headers: { get: () => null },
    arrayBuffer: () => Promise.reject(error),
    json: () => Promise.reject(error),
  } as unknown as Response);
}

function createNoContentResponse() {
  return Promise.resolve(new Response(null, { status: 204 }));
}

function createErrorResponse(errorBody: unknown, status: number, headers?: Record<string, string>) {
  return Promise.resolve({
    ok: false,
    status,
    headers: {
      get: (name: string) => headers?.[name] ?? null,
    },
    json: async () => ({ error: errorBody }),
  } as Response);
}

interface VerifyFetchArgs {
  url: string;
  headers: Record<string, string>;
  method?: string; // fetchOptions default to GET
  body?: unknown;
}

function verifyFetch(mock: ReturnType<typeof vi.fn>, args: VerifyFetchArgs | VerifyFetchArgs[]) {
  const argsArray = Array.isArray(args) ? args : [args];

  // Verify total call count
  expect(mock).toHaveBeenCalledTimes(argsArray.length);

  // Verify each call
  argsArray.forEach((args, index) => {
    const callNumber = index + 1;
    expect(mock).toHaveBeenNthCalledWith(callNumber, args.url, {
      method: args.method,
      headers: {
        Authorization: "test_auth_token",
        ...args.headers,
      },
      ...(args.body !== undefined ? { body: args.body } : {}),
    });
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
    description: "Some Description XYZ123",
    iTwinId: "itwin-1",
    createdById: "user-1",
    lastModifiedById: "user-1",
    creationTime: "2025-07-16T15:00:00.000Z",
    lastModified: "2025-07-16T15:00:00.000Z",
    tags: [{ id: "tag-1", displayName: "Tag 1" }],
    visibility: SceneVisibility.ITWIN,
    isPubliclyShared: false,
    sceneData: {
      objects: [
        {
          id: "obj-1",
          kind: "Layer",
          version: "1.0.0",
          data: {},
        },
      ],
    },
  },
};

const exampleSceneMetadataResponse: SceneMetadataResponse = {
  scene: {
    id: "scene-1",
    displayName: "Example Scene",
    description: "Some Description XYZ123",
    iTwinId: "itwin-1",
    createdById: "user-1",
    lastModifiedById: "user-1",
    creationTime: "2025-07-16T15:00:00.000Z",
    lastModified: "2025-07-16T15:00:00.000Z",
    tags: [{ id: "tag-1", displayName: "Tag 1" }],
    visibility: SceneVisibility.ITWIN,
    isPubliclyShared: false,
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
      lastModifiedById: "user-1",
      creationTime: "2025-07-16T15:00:00.000Z",
      lastModified: "2025-07-16T15:00:00.000Z",
      visibility: SceneVisibility.ITWIN,
      isPubliclyShared: false,
      tags: [{ id: "tag-1", displayName: "Tag 1" }],
    },
  ],
  _links: links,
};

const exampleTagResponse: TagResponse = {
  tag: {
    id: "tag-1",
    displayName: "Tag 1",
    iTwinId: "itwin-1",
    createdById: "user-1",
    lastModifiedById: "user-1",
    creationTime: "2025-07-16T15:00:00.000Z",
    lastModified: "2025-07-16T15:00:00.000Z",
  },
};

const exampleTagListResponse: TagListResponse = {
  tags: [exampleTagResponse.tag],
  _links: links,
};

const exampleSceneObjectResponse: SceneObjectResponse = {
  object: {
    id: "obj-1",
    kind: "Layer",
    version: "1.0.0",
    visible: true,
    data: {},
    sceneId: "scene-1",
    createdById: "user-1",
    lastModifiedById: "user-1",
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
    isPubliclyShared: false,
    isPartial: true,
  },
};

const exampleImageResponse: ImageResponse = {
  image: { href: "https://blob.scene-images/itwin-1/scene-1/objects/object-1/image/small.png" },
};

const exampleSceneShareResponse: SceneShareResponse = {
  share: {
    id: "share-1",
    sceneId: "scene-1",
    iTwinId: "itwin-1",
    contractName: "SceneDefault",
    shareKey: "eyJhbGciOiJ...",
    expiration: "2125-07-16T15:00:00.000Z",
    createdById: "user-1",
    lastModifiedById: "user-1",
    creationTime: "2025-07-16T15:00:00.000Z",
    lastModified: "2025-07-16T15:00:00.000Z",
  },
};

const exampleSceneShareListResponse: SceneShareListResponse = {
  shares: [exampleSceneShareResponse.share],
};
