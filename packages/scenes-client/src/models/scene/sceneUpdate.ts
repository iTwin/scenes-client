/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

export interface SceneUpdate {
  /** User defined display name of the scene */
  displayName?: string;
  /** Optional detailed description of the scene */
  description?: string;
  /** Optional parent Id for the scene (UUID) */
  parentId?: string;
}
