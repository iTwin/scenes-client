// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
import { isObject } from "../../utilities.js";
import { isSceneDataLinks, SceneDataLinks } from "./sceneDataLinks.js";
import { isSceneMinimal, SceneMinimal } from "./sceneMinimal.js";

export interface SceneWithLinks extends SceneMinimal {
  /** Scene data with links to resources */
  sceneData: SceneDataLinks;
}

export function isSceneWithLinks(v: unknown): v is SceneWithLinks {
  return isObject(v) && isSceneMinimal(v) && isSceneDataLinks(v.sceneData);
}
