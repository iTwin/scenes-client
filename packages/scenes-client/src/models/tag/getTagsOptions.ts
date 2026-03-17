/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

/** Paging options for listing tags */
export interface GetTagsOptions {
  /** Maximum number of tags returned in one page. */
  top?: number;
  /** Number of tags to skip before returning results. */
  skip?: number;
  /** Delay in milliseconds between page requests in getAllTags. */
  delayMs?: number;
}

export const GET_TAGS_DEFAULTS: Required<GetTagsOptions> = {
  top: 100,
  skip: 0,
  delayMs: 0,
};
