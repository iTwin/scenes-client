// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
import { isObject } from "../../utilities.js";
import {
  SchemaData,
  SchemaKind,
  SchemaVersion,
} from "./types/sceneObjectSchemas.js";

/**
 * General scene object creation interface.
 * For specific field requirements, use the typed creation functions.
 */
export interface SceneObjectCreate<
  K extends SchemaKind = SchemaKind,
  V extends SchemaVersion<K> = SchemaVersion<K>,
> {
  /** Optional identifier for the scene object (UUID) */
  id?: string;
  /** Optional display name for the scene object */
  displayName?: string;
  /** Optional order in lists */
  order?: number;
  /** JSON schema version this object conforms to (SemVer) */
  version: V;
  /** Kind of the scene object (schema name) */
  kind: K;
  /** Optional parent Id (UUID) */
  parentId?: string;
  /** iTwin Id associated with this object (UUID) */
  iTwinId?: string;
  /** Related scene object Id for styling (UUID) */
  relatedId?: string;
  /** Arbitrary data that matches the object's JSON schema */
  data: SchemaData<K, V>;
}

export interface BulkSceneObjectCreate {
  objects: SceneObjectCreate[];
}

export function isSceneObjectCreate(v: unknown): v is SceneObjectCreate {
  return (
    isObject(v) &&
    (v.id === undefined || typeof v.id === "string") &&
    (v.displayName === undefined || typeof v.displayName === "string") &&
    (v.order === undefined || typeof v.order === "number") &&
    typeof v.version === "string" &&
    typeof v.kind === "string" &&
    (v.parentId === undefined || typeof v.parentId === "string") &&
    (v.iTwinId === undefined || typeof v.iTwinId === "string") &&
    (v.relatedId === undefined || typeof v.relatedId === "string") &&
    isObject(v.data)
  );
}
