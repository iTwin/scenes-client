// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
import { SchemaData, SchemaVersion } from "./types/sceneObjectSchemas.js";
import {
  ITwinScopedSchemas,
  ResourceStylingSchemas,
  StandardSchemas,
} from "./types/schemaCategories.js";

/**
 * Optional metadata properties that can be updated for any scene object
 */
export interface MetadataSceneObjectUpdate {
  /** Display name for the scene object */
  displayName?: string;
  /** Number for the scene object's order in lists */
  order?: number;
  /** Parent Id for the scene object (UUID) */
  parentId?: string;
}

/**
 * Interface for updating resource styling object data (and optionally metadata)
 * @template K - The resource styling schema kind (ex: 'iModelVisibility', 'ExpressionStyling')
 * @template V - The schema version (ex: '1.0.0')
 *
 * @example
 * ```typescript
 * const stylingUpdate: ResourceStylingObjectUpdate<'ExpressionStyling', '1.0.0'> = {
 *   displayName: 'Updated Expression',
 *   data: { expression: 'element.category === "Door"' }
 * };
 * ```
 */
export interface ResourceStylingObjectDataUpdate<
  K extends ResourceStylingSchemas,
  V extends SchemaVersion<K> = SchemaVersion<K>,
> extends MetadataSceneObjectUpdate {
  /** Schema-specific data to update for the resource styling scene object */
  data: SchemaData<K, V>;
}

/**
 * Interface for updating iTwin scoped object data (and optionally metadata)
 * When updating data, iTwinId is required
 * @template K - The iTwin scoped schema kind (ex: 'RepositoryResource')
 * @template V - The schema version (ex: '1.0.0')
 *
 * @example
 * ```typescript
 * const repositoryUpdate: ITwinScopedObjectUpdate<'RepositoryResource', '1.0.0'> = {
 *   displayName: 'Updated Repository',
 *   iTwinId: '<iTwin_id>',
 *   data: { repositoryId: '<repo_id>',  id: '<resource_id>', class: '<repo_class>', visible: true }
 * };
 * ```
 */
export interface ITwinScopedObjectDataUpdate<
  K extends ITwinScopedSchemas = ITwinScopedSchemas,
  V extends SchemaVersion<K> = SchemaVersion<K>,
> extends MetadataSceneObjectUpdate {
  /** iTwin Id the scene object is associated with (UUID) - required when updating data */
  iTwinId: string;
  /** Schema-specific data to update for the scene object */
  data: SchemaData<K, V>;
}

/**
 * Interface for updating standard scene object data (and optionally metadata)
 * @template K - The schema kind (ex: 'Layer', 'View3d', 'GoogleTilesStyling')
 * @template V - The schema version (ex: '1.0.0')
 *
 * @example
 * ```typescript
 * const layerUpdate: StandardSceneObjectUpdate<'Layer', '1.0.0'> = {
 *   displayName: 'Updated Layer',
 *   data: { visible: false }
 * };
 * ```
 */
export interface StandardSceneObjectDataUpdate<
  K extends StandardSchemas,
  V extends SchemaVersion<K> = SchemaVersion<K>,
> extends MetadataSceneObjectUpdate {
  /** Schema-specific data to update for the scene object */
  data: SchemaData<K, V>;
}

/**
 * Represents all possible scene object update interfaces
 */
export type SceneObjectUpdate =
  | MetadataSceneObjectUpdate
  | ResourceStylingObjectDataUpdate<ResourceStylingSchemas>
  | ITwinScopedObjectDataUpdate<ITwinScopedSchemas>
  | StandardSceneObjectDataUpdate<StandardSchemas>;

/**
 * Scene object update with required ID field for bulk operations
 */
export type SceneObjectUpdateById = SceneObjectUpdate & {
  /** Id of the scene object to update (UUID) */
  id: string;
};

/**
 * Interface for updating multiple scene objects in bulk
 *
 * @example
 * ```typescript
 * const bulkUpdate: BulkSceneObjectUpdate = {
 *   objects: [
 *     { id: '<object_id>', displayName: 'My Object 1', data: { ... } },
 *     { id: '<object_id>', displayName: 'My Object 2', data: { ... } }
 *   ]
 * };
 * ```
 */
export interface BulkSceneObjectUpdate {
  /**  Array of scene objects to patch */
  objects: SceneObjectUpdateById[];
}
