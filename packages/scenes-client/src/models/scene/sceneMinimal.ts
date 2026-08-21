/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { isObject } from "../../utilities.js";
import { isTagMinimal, TagMinimal } from "../tag/tagMinimal.js";
import { SceneVisibility } from "./sceneVisibility.js";

export interface SceneMinimal {
  /** Unique identifier for the scene (UUID). */
  id: string;
  /** User defined display name of the scene */
  displayName: string;
  /** Optional detailed description of the scene */
  description?: string;
  /** Id of the user who created the scene (UUID). */
  createdById: string;
  /** Id of the user who last modified the scene (UUID). */
  lastModifiedById: string;
  /** iTwin Id associated with the scene (UUID). */
  iTwinId: string;
  /** Time the scene was created as an ISO8601 string, 'YYYY-MM-DDTHH:mm:ss.sssZ'. */
  creationTime: string;
  /** Time the scene was last modified as an ISO8601 string, 'YYYY-MM-DDTHH:mm:ss.sssZ'. */
  lastModified: string;
  /** Visibility of the scene. `iTwin` means the scene is visible to all iTwin members with `SCENES_READ` permission. */
  visibility?: SceneVisibility;
  /** Tags associated with this scene */
  tags: TagMinimal[];
}

export function isSceneMinimal(v: unknown): v is SceneMinimal {
  return (
    isObject(v) &&
    typeof v.id === "string" &&
    typeof v.displayName === "string" &&
    typeof v.createdById === "string" &&
    typeof v.lastModifiedById === "string" &&
    typeof v.iTwinId === "string" &&
    typeof v.creationTime === "string" &&
    typeof v.lastModified === "string" &&
    Array.isArray(v.tags) &&
    v.tags.every((tag) => isTagMinimal(tag)) &&
    (v.description === undefined || typeof v.description === "string") &&
    (v.visibility === undefined || typeof v.visibility === "string")
  );
}
