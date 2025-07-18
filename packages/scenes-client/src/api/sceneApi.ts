// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

import { callApi, AuthArgs } from "./apiFetch";

import {
  SceneCreateDto,
  SceneUpdateDTO,
  SceneListResponse,
  ScenesApiError,
  ScenesErrorResponse,
  SceneResponse,
  isSceneListResponse,
  isSceneResponse,
  PagingLinks,
  GetScenesOptions,
} from "../models/index";

import { iteratePagedEndpoint } from "../utilities";

export function getScenesPaged(
  args: { iTwinId: string; } & AuthArgs,
  opts: Required<GetScenesOptions>,
): AsyncIterableIterator<SceneListResponse> {
  const { iTwinId, getAccessToken, baseUrl } = args;
  const { top, delayMs, skip } = opts;
  const initialUrl = `${baseUrl}/v1/scenes?iTwinId=${iTwinId}&$top=${top}&$skip=${skip}`;

  return iteratePagedEndpoint<SceneListResponse>(initialUrl, delayMs, async (url) => {
    return callApi<SceneListResponse>({
      baseUrl: url,
      getAccessToken: getAccessToken,
      additionalHeaders: {
        Accept: "application/vnd.bentley.itwin-platform.v1+json",
      },
      postProcess: async (response) => {
        const json = await response.json();
        if (!response.ok) {
          throw new ScenesApiError(json.error as ScenesErrorResponse, response.status);
        }
        if (!isSceneListResponse(json)) {
          throw new Error("Error fetching scenes: unexpected response format");
        }
        return json;
      },
    });
  });
}

export async function getScene({
  id,
  iTwinId,
  getAccessToken,
  baseUrl,
}: { id: string; iTwinId: string; } & AuthArgs): Promise<SceneResponse> {
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

export async function postScene({
  scene,
  iTwinId,
  getAccessToken,
  baseUrl,
}: {
  iTwinId: string;
  scene: SceneCreateDto;
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
