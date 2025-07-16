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

type ITwinParams = { iTwinId: string; };
type SceneParams = ITwinParams & { sceneId: string; };
type ObjectParams = SceneParams & { objectId: string; };

export type GetScenesParams = ITwinParams;
export type GetSceneParams = SceneParams;
export type PostSceneParams = ITwinParams & { scene: SceneCreateDto; };
export type PatchSceneParams = SceneParams & { scene: SceneUpdateDTO; };
export type DeleteSceneParams = SceneParams;

export type GetObjectParams = ObjectParams;
export type GetObjectsParams = SceneParams;
export type PostObjectParams = SceneParams & { object: SceneObjectCreateDto; };
export type PostObjectsParams = SceneParams & { objects: SceneObjectCreateDto[]; };
export type PatchObjectParams = ObjectParams & { object: SceneObjectUpdateDTO; };
export type PatchObjectsParams = SceneParams & { objects: SceneObjectUpdateWithIdDTO[]; };
export type DeleteObjectParams = ObjectParams;
export type DeleteObjectsParams = SceneParams & { objectIds: string[]; };

export class SceneClient {
  private readonly getAccessToken: AccessTokenFn;
  private readonly baseUrl: string;

  /**
   * Create a new SceneClient instance.
   * @param getAccessToken – Async function to retrieve an access token.
   * @param baseUrl – Optional base URL for the API. Defaults to production.
   */
  constructor(
    getAccessToken: AccessTokenFn,
    baseUrl: string = DEFAULT_BASE_URL,
  ) {
    this.getAccessToken = getAccessToken;
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch a list of scenes for the given iTwinId.
   * @param params.iTwinId – The iTwin’s unique identifier.
   * @returns List of scenes.
   */
  async getScenes(params: GetScenesParams): Promise<SceneListResponse> {
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
  async getScene(params: GetSceneParams): Promise<SceneResponse> {
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
  async postScene(params: PostSceneParams): Promise<SceneResponse> {
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
  async patchScene(params: PatchSceneParams): Promise<SceneResponse> {
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
  async deleteScene(params: DeleteSceneParams): Promise<void> {
    return deleteScene({
      iTwinId: params.iTwinId,
      sceneId: params.sceneId,
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
  async getObject(params: GetObjectParams): Promise<SceneObjectResponse> {
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
  async getObjects(params: GetObjectsParams): Promise<SceneObjectListResponse> {
    return getObjects({
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
  async postObject(params: PostObjectParams): Promise<SceneObjectResponse> {
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
  async postObjects(params: PostObjectsParams): Promise<SceneObjectListResponse> {
    return postObjects({
      iTwinId: params.iTwinId,
      sceneId: params.sceneId,
      objects: params.objects,
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
  async patchObject(params: PatchObjectParams): Promise<SceneObjectResponse> {
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
  async patchObjects(params: PatchObjectsParams): Promise<SceneObjectListResponse> {
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
  async deleteObject(params: DeleteObjectParams): Promise<void> {
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
  async deleteObjects(params: DeleteObjectsParams): Promise<void> {
    return deleteObjects({
      iTwinId: params.iTwinId,
      sceneId: params.sceneId,
      objectIds: params.objectIds,
      getAccessToken: this.getAccessToken,
      baseUrl: this.baseUrl,
    });
  }
}
