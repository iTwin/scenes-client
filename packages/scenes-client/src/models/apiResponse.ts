/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { isObject } from "../utilities.js";
import { isSceneObject, SceneObject } from "./object/sceneObject.js";
import { isScene, Scene } from "./scene/scene.js";
import { isSceneContext, SceneContext } from "./scene/sceneContext.js";
import { isSceneMinimal, SceneMinimal } from "./scene/sceneMinimal.js";
import { isSceneWithLinks, SceneWithLinks } from "./scene/sceneWithLinks.js";

/** Generic href link */
export interface Link {
  href: string;
}

/** Links for paginated response lists */
export interface PagingLinks {
  self: Link;
  prev?: Link;
  next?: Link;
}

/** Full scene response with complete information including objects */
export interface SceneResponse {
  scene: Scene;
}

/** Scene response with metadata and links to resources */
export interface SceneMetadataResponse {
  scene: SceneWithLinks;
}

/** Scene list response model */
export interface SceneListResponse {
  scenes: SceneMinimal[];
  _links?: PagingLinks;
}

/** Scene object response model */
export interface SceneObjectResponse {
  object: SceneObject;
}

/** Scene object list response model for bulk responses */
export interface SceneObjectListResponse {
  objects: SceneObject[];
}

/** Scene object list response model for paginated responses */
export interface SceneObjectPagedResponse extends SceneObjectListResponse {
  sceneContext: SceneContext;
  _links: PagingLinks;
}

// type guards for runtime type checking
export function isLink(v: unknown): v is Link {
  return isObject(v) && typeof v.href === "string";
}

export function isPagingLinks(v: unknown): v is PagingLinks {
  return (
    isObject(v) &&
    isLink(v.self) &&
    (v.prev === undefined || isLink(v.prev)) &&
    (v.next === undefined || isLink(v.next))
  );
}

export function isSceneResponse(v: unknown): v is SceneResponse {
  return isObject(v) && isScene(v.scene);
}

export function isSceneMetadataResponse(v: unknown): v is SceneMetadataResponse {
  return isObject(v) && isSceneWithLinks(v.scene);
}

export function isSceneListResponse(v: unknown): v is SceneListResponse {
  return isObject(v) && Array.isArray(v.scenes) && v.scenes.every((scene) => isSceneMinimal(scene));
}

export function isSceneObjectResponse(v: unknown): v is SceneObjectResponse {
  return isObject(v) && isSceneObject(v.object);
}

export function isSceneObjectListResponse(v: unknown): v is SceneObjectListResponse {
  return isObject(v) && Array.isArray(v.objects) && v.objects.every((obj) => isSceneObject(obj));
}

export function isSceneObjectPagedResponse(v: unknown): v is SceneObjectPagedResponse {
  return (
    isObject(v) &&
    isSceneObjectListResponse(v) &&
    isPagingLinks(v._links) &&
    isSceneContext(v.sceneContext)
  );
}
