// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
import { isObject } from "../../utilities";

export interface SceneObjectCreateDTO {
  /** Optional identifier for the scene object (UUID) */
  id?: string;

  /** Optional display name for the scene object */
  displayName?: string;

  /** Optional order in lists */
  order?: number;

  /** JSON schema version this object conforms to (SemVer) */
  version: string;

  /** Kind of the scene object (schema name) */
  kind: string;

  /** Optional parent Id (UUID) */
  parentId?: string;

  /** iTwin Id associated with this object (UUID) */
  iTwinId?: string;

  /** Related scene object Id for styling (UUID) */
  relatedId?: string;

  /** Arbitrary data that matches the object's JSON schema */
  data: Record<string, unknown>;
}

export interface BulkSceneObjectCreateDTO {
  objects: SceneObjectCreateDTO[];
}

export function isSceneObjectCreateDTO(v: unknown): v is SceneObjectCreateDTO {
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
