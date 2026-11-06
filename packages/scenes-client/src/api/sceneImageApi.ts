/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  DeleteSceneImageParams,
  GetSceneImageParams,
  ImageResponse,
  isImageResponse,
  UploadSceneImageParams,
} from "../models/index.js";
import { ClientArgs, callApi } from "./apiFetch.js";

/**
 * Fetches a link to a scene's image.
 * @param params - {@link GetSceneImageParams}
 * @returns ImageResponse containing a link to the image.
 * @throws {ScenesApiError} If the API call fails or the response format is invalid.
 */
export async function getSceneImage(
  { sceneId, iTwinId, size }: GetSceneImageParams,
  clientArgs: ClientArgs,
): Promise<ImageResponse> {
  return callApi<ImageResponse>({
    endpoint: `/${sceneId}/image?iTwinId=${iTwinId}${size ? `&size=${size}` : ""}`,
    ...clientArgs,
    typeGuard: isImageResponse,
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
    },
  });
}

/**
 * Uploads an image for a scene, replacing any existing image.
 * @param params - {@link UploadSceneImageParams}
 * @returns ImageResponse containing a link to the uploaded image.
 * @throws {ScenesApiError} If the API call fails or the response format is invalid.
 */
export async function uploadSceneImage(
  { sceneId, iTwinId, image, contentType }: UploadSceneImageParams,
  clientArgs: ClientArgs,
): Promise<ImageResponse> {
  return callApi<ImageResponse>({
    endpoint: `/${sceneId}/image?iTwinId=${iTwinId}`,
    ...clientArgs,
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
 * Deletes a scene's image.
 * @param params - {@link DeleteSceneImageParams}
 * @throws {ScenesApiError} If the API call fails.
 */
export async function deleteSceneImage(
  { sceneId, iTwinId }: DeleteSceneImageParams,
  clientArgs: ClientArgs,
): Promise<void> {
  await callApi({
    endpoint: `/${sceneId}/image?iTwinId=${iTwinId}`,
    ...clientArgs,
    fetchOptions: {
      method: "DELETE",
    },
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
    },
  });
}
