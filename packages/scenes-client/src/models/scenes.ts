// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

/**
 * Minimal scene object response used in SceneData
 */
export interface SceneObjectMinimal {
  /** Unique identifier */
  id: string;
  /** Optional user visible name */
  displayName?: string;
  /** Optional order/index number */
  order?: number;
  /** Optional parent object id */
  parentId?: string;
  /** Related object id for resource styling objects */
  relatedId?: string;
  /** Project id the object is associated with */
  iTwinId?: string;
  /** Kind of the scene object (JSON schema name) */
  kind: string;
  /** Version of the JSON schema */
  version: string;
  /** Data for the scene object, validated against its JSON schema */
  data: object;
}

/**
 * SceneObject response object for restful operations
 */
export interface SceneObject extends SceneObjectMinimal {
  /** Id of the scene containing the object */
  sceneId: string;
  /** Id of the user who created the scene object */
  createdById: string;
  /** Time the scene was object created as an ISO8601 string, `"YYYY-MM-DDTHH:mm:ss.sssZ"` */
  creationTime: string;
  /** Time the scene object was last modified as an ISO8601 string, `"YYYY-MM-DDTHH:mm:ss.sssZ"` */
  lastModified: string;
}

/**
 * SceneData response object
 */
export interface SceneData {
  /** Scene informational objects */
  objects: SceneObjectMinimal[];
}

/**
 * Minimal scene response object used in GET ALL response lists
 */
export interface SceneMinimal {
  /** Unique identifier */
  id: string;
  /** User visible name */
  displayName: string;
  /** Project id the scene is associated with */
  iTwinId: string;
  /** Optional parent scene id */
  parentId?: string;
  /** Id of the user who created the scene */
  createdById: string;
  /** Time the scene was created as an ISO8601 string, `"YYYY-MM-DDTHH:mm:ss.sssZ"` */
  creationTime: string;
  /** Time the scene was last modified as an ISO8601 string, `"YYYY-MM-DDTHH:mm:ss.sssZ"` */
  lastModified: string;
}

/**
 * Scene response object for restful operations
 */
export interface Scene extends SceneMinimal {
  /** True if sceneData has been filtered due to insufficient permissions */
  isPartial?: boolean;
  /** Scene informational objects */
  sceneData: SceneData;
}
