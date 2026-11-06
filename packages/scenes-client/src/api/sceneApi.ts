/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  SceneListResponse,
  SceneResponse,
  isSceneListResponse,
  isSceneResponse,
  GetScenesOptions,
  GetSceneParams,
  GetAllScenesParams,
  PostSceneParams,
  PatchSceneParams,
  DeleteSceneParams,
  GetScenesParams,
  SceneObject,
  GET_OBJECTS_DEFAULTS,
  GetSceneMetadataParams,
  isSceneMetadataResponse,
  SceneMetadataResponse,
} from "../models/index.js";
import { iteratePagedEndpoint } from "../utilities.js";
import { callApi, ClientArgs } from "./apiFetch.js";
import { getAllObjects } from "./sceneObjectApi.js";

/**
 * Fetches a single scene by its ID (minimal representation with object links).
 * @param params - {@link GetSceneParams}
 * @returns Scene metadata and relevant links.
 * @throws {ScenesApiError} If the API call fails or the response format is invalid.
 */
export async function getSceneMetadata(
  { sceneId, iTwinId }: GetSceneMetadataParams,
  clientArgs: ClientArgs,
): Promise<SceneMetadataResponse> {
  return callApi<SceneMetadataResponse>({
    endpoint: `/${sceneId}?iTwinId=${iTwinId}`,
    ...clientArgs,
    typeGuard: isSceneMetadataResponse,
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
    },
  });
}

/**
 * Fetches a single scene and all its all objects by ID.
 * @param params - {@link GetSceneInfoParams}
 * @returns Scene details.
 * @throws {ScenesApiError} If the API call fails or the response format is invalid.
 */
export async function getScene(
  { sceneId, orderBy, iTwinId }: GetSceneParams,
  clientArgs: ClientArgs,
): Promise<SceneResponse> {
  const params = { sceneId, iTwinId };
  const opts = {
    top: GET_OBJECTS_DEFAULTS.top,
    skip: GET_OBJECTS_DEFAULTS.skip,
    delayMs: GET_OBJECTS_DEFAULTS.delayMs,
    orderBy: orderBy ?? GET_OBJECTS_DEFAULTS.orderBy,
  };

  const collectObjects = async () => {
    const objects: SceneObject[] = [];
    let isPartial: boolean | undefined;

    const iterable = getAllObjects(params, clientArgs, opts);
    for await (const page of iterable) {
      objects.push(...page.objects);
      // Extract isPartial from the first page (sceneContext is consistent across all pages)
      if (isPartial === undefined) {
        isPartial = page.sceneContext.isPartial;
      }
    }
    return { objects, isPartial };
  };

  const [minimalScene, { objects, isPartial }] = await Promise.all([
    getSceneMetadata(params, clientArgs),
    collectObjects(),
  ]);

  return {
    scene: {
      ...minimalScene.scene,
      isPartial,
      sceneData: { objects },
    },
  };
}

/**
 * Fetches scenes in single page specified by the options.
 * @param params - {@link GetScenesParams}
 * @returns One page of scenes in the iTwin.
 * @throws {ScenesApiError} If the API call fails or the response format is invalid.
 */
export async function getScenes(
  { iTwinId, top, skip }: GetScenesParams,
  clientArgs: ClientArgs,
): Promise<SceneListResponse> {
  const url = `${clientArgs.baseUrl}?iTwinId=${iTwinId}&$top=${top}&$skip=${skip}`;

  const response = await callApi<SceneListResponse>({
    ...clientArgs,
    baseUrl: url,
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
    },
    typeGuard: isSceneListResponse,
  });

  return response;
}

/**
 * Fetches scenes in a paginated manner.
 * @param params - {@link GetAllScenesParams}
 * @param clientArgs - {@link ClientArgs}
 * @param opts - {@link GetScenesOptions}
 * @returns Async iterator of paged scene lists.
 * @throws {ScenesApiError} If the API call fails or the response format is invalid.
 */
export function getAllScenes(
  { iTwinId }: GetAllScenesParams,
  clientArgs: ClientArgs,
  opts: Required<GetScenesOptions>,
): AsyncIterableIterator<SceneListResponse> {
  const { top, delayMs, skip } = opts;
  const initialUrl = `${clientArgs.baseUrl}?iTwinId=${iTwinId}&$top=${top}&$skip=${skip}`;

  return iteratePagedEndpoint<SceneListResponse>(initialUrl, delayMs, async (url) => {
    return callApi<SceneListResponse>({
      ...clientArgs,
      baseUrl: url,
      additionalHeaders: {
        Accept: "application/vnd.bentley.itwin-platform.v1+json",
      },
      typeGuard: isSceneListResponse,
    });
  });
}

/**
 * Creates a new scene.
 * @param params - {@link PostSceneParams}
 * @returns Created scene details.
 * @throws {ScenesApiError} If the API call fails or the response format is invalid.
 */
export async function postScene(
  { iTwinId, scene }: PostSceneParams,
  clientArgs: ClientArgs,
): Promise<SceneResponse> {
  return callApi<SceneResponse>({
    endpoint: `?iTwinId=${iTwinId}`,
    ...clientArgs,
    typeGuard: isSceneResponse,
    fetchOptions: {
      method: "POST",
      body: JSON.stringify(scene),
    },
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
      "Content-Type": "application/json",
    },
  });
}

/**
 * Updates an existing scene's metadata.
 * @param params - {@link PatchSceneParams}
 * @returns Updated scene details.
 * @throws {ScenesApiError} If the API call fails or the response format is invalid.
 */
export async function patchScene(
  { iTwinId, sceneId, scene }: PatchSceneParams,
  clientArgs: ClientArgs,
): Promise<SceneMetadataResponse> {
  return callApi<SceneMetadataResponse>({
    endpoint: `/${sceneId}?iTwinId=${iTwinId}`,
    ...clientArgs,
    typeGuard: isSceneMetadataResponse,
    fetchOptions: {
      method: "PATCH",
      body: JSON.stringify(scene),
    },
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
      "Content-Type": "application/json",
    },
  });
}

/**
 * Deletes a scene by its ID.
 * @param params - {@link DeleteSceneParams}
 * @throws {ScenesApiError} If the API call fails.
 */
export async function deleteScene(
  { sceneId, iTwinId }: DeleteSceneParams,
  clientArgs: ClientArgs,
): Promise<void> {
  await callApi({
    endpoint: `/${sceneId}?iTwinId=${iTwinId}`,
    ...clientArgs,
    fetchOptions: { method: "DELETE" },
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
    },
  });
}
