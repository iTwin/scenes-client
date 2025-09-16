/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

/**
 * Options for retrieving scenes.
 */
export interface GetScenesOptions {
  /** items per page */
  top?: number;
  /** number of items to skip */
  skip?: number;
  /** ms pause between pages */
  delayMs?: number;
}

export const GET_SCENES_DEFAULTS: Required<GetScenesOptions> = {
  top: 100,
  delayMs: 0,
  skip: 0,
};
