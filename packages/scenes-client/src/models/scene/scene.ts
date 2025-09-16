/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { isObject } from "../../utilities.js";
import { isSceneData, SceneData } from "./sceneData.js";
import { isSceneMinimal, SceneMinimal } from "./sceneMinimal.js";

export interface Scene extends SceneMinimal {
  /** Scene informational objects. */
  sceneData: SceneData;
  /** Indicates sceneData was filtered because the user lacks necessary permissions to view all objects. */
  isPartial?: boolean;
}

export function isScene(v: unknown): v is Scene {
  return (
    isObject(v) &&
    isSceneMinimal(v) &&
    isSceneData(v.sceneData) &&
    (v.isPartial === undefined || typeof v.isPartial === "boolean")
  );
}
