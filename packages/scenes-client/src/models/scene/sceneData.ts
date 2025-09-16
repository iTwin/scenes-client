// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
import { isObject } from "../../utilities.js";
import { isSceneObjectMinimal, SceneObjectMinimal } from "../object/sceneObjectMinimal.js";

/** Container for scene objects and related data returned by the API */
export interface SceneData {
  /** Array of scene objects */
  objects: SceneObjectMinimal[];
}

export function isSceneData(v: unknown): v is SceneData {
  return (
    isObject(v) && Array.isArray(v.objects) && v.objects.every((obj) => isSceneObjectMinimal(obj))
  );
}
