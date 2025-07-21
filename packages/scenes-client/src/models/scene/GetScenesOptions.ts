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

// @naron: are these default the right number? depending on frequent it can be called?
export const GET_SCENES_DEFAULTS: Required<GetScenesOptions> = {
  top: 100,
  delayMs: 50,
  skip: 0,
};
