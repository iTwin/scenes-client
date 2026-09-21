/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  GetAllSceneSharesParams,
  GetSceneShareParams,
  PostSceneShareParams,
  RevokeSceneShareParams,
  SceneShareListResponse,
  SceneShareResponse,
  isSceneShareListResponse,
  isSceneShareResponse,
} from "../models/index.js";
import { AuthArgs, callApi } from "./apiFetch.js";

/**
 * Fetches a single scene share by ID.
 * @param params - {@link GetSceneShareParams}
 * @returns SceneShareResponse containing the single share details.
 * @throws {ScenesApiError} If the API call fails or the response format is invalid.
 */
export async function getSceneShare({
  iTwinId,
  sceneId,
  shareId,
  getAccessToken,
  baseUrl,
}: GetSceneShareParams & AuthArgs): Promise<SceneShareResponse> {
  return callApi<SceneShareResponse>({
    endpoint: `/${sceneId}/shares/${shareId}?iTwinId=${iTwinId}`,
    getAccessToken,
    baseUrl,
    typeGuard: isSceneShareResponse,
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
    },
  });
}

/**
 * Fetches all shares for a scene.
 * @param params - {@link GetAllSceneSharesParams}
 * @returns SceneShareListResponse containing all shares for the scene.
 * @throws {ScenesApiError} If the API call fails or the response format is invalid.
 */
export async function getAllSceneShares({
  iTwinId,
  sceneId,
  getAccessToken,
  baseUrl,
}: GetAllSceneSharesParams & AuthArgs): Promise<SceneShareListResponse> {
  return callApi<SceneShareListResponse>({
    endpoint: `/${sceneId}/shares?iTwinId=${iTwinId}`,
    getAccessToken,
    baseUrl,
    typeGuard: isSceneShareListResponse,
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
    },
  });
}

/**
 * Creates a new scene share.
 * @param params - {@link PostSceneShareParams}
 * @returns Created share details, including the `shareKey`.
 * @throws {ScenesApiError} If the API call fails or the response format is invalid.
 */
export async function postSceneShare({
  iTwinId,
  sceneId,
  share,
  getAccessToken,
  baseUrl,
}: PostSceneShareParams & AuthArgs): Promise<SceneShareResponse> {
  return callApi<SceneShareResponse>({
    endpoint: `/${sceneId}/shares?iTwinId=${iTwinId}`,
    getAccessToken,
    baseUrl,
    typeGuard: isSceneShareResponse,
    fetchOptions: {
      method: "POST",
      body: JSON.stringify(share),
    },
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
      "Content-Type": "application/json",
    },
  });
}

/**
 * Revokes a scene share.
 * Any future requests made with the associated `shareKey` will no longer work.
 * @param params - {@link RevokeSceneShareParams}
 * @throws {ScenesApiError} If the API call fails.
 */
export async function revokeSceneShare({
  iTwinId,
  sceneId,
  shareId,
  getAccessToken,
  baseUrl,
}: RevokeSceneShareParams & AuthArgs): Promise<void> {
  await callApi({
    endpoint: `/${sceneId}/shares/${shareId}?iTwinId=${iTwinId}`,
    getAccessToken,
    baseUrl,
    fetchOptions: { method: "DELETE" },
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
    },
  });
}
