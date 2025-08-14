// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
import { isObject } from "../../utilities.js";
import { isSceneObjectCreate, SceneObjectCreate } from "./sceneObjectCreate.js";
import { SchemaKind, SchemaVersion } from "./types/sceneObjectSchemas.js";

export interface SceneObject<
  K extends SchemaKind = SchemaKind,
  V extends SchemaVersion<K> = SchemaVersion<K>,
> extends SceneObjectCreate<K, V> {
  /** Unique identifier for the scene object (UUID). */
  id: string;
  /** Id of the scene containing the object (UUID). */
  sceneId: string;
  /** Id of the user who created the scene object (UUID). */
  createdById: string;
  /** Time the scene object was created as an ISO8601 string, 'YYYY-MM-DDTHH:mm:ss.sssZ'. */
  creationTime: string;
  /** Time the scene object was last modified as an ISO8601 string, 'YYYY-MM-DDTHH:mm:ss.sssZ'. */
  lastModified: string;
}

export function isSceneObject(v: unknown): v is SceneObject {
  return (
    isObject(v) &&
    typeof v.id === "string" &&
    typeof v.sceneId === "string" &&
    typeof v.createdById === "string" &&
    typeof v.creationTime === "string" &&
    typeof v.lastModified === "string" &&
    isSceneObjectCreate(v)
  );
}
