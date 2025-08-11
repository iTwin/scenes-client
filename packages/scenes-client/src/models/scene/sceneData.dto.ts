// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

import { isObject } from "../../utilities";
import {
  isSceneObjectMinimalDTO,
  SceneObjectMinimalDTO,
} from "../object/sceneObjectMinimal.dto";

/** Container for scene objects and related data returned by the API */
export interface SceneDataDTO {
  /** Array of scene objects */
  objects: SceneObjectMinimalDTO[];
}

export function isSceneDataDTO(v: unknown): v is SceneDataDTO {
  return (
    isObject(v) &&
    Array.isArray(v.objects) &&
    v.objects.every((obj) => isSceneObjectMinimalDTO(obj))
  );
}
