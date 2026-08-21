/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { isObject } from "../../utilities.js";
import { isSceneObjectCreate, SceneObjectCreate } from "../object/sceneObjectCreate.js";
import { SceneVisibility } from "./sceneVisibility.js";

export interface SceneDataCreate {
  /** Array of scene objects */
  objects: SceneObjectCreate[];
}

export interface SceneCreate {
  /** Optional identifier for the scene object (UUID) */
  id?: string;
  /** User defined display name of the scene */
  displayName: string;
  /** Optional detailed description of the scene */
  description?: string;
  /**  Visibility of the scene. Defaults to `private`. Set to `iTwin` to make the scene visible to all iTwin members with `SCENES_READ` permission.*/
  visibility?: SceneVisibility;
  /** Optional list of tag Ids to apply to this scene. Tags must exist in the same iTwin as the scene itself. */
  tagIds?: string[];
  /** Scene informational objects */
  sceneData?: SceneDataCreate;
}

export function isSceneDataCreate(v: unknown): v is SceneDataCreate {
  return (
    isObject(v) && Array.isArray(v.objects) && v.objects.every((obj) => isSceneObjectCreate(obj))
  );
}
