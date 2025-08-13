// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
import {
  SceneListResponse,
  ScenesApiError,
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
} from "../models/index.js";
import { handleErrorResponse, iteratePagedEndpoint } from "../utilities.js";
import { callApi, AuthArgs } from "./apiFetch.js";

/**
 * Fetches a single scene by its ID.
 * @param params - {@link GetSceneParams}
 * @returns Scene details.
 * @throws {ScenesApiError} If the API call fails or the response format is invalid.
 */
export async function getScene({
  sceneId,
  orderBy,
  iTwinId,
  getAccessToken,
  baseUrl,
}: GetSceneParams & AuthArgs): Promise<SceneResponse> {
  return callApi<SceneResponse>({
    endpoint: `/${sceneId}?iTwinId=${iTwinId}&orderBy=${orderBy}`,
    getAccessToken,
    postProcess: async (response) => {
      if (!response.ok) {
        await handleErrorResponse(response);
      }
      const responseJson = await response.json();
      if (!isSceneResponse(responseJson)) {
        throw new ScenesApiError(
          {
            code: "InvalidResponse",
            message: "Error fetching scene: unexpected response format",
          },
          response.status,
        );
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
 * Fetches scenes in single page specified by the options.
 * @param params - {@link GetScenesParams}
 * @returns Async iterator of paged scene lists.
 * @throws {ScenesApiError} If the API call fails or the response format is invalid.
 */
export async function getScenes({
  iTwinId,
  top,
  skip,
  getAccessToken,
  baseUrl,
}: GetScenesParams & AuthArgs): Promise<SceneListResponse> {
  const url = `${baseUrl}?iTwinId=${iTwinId}&$top=${top}&$skip=${skip}`;

  const response = await callApi<SceneListResponse>({
    baseUrl: url,
    getAccessToken,
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
    },
    postProcess: async (response) => {
      if (!response.ok) {
        await handleErrorResponse(response);
      }
      const responseJson = await response.json();
      if (!isSceneListResponse(responseJson)) {
        throw new ScenesApiError(
          { code: "InvalidResponse", message: "Unexpected response format" },
          response.status,
        );
      }
      return responseJson;
    },
  });

  return response;
}

/**
 * Fetches scenes in a paginated manner.
 * @param args - {@link GetAllScenesParams}
 * @param opts - {@link GetScenesOptions}
 * @returns Async iterator of paged scene lists.
 * @throws {ScenesApiError} If the API call fails or the response format is invalid.
 */
export function getAllScenes(
  args: GetAllScenesParams & AuthArgs,
  opts: Required<GetScenesOptions>,
): AsyncIterableIterator<SceneListResponse> {
  const { iTwinId, getAccessToken, baseUrl } = args;
  const { top, delayMs, skip } = opts;
  const initialUrl = `${baseUrl}?iTwinId=${iTwinId}&$top=${top}&$skip=${skip}`;

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
          if (!response.ok) {
            await handleErrorResponse(response);
          }
          const responseJson = await response.json();
          if (!isSceneListResponse(responseJson)) {
            throw new ScenesApiError(
              {
                code: "InvalidResponse",
                message: "Error fetching scenes: unexpected response format",
              },
              response.status,
            );
          }
          return responseJson;
        },
      });
    },
  );
}

/**
 * Creates a new scene.
 * @param params - {@link PostSceneParams}
 * @returns Created scene details.
 * @throws {ScenesApiError} If the API call fails or the response format is invalid.
 */
export async function postScene({
  iTwinId,
  scene,
  getAccessToken,
  baseUrl,
}: PostSceneParams & AuthArgs): Promise<SceneResponse> {
  return callApi<SceneResponse>({
    endpoint: `?iTwinId=${iTwinId}`,
    getAccessToken,
    baseUrl,
    postProcess: async (response) => {
      if (!response.ok) {
        await handleErrorResponse(response);
      }
      const responseJson = await response.json();
      if (!isSceneResponse(responseJson)) {
        throw new ScenesApiError(
          {
            code: "InvalidResponse",
            message: "Error creating scene: unexpected response format",
          },
          response.status,
        );
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
 * @param params - {@link PatchSceneParams}
 * @returns Updated scene details.
 * @throws {ScenesApiError} If the API call fails or the response format is invalid.
 */
export async function patchScene({
  iTwinId,
  sceneId,
  scene,
  getAccessToken,
  baseUrl,
}: PatchSceneParams & AuthArgs): Promise<SceneResponse> {
  return callApi<SceneResponse>({
    endpoint: `/${sceneId}?iTwinId=${iTwinId}`,
    getAccessToken,
    baseUrl,
    postProcess: async (response) => {
      if (!response.ok) {
        await handleErrorResponse(response);
      }
      const responseJson = await response.json();
      if (!isSceneResponse(responseJson)) {
        throw new ScenesApiError(
          {
            code: "InvalidResponse",
            message: "Error updating scene: unexpected response format",
          },
          response.status,
        );
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
 * @param params - {@link DeleteSceneParams}
 * @throws {ScenesApiError} If the API call fails.
 */
export async function deleteScene({
  sceneId,
  iTwinId,
  getAccessToken,
  baseUrl,
}: DeleteSceneParams & AuthArgs): Promise<void> {
  return callApi({
    endpoint: `/${sceneId}?iTwinId=${iTwinId}`,
    getAccessToken,
    baseUrl,
    fetchOptions: { method: "DELETE" },
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
    },
    postProcess: async (response) => {
      if (!response.ok) {
        await handleErrorResponse(response);
      }
      return;
    },
  });
}
