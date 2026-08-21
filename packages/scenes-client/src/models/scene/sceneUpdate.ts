/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { SceneVisibility } from "./sceneVisibility.js";

export interface SceneUpdate {
  /** User defined display name of the scene */
  displayName?: string;
  /** Optional detailed description of the scene. Pass `null` to remove. */
  description?: string | null;
  /** Visibility of the scene. Set to `iTwin` to make the scene visible to all iTwin members with `SCENES_READ` permission.*/
  visibility?: SceneVisibility;
  /**
   * Optional list of tag Ids to apply to this scene.
   * Tags must exist in the same iTwin as the scene itself.
   *
   * Replaces the full set of scene's tags.
   */
  tagIds?: string[];
}
