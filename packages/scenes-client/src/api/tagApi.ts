/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  DeleteTagParams,
  GetAllTagsParams,
  GetTagParams,
  GetTagsOptions,
  GetTagsParams,
  PatchTagParams,
  PostTagParams,
  TagListResponse,
  TagResponse,
  isTagListResponse,
  isTagResponse,
} from "../models/index.js";
import { iteratePagedEndpoint } from "../utilities.js";
import { callApi, AuthArgs } from "./apiFetch.js";

/**
 * Fetches a single tag by ID.
 * @param params - {@link GetTagParams}
 * @returns Tag details.
 * @throws {ScenesApiError} If the API call fails or the response format is invalid.
 */
export async function getTag({
  tagId,
  iTwinId,
  getAccessToken,
  baseUrl,
}: GetTagParams & AuthArgs): Promise<TagResponse> {
  return callApi<TagResponse>({
    endpoint: `/tags/${tagId}?iTwinId=${iTwinId}`,
    getAccessToken,
    baseUrl,
    typeGuard: isTagResponse,
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
    },
  });
}

/**
 * Fetches tags in a single page specified by the options.
 * @param params - {@link GetTagsParams}
 * @returns One page of tags in the iTwin.
 * @throws {ScenesApiError} If the API call fails or the response format is invalid.
 */
export async function getTags({
  iTwinId,
  top,
  skip,
  getAccessToken,
  baseUrl,
}: GetTagsParams & AuthArgs): Promise<TagListResponse> {
  return callApi<TagListResponse>({
    endpoint: `/tags?iTwinId=${iTwinId}&$top=${top}&$skip=${skip}`,
    getAccessToken,
    baseUrl,
    typeGuard: isTagListResponse,
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
    },
  });
}

/**
 * Fetches tags in a paginated manner.
 * @param args - {@link GetAllTagsParams}
 * @param opts - {@link GetTagsOptions}
 * @returns Async iterator of paged tag lists.
 * @throws {ScenesApiError} If the API call fails or the response format is invalid.
 */
export function getAllTags(
  args: GetAllTagsParams & AuthArgs,
  opts: Required<GetTagsOptions>,
): AsyncIterableIterator<TagListResponse> {
  const { iTwinId, getAccessToken, baseUrl } = args;
  const { top, skip, delayMs } = opts;
  const initialUrl = `${baseUrl}/tags?iTwinId=${iTwinId}&$top=${top}&$skip=${skip}`;

  return iteratePagedEndpoint<TagListResponse>(initialUrl, delayMs, async (url) => {
    return callApi<TagListResponse>({
      baseUrl: url,
      getAccessToken,
      typeGuard: isTagListResponse,
      additionalHeaders: {
        Accept: "application/vnd.bentley.itwin-platform.v1+json",
      },
    });
  });
}

/**
 * Creates a new tag.
 * @param params - {@link PostTagParams}
 * @returns Created tag details.
 * @throws {ScenesApiError} If the API call fails or the response format is invalid.
 */
export async function postTag({
  iTwinId,
  tag,
  getAccessToken,
  baseUrl,
}: PostTagParams & AuthArgs): Promise<TagResponse> {
  return callApi<TagResponse>({
    endpoint: `/tags?iTwinId=${iTwinId}`,
    getAccessToken,
    baseUrl,
    typeGuard: isTagResponse,
    fetchOptions: {
      method: "POST",
      body: JSON.stringify(tag),
    },
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
      "Content-Type": "application/json",
    },
  });
}

/**
 * Updates an existing tag.
 * @param params - {@link PatchTagParams}
 * @returns Updated tag details.
 * @throws {ScenesApiError} If the API call fails or the response format is invalid.
 */
export async function patchTag({
  tagId,
  iTwinId,
  tag,
  getAccessToken,
  baseUrl,
}: PatchTagParams & AuthArgs): Promise<TagResponse> {
  return callApi<TagResponse>({
    endpoint: `/tags/${tagId}?iTwinId=${iTwinId}`,
    getAccessToken,
    baseUrl,
    typeGuard: isTagResponse,
    fetchOptions: {
      method: "PATCH",
      body: JSON.stringify(tag),
    },
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
      "Content-Type": "application/json",
    },
  });
}

/**
 * Deletes a tag by ID.
 * @param params - {@link DeleteTagParams}
 * @throws {ScenesApiError} If the API call fails.
 */
export async function deleteTag({
  tagId,
  iTwinId,
  getAccessToken,
  baseUrl,
}: DeleteTagParams & AuthArgs): Promise<void> {
  await callApi({
    endpoint: `/tags/${tagId}?iTwinId=${iTwinId}`,
    getAccessToken,
    baseUrl,
    fetchOptions: { method: "DELETE" },
    additionalHeaders: {
      Accept: "application/vnd.bentley.itwin-platform.v1+json",
    },
  });
}
