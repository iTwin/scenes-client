/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { SceneObjectCreate } from "./sceneObjectCreate.js";
import { SceneObjectUpdate } from "./sceneObjectUpdate.js";
import { SchemaKind, SchemaVersion } from "./types/sceneObjectSchemas.js";

/**
 * Operation types for bulk scene object updates
 */
export enum OperationType {
  CREATE = "add",
  UPDATE = "update",
  DELETE = "remove",
}

/**
 * Base interface for scene object operations
 */
export interface SceneObjectOperationBase {
  op: OperationType;
}

/**
 * Operation to create a new scene object
 *
 * @example
 * ```typescript
 * const createStylingObject: CreateSceneObjectOperation<'ExpressionStyling', '1.0.0'> = {
 *   op: OperationType.CREATE,
 *   payload: {
 *     id: '<object_id>', // Optional, will be auto-generated if not provided
 *     kind: 'ExpressionStyling',
 *     version: '1.0.0',
 *     relatedId: '<related_object_id>',
 *     data: { stylingOptions: { styleType: "Expression", show: 'element.category === "Door"' } }
 *   }
 * };
 * ```
 */
export interface CreateSceneObjectOperation<
  K extends SchemaKind = SchemaKind,
  V extends SchemaVersion<K> = SchemaVersion<K>,
> extends SceneObjectOperationBase {
  /** Operation type */
  op: OperationType.CREATE;
  /** Scene object creation payload */
  payload: SceneObjectCreate<K, V>;
}

/**
 * Operation to update an existing scene object
 *
 * @example
 * ```typescript
 * const updateStyling: UpdateSceneObjectOperation<'ExpressionStyling', '1.0.0'> = {
 *   op: OperationType.UPDATE,
 *   id: '<object_id>',
 *   payload: {
 *     displayName: 'Updated ExpressionStyling',
 *     data: { stylingOptions: { styleType: "Expression", show: 'element.category === "Door"' } }
 *   }
 * };
 * ```
 */
export interface UpdateSceneObjectOperation<
  K extends SchemaKind = SchemaKind,
  V extends SchemaVersion<K> = SchemaVersion<K>,
> extends SceneObjectOperationBase {
  /** Operation type */
  op: OperationType.UPDATE;
  /** Id of the scene object to update (UUID) */
  id: string;
  /** Scene object partial update payload */
  payload: SceneObjectUpdate<K, V>;
}

/**
 * Operation to delete a scene object
 *
 * @example
 * ```typescript
 * const deleteOperation: DeleteSceneObjectOperation = {
 *   op: OperationType.DELETE,
 *   id: '<object_id>'
 * };
 * ```
 */
export interface DeleteSceneObjectOperation extends SceneObjectOperationBase {
  /** Operation type */
  op: OperationType.DELETE;
  /** Id of the scene object to delete (UUID) */
  id: string;
}

/**
 * Union type for all scene object operations
 */
export type SceneObjectOperation =
  | CreateSceneObjectOperation
  | UpdateSceneObjectOperation
  | DeleteSceneObjectOperation;

/**
 * Interface for updating multiple scene objects in bulk using atomic operations.
 * All operations are executed in the order provided.
 *
 * @example
 * ```typescript
 * const bulkUpdate: BulkSceneObjectOperations = {
 *   operations: [
 *     // 1. Create a new scene object
 *     { op: 'add', payload: { displayName: 'My New Layer', id: '<object_id_1>', ... } },
 *     // 2. Move existing object to the new layer
 *     { op: 'update', id: '<object_id_2>', payload: { parentId: '<object_id_1>' } },
 *     // 3. Remove old layer
 *     { op: 'remove', id: '<object_id_3>'}
 *   ]
 * };
 * ```
 */
export interface BulkSceneObjectOperations {
  /**  Array of scene object operations to perform. */
  operations: SceneObjectOperation[];
}
