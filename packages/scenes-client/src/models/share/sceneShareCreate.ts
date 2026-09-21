/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

/** Payload for creating a new scene share. */
export interface SceneShareCreate {
  /**
   * Optional share expiration. Must be a date in the future.
   * If not provided, defaults to 100 years from creation (to be effectively non-expiring).
   */
  expiration?: string | Date;
}
