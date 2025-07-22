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
   * @param params.iTwinId – The iTwin’s unique identifier.
   * @param params.sceneId – The scene’s unique identifier.
   * @returns SceneResponse containing the Scene's details.
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
   * Fetches scenes in a single page specified by top/skip.
   * @param params.iTwinId – The iTwin’s unique identifier.
   * @param params.top – Number of items per page.
   * @param params.skip – Number of items to skip.
   * @returns SceneListResponse containing the list of scenes details.
   * @throws {ScenesApiError} If the API call fails or the response format is invalid.
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
   * Fetch all scenes with pagination.
   * @param params.iTwinId – The iTwin’s unique identifier.
   * @param params.top – Number of items per page.
   * @param params.skip – Number of items to skip.
   * @param params.delayMs – Milliseconds to wait between requests.
   * @returns An async iterator of SceneListResponse.
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
   * @param params.iTwinId – The iTwin’s unique identifier.
   * @param params.scene – The scene creation payload.
   * @returns SceneResponse containing the created Scene's details.
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
   * @param params.iTwinId – The iTwin’s unique identifier.
   * @param params.sceneId – The scene’s unique identifier.
   * @param params.scene – The scene update payload.
   * @returns  SceneResponse containing the updated Scene's details.
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
   * @param params.iTwinId – The iTwin’s unique identifier.
   * @param params.sceneId – The scene’s unique identifier.
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
   * @param params.iTwinId – The iTwin’s unique identifier.
   * @param params.sceneId – The scene’s unique identifier.
   * @param params.objectId – The object’s unique identifier.
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
   * Fetch scenes objects in a single page specified by top/skip/kind.
   * @param params.iTwinId – The iTwin’s unique identifier.
   * @param params.sceneId – The scene’s unique identifier.
   * @param params.top – Number of items per page.
   * @param params.skip – Number of items to skip.
   * @param params.kind – Property to order by.
   * @returns SceneObjectListResponse containing the objects in the scene.
   * @throws {ScenesApiError} If the API call fails or the response format is invalid.
   */
  async getObjects(params: GetObjectsParams): Promise<SceneObjectListResponse> {
    return getObjects({
      sceneId: params.sceneId,
      iTwinId: params.iTwinId,
      top: params.top ?? GET_OBJECTS_DEFAULTS.top,
      skip: params.skip ?? GET_OBJECTS_DEFAULTS.skip,
      orderBy: params.orderBy ?? GET_OBJECTS_DEFAULTS.orderBy,
      getAccessToken: this.getAccessToken,
      baseUrl: this.baseUrl,
    });
  }

  /**
   * Fetch scene objects with pagination.
   * @param params.iTwinId – The iTwin’s unique identifier.
   * @param params.sceneId – The scene’s unique identifier.
   * @param params.top – Number of items per page.
   * @param params.skip – Number of items to skip.
   * @param params.delayMs – Milliseconds to wait between requests.
   * @param params.kind – Property to order by.
   * @returns An async iterator of SceneObjectListResponse.
   * @throws {ScenesApiError} If the API call fails or the response format is invalid.
   */
  async getAllObjects(
    params: GetAllObjectsParams,
  ): Promise<AsyncIterableIterator<SceneObjectListResponse>> {
    const opts: Required<GetObjectsOptions> = {
      top: params.top ?? GET_OBJECTS_DEFAULTS.top,
      skip: params.skip ?? GET_OBJECTS_DEFAULTS.skip,
      delayMs: params.delayMs ?? GET_OBJECTS_DEFAULTS.delayMs,
      orderBy: params.orderBy ?? GET_OBJECTS_DEFAULTS.orderBy,
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
   * @param params.iTwinId – The iTwin’s unique identifier.
   * @param params.sceneId – The scene’s unique identifier.
   * @param params.objects – Array of SceneObjectCreateDTO to create.
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
   * @param params.iTwinId – The iTwin’s unique identifier.
   * @param params.sceneId – The scene’s unique identifier.
   * @param params.objects – Array of SceneObjectUpdateById to update.
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
   * @param params.iTwinId – The iTwin’s unique identifier.
   * @param params.sceneId – The scene’s unique identifier.
   * @param params.objectId – The object’s unique identifier.
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
   * @param params.iTwinId – The iTwin’s unique identifier.
   * @param params.sceneId – The scene’s unique identifier.
   * @param params.objectIds – Array of object IDs to delete.
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
