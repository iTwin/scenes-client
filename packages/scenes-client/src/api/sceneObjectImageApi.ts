/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  DeleteObjectImageParams,
  GetObjectImageParams,
  ImageResponse,
  isImageResponse,
  UploadObjectImageParams,
} from "../models/index.js";
import { AuthArgs, callApi } from "./apiFetch.js";

/**
 * Fetches a link to a scene object's image.
 * @param params - {@link GetObjectImageParams}
 * @returns ImageResponse containing a link to the image.
 * @throws {ScenesApiError} If the API call fails or the response format is invalid.
 */
export async function getObjectImage({
  sceneId,
  iTwinId,
  objectId,
  size,
  getAccessToken,
  baseUrl,
}: GetObjectImageParams & AuthArgs): Promise<ImageResponse> {
  return callApi<ImageResponse>({
    endpoint: `/${sceneId}/objects/${objectId}/image?iTwinId=${iTwinId}${size ? `&size=${size}` : ""}`,
    getAccessToken,
    baseUrl,
    typeGuard: isImageResponse,
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
    },
  });
}

/**
 * Uploads an image for a scene object, replacing any existing image.
 * @param params - {@link UploadObjectImageParams}
 * @returns ImageResponse containing a link to the uploaded image.
 * @throws {ScenesApiError} If the API call fails or the response format is invalid.
 */
export async function uploadObjectImage({
  sceneId,
  iTwinId,
  objectId,
  image,
  contentType,
  getAccessToken,
  baseUrl,
}: UploadObjectImageParams & AuthArgs): Promise<ImageResponse> {
  return callApi<ImageResponse>({
    endpoint: `/${sceneId}/objects/${objectId}/image?iTwinId=${iTwinId}`,
    getAccessToken,
    baseUrl,
    typeGuard: isImageResponse,
    fetchOptions: {
      method: "PUT",
      body: image,
    },
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
      "Content-Type": contentType,
    },
  });
}

/**
 * Deletes a scene object's image.
 * @param params - {@link DeleteObjectImageParams}
 * @throws {ScenesApiError} If the API call fails.
 */
export async function deleteObjectImage({
  sceneId,
  iTwinId,
  objectId,
  getAccessToken,
  baseUrl,
}: DeleteObjectImageParams & AuthArgs): Promise<void> {
  await callApi({
    endpoint: `/${sceneId}/objects/${objectId}/image?iTwinId=${iTwinId}`,
    getAccessToken,
    baseUrl,
    fetchOptions: {
      method: "DELETE",
    },
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
    },
  });
}
