// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

import {
  getScene,
  getAllScenes,
  postScene,
  patchScene,
  deleteScene,
  getScenes,
} from "./api/sceneApi";
import {
  postObjects,
  getObject,
  deleteObject,
  deleteObjects,
  patchObjects,
  getAllObjects,
  getObjects,
} from "./api/sceneObjectApi";
import {
  SceneListResponse,
  SceneObjectResponse,
  SceneObjectListResponse,
  SceneResponse,
  GetScenesOptions,
  GET_SCENES_DEFAULTS,
  GetObjectsOptions,
  GET_OBJECTS_DEFAULTS,
  GetSceneParams,
  PostSceneParams,
  GetAllScenesParams,
  PatchSceneParams,
  DeleteSceneParams,
  GetObjectParams,
  GetAllObjectsParams,
  PostObjectsParams,
  PatchObjectsParams,
  DeleteObjectParams,
  DeleteObjectsParams,
  GetScenesParams,
  GetObjectsParams,
} from "./models/index";

type AccessTokenFn = () => Promise<string>;

const DEFAULT_BASE_URL = "https://itwinscenes-eus.bentley.com";

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
   * Fetch a single scene by its ID.
   * @param params - {@link GetSceneParams}
   * @returns Scene details.
   * @throws {ScenesApiError} If the API call fails or the response format is invalid.
   */
  async getScene(params: GetSceneParams): Promise<SceneResponse> {
    return getScene({
      sceneId: params.sceneId,
      iTwinId: params.iTwinId,
      getAccessToken: this.getAccessToken,
      baseUrl: this.baseUrl,
    });
  }

  /**
   * Fetches scenes in single page specified by the option's top/skip.
   * @param params - {@link GetScenesParams}
   * @returns SceneListResponse containing the list of scenes.
   * @throws {ScenesApiError} If the API call fails or the response format is
   */
  async getScenes(params: GetScenesParams): Promise<SceneListResponse> {
    return getScenes({
      iTwinId: params.iTwinId,
      top: params.top ?? GET_SCENES_DEFAULTS.top,
      skip: params.skip ?? GET_SCENES_DEFAULTS.skip,
      getAccessToken: this.getAccessToken,
      baseUrl: this.baseUrl,
    });
  }

  /**
   * Fetch a list of scenes for the given iTwinId.
   * @param params - {@link GetAllScenesParams}
   * @returns an iterator of scenes list response.
   * @throws {ScenesApiError} If the API call fails or the response format is invalid.
   */
  async getAllScenes(
    params: GetAllScenesParams,
  ): Promise<AsyncIterableIterator<SceneListResponse>> {
    const opts: Required<GetScenesOptions> = {
      top: params.top ?? GET_SCENES_DEFAULTS.top,
      skip: params.skip ?? GET_SCENES_DEFAULTS.skip,
      delayMs: params.delayMs ?? GET_SCENES_DEFAULTS.delayMs,
    };

    return getAllScenes(
      {
        iTwinId: params.iTwinId,
        getAccessToken: this.getAccessToken,
        baseUrl: this.baseUrl,
      },
      opts,
    );
  }

  /**
   * Create a new scene.
   * @param params - {@link PostSceneParams}
   * @returns Created scene details.
   * @throws {ScenesApiError} If the API call fails or the response format is invalid.
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
   * @param params - {@link PatchSceneParams}
   * @returns Updated scene details.
   * @throws {ScenesApiError} If the API call fails or the response format is invalid.
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
   * @param params - {@link DeleteSceneParams}
   * @throws {ScenesApiError} If the API call fails.
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
   * Fetch a single scene object by its object ID.
   * @param params - {@link GetObjectParams}
   * @returns SceneObjectResponse containing the single object details.
   * @throws {ScenesApiError} If the API call fails or the response format is invalid.
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
   * Fetches objects in single paged specified by the options.
   * @param params - {@link GetObjectsParams}
   * @returns SceneObjectListResponse containing the objects in the scene.
   * @throws {ScenesApiError} If the API call fails or the response format is invalid
   */
  async getObjects(
    params: GetObjectsParams,
  ): Promise<SceneObjectListResponse> {
    return getObjects({
      sceneId: params.sceneId,
      iTwinId: params.iTwinId,
      top: params.top ?? GET_OBJECTS_DEFAULTS.top,
      skip: params.skip ?? GET_OBJECTS_DEFAULTS.skip,
      kind: params.kind ?? GET_OBJECTS_DEFAULTS.kind,
      getAccessToken: this.getAccessToken,
      baseUrl: this.baseUrl,
    });
  }

  /**
   * Fetch multiple scene objects with pagination.
   * @param params - {@link GetAllObjectsParams}
   * @returns an iterator of scene object list response.
   * @throws {ScenesApiError} If the API call fails or the response format is invalid.
   */
  async getAllObjects(
    params: GetAllObjectsParams,
  ): Promise<AsyncIterableIterator<SceneObjectListResponse>> {
    const opts: Required<GetObjectsOptions> = {
      top: params.top ?? GET_OBJECTS_DEFAULTS.top,
      skip: params.skip ?? GET_OBJECTS_DEFAULTS.skip,
      delayMs: params.delayMs ?? GET_OBJECTS_DEFAULTS.delayMs,
      kind: params.kind ?? GET_OBJECTS_DEFAULTS.kind,
    };

    return getAllObjects(
      {
        sceneId: params.sceneId,
        iTwinId: params.iTwinId,
        getAccessToken: this.getAccessToken,
        baseUrl: this.baseUrl,
      },
      opts,
    );
  }

  /**
   * Create one or multiple scene objects.
   * @param params - {@link PostObjectsParams}
   * @returns Created scene objects details in list.
   * @throws {ScenesApiError} If the API call fails or the response format is invalid.
   */
  async postObjects(
    params: PostObjectsParams,
  ): Promise<SceneObjectListResponse> {
    return postObjects({
      iTwinId: params.iTwinId,
      sceneId: params.sceneId,
      objects: params.objects,
      getAccessToken: this.getAccessToken,
      baseUrl: this.baseUrl,
    });
  }

  /**
   * Update one or multiple scene objects.
   * @param params - {@link PatchObjectsParams}
   * @returns Updated scene objects details.
   * @throws {ScenesApiError} If the API call fails or the response format is invalid.
   */
  async patchObjects(
    params: PatchObjectsParams,
  ): Promise<SceneObjectListResponse> {
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
   * @param params - {@link DeleteObjectParams}
   * @throws {ScenesApiError} If the API call fails.
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
   * @param params - {@link DeleteObjectsParams}
   * @throws {ScenesApiError} If the API call fails.
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
