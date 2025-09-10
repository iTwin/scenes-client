// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
import { isObject } from "../../utilities.js";
import { isLink, Link } from "../apiResponse.js";

/** Container for links to scene resources returned by the API */
export interface SceneDataLinks {
  /** URL to retrieve scene objects */
  objects: Link;
}

export function isSceneDataLinks(v: unknown): v is SceneDataLinks {
  return isObject(v) && isLink(v.objects);
}
