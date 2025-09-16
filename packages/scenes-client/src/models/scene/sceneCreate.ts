// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

import { isObject } from "../../utilities.js";
import { isSceneObjectCreate, SceneObjectCreate } from "../object/sceneObjectCreate.js";

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
  /** Optional parent Id for the scene (UUID) */
  parentId?: string;
  /** Scene informational objects */
  sceneData?: SceneDataCreate;
}

export function isSceneDataCreate(v: unknown): v is SceneDataCreate {
  return (
    isObject(v) && Array.isArray(v.objects) && v.objects.every((obj) => isSceneObjectCreate(obj))
  );
}
