/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  getScene,
  getScenes,
  postScene,
  patchScene,
  deleteScene,
  postObject,
  patchObject,
  deleteObject,
  deleteObjects,
} from "./scenesApi.js";

import type {
  Scene,
  SceneObject,
  CreateSceneDto,
  UpdateSceneDto,
  CreateObjectDto,
  UpdateObjectDto,
} from "./scenes.js";

import type { UrlPrefix } from "./Fetch.js";

type AccessTokenFn = () => Promise<string>;

export class SceneClient {
  private getAccessToken: AccessTokenFn;
  private urlPrefix: UrlPrefix;

  // @naron: should I accept a url prefix here? and should it be default to ""?
  constructor({ getAccessToken, urlPrefix = "", }: { getAccessToken: AccessTokenFn; urlPrefix?: UrlPrefix }) {
    this.getAccessToken = getAccessToken;
    this.urlPrefix = urlPrefix;
  }

  async getScenes(params: { iTwinId: string }): Promise<Pick<Scene, "id" | "iTwinId" | "displayName">[]> {
    return getScenes({
      iTwinId: params.iTwinId,
      getAccessToken: this.getAccessToken,
      urlPrefix: this.urlPrefix,
    });
  }

  async getScene(params: { iTwinId: string; sceneId: string }): Promise<{ scene: Scene }> {
    const scene = await getScene({
      id: params.sceneId,
      iTwinId: params.iTwinId,
      getAccessToken: this.getAccessToken,
      urlPrefix: this.urlPrefix,
    });
    return { scene };
  }

  async postScene(params: { iTwinId: string; scene: CreateSceneDto }): Promise<Scene> {
    return postScene({
      iTwinId: params.iTwinId,
      scene: params.scene,
      getAccessToken: this.getAccessToken,
      urlPrefix: this.urlPrefix,
    });
  }

  async patchScene(params: { iTwinId: string; sceneId: string; scene: UpdateSceneDto }): Promise<Scene> {
    return patchScene({
      iTwinId: params.iTwinId,
      sceneId: params.sceneId,
      scene: params.scene,
      getAccessToken: this.getAccessToken,
      urlPrefix: this.urlPrefix,
    });
  }

  async deleteScene(params: { iTwinId: string; sceneId: string }): Promise<void> {
    return deleteScene({
      iTwinId: params.iTwinId,
      sceneId: params.sceneId,
      getAccessToken: this.getAccessToken,
      urlPrefix: this.urlPrefix,
    });
  }

  async postObject(params: { iTwinId: string; sceneId: string; object: CreateObjectDto }): Promise<SceneObject> {
    return postObject({
      iTwinId: params.iTwinId,
      sceneId: params.sceneId,
      object: params.object,
      getAccessToken: this.getAccessToken,
      urlPrefix: this.urlPrefix,
    });
  }

  async patchObject(params: { iTwinId: string; sceneId: string; objectId: string; object: UpdateObjectDto }): Promise<SceneObject> {
    return patchObject({
      iTwinId: params.iTwinId,
      sceneId: params.sceneId,
      objectId: params.objectId,
      object: params.object,
      getAccessToken: this.getAccessToken,
      urlPrefix: this.urlPrefix,
    });
  }

  async deleteObject(params: { iTwinId: string; sceneId: string; objectId: string }): Promise<void> {
    return deleteObject({
      iTwinId: params.iTwinId,
      sceneId: params.sceneId,
      objectId: params.objectId,
      getAccessToken: this.getAccessToken,
      urlPrefix: this.urlPrefix,
    });
  }

  async deleteObjects(params: { iTwinId: string; sceneId: string; objectIds: string[] }): Promise<void> {
    return deleteObjects({
      iTwinId: params.iTwinId,
      sceneId: params.sceneId,
      objectIds: params.objectIds,
      getAccessToken: this.getAccessToken,
      urlPrefix: this.urlPrefix,
    });
  }
}
