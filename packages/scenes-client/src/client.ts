// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

import {
  getScene,
  getScenes,
  postScene,
  patchScene,
  deleteScene,
  postObject,
  postObjects,
  getObject,
  patchObject,
  deleteObject,
  deleteObjects,
  patchObjects,
  getObjects,
} from "./scenesApi.js";

import {
  SceneCreateDto,
  SceneUpdateDTO,
  SceneListResponse,
  SceneObjectCreateDto,
  SceneObjectResponse,
  SceneObjectListResponse,
  SceneObjectUpdateDTO,
  SceneObjectUpdateWithIdDTO,
  SceneResponse,
} from "./models/index";

type AccessTokenFn = () => Promise<string>;

const DEFAULT_BASE_URL = "https://itwinscenes-eus.bentley.com";

export class SceneClient {
  private getAccessToken: AccessTokenFn;
  private baseUrl: string;
  /**
   * Create a new SceneClient instance.
   * @param getAccessToken – Async function to retrieve an access token.
   * @param baseUrl – Optional base URL for the API. Defaults to production.
   */
  constructor({
    getAccessToken,
    baseUrl = DEFAULT_BASE_URL,
  }: {
    getAccessToken: AccessTokenFn;
    baseUrl?: string;
  }) {
    this.getAccessToken = getAccessToken;
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch a list of scenes for the given iTwinId.
   * @param params.iTwinId – The iTwin’s unique identifier.
   * @returns List of scenes.
   */
  async getScenes(params: { iTwinId: string; }): Promise<SceneListResponse> {
    return getScenes({
      iTwinId: params.iTwinId,
      getAccessToken: this.getAccessToken,
      baseUrl: this.baseUrl,
    });
  }

  /**
   * Fetch a single scene by its ID.
   * @param params.iTwinId – The iTwin’s unique identifier.
   * @param params.sceneId – The scene’s unique identifier.
   * @returns Scene details.
   */
  async getScene(params: {
    iTwinId: string;
    sceneId: string;
  }): Promise<SceneResponse> {
    return getScene({
      id: params.sceneId,
      iTwinId: params.iTwinId,
      getAccessToken: this.getAccessToken,
      baseUrl: this.baseUrl,
    });
  }

  /**
   * Create a new scene.
   * @param params.iTwinId – The iTwin’s unique identifier.
   * @param params.scene – SceneCreateDto object to create.
   * @returns Created scene details.
   */
  async postScene(params: {
    iTwinId: string;
    scene: SceneCreateDto;
  }): Promise<SceneResponse> {
    return postScene({
      iTwinId: params.iTwinId,
      scene: params.scene,
      getAccessToken: this.getAccessToken,
      baseUrl: this.baseUrl,
    });
  }

  /**
   * Update an existing scene.
   * @param params.iTwinId – The iTwin’s unique identifier.
   * @param params.sceneId – The scene’s unique identifier.
   * @param params.scene – SceneUpdateDTO object with updated fields.
   * @returns Updated scene details.
   */
  async patchScene(params: {
    iTwinId: string;
    sceneId: string;
    scene: SceneUpdateDTO;
  }): Promise<SceneResponse> {
    return patchScene({
      iTwinId: params.iTwinId,
      sceneId: params.sceneId,
      scene: params.scene,
      getAccessToken: this.getAccessToken,
      baseUrl: this.baseUrl,
    });
  }

  /**
   * Delete a scene by its ID.
   * @param params.iTwinId – The iTwin’s unique identifier.
   * @param params.sceneId – The scene’s unique identifier.
   */
  async deleteScene(params: {
    iTwinId: string;
    sceneId: string;
  }): Promise<void> {
    return deleteScene({
      iTwinId: params.iTwinId,
      sceneId: params.sceneId,
      getAccessToken: this.getAccessToken,
      baseUrl: this.baseUrl,
    });
  }

  /**
   * Create a new scene object.
   * @param params.iTwinId – The iTwin’s unique identifier.
   * @param params.sceneId – The scene’s unique identifier.
   * @param params.object – SceneObjectCreateDto object to create.
   * @returns Created scene object details.
   */
  async postObject(params: {
    iTwinId: string;
    sceneId: string;
    object: SceneObjectCreateDto;
  }): Promise<SceneObjectResponse> {
    return postObject({
      iTwinId: params.iTwinId,
      sceneId: params.sceneId,
      object: params.object,
      getAccessToken: this.getAccessToken,
      baseUrl: this.baseUrl,
    });
  }

  /**
   * Create multiple scene objects.
   * @param params.iTwinId – The iTwin’s unique identifier.
   * @param params.sceneId – The scene’s unique identifier.
   * @param params.objects – Array of SceneObjectCreateDto to create.
   * @returns Created scene objects details.
   */
  async postObjects(params: {
    iTwinId: string;
    sceneId: string;
    objects: SceneObjectCreateDto[];
  }): Promise<SceneObjectListResponse> {
    return postObjects({
      iTwinId: params.iTwinId,
      sceneId: params.sceneId,
      objects: params.objects,
      getAccessToken: this.getAccessToken,
      baseUrl: this.baseUrl,
    });
  }

  /**
   * Fetch a single scene object by its ID.
   * @param params.iTwinId – The iTwin’s unique identifier.
   * @param params.sceneId – The scene’s unique identifier.
   * @param params.objectId – The object’s unique identifier.
   * @returns Scene object details.
   */
  async getObject(params: {
    iTwinId: string;
    sceneId: string;
    objectId: string;
  }): Promise<SceneObjectResponse> {
    return getObject({
      sceneId: params.sceneId,
      iTwinId: params.iTwinId,
      objectId: params.objectId,
      getAccessToken: this.getAccessToken,
      baseUrl: this.baseUrl,
    });
  }

  /**
   * Fetch all objects for a given scene.
   * @param params.iTwinId – The iTwin’s unique identifier.
   * @param params.sceneId – The scene’s unique identifier.
   * @returns List of scene objects.
   */
  async getObjects(params: {
    iTwinId: string;
    sceneId: string;
  }): Promise<SceneObjectListResponse> {
    return getObjects({
      iTwinId: params.iTwinId,
      sceneId: params.sceneId,
      getAccessToken: this.getAccessToken,
      baseUrl: this.baseUrl,
    });
  }

  /**
   * Update a single scene object.
   * @param params.iTwinId – The iTwin’s unique identifier.
   * @param params.sceneId – The scene’s unique identifier.
   * @param params.objectId – The object’s unique identifier.
   * @param params.object – SceneObjectUpdateDTO object with updated fields.
   * @returns Updated scene object details.
   */
  async patchObject(params: {
    iTwinId: string;
    sceneId: string;
    objectId: string;
    object: SceneObjectUpdateDTO;
  }): Promise<SceneObjectResponse> {
    return patchObject({
      iTwinId: params.iTwinId,
      sceneId: params.sceneId,
      objectId: params.objectId,
      object: params.object,
      getAccessToken: this.getAccessToken,
      baseUrl: this.baseUrl,
    });
  }

  /**
   * Update multiple scene objects.
   * @param params.iTwinId – The iTwin’s unique identifier.
   * @param params.sceneId – The scene’s unique identifier.
   * @param params.objects – Array of SceneObjectUpdateWithIdDTO to update.
   * @returns Updated scene objects details.
   */
  async patchObjects(params: {
    iTwinId: string;
    sceneId: string;
    objects: SceneObjectUpdateWithIdDTO[];
  }): Promise<SceneObjectListResponse> {
    return patchObjects({
      iTwinId: params.iTwinId,
      sceneId: params.sceneId,
      objects: params.objects,
      getAccessToken: this.getAccessToken,
      baseUrl: this.baseUrl,
    });
  }

  /**
   * Delete a single scene object by its ID.
   * @param params.iTwinId – The iTwin’s unique identifier.
   * @param params.sceneId – The scene’s unique identifier.
   * @param params.objectId – The object’s unique identifier.
   */
  async deleteObject(params: {
    iTwinId: string;
    sceneId: string;
    objectId: string;
  }): Promise<void> {
    return deleteObject({
      iTwinId: params.iTwinId,
      sceneId: params.sceneId,
      objectId: params.objectId,
      getAccessToken: this.getAccessToken,
      baseUrl: this.baseUrl,
    });
  }

  /**
   * Delete multiple scene objects by their IDs.
   * @param params.iTwinId – The iTwin’s unique identifier.
   * @param params.sceneId – The scene’s unique identifier.
   * @param params.objectIds – Array of object IDs to delete.
   */
  async deleteObjects(params: {
    iTwinId: string;
    sceneId: string;
    objectIds: string[];
  }): Promise<void> {
    return deleteObjects({
      iTwinId: params.iTwinId,
      sceneId: params.sceneId,
      objectIds: params.objectIds,
      getAccessToken: this.getAccessToken,
      baseUrl: this.baseUrl,
    });
  }
}
