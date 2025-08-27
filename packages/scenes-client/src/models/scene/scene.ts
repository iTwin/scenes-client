// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

import { isObject } from "../../utilities.js";
import { isSceneData, SceneData } from "./sceneData.js";

export interface Scene {
  /** Unique identifier for the scene (UUID). */
  id: string;
  /** Optional parent Id for the scene (UUID) */
  parentId?: string;
  /** User defined display name of the scene */
  displayName: string;
  /** Optional detailed description of the scene */
  description?: string;
  /** Scene informational objects. */
  sceneData: SceneData;
  /** Indicates sceneData was filtered because the user lacks necessary permissions to view all objects. */
  isPartial?: boolean;
  /** Id of the user who created the scene (UUID). */
  createdById: string;
  /** iTwin Id associated with the scene (UUID). */
  iTwinId: string;
  /** Time the scene was created as an ISO8601 string, 'YYYY-MM-DDTHH:mm:ss.sssZ'. */
  creationTime: string;
  /** Time the scene was last modified as an ISO8601 string, 'YYYY-MM-DDTHH:mm:ss.sssZ'. */
  lastModified: string;
}

export function isScene(v: unknown): v is Scene {
  return (
    isObject(v) &&
    typeof v.id === "string" &&
    isSceneData(v.sceneData) &&
    (v.isPartial === undefined || typeof v.isPartial === "boolean") &&
    typeof v.createdById === "string" &&
    typeof v.iTwinId === "string" &&
    typeof v.creationTime === "string" &&
    typeof v.lastModified === "string"
  );
}
