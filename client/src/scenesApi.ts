// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

import { callApi, AuthArgs } from "./Fetch";

import {
  SceneCreateDto,
  SceneUpdateDTO,
  SceneListResponse,
  ScenesApiError,
  ScenesErrorResponse,
  SceneObjectCreateDto,
  SceneObjectResponse,
  SceneObjectListResponse,
  SceneObjectUpdateDTO,
  SceneObjectUpdateWithIdDTO,
  SceneResponse,
} from "./types/index";

function* batched<T>(items: T[], batchSize: number) {
  for (let i = 0; i < items.length; i += batchSize) {
    yield items.slice(i, i + batchSize);
  }
}

export async function getScenes({
  iTwinId,
  getAccessToken,
  urlPrefix,
  baseUrl,
}: { iTwinId: string } & AuthArgs): Promise<SceneListResponse> {
  return callApi<SceneListResponse>({
    endpoint: `v1/scenes?iTwinId=${iTwinId}&$top=100&$skip=0`, //@naron: top/skip should be params?
    getAccessToken,
    postProcess: async (response) => {
      const responseJson = await response.json();
      if (!response.ok) {
        const err = responseJson.error as ScenesErrorResponse; //@naron: directly cast?
        throw new ScenesApiError(err, responseJson.status);
      }
      if (!("scenes" in responseJson) || !Array.isArray(responseJson.scenes)) {
        //@naron: is this runtime check necessary? if necessary, should it be a type guard?
        throw new Error("Error fetching scenes: unexpected response format");
      }
      return responseJson;
    },
    urlPrefix,
    baseUrl,
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
    },
  });
}

export async function getScene({
  id,
  iTwinId,
  getAccessToken,
  urlPrefix,
  baseUrl,
}: { id: string; iTwinId: string } & AuthArgs): Promise<SceneResponse> {
  return callApi<SceneResponse>({
    endpoint: `v1/scenes/${id}?iTwinId=${iTwinId}`,
    getAccessToken,
    postProcess: async (response) => {
      const responseJson = await response.json();
      if (!response.ok) {
        const err = responseJson.error as ScenesErrorResponse;
        throw new ScenesApiError(err, response.status);
      }
      if (
        !("scene" in responseJson) ||
        typeof responseJson.scene !== "object"
      ) {
        throw new Error("Error fetching scene: unexpected response format");
      }
      return responseJson;
    },
    urlPrefix,
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
  urlPrefix,
  baseUrl,
}: {
  iTwinId: string;
  scene: SceneCreateDto;
} & AuthArgs): Promise<SceneResponse> {
  return callApi<SceneResponse>({
    endpoint: `v1/scenes?iTwinId=${iTwinId}`,
    getAccessToken,
    urlPrefix,
    baseUrl,
    postProcess: async (response) => {
      const responseJson = await response.json();
      if (!response.ok) {
        const err = responseJson.error as ScenesErrorResponse;
        throw new ScenesApiError(err, response.status);
      }
      if (
        !("scene" in responseJson) ||
        typeof responseJson.scene !== "object"
      ) {
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

//@naron: probably object related ones can go to a different file?
export async function postObject({
  sceneId,
  iTwinId,
  object,
  getAccessToken,
  urlPrefix,
  baseUrl,
}: {
  sceneId: string;
  iTwinId: string;
  object: SceneObjectCreateDto;
} & AuthArgs): Promise<SceneObjectResponse> {
  return callApi({
    endpoint: `v1/scenes/${sceneId}/objects?iTwinId=${iTwinId}`,
    getAccessToken,
    urlPrefix,
    baseUrl,
    postProcess: async (response) => {
      const responseJson = await response.json();
      if (!response.ok) {
        const err = responseJson.error as ScenesErrorResponse;
        throw new ScenesApiError(err, response.status);
      }
      if (
        !("object" in responseJson) ||
        typeof responseJson.object !== "object"
      ) {
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
  urlPrefix,
  baseUrl,
}: {
  sceneId: string;
  iTwinId: string;
  objects: SceneObjectCreateDto[];
} & AuthArgs): Promise<SceneObjectListResponse> {
  return callApi({
    endpoint: `v1/scenes/${sceneId}/objects?iTwinId=${iTwinId}`,
    getAccessToken,
    urlPrefix,
    baseUrl,
    postProcess: async (response) => {
      const responseJson = await response.json();
      if (!response.ok) {
        const err = responseJson.error as ScenesErrorResponse;
        throw new ScenesApiError(err, response.status);
      }
      if (
        !("objects" in responseJson) ||
        !Array.isArray(responseJson.objects)
      ) {
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
  urlPrefix,
  baseUrl,
}: {
  sceneId: string;
  iTwinId: string;
  objectId: string;
} & AuthArgs): Promise<SceneObjectResponse> {
  return callApi<SceneObjectResponse>({
    endpoint: `v1/scenes/${sceneId}/objects/${objectId}?iTwinId=${iTwinId}`,
    getAccessToken,
    urlPrefix,
    baseUrl,
    postProcess: async (response) => {
      const responseJson = await response.json();
      if (!response.ok) {
        const err = responseJson.error as ScenesErrorResponse;
        throw new ScenesApiError(err, response.status);
      }
      if (
        !("object" in responseJson) ||
        typeof responseJson.object !== "object"
      ) {
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

export async function getObjects({
  sceneId,
  iTwinId,
  getAccessToken,
  urlPrefix,
  baseUrl,
}: {
  sceneId: string;
  iTwinId: string;
} & AuthArgs): Promise<SceneObjectListResponse> {
  return callApi<SceneObjectListResponse>({
    endpoint: `v1/scenes/${sceneId}/objects?iTwinId=${iTwinId}`,
    getAccessToken,
    urlPrefix,
    baseUrl,
    postProcess: async (response) => {
      const responseJson = await response.json();
      if (!response.ok) {
        const err = responseJson.error as ScenesErrorResponse;
        throw new ScenesApiError(err, response.status);
      }
      if (
        !("objects" in responseJson) ||
        !Array.isArray(responseJson.objects)
      ) {
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
}

export async function patchScene({
  iTwinId,
  sceneId,
  scene,
  getAccessToken,
  urlPrefix,
  baseUrl,
}: {
  sceneId: string;
  iTwinId: string;
  scene: SceneUpdateDTO;
} & AuthArgs): Promise<SceneResponse> {
  return callApi<SceneResponse>({
    endpoint: `v1/scenes/${sceneId}?iTwinId=${iTwinId}`,
    getAccessToken,
    urlPrefix,
    baseUrl,
    postProcess: async (response) => {
      const responseJson = await response.json();
      if (!response.ok) {
        const err = responseJson.error as ScenesErrorResponse;
        throw new ScenesApiError(err, response.status);
      }
      if (
        !("scene" in responseJson) ||
        typeof responseJson.scene !== "object"
      ) {
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

export async function patchObject({
  sceneId,
  iTwinId,
  objectId,
  object,
  getAccessToken,
  urlPrefix,
  baseUrl,
}: {
  sceneId: string;
  iTwinId: string;
  objectId: string;
  object: SceneObjectUpdateDTO;
} & AuthArgs): Promise<SceneObjectResponse> {
  return callApi({
    endpoint: `v1/scenes/${sceneId}/objects/${objectId}?iTwinId=${iTwinId}`,
    getAccessToken,
    urlPrefix,
    baseUrl,
    postProcess: async (response) => {
      const responseJson = await response.json();
      if (!response.ok) {
        const err = responseJson.error as ScenesErrorResponse;
        throw new ScenesApiError(err, response.status);
      }
      if (
        !("object" in responseJson) ||
        typeof responseJson.object !== "object"
      ) {
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
  urlPrefix,
  baseUrl,
}: {
  sceneId: string;
  iTwinId: string;
  objects: SceneObjectUpdateWithIdDTO[];
} & AuthArgs): Promise<SceneObjectListResponse> {
  return callApi({
    endpoint: `v1/scenes/${sceneId}/objects?iTwinId=${iTwinId}`,
    getAccessToken,
    urlPrefix,
    baseUrl,
    postProcess: async (response) => {
      const responseJson = await response.json();
      if (!response.ok) {
        const err = responseJson.error as ScenesErrorResponse;
        throw new ScenesApiError(err, response.status);
      }

      // @naron: this is repetitive, can be a utility function
      if (
        !("objects" in responseJson) ||
        !Array.isArray(responseJson.objects)
      ) {
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

export async function deleteScene({
  sceneId,
  iTwinId,
  getAccessToken,
  urlPrefix,
  baseUrl,
}: {
  sceneId: string;
  iTwinId: string;
} & AuthArgs): Promise<void> {
  return callApi({
    endpoint: `v1/scenes/${sceneId}?iTwinId=${iTwinId}`,
    getAccessToken,
    urlPrefix,
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

export async function deleteObject({
  sceneId,
  iTwinId,
  objectId,
  getAccessToken,
  urlPrefix,
  baseUrl,
}: {
  sceneId: string;
  iTwinId: string;
  objectId: string;
} & AuthArgs): Promise<void> {
  return callApi({
    endpoint: `v1/scenes/${sceneId}/objects/${objectId}?iTwinId=${iTwinId}`,
    getAccessToken,
    urlPrefix,
    baseUrl,
    postProcess: async () => {},
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
  urlPrefix,
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
        endpoint: `v1/scenes/${sceneId}/objects?iTwinId=${iTwinId}&ids=${batch.join(",")}`,
        getAccessToken,
        urlPrefix,
        baseUrl,
        postProcess: async () => {},
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
