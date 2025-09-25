/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

export interface SceneUpdate {
  /** User defined display name of the scene */
  displayName?: string;
  /** Optional detailed description of the scene. Pass `null` to remove. */
  description?: string | null;
  /** Optional parent Id for the scene (UUID). Pass `null` to remove. */
  parentId?: string | null;
}
