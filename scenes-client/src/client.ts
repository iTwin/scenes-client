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
  postObjects,
  patchObject,
  deleteObject,
  deleteObjects,
  patchObjects,
} from "./scenesApi.js";

import { 
  SceneCreateDto,
  SceneUpdateDTO,
  SceneListResponse,
  SceneObjectCreateDto,
  SceneDataCreateDto,
  SceneObjectResponse,
  SceneObjectListResponse,
  SceneObjectUpdateDTO,
  SceneObjectUpdateWithIdDTO,
  SceneResponse,
 } from "./types/index.js";

import type { UrlPrefix } from "./Fetch.js";

type AccessTokenFn = () => Promise<string>;

export class SceneClient {
  private getAccessToken: AccessTokenFn;
  private urlPrefix: UrlPrefix;
  private baseUrl?: string;

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

  async getScene(params: { iTwinId: string; sceneId: string }): Promise<SceneResponse> {
    return await getScene({
      id: params.sceneId,
      iTwinId: params.iTwinId,
      getAccessToken: this.getAccessToken,
      urlPrefix: this.urlPrefix,
      baseUrl: this.baseUrl,
    });
  }

  async postScene(params: { iTwinId: string; scene: SceneCreateDto }): Promise<SceneResponse> {
    return postScene({
      iTwinId: params.iTwinId,
      scene: params.scene,
      getAccessToken: this.getAccessToken,
      urlPrefix: this.urlPrefix,
      baseUrl: this.baseUrl,
    });
  }

  async patchScene(params: { iTwinId: string; sceneId: string; scene: SceneUpdateDTO }): Promise<SceneResponse> {
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

  async postObject(params: { iTwinId: string; sceneId: string; object: SceneObjectCreateDto }): Promise<SceneObjectResponse> {
    return postObject({
      iTwinId: params.iTwinId,
      sceneId: params.sceneId,
      object: params.object,
      getAccessToken: this.getAccessToken,
      urlPrefix: this.urlPrefix,
      baseUrl: this.baseUrl,
    });
  }

  async postObjects(params: { iTwinId: string; sceneId: string; objects: SceneObjectCreateDto[] }): Promise<SceneObjectListResponse> {
    return postObjects({
      iTwinId: params.iTwinId,
      sceneId: params.sceneId,
      objects: params.objects,
      getAccessToken: this.getAccessToken,
      urlPrefix: this.urlPrefix,
      baseUrl: this.baseUrl,
    });
  }

  async patchObject(params: { iTwinId: string; sceneId: string; objectId: string; object: SceneObjectUpdateDTO }): Promise<SceneObjectResponse> {
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

  async patchObjects(params: { iTwinId: string; sceneId: string; objects: SceneObjectUpdateWithIdDTO[] }): Promise<SceneObjectListResponse> {
    return patchObjects({
      iTwinId: params.iTwinId,
      sceneId: params.sceneId,
      objects: params.objects,
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
