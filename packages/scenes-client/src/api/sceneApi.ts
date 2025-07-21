// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
import {
  SceneCreateDTO,
  SceneUpdateDTO,
  SceneListResponse,
  ScenesApiError,
  ScenesErrorResponse,
  SceneResponse,
  isSceneListResponse,
  isSceneResponse,
  GetScenesOptions,
} from "../models/index";
import { iteratePagedEndpoint } from "../utilities";
import { callApi, AuthArgs } from "./apiFetch";

/**
 * Fetches a single scene by its ID.
 * @param param.id - The scene's unique identifier.
 * @param param.iTwinId - The iTwin’s unique identifier.
 * @param param.getAccessToken - Function to get the access token.
 * @param param.baseUrl - The base URL for the API.
 * @returns Promise containing the SceneResponse.
 */
export async function getScene({
  id,
  iTwinId,
  getAccessToken,
  baseUrl,
}: { id: string; iTwinId: string } & AuthArgs): Promise<SceneResponse> {
  return callApi<SceneResponse>({
    endpoint: `/v1/scenes/${id}?iTwinId=${iTwinId}`,
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
 * @param args.iTwinId - The iTwin’s unique identifier.
 * @param args.getAccessToken - Function to get the access token.
 * @param args.baseUrl - The base URL for the API.
 * @param opts.top - Number of items to return per page.
 * @param opts.skip - Number of items to skip.
 * @param opts.delayMs - Delay in milliseconds between pages.
 * @returns AsyncIterableIterator of Scene's List Response.
 */
export function getScenesPaged(
  args: { iTwinId: string } & AuthArgs,
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
 * @param param.scene - The scene to create in SceneCreateDto format.
 * @param param.iTwinId - The iTwin’s unique identifier.
 * @param param.getAccessToken - Function to get the access token.
 * @param param.baseUrl - The base URL for the API.
 * @returns Promise containing the Scene's Response.
 */
export async function postScene({
  scene,
  iTwinId,
  getAccessToken,
  baseUrl,
}: {
  scene: SceneCreateDTO;
  iTwinId: string;
} & AuthArgs): Promise<SceneResponse> {
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
 * @param param.iTwinId - The iTwin’s unique identifier.
 * @param param.sceneId - The scene’s unique identifier.
 * @param param.scene - The scene to update in SceneUpdateDTO format.
 * @param param.getAccessToken - Function to get the access token.
 * @param param.baseUrl - The base URL for the API.
 * @returns Promise containing the updated Scene's Response.
 */
export async function patchScene({
  iTwinId,
  sceneId,
  scene,
  getAccessToken,
  baseUrl,
}: {
  sceneId: string;
  iTwinId: string;
  scene: SceneUpdateDTO;
} & AuthArgs): Promise<SceneResponse> {
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
 * @param param.sceneId - The scene’s unique identifier.
 * @param param.iTwinId - The iTwin’s unique identifier.
 * @param param.getAccessToken - Function to get the access token.
 * @param param.baseUrl - The base URL for the API.
 */
export async function deleteScene({
  sceneId,
  iTwinId,
  getAccessToken,
  baseUrl,
}: {
  sceneId: string;
  iTwinId: string;
} & AuthArgs): Promise<void> {
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
