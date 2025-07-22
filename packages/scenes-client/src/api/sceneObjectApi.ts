// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

import {
  ScenesApiError,
  ScenesErrorResponse,
  SceneObjectResponse,
  SceneObjectListResponse,
  isSceneObjectResponse,
  isSceneObjectListResponse,
  GetObjectsOptions,
  SceneObjectPagedResponse,
  isSceneObjectPagedResponse,
  GetObjectParams,
  GetObjectsPagedParams,
  PostObjectsParams,
  PatchObjectsParams,
  DeleteObjectParams,
  DeleteObjectsParams,
} from "../models/index";
import { iteratePagedEndpoint, batched } from "../utilities";
import { callApi, AuthArgs } from "./apiFetch";

export async function getObject({
  sceneId,
  iTwinId,
  objectId,
  getAccessToken,
  baseUrl,
}: GetObjectParams & AuthArgs): Promise<SceneObjectResponse> {
  return callApi<SceneObjectResponse>({
    endpoint: `/v1/scenes/${sceneId}/objects/${objectId}?iTwinId=${iTwinId}`,
    getAccessToken,
    baseUrl,
    postProcess: async (response) => {
      const responseJson = await response.json();
      if (!response.ok) {
        const err = responseJson.error as ScenesErrorResponse;
        throw new ScenesApiError(err, response.status);
      }
      if (!isSceneObjectResponse(responseJson)) {
        throw new Error(
          "Error fetching scene object: unexpected response format",
        );
      }
      return responseJson;
    },
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
    },
  });
}

export function getObjectsPaged(
  args: GetObjectsPagedParams & AuthArgs,
  opts: Required<GetObjectsOptions>,
): AsyncIterableIterator<SceneObjectPagedResponse> {
  const { sceneId, iTwinId, getAccessToken, baseUrl } = args;
  const { top, skip, delayMs, kind } = opts;
  const initialUrl = `${baseUrl}/v1/scenes/${sceneId}/objects?iTwinId=${iTwinId}&$top=${top}&$skip=${skip}&orderBy=${kind}`;

  return iteratePagedEndpoint<SceneObjectPagedResponse>(
    initialUrl,
    delayMs,
    async (url) => {
      return callApi<SceneObjectPagedResponse>({
        baseUrl: url,
        getAccessToken,
        postProcess: async (response) => {
          const responseJson = await response.json();
          if (!response.ok) {
            const err = responseJson.error as ScenesErrorResponse;
            throw new ScenesApiError(err, response.status);
          }
          if (!isSceneObjectPagedResponse(responseJson)) {
            throw new Error(
              "Error fetching scene objects: unexpected response format",
            );
          }
          return responseJson;
        },
        additionalHeaders: {
          Accept: "application/vnd.bentley.itwin-platform.v1+json",
        },
      });
    },
  );
}

export async function postObjects({
  sceneId,
  iTwinId,
  objects,
  getAccessToken,
  baseUrl,
}: PostObjectsParams & AuthArgs): Promise<SceneObjectListResponse> {
  return callApi({
    endpoint: `/v1/scenes/${sceneId}/objects?iTwinId=${iTwinId}`,
    getAccessToken,
    baseUrl,
    postProcess: async (response) => {
      const responseJson = await response.json();
      if (!response.ok) {
        const err = responseJson.error as ScenesErrorResponse;
        throw new ScenesApiError(err, response.status);
      }
      if (!isSceneObjectListResponse(responseJson)) {
        throw new Error(
          "Error creating scene objects: unexpected response format",
        );
      }
      return responseJson;
    },
    fetchOptions: {
      method: "POST",
      body: JSON.stringify({ objects }, (_, value) =>
        value === undefined ? null : value,
      ),
    },
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
      "Content-Type": "application/json",
    },
  });
}

export async function patchObjects({
  sceneId,
  iTwinId,
  objects,
  getAccessToken,
  baseUrl,
}: PatchObjectsParams & AuthArgs): Promise<SceneObjectListResponse> {
  return callApi({
    endpoint: `/v1/scenes/${sceneId}/objects?iTwinId=${iTwinId}`,
    getAccessToken,
    baseUrl,
    postProcess: async (response) => {
      const responseJson = await response.json();
      if (!response.ok) {
        const err = responseJson.error as ScenesErrorResponse;
        throw new ScenesApiError(err, response.status);
      }
      if (!isSceneObjectListResponse(responseJson)) {
        throw new Error(
          "Error updating scene objects: unexpected response format",
        );
      }
      return responseJson;
    },
    fetchOptions: {
      method: "PATCH",
      body: JSON.stringify({ objects }, (_, value) =>
        value === undefined ? null : value,
      ),
    },
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
      "Content-Type": "application/json",
    },
  });
}

export async function deleteObject({
  sceneId,
  iTwinId,
  objectId,
  getAccessToken,
  baseUrl,
}: DeleteObjectParams & AuthArgs): Promise<void> {
  return callApi({
    endpoint: `/v1/scenes/${sceneId}/objects/${objectId}?iTwinId=${iTwinId}`,
    getAccessToken,
    baseUrl,
    postProcess: async () => { },
    fetchOptions: {
      method: "DELETE",
    },
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
    },
  });
}

export async function deleteObjects({
  sceneId,
  iTwinId,
  objectIds,
  getAccessToken,
  baseUrl,
}: DeleteObjectsParams & AuthArgs): Promise<void> {
  const promises: Promise<void>[] = [];
  for (const batch of batched(objectIds, 20)) {
    promises.push(
      callApi({
        endpoint: `/v1/scenes/${sceneId}/objects?iTwinId=${iTwinId}&ids=${batch.join(",")}`,
        getAccessToken,
        baseUrl,
        postProcess: async () => { },
        fetchOptions: {
          method: "DELETE",
        },
        additionalHeaders: {
          Accept: "application/vnd.bentley.itwin-platform.v1+json",
        },
      }),
    );
  }
  await Promise.all(promises);
}
