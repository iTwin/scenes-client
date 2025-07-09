/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { callApi, RequestArgs } from "./Fetch";
import type {
    Scene,
    SceneObject,
    UpdateObjectDto,
  } from "./scenes.js";

import { 
  SceneCreateDto,
  SceneUpdateDTO,
  SceneListResponse,
  ScenesApiError,
  ScenesErrorResponse,
  SceneObjectCreateDto,
  SceneDataCreateDto,
  SceneObjectResponse,
  SceneObjectListResponse,
  SceneObjectUpdateDTO,
  SceneObjectUpdateWithIdDTO
 } from "./types/index.js";

// @naron: better organize the methods here
const DEFAULT_BASE_URL = "https://itwinscenes-eus.bentley.com/";

async function callScenesApi<T>({
  baseUrl = DEFAULT_BASE_URL,
  ...args
}: Omit<RequestArgs<T>, "baseUrl"> & { baseUrl?: string }): Promise<T> {
  return callApi<T>({ ...args, baseUrl });
}

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
}: { iTwinId: string; baseUrl?: string } & Pick<RequestArgs<any>, "getAccessToken" | "urlPrefix">): Promise<SceneListResponse> {
  return callScenesApi<SceneListResponse>({
    endpoint: `v1/scenes?iTwinId=${iTwinId}&$top=100&$skip=0`, //@naron: top/skip should be params?
    getAccessToken,
    postProcess: async (response) => {
      const responseJson = await response.json();
      if(!response.ok){
        const err = responseJson.error as ScenesErrorResponse; //@naron: directly cast?
        throw new ScenesApiError(err, responseJson.status)
      }
      if (!("scenes" in responseJson) || !Array.isArray(responseJson.scenes)) { //@naron: is this runtime check necessary? if necessary, should it be a type guard?
        throw new Error(`Error fetching scenes: unexpected response format`);
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
}: { id: string; iTwinId: string; baseUrl?: string } & Pick<RequestArgs<any>, "getAccessToken" | "urlPrefix">): Promise<Scene> {
  return callScenesApi<Scene>({
    endpoint: `v1/scenes/${id}?iTwinId=${iTwinId}`,
    getAccessToken,
    postProcess: async (response) => {
      const responseJson = await response.json();
      if (!response.ok) {
        const err = responseJson.error as ScenesErrorResponse;
        throw new ScenesApiError(err, response.status);
      }
      if (!("scene" in responseJson) || typeof responseJson.scene !== "object") {
        throw new Error(`Error fetching scene: unexpected response format`);
      }
      return responseJson.scene;
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
}: { iTwinId: string; scene: SceneCreateDto; baseUrl?: string } & Pick<RequestArgs<any>, "getAccessToken" | "urlPrefix">): Promise<Scene> {
  return callScenesApi({
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
      if (!("scene" in responseJson) || typeof responseJson.scene !== "object") {
        throw new Error(`Error creating scene: unexpected response format`);
      }
      return responseJson.scene; //@naron: these are returning scense but should be the actual resposne with ApiResponse types
    },
    fetchOptions: {
      method: "POST",
      body: JSON.stringify(scene, (_, value) => (value === undefined ? null : value)),
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
}: { sceneId: string; iTwinId: string; object: SceneObjectCreateDto; baseUrl?: string } & Pick<RequestArgs<any>, "getAccessToken" | "urlPrefix">): Promise<SceneObjectResponse> {
  return callScenesApi({
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
      if (!("object" in responseJson) || typeof responseJson.object !== "object") {
        throw new Error(`Error creating scene object: unexpected response format`);
      }
      return responseJson;
    },
    fetchOptions: {
      method: "POST",
      body: JSON.stringify(object, (_, value) => (value === undefined ? null : value)),
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
}: { sceneId: string; iTwinId: string; objects: SceneObjectCreateDto[]; baseUrl?: string } & Pick<RequestArgs<any>, "getAccessToken" | "urlPrefix">): Promise<SceneObjectListResponse> {
  return callScenesApi({
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
      if (!("objects" in responseJson) || !Array.isArray(responseJson.objects)) {
        throw new Error(`Error creating scene objects: unexpected response format`);
      }
      return responseJson;
    },
    fetchOptions: {
      method: "POST",
      body: JSON.stringify(objects, (_, value) => (value === undefined ? null : value)),
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
  urlPrefix,
  baseUrl,
}: { sceneId: string; iTwinId: string; scene: SceneUpdateDTO; baseUrl?: string } & Pick<RequestArgs<any>, "getAccessToken" | "urlPrefix">): Promise<Scene> {
  return callScenesApi({
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
      if (!("scene" in responseJson) || typeof responseJson.scene !== "object") {
        throw new Error(`Error updating scene: unexpected response format`);
      }
      return responseJson.scene;
    },
    fetchOptions: {
      method: "PATCH",
      body: JSON.stringify(scene, (_, value) => (value === undefined ? null : value)),
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
}: { sceneId: string; iTwinId: string; objectId: string; object: SceneObjectUpdateDTO; baseUrl?: string } & Pick<RequestArgs<any>, "getAccessToken" | "urlPrefix">): Promise<SceneObjectResponse> {
  return callScenesApi({
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
      if (!("object" in responseJson) || typeof responseJson.object !== "object") {
        throw new Error(`Error updating scene object: unexpected response format`);
      }
      return responseJson;
    },
    fetchOptions: {
      method: "PATCH",
      body: JSON.stringify(object, (_, value) => (value === undefined ? null : value)),
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
}: { sceneId: string; iTwinId: string; objects: SceneObjectUpdateWithIdDTO[]; baseUrl?: string } & Pick<RequestArgs<any>, "getAccessToken" | "urlPrefix">): Promise<SceneObjectListResponse> {
  return callScenesApi({
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
      if (!("objects" in responseJson) || !Array.isArray(responseJson.objects)) {
        throw new Error(`Error updating scene objects: unexpected response format`);
      }
      return responseJson;
    },
    fetchOptions: {
      method: "PATCH",
      body: JSON.stringify(objects, (_, value) => (value === undefined ? null : value)),
    },
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
      "Content-Type": "application/json",
    },
  });
}


export async function deleteScene({ sceneId, iTwinId, getAccessToken, urlPrefix, baseUrl }: {
  sceneId: string; iTwinId: string; baseUrl?: string
} & Pick<RequestArgs<any>, "getAccessToken" | "urlPrefix">): Promise<void> {
  return callScenesApi({
    endpoint: `v1/scenes/${sceneId}?iTwinId=${iTwinId}`,
    getAccessToken,
    urlPrefix,
    baseUrl,
    fetchOptions: { method: "DELETE" },
    additionalHeaders: { Accept: "application/vnd.bentley.itwin-platform.v1+json" },
    postProcess: async response => {
      if (!response.ok) {
        const err = await response.json().catch(() => ({} as ScenesErrorResponse));
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
}: { sceneId: string; iTwinId: string; objectId: string; baseUrl?: string } & Pick<RequestArgs<any>, "getAccessToken" | "urlPrefix">): Promise<void> {
  return callScenesApi({
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
}: { sceneId: string; iTwinId: string; objectIds: string[]; baseUrl?: string } & Pick<RequestArgs<any>, "getAccessToken" | "urlPrefix">): Promise<void> {
  const promises: Promise<void>[] = [];
  for (const batch of batched(objectIds, 20)) {
    promises.push(
      callScenesApi({
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
