// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
import { isObject } from "../../utilities.js";
import {
  SchemaData,
  SchemaKind,
  SchemaVersion,
} from "./types/sceneObjectSchemas.js";
import {
  ITwinScopedSchemas,
  ResourceStylingSchemas,
  StandardSchemas,
} from "./types/schemaCategories.js";

/**
 * Base scene object creation interface.
 * Contains properties common to all scene objects
 */
export interface BaseSceneObjectCreate<
  K extends SchemaKind = SchemaKind,
  V extends SchemaVersion<K> = SchemaVersion<K>,
> {
  /** Kind of the scene object (schema name) */
  kind: K;
  /** JSON schema version this object conforms to (SemVer) */
  version: V;
  /** Data that matches the object's JSON schema */
  data: SchemaData<K, V>;
  /** Optional identifier for the scene object (UUID) */
  id?: string;
  /** Optional display name for the scene object */
  displayName?: string;
  /** Optional order in lists */
  order?: number;
  /** Optional parent Id (UUID) */
  parentId?: string;
}

/**
 * Resource styling object creation interface.
 * Used to apply styling options to RepositoryResource objects in a scene.
 * Requires a relatedId to indicate which object is being styled.
 *
 * @example
 * ```typescript
 * const expressionStyling: ResourceStylingObjectCreate = {
 *   kind: 'ExpressionStyling',
 *   version: '1.0.0',
 *   relatedId: '<object_id>',
 *   data: { stylingOptions: { styleType: "Expression", show: 'element.category === "Door"' } }
 * };
 * ```
 */
export interface ResourceStylingObjectCreate<
  K extends ResourceStylingSchemas = ResourceStylingSchemas,
  V extends SchemaVersion<K> = SchemaVersion<K>,
> extends BaseSceneObjectCreate<K, V> {
  /** Id of the related scene object this styling applies to (UUID) */
  relatedId: string;
}

/**
 * iTwin-scoped object creation interface.
 * Object will be associated to a specific iTwin via iTwinId
 *
 * @example
 * ```typescript
 * const repository: ITwinScopedObjectCreate = {
 *   kind: 'RepositoryResource',
 *   version: '1.0.0',
 *   iTwinId: '<iTwin_id>',
 *   data: { repositoryId: '<repo_id>',  id: '<resource_id>', class: '<repo_class>', visible: true }
 * };
 * ```
 */
export interface ITwinScopedObjectCreate<
  K extends ITwinScopedSchemas = ITwinScopedSchemas,
  V extends SchemaVersion<K> = SchemaVersion<K>,
> extends BaseSceneObjectCreate<K, V> {
  /** iTwin Id the scene object is associated with (UUID) */
  iTwinId: string;
}

/**
 * Standard scene object creation interface.
 * Use for most objects, no extra requirements beyond base properties
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface StandardObjectCreate<
  K extends StandardSchemas = StandardSchemas,
  V extends SchemaVersion<K> = SchemaVersion<K>,
> extends BaseSceneObjectCreate<K, V> {}

/**
 * Union type representing all possible scene object creates.
 * Automatically resolves to the appropriate interface based on the schema kind
 */
export type SceneObjectCreate =
  | StandardObjectCreate
  | ResourceStylingObjectCreate
  | ITwinScopedObjectCreate;

/**
 * Interface for creating multiple scene objects
 *
 * @example
 * ```typescript
 * const bulkCreate: BulkSceneObjectCreate = {
 *   objects: [
 *     { kind: 'Layer', version: '1.0.0', data: { ... } },
 *     { kind: 'View3d', version: '1.0.0', data: { ... } }
 *   ]
 * };
 * ```
 */
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
