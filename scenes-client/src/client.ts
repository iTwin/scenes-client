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
  CreateObjectDto,
  UpdateObjectDto,
} from "./scenes.js";

import { 
  SceneCreateDto,
  SceneUpdateDTO,
  SceneListResponse,
 } from "./types/index.js";

import type { UrlPrefix } from "./Fetch.js";

type AccessTokenFn = () => Promise<string>;

export class SceneClient {
  private getAccessToken: AccessTokenFn;
  private urlPrefix: UrlPrefix;
  private baseUrl?: string;

  // @naron: should I accept a url prefix here? and should it be default to ""?
  constructor({ getAccessToken, urlPrefix = "", baseUrl }: { getAccessToken: AccessTokenFn; urlPrefix?: UrlPrefix; baseUrl?: string; }) {
    this.getAccessToken = getAccessToken;
    this.urlPrefix = urlPrefix;
    this.baseUrl = baseUrl;
  }

  async getScenes(params: { iTwinId: string }): Promise<SceneListResponse> {
    return getScenes({
      iTwinId: params.iTwinId,
      getAccessToken: this.getAccessToken,
      urlPrefix: this.urlPrefix,
      baseUrl: this.baseUrl,
    });
  }

  async getScene(params: { iTwinId: string; sceneId: string }): Promise<Scene> {
    return await getScene({
      id: params.sceneId,
      iTwinId: params.iTwinId,
      getAccessToken: this.getAccessToken,
      urlPrefix: this.urlPrefix,
      baseUrl: this.baseUrl,
    });
  }

  async postScene(params: { iTwinId: string; scene: SceneCreateDto }): Promise<Scene> {
    return postScene({
      iTwinId: params.iTwinId,
      scene: params.scene,
      getAccessToken: this.getAccessToken,
      urlPrefix: this.urlPrefix,
      baseUrl: this.baseUrl,
    });
  }

  async patchScene(params: { iTwinId: string; sceneId: string; scene: SceneUpdateDTO }): Promise<Scene> {
    return patchScene({
      iTwinId: params.iTwinId,
      sceneId: params.sceneId,
      scene: params.scene,
      getAccessToken: this.getAccessToken,
      urlPrefix: this.urlPrefix,
      baseUrl: this.baseUrl,
    });
  }

  async deleteScene(params: { iTwinId: string; sceneId: string }): Promise<void> {
    return deleteScene({
      iTwinId: params.iTwinId,
      sceneId: params.sceneId,
      getAccessToken: this.getAccessToken,
      urlPrefix: this.urlPrefix,
      baseUrl: this.baseUrl,
    });
  }

  async postObject(params: { iTwinId: string; sceneId: string; object: CreateObjectDto }): Promise<SceneObject> {
    return postObject({
      iTwinId: params.iTwinId,
      sceneId: params.sceneId,
      object: params.object,
      getAccessToken: this.getAccessToken,
      urlPrefix: this.urlPrefix,
      baseUrl: this.baseUrl,
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
      baseUrl: this.baseUrl,
    });
  }

  async deleteObject(params: { iTwinId: string; sceneId: string; objectId: string }): Promise<void> {
    return deleteObject({
      iTwinId: params.iTwinId,
      sceneId: params.sceneId,
      objectId: params.objectId,
      getAccessToken: this.getAccessToken,
      urlPrefix: this.urlPrefix,
      baseUrl: this.baseUrl,
    });
  }

  async deleteObjects(params: { iTwinId: string; sceneId: string; objectIds: string[] }): Promise<void> {
    return deleteObjects({
      iTwinId: params.iTwinId,
      sceneId: params.sceneId,
      objectIds: params.objectIds,
      getAccessToken: this.getAccessToken,
      urlPrefix: this.urlPrefix,
      baseUrl: this.baseUrl,
    });
  }
}
