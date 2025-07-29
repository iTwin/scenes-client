// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

import { isObject } from "../../utilities";
import {
  isSceneObjectCreateDTO,
  SceneObjectCreateDTO,
} from "../object/sceneObjectCreate.dto";

export interface SceneDataCreateDTO {
  /** Array of scene objects */
  objects: SceneObjectCreateDTO[];
}

export interface SceneCreateDTO {
  /** Optional identifier for the scene object (UUID) */
  id?: string;

  /** User defined display name of the scene */
  displayName: string;

  /** Optional parent Id for the scene (UUID) */
  parentId?: string;

  /** Scene informational objects */
  sceneData?: SceneDataCreateDTO;
}

export function isSceneDataCreateDTO(v: unknown): v is SceneDataCreateDTO {
  return (
    isObject(v) &&
    Array.isArray(v.objects) &&
    v.objects.every((obj) => isSceneObjectCreateDTO(obj))
  );
}
