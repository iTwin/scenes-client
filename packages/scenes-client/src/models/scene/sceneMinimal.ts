/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { isObject } from "../../utilities.js";

export interface SceneMinimal {
  /** Unique identifier for the scene (UUID). */
  id: string;
  /** Optional parent Id for the scene (UUID) */
  parentId?: string;
  /** User defined display name of the scene */
  displayName: string;
  /** Optional detailed description of the scene */
  description?: string;
  /** Id of the user who created the scene (UUID). */
  createdById: string;
  /** iTwin Id associated with the scene (UUID). */
  iTwinId: string;
  /** Time the scene was created as an ISO8601 string, 'YYYY-MM-DDTHH:mm:ss.sssZ'. */
  creationTime: string;
  /** Time the scene was last modified as an ISO8601 string, 'YYYY-MM-DDTHH:mm:ss.sssZ'. */
  lastModified: string;
}

export function isSceneMinimal(v: unknown): v is SceneMinimal {
  return (
    isObject(v) &&
    typeof v.id === "string" &&
    typeof v.displayName === "string" &&
    typeof v.createdById === "string" &&
    typeof v.iTwinId === "string" &&
    typeof v.creationTime === "string" &&
    typeof v.lastModified === "string" &&
    (v.description === undefined || typeof v.description === "string") &&
    (v.parentId === undefined || typeof v.parentId === "string")
  );
}
