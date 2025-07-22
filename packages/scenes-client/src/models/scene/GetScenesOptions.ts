// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

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
