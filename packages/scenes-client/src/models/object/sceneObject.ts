// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
import { isObject } from "../../utilities.js";
import {
  isSceneObjectCreate,
  ResourceStylingObjectCreate,
  ITwinScopedObjectCreate,
  StandardObjectCreate,
} from "./sceneObjectCreate.js";
import { SchemaVersion } from "./types/sceneObjectSchemas.js";
import {
  ITwinScopedSchemas,
  ResourceStylingSchemas,
  StandardSchemas,
} from "./types/schemaCategories.js";

/**
 * Server response metadata added to all scene objects
 */
interface SceneObjectResponseMetadata {
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

/**
 * Scene object that applies styling to a specific resource (ex: iModelVisibility, ExpressionStyling)
 * RelatedId indicates which scene object is being styled.
 */
export interface ResourceStylingObject<
  K extends ResourceStylingSchemas = ResourceStylingSchemas,
  V extends SchemaVersion<K> = SchemaVersion<K>,
> extends Omit<ResourceStylingObjectCreate<K, V>, "id">,
    SceneObjectResponseMetadata {}

/**
 * Scene object that is iTwin-scoped (ex: RepositoryResource)
 */
export interface ITwinScopedObject<
  K extends ITwinScopedSchemas = ITwinScopedSchemas,
  V extends SchemaVersion<K> = SchemaVersion<K>,
> extends Omit<ITwinScopedObjectCreate<K, V>, "id">,
    SceneObjectResponseMetadata {}

/**
 * Standard scene object (ex: Layer, View3d, UnrealAtmosphericStyling)
 */
export interface StandardObject<
  K extends StandardSchemas = StandardSchemas,
  V extends SchemaVersion<K> = SchemaVersion<K>,
> extends Omit<StandardObjectCreate<K, V>, "id">,
    SceneObjectResponseMetadata {}

/**
 * Union type representing all possible scene object responses.
 * Automatically resolves to the appropriate interface based on schema kind
 */
export type SceneObject =
  | StandardObject
  | ResourceStylingObject
  | ITwinScopedObject;

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
