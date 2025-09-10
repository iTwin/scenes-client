// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
import { isObject } from "../../utilities.js";
import { isSceneData, SceneData } from "./sceneData.js";
import { isSceneMinimal, SceneMinimal } from "./sceneMinimal.js";

export interface SceneInfo extends SceneMinimal {
  /** Scene informational objects. */
  sceneData: SceneData;
  /** Indicates sceneData was filtered because the user lacks necessary permissions to view all objects. */
  isPartial?: boolean;
}

export function isSceneInfo(v: unknown): v is SceneInfo {
  return (
    isObject(v) &&
    isSceneMinimal(v) &&
    isSceneData(v.sceneData) &&
    (v.isPartial === undefined || typeof v.isPartial === "boolean")
  );
}
