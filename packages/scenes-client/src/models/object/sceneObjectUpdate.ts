// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

export interface SceneObjectUpdate {
  /** Display name for the scene object */
  displayName?: string;
  /** Number for the scene object's order in lists */
  order?: number;
  /** Parent Id for the scene object (UUID) */
  parentId?: string;
  /** iTwin Id the scene object is associated with (UUID) */
  iTwinId?: string;
  /** Data for the scene object */
  data?: object;
}

export interface SceneObjectUpdateById extends SceneObjectUpdate {
  /** Id of the scene object to update (UUID) */
  id: string;
}

/**
 * Bulk update of scene objects.
 */
export interface BulkSceneObjectUpdate {
  /**
   * Array of scene objects to patch.
   */
  objects: SceneObjectUpdateById[];
}
