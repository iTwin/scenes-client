import { callApi, AuthArgs } from "./apiFetch";

import {
  ScenesApiError,
  ScenesErrorResponse,
  SceneObjectCreateDto,
  SceneObjectResponse,
  SceneObjectListResponse,
  SceneObjectUpdateDTO,
  SceneObjectUpdateWithIdDTO,
  isSceneObjectResponse,
  isSceneObjectListResponse,
  GetObjectsOptions
} from "../models/index";

import { iteratePagedEndpoint } from "../utilities";

//@naron: reorder these
export async function postObject({
  sceneId,
  iTwinId,
  object,
  getAccessToken,
  baseUrl,
}: {
  sceneId: string;
  iTwinId: string;
  object: SceneObjectCreateDto;
} & AuthArgs): Promise<SceneObjectResponse> {
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
      if (!isSceneObjectResponse(responseJson)) {
        throw new Error(
          "Error creating scene object: unexpected response format",
        );
      }
      return responseJson;
    },
    fetchOptions: {
      method: "POST",
      body: JSON.stringify(object, (_, value) =>
        value === undefined ? null : value,
      ),
    },
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
      "Content-Type": "application/json",
    },
  });
}

export async function postObjects({
  sceneId,
  iTwinId,
  objects,
  getAccessToken,
  baseUrl,
}: {
  sceneId: string;
  iTwinId: string;
  objects: SceneObjectCreateDto[];
} & AuthArgs): Promise<SceneObjectListResponse> {
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
      body: JSON.stringify(objects, (_, value) =>
        value === undefined ? null : value,
      ),
    },
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
      "Content-Type": "application/json",
    },
  });
}

export async function getObject({
  sceneId,
  iTwinId,
  objectId,
  getAccessToken,
  baseUrl,
}: {
  sceneId: string;
  iTwinId: string;
  objectId: string;
} & AuthArgs): Promise<SceneObjectResponse> {
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
  args: { sceneId: string; iTwinId: string } & AuthArgs,
  opts: Required<GetObjectsOptions>,
) : AsyncIterableIterator<SceneObjectListResponse> {
  const { sceneId, iTwinId, getAccessToken, baseUrl } = args;
  const { top, skip, delayMs, kind } = opts;
  const initialUrl = `${baseUrl}/v1/scenes/${sceneId}/objects?iTwinId=${iTwinId}&$top=${top}&$skip=${skip}&orderBy=${kind}`;
  
  return iteratePagedEndpoint<SceneObjectListResponse>(initialUrl, delayMs, async (url) => {
    return callApi<SceneObjectListResponse>({
      baseUrl: url,
      getAccessToken,
      postProcess: async (response) => {
        const responseJson = await response.json();
        if (!response.ok) {
          const err = responseJson.error as ScenesErrorResponse;
          throw new ScenesApiError(err, response.status);
        }
        if (!isSceneObjectListResponse(responseJson)) {
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
  });
};

export async function patchObject({
  sceneId,
  iTwinId,
  objectId,
  object,
  getAccessToken,
  baseUrl,
}: {
  sceneId: string;
  iTwinId: string;
  objectId: string;
  object: SceneObjectUpdateDTO;
} & AuthArgs): Promise<SceneObjectResponse> {
  return callApi({
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
          "Error updating scene object: unexpected response format",
        );
      }
      return responseJson;
    },
    fetchOptions: {
      method: "PATCH",
      body: JSON.stringify(object, (_, value) =>
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
}: {
  sceneId: string;
  iTwinId: string;
  objects: SceneObjectUpdateWithIdDTO[];
} & AuthArgs): Promise<SceneObjectListResponse> {
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
      body: JSON.stringify(objects, (_, value) =>
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
}: {
  sceneId: string;
  iTwinId: string;
  objectId: string;
} & AuthArgs): Promise<void> {
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
}: {
  sceneId: string;
  iTwinId: string;
  objectIds: string[];
} & AuthArgs): Promise<void> {
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

function* batched<T>(items: T[], batchSize: number) {
  for (let i = 0; i < items.length; i += batchSize) {
    yield items.slice(i, i + batchSize);
  }
}
