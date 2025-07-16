// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

export interface SceneObjectCreateDto {
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
};

export interface SceneDataCreateDto {
  /** Array of scene objects */
  objects: SceneObjectCreateDto[];
};
