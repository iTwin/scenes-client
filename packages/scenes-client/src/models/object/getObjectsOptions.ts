/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

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
  /** property to order by (default OrderByProperties.KIND) */
  orderBy?: OrderByProperties;
}

export const GET_OBJECTS_DEFAULTS: Required<GetObjectsOptions> = {
  top: 100,
  delayMs: 0,
  skip: 0,
  orderBy: OrderByProperties.KIND,
};
