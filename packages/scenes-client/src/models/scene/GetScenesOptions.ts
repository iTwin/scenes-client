// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

export interface GetScenesOptions {
  /** items per page (default 100) */
  top?: number;
  // @naron: are these default the right number? depending on frequent it can be called?
  /** ms pause between pages (default 100) */
  delayMs?: number;
  /** number of items to skip (default 0) */
  skip?: number;
}

export const GET_SCENES_DEFAULTS: Required<GetScenesOptions> = {
  top: 100,
  delayMs: 0,
  skip: 0,
};
