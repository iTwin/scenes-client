// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
import {
  SceneListResponse,
  ScenesApiError,
  ScenesErrorResponse,
  SceneResponse,
  isSceneListResponse,
  isSceneResponse,
  GetScenesOptions,
  GetSceneParams,
  GetScenesPagedParams,
  PostSceneParams,
  PatchSceneParams,
  DeleteSceneParams,
} from "../models/index";
import { iteratePagedEndpoint } from "../utilities";
import { callApi, AuthArgs } from "./apiFetch";

/**
 * Fetches a single scene by its ID.
 */
export async function getScene({
  sceneId,
  iTwinId,
  getAccessToken,
  baseUrl,
}: GetSceneParams & AuthArgs): Promise<SceneResponse> {
  return callApi<SceneResponse>({
    endpoint: `/v1/scenes/${sceneId}?iTwinId=${iTwinId}`,
    getAccessToken,
    postProcess: async (response) => {
      const responseJson = await response.json();
      if (!response.ok) {
        const err = responseJson.error as ScenesErrorResponse;
        throw new ScenesApiError(err, response.status);
      }
      if (!isSceneResponse(responseJson)) {
        throw new Error("Error fetching scene: unexpected response format");
      }
      return responseJson;
    },
    baseUrl,
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
    },
  });
}

/**
 * Fetches scenes in a paginated manner.
 */
export function getScenesPaged(
  args: GetScenesPagedParams & AuthArgs,
  opts: Required<GetScenesOptions>,
): AsyncIterableIterator<SceneListResponse> {
  const { iTwinId, getAccessToken, baseUrl } = args;
  const { top, delayMs, skip } = opts;
  const initialUrl = `${baseUrl}/v1/scenes?iTwinId=${iTwinId}&$top=${top}&$skip=${skip}`;

  return iteratePagedEndpoint<SceneListResponse>(
    initialUrl,
    delayMs,
    async (url) => {
      return callApi<SceneListResponse>({
        baseUrl: url,
        getAccessToken: getAccessToken,
        additionalHeaders: {
          Accept: "application/vnd.bentley.itwin-platform.v1+json",
        },
        postProcess: async (response) => {
          const json = await response.json();
          if (!response.ok) {
            throw new ScenesApiError(
              json.error as ScenesErrorResponse,
              response.status,
            );
          }
          if (!isSceneListResponse(json)) {
            throw new Error(
              "Error fetching scenes: unexpected response format",
            );
          }
          return json;
        },
      });
    },
  );
}

/**
 * Creates a new scene.
 */
export async function postScene({
  iTwinId,
  scene,
  getAccessToken,
  baseUrl,
}: PostSceneParams & AuthArgs): Promise<SceneResponse> {
  return callApi<SceneResponse>({
    endpoint: `/v1/scenes?iTwinId=${iTwinId}`,
    getAccessToken,
    baseUrl,
    postProcess: async (response) => {
      const responseJson = await response.json();
      if (!response.ok) {
        const err = responseJson.error as ScenesErrorResponse;
        throw new ScenesApiError(err, response.status);
      }
      if (!isSceneResponse(responseJson)) {
        throw new Error("Error creating scene: unexpected response format");
      }
      return responseJson;
    },
    fetchOptions: {
      method: "POST",
      body: JSON.stringify(scene, (_, value) =>
        value === undefined ? null : value,
      ),
    },
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
      "Content-Type": "application/json",
    },
  });
}

/**
 * Updates an existing scene.
 */
export async function patchScene({
  iTwinId,
  sceneId,
  scene,
  getAccessToken,
  baseUrl,
}: PatchSceneParams & AuthArgs): Promise<SceneResponse> {
  return callApi<SceneResponse>({
    endpoint: `/v1/scenes/${sceneId}?iTwinId=${iTwinId}`,
    getAccessToken,
    baseUrl,
    postProcess: async (response) => {
      const responseJson = await response.json();
      if (!response.ok) {
        const err = responseJson.error as ScenesErrorResponse;
        throw new ScenesApiError(err, response.status);
      }
      if (!isSceneResponse(responseJson)) {
        throw new Error("Error updating scene: unexpected response format");
      }
      return responseJson;
    },
    fetchOptions: {
      method: "PATCH",
      body: JSON.stringify(scene, (_, value) =>
        value === undefined ? null : value,
      ),
    },
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
      "Content-Type": "application/json",
    },
  });
}

/**
 * Deletes a scene by its ID.
 */
export async function deleteScene({
  sceneId,
  iTwinId,
  getAccessToken,
  baseUrl,
}: DeleteSceneParams & AuthArgs): Promise<void> {
  return callApi({
    endpoint: `/v1/scenes/${sceneId}?iTwinId=${iTwinId}`,
    getAccessToken,
    baseUrl,
    fetchOptions: { method: "DELETE" },
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
    },
    postProcess: async (response) => {
      if (!response.ok) {
        const err = await response
          .json()
          .catch(() => ({}) as ScenesErrorResponse);
        throw new ScenesApiError(err, response.status);
      }
      return;
    },
  });
}
