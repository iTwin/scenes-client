/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { SchemaData, SchemaKind, SchemaVersion } from "./types/sceneObjectSchemas.js";

/**
 * Interface for updating scene objects
 *
 * @example
 * ```typescript
 * const layerUpdate: StandardSceneObjectUpdate<'Layer', '1.0.0'> = {
 *   displayName: 'Updated Layer',
 *   data: { visible: false }
 * };
 * ```
 */
export interface SceneObjectUpdate<
  K extends SchemaKind = SchemaKind,
  V extends SchemaVersion<K> = SchemaVersion<K>,
> {
  /** Optional display name for the scene object. Pass `null` to remove. */
  displayName?: string | null;
  /** Optional number for the scene object's order in lists. Pass `null` to remove. */
  order?: number | null;
  /** Optional parent Id for the scene object (UUID). Pass `null` to remove. */
  parentId?: string | null;
  /** Optional visibility state for the scene object. Pass `null` to remove. */
  visible?: boolean | null;
  /** Schema-specific data to update for the scene object */
  data?: SchemaData<K, V>;
}

export type SceneObjectUpdateById = SceneObjectUpdate & {
  /** Id of the scene object to update (UUID) */
  id: string;
};

/**
 * Interface for updating multiple scene objects in bulk
 *
 * @deprecated Use {@link BulkSceneObjectOperations} instead.
 * @example
 * ```typescript
 * const bulkUpdate: BulkSceneObjectUpdate = {
 *   objects: [
 *     { id: '<object_id_1>', displayName: 'My Object 1' },
 *     { id: '<object_id_2>', data: { ... } }
 *   ]
 * };
 * ```
 */
export interface BulkSceneObjectUpdate {
  /**  Array of scene objects to patch */
  objects: SceneObjectUpdateById[];
}
