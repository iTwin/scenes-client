/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  ScenesApiError,
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
  PatchObjectParam,
  handleErrorResponse,
  PatchObjectsOperationsParams,
} from "../models/index.js";
import { iteratePagedEndpoint, batched } from "../utilities.js";
import { callApi, AuthArgs } from "./apiFetch.js";

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
    endpoint: `/${sceneId}/objects/${objectId}?iTwinId=${iTwinId}`,
    getAccessToken,
    baseUrl,
    postProcess: async (response) => {
      if (!response.ok) {
        await handleErrorResponse(response);
      }
      const responseJson = await response.json();
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
  orderBy,
  getAccessToken,
  baseUrl,
}: GetObjectsParams & AuthArgs): Promise<SceneObjectListResponse> {
  return callApi<SceneObjectListResponse>({
    endpoint: `/${sceneId}/objects?iTwinId=${iTwinId}&$top=${top}&$skip=${skip}&orderBy=${orderBy}`,
    getAccessToken,
    baseUrl,
    postProcess: async (response) => {
      if (!response.ok) {
        await handleErrorResponse(response);
      }
      const responseJson = await response.json();
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
  const { top, skip, delayMs, orderBy } = opts;
  const initialUrl = `${baseUrl}/${sceneId}/objects?iTwinId=${iTwinId}&$top=${top}&$skip=${skip}&orderBy=${orderBy}`;

  return iteratePagedEndpoint<SceneObjectPagedResponse>(initialUrl, delayMs, async (url) => {
    return callApi<SceneObjectPagedResponse>({
      baseUrl: url,
      getAccessToken,
      postProcess: async (response) => {
        if (!response.ok) {
          await handleErrorResponse(response);
        }
        const responseJson = await response.json();
        if (!isSceneObjectPagedResponse(responseJson)) {
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
  });
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
      endpoint: `/${sceneId}/objects?iTwinId=${iTwinId}`,
      getAccessToken,
      baseUrl,
      postProcess: async (response) => {
        if (!response.ok) {
          await handleErrorResponse(response);
        }
        const responseJson = await response.json();
        if (!isSceneObjectListResponse(responseJson)) {
          throw new ScenesApiError(
            {
              code: "InvalidResponse",
              message: "Error creating scene objects: unexpected response format",
            },
            response.status,
          );
        }
        return responseJson;
      },
      fetchOptions: {
        method: "POST",
        body: JSON.stringify({ objects: batch }),
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
 * Updates a single scene object by its ID.
 * @param params - {@link PatchObjectParam}
 * @returns Updated scene object details.
 * @throws {ScenesApiError} If the API call fails or the response format is invalid.
 */
export async function patchObject({
  sceneId,
  iTwinId,
  objectId,
  object,
  getAccessToken,
  baseUrl,
}: PatchObjectParam & AuthArgs): Promise<SceneObjectResponse> {
  return callApi<SceneObjectResponse>({
    endpoint: `/${sceneId}/objects/${objectId}?iTwinId=${iTwinId}`,
    getAccessToken,
    baseUrl,
    postProcess: async (response) => {
      if (!response.ok) {
        await handleErrorResponse(response);
      }
      const responseJson = await response.json();
      if (!isSceneObjectResponse(responseJson)) {
        throw new ScenesApiError(
          {
            code: "InvalidResponse", //@naron: this seemed repetitive
            message: "Error updating scene object: unexpected response format",
          },
          response.status,
        );
      }
      return responseJson;
    },
    fetchOptions: {
      method: "PATCH",
      body: JSON.stringify(object),
    },
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
      "Content-Type": "application/json",
    },
  });
}

/**
 * Updates one or multiple scene objects.
 * @deprecated Use {@link patchObjectsOperations} instead.
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
      endpoint: `/${sceneId}/objects?iTwinId=${iTwinId}`,
      getAccessToken,
      baseUrl,
      postProcess: async (response) => {
        if (!response.ok) {
          await handleErrorResponse(response);
        }
        const responseJson = await response.json();
        if (!isSceneObjectListResponse(responseJson)) {
          throw new ScenesApiError(
            {
              code: "InvalidResponse",
              message: "Error updating scene objects: unexpected response format",
            },
            response.status,
          );
        }
        return responseJson;
      },
      fetchOptions: {
        method: "PATCH",
        body: JSON.stringify({ objects: batch }),
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
 * Updates multiple objects within a scene using an ordered list of atomic operations.
 * All operations are executed in the order provided. If any operation fails, all changes are rolled back.
 * Max 100 operations per request.
 *
 * @param params - {@link PatchObjectsOperationsParams}
 * @returns Updated scene objects details.
 * @throws {ScenesApiError} If the API call fails or the response format is invalid.
 */
export async function patchObjectsOperations({
  sceneId,
  iTwinId,
  operations,
  getAccessToken,
  baseUrl,
}: PatchObjectsOperationsParams & AuthArgs): Promise<SceneObjectListResponse> {
  return callApi({
    endpoint: `/${sceneId}/objects?iTwinId=${iTwinId}`,
    getAccessToken,
    baseUrl,
    postProcess: async (response) => {
      if (!response.ok) {
        await handleErrorResponse(response);
      }
      const responseJson = await response.json();
      if (!isSceneObjectListResponse(responseJson)) {
        throw new ScenesApiError(
          {
            code: "InvalidResponse",
            message: "Error updating scene objects with operations: unexpected response format",
          },
          response.status,
        );
      }
      return responseJson;
    },
    fetchOptions: {
      method: "PATCH",
      body: JSON.stringify({ operations }),
    },
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
      "Content-Type": "application/json",
    },
  });
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
    endpoint: `/${sceneId}/objects/${objectId}?iTwinId=${iTwinId}`,
    getAccessToken,
    baseUrl,
    postProcess: async (response) => {
      if (!response.ok) {
        await handleErrorResponse(response);
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
        endpoint: `/${sceneId}/objects?iTwinId=${iTwinId}&ids=${batch.join(",")}`,
        getAccessToken,
        baseUrl,
        postProcess: async (response) => {
          if (!response.ok) {
            await handleErrorResponse(response);
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
