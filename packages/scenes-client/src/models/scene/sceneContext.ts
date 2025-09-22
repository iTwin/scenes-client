/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { isObject } from "../../utilities.js";

/** Context about the scene for requested objects */
export interface SceneContext {
  /** User defined display name of the scene */
  displayName: string;
  /** Time the scene was last modified as an ISO8601 string, 'YYYY-MM-DDTHH:mm:ss.sssZ */
  lastModified: string;
  /** Indicates some objects in this scene will be filtered due to insufficient permissions. */
  isPartial?: boolean;
}

export const isSceneContext = (v: unknown): v is SceneContext => {
  return (
    isObject(v) &&
    typeof v.displayName === "string" &&
    typeof v.lastModified === "string" &&
    (v.isPartial === undefined || typeof v.isPartial === "boolean")
  );
};
