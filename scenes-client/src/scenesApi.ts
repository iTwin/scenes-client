/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { callApi, RequestArgs } from "./Fetch";
import type {
    Scene,
    SceneObject,
    CreateObjectDto,
    UpdateObjectDto,
  } from "./scenes.js";

import type { 
  SceneCreateDto,
  SceneUpdateDTO,
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
}: { iTwinId: string; baseUrl?: string } & Pick<RequestArgs<any>, "getAccessToken" | "urlPrefix">): Promise<Pick<Scene, "id" | "iTwinId" | "displayName">[]> {
  return callScenesApi<Scene[]>({
    endpoint: `v1/iTwins/${iTwinId}/scenes`,
    getAccessToken,
    postProcess: async (response) => {
      const responseJson = await response.json();
      if ("error" in responseJson) {
        throw new Error(`Error fetching scenes: ${responseJson.message}`);
      }
      if (!("scenes" in responseJson) || !Array.isArray(responseJson.scenes)) {
        throw new Error(`Error fetching scenes: unexpected response format`);
      }
      return responseJson.scenes;
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
    endpoint: `v1/iTwins/${iTwinId}/scenes/${id}?orderBy=order`,
    getAccessToken,
    postProcess: async (response) => {
      const responseJson = await response.json();
      if ("error" in responseJson) {
        throw new Error(`Error fetching scene: ${responseJson.message}`);
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
    endpoint: `v1/iTwins/${iTwinId}/scenes`,
    getAccessToken,
    urlPrefix,
    baseUrl,
    postProcess: async (response) => {
      const responseJson = await response.json();
      if ("error" in responseJson) {
        throw new Error(`Error creating scene: ${responseJson.message}`);
      }
      if (!("scene" in responseJson) || typeof responseJson.scene !== "object") {
        throw new Error(`Error creating scene: unexpected response format`);
      }
      return responseJson.scene;
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

export async function postObject({
  sceneId,
  iTwinId,
  object,
  getAccessToken,
  urlPrefix,
  baseUrl,
}: { sceneId: string; iTwinId: string; object: CreateObjectDto; baseUrl?: string } & Pick<RequestArgs<any>, "getAccessToken" | "urlPrefix">): Promise<SceneObject> {
  return callScenesApi({
    endpoint: `v1/iTwins/${iTwinId}/scenes/${sceneId}/objects`,
    getAccessToken,
    urlPrefix,
    baseUrl,
    postProcess: async (response) => {
      const responseJson = await response.json();
      if ("error" in responseJson) {
        throw new Error(`Error creating scene object: ${responseJson.message}`);
      }
      if (!("object" in responseJson) || typeof responseJson.object !== "object") {
        throw new Error(`Error creating scene object: unexpected response format`);
      }
      return responseJson.object;
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

export async function patchScene({
  iTwinId,
  sceneId,
  scene,
  getAccessToken,
  urlPrefix,
  baseUrl,
}: { sceneId: string; iTwinId: string; scene: SceneUpdateDTO; baseUrl?: string } & Pick<RequestArgs<any>, "getAccessToken" | "urlPrefix">): Promise<Scene> {
  return callScenesApi({
    endpoint: `v1/iTwins/${iTwinId}/scenes/${sceneId}`,
    getAccessToken,
    urlPrefix,
    baseUrl,
    postProcess: async (response) => {
      const responseJson = await response.json();
      if ("error" in responseJson) {
        throw new Error(`Error updating scene: ${responseJson.message}`); //@naron: this error mss is not helping
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
}: { sceneId: string; iTwinId: string; objectId: string; object: UpdateObjectDto; baseUrl?: string } & Pick<RequestArgs<any>, "getAccessToken" | "urlPrefix">): Promise<SceneObject> {
  return callScenesApi({
    endpoint: `v1/iTwins/${iTwinId}/scenes/${sceneId}/objects/${objectId}`,
    getAccessToken,
    urlPrefix,
    baseUrl,
    postProcess: async (response) => {
      const responseJson = await response.json();
      if ("error" in responseJson) {
        throw new Error(`Error updating scene object: ${responseJson.message}`);
      }
      if (!("object" in responseJson) || typeof responseJson.object !== "object") {
        throw new Error(`Error updating scene object: unexpected response format`);
      }
      return responseJson.object;
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

export async function deleteScene({
  sceneId,
  iTwinId,
  getAccessToken,
  urlPrefix,
  baseUrl,
}: { sceneId: string; iTwinId: string; baseUrl?: string } & Pick<RequestArgs<any>, "getAccessToken" | "urlPrefix">): Promise<void> {
  return callScenesApi({
    endpoint: `v1/iTwins/${iTwinId}/scenes/${sceneId}`,
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

export async function deleteObject({
  sceneId,
  iTwinId,
  objectId,
  getAccessToken,
  urlPrefix,
  baseUrl,
}: { sceneId: string; iTwinId: string; objectId: string; baseUrl?: string } & Pick<RequestArgs<any>, "getAccessToken" | "urlPrefix">): Promise<void> {
  return callScenesApi({
    endpoint: `v1/iTwins/${iTwinId}/scenes/${sceneId}/objects/${objectId}`,
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
        endpoint: `v1/iTwins/${iTwinId}/scenes/${sceneId}/objects?ids=${batch.join(",")}`,
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
