/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { callApi, RequestArgs } from "./Fetch";
import type {
    Scene,
    SceneObject,
    CreateSceneDto,
    UpdateSceneDto,
    CreateObjectDto,
    UpdateObjectDto,
  } from "./scenes.js";

// @naron: better organize the methods here
const BASE_URL = "https://itwinscenes-eus.bentley.com/"; // @naron: should be param?

async function callScenesApi<T>(args: Omit<RequestArgs<T>, "baseUrl">): Promise<T> {
  return callApi<T>({ ...args, baseUrl: BASE_URL });
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
}: { iTwinId: string } & Pick<RequestArgs<any>, "getAccessToken" | "urlPrefix">): Promise<Pick<Scene, "id" | "iTwinId" | "displayName">[]> {
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
}: { id: string; iTwinId: string } & Pick<RequestArgs<any>, "getAccessToken" | "urlPrefix">): Promise<Scene> {
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
}: { iTwinId: string; scene: CreateSceneDto } & Pick<RequestArgs<any>, "getAccessToken" | "urlPrefix">): Promise<Scene> {
  return callScenesApi({
    endpoint: `v1/iTwins/${iTwinId}/scenes`,
    getAccessToken,
    urlPrefix,
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
      body: JSON.stringify(scene, (_, value) => (value === undefined ? null : value)), // Convert undefined to null for JSON serialization
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
}: { sceneId: string; iTwinId: string; object: CreateObjectDto } & Pick<RequestArgs<any>, "getAccessToken" | "urlPrefix">): Promise<SceneObject> {
  return callScenesApi({
    endpoint: `v1/iTwins/${iTwinId}/scenes/${sceneId}/objects`,
    getAccessToken,
    urlPrefix,
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
      body: JSON.stringify(object, (_, value) => (value === undefined ? null : value)), // Convert undefined to null for JSON serialization
    },
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
      "Content-Type": "application/json",
    },
  });
}

export async function patchScene({
  sceneId,
  iTwinId,
  scene,
  getAccessToken,
  urlPrefix,
}: { sceneId: string; iTwinId: string; scene: UpdateSceneDto } & Pick<RequestArgs<any>, "getAccessToken" | "urlPrefix">): Promise<Scene> {
  return callScenesApi({
    endpoint: `v1/iTwins/${iTwinId}/scenes/${sceneId}`,
    getAccessToken,
    urlPrefix,
    postProcess: async (response) => {
      const responseJson = await response.json();
      if ("error" in responseJson) {
        throw new Error(`Error updating scene: ${responseJson.message}`);
      }
      if (!("scene" in responseJson) || typeof responseJson.scene !== "object") {
        throw new Error(`Error updating scene: unexpected response format`);
      }
      return responseJson.scene;
    },
    fetchOptions: {
      method: "PATCH",
      body: JSON.stringify(scene, (_, value) => (value === undefined ? null : value)), // Convert undefined to null for JSON serialization
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
}: { sceneId: string; iTwinId: string; objectId: string; object: UpdateObjectDto } & Pick<
  RequestArgs<any>,
  "getAccessToken" | "urlPrefix"
>): Promise<SceneObject> {
  return callScenesApi({
    endpoint: `v1/iTwins/${iTwinId}/scenes/${sceneId}/objects/${objectId}`,
    getAccessToken,
    urlPrefix,
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
      body: JSON.stringify(object, (_, value) => (value === undefined ? null : value)), // Convert undefined to null for JSON serialization
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
}: { sceneId: string; iTwinId: string } & Pick<RequestArgs<any>, "getAccessToken" | "urlPrefix">): Promise<void> {
  return callScenesApi({
    endpoint: `v1/iTwins/${iTwinId}/scenes/${sceneId}`,
    getAccessToken,
    urlPrefix,
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
}: { sceneId: string; iTwinId: string; objectId: string } & Pick<RequestArgs<any>, "getAccessToken" | "urlPrefix">): Promise<void> {
  return callScenesApi({
    endpoint: `v1/iTwins/${iTwinId}/scenes/${sceneId}/objects/${objectId}`,
    getAccessToken,
    urlPrefix,
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
}: { sceneId: string; iTwinId: string; objectIds: string[] } & Pick<RequestArgs<any>, "getAccessToken" | "urlPrefix">): Promise<void> {
  const promises: Promise<void>[] = [];
  // scene API supports deleting up to 20 objects with a single request
  for (const batch of batched(objectIds, 20)) {
    promises.push(
      callScenesApi({
        endpoint: `v1/iTwins/${iTwinId}/scenes/${sceneId}/objects?ids=${batch.join(",")}`,
        getAccessToken,
        urlPrefix,
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