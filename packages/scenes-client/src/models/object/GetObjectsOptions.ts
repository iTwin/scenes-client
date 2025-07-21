// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

/**
 * Properties to optionally order scene objects by.
 */
export enum OrderByProperties {
  NAME = "displayName",
  ORDER_NUMBER = "order",
  KIND = "kind",
}

/**
 * Options for retrieving scene objects.
 */
export interface GetObjectsOptions {
  /** items per page (default 100) */
  top?: number;
  /** number of items to skip (default 0) */
  skip?: number;
  /** ms pause between pages (default 0) */
  delayMs?: number;
  kind?: OrderByProperties;
}

// @naron: are these default the right number? depending on frequent it can be called?
export const GET_OBJECTS_DEFAULTS: Required<GetObjectsOptions> = {
  top: 100,
  delayMs: 0,
  skip: 0,
  kind: OrderByProperties.KIND,
};
