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
  GetAllObjectsParams,
  PostObjectsParams,
  PatchObjectsParams,
  DeleteObjectParams,
  DeleteObjectsParams,
  GetObjectsParams,
} from "../models/index";
import { iteratePagedEndpoint, batched } from "../utilities";
import { callApi, AuthArgs } from "./apiFetch";

/**
 * Fetches a single scene object by its object ID.
 * @param params - {@link GetObjectParams}
 * @returns SceneObjectResponse containing the single object details.
 * @throws {ScenesApiError} If the API call fails or the response format is invalid.
 */
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
        throw new ScenesApiError(
          {
            code: "InvalidResponse",
            message: "Error fetching scene object: unexpected response format",
          },
          response.status,
        );
      }
      return responseJson;
    },
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
    },
  });
}

/**
 * Fetches objects in single paged specified by the options.
 * @param params - {@link GetObjectsParams}
 * @returns SceneObjectListResponse containing the objects in the scene.
 * @throws {ScenesApiError} If the API call fails or the response format is invalid
 */
export async function getObjects({
  sceneId,
  iTwinId,
  top,
  skip,
  orderBy: kind,
  getAccessToken,
  baseUrl,
}: GetObjectsParams & AuthArgs): Promise<SceneObjectListResponse> {
  return callApi<SceneObjectListResponse>({
    endpoint: `/v1/scenes/${sceneId}/objects?iTwinId=${iTwinId}&$top=${top}&$skip=${skip}&orderBy=${kind}`,
    getAccessToken,
    baseUrl,
    postProcess: async (response) => {
      const responseJson = await response.json();
      if (!response.ok) {
        const err = responseJson.error as ScenesErrorResponse;
        throw new ScenesApiError(err, response.status);
      }
      if (!isSceneObjectListResponse(responseJson)) {
        throw new ScenesApiError(
          {
            code: "InvalidResponse",
            message: "Error fetching scene objects: unexpected response format",
          },
          response.status,
        );
      }
      return responseJson;
    },
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
    },
  });
}

/**
 * Fetches scene objects with pagination.
 * @param args - {@link GetAllObjectsParams}
 * @param opts - {@link GetObjectsOptions}
 * @returns Async iterator of paged scene object lists.
 * @throws {ScenesApiError} If the API call fails or the response format is invalid.
 */
export function getAllObjects(
  args: GetAllObjectsParams & AuthArgs,
  opts: Required<GetObjectsOptions>,
): AsyncIterableIterator<SceneObjectPagedResponse> {
  const { sceneId, iTwinId, getAccessToken, baseUrl } = args;
  const { top, skip, delayMs, orderBy: kind } = opts;
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
            throw new ScenesApiError(
              {
                code: "InvalidResponse",
                message:
                  "Error fetching scene objects: unexpected response format",
              },
              response.status,
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

/**
 * Creates one or multiple scene objects.
 * @param params - {@link PostObjectsParams}
 * @returns Created scene objects details in list.
 * @throws {ScenesApiError} If the API call fails or the response format is invalid.
 */
export async function postObjects({
  sceneId,
  iTwinId,
  objects,
  getAccessToken,
  baseUrl,
}: PostObjectsParams & AuthArgs): Promise<SceneObjectListResponse> {
  const batchSize = 20;
  const results: SceneObjectListResponse[] = [];
  for (const batch of batched(objects, batchSize)) {
    const response = await callApi({
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
          throw new ScenesApiError(
            {
              code: "InvalidResponse",
              message:
                "Error creating scene objects: unexpected response format",
            },
            response.status,
          );
        }
        return responseJson;
      },
      fetchOptions: {
        method: "POST",
        body: JSON.stringify({ objects: batch }, (_, value) =>
          value === undefined ? null : value,
        ),
      },
      additionalHeaders: {
        Accept: "application/vnd.bentley.itwin-platform.v1+json",
        "Content-Type": "application/json",
      },
    });
    results.push(response);
  }
  // Combine all objects from batches into a single response
  return {
    objects: results.flatMap((r) => r.objects),
  };
}

/**
 * Updates one or multiple scene objects.
 * @param params - {@link PatchObjectsParams}
 * @returns Updated scene objects details.
 * @throws {ScenesApiError} If the API call fails or the response format is invalid.
 */
export async function patchObjects({
  sceneId,
  iTwinId,
  objects,
  getAccessToken,
  baseUrl,
}: PatchObjectsParams & AuthArgs): Promise<SceneObjectListResponse> {
  const batchSize = 20;
  const results: SceneObjectListResponse[] = [];
  for (const batch of batched(objects, batchSize)) {
    const response = await callApi({
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
          throw new ScenesApiError(
            {
              code: "InvalidResponse",
              message:
                "Error updating scene objects: unexpected response format",
            },
            response.status,
          );
        }
        return responseJson;
      },
      fetchOptions: {
        method: "PATCH",
        body: JSON.stringify({ objects: batch }, (_, value) =>
          value === undefined ? null : value,
        ),
      },
      additionalHeaders: {
        Accept: "application/vnd.bentley.itwin-platform.v1+json",
        "Content-Type": "application/json",
      },
    });
    results.push(response);
  }
  // Combine all objects from batches into a single response
  return {
    objects: results.flatMap((r) => r.objects),
  };
}

/**
 * Deletes a single scene object by its ID.
 * @param params - {@link DeleteObjectParams}
 * @throws {ScenesApiError} If the API call fails.
 */
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
    postProcess: async (response) => {
      if (!response.ok) {
        const err = await response
          .json()
          .catch(() => ({}) as ScenesErrorResponse);
        throw new ScenesApiError(err, response.status);
      }
      return;
    },
    fetchOptions: {
      method: "DELETE",
    },
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
    },
  });
}

/**
 * Deletes multiple scene objects by their IDs.
 * @param params - {@link DeleteObjectsParams}
 * @throws {ScenesApiError} If the API call fails.
 */
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
        postProcess: async (response) => {
          if (!response.ok) {
            const err = await response
              .json()
              .catch(() => ({}) as ScenesErrorResponse);
            throw new ScenesApiError(err, response.status);
          }
          return;
        },
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
