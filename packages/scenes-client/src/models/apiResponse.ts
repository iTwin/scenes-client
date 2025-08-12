// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

import { isObject } from "../utilities";
import { isSceneObject, SceneObject } from "./object/sceneObject";
import { isScene, Scene } from "./scene/scene";
import { isSceneMinimal, SceneMinimal } from "./scene/sceneMinimal";

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

/** Scene response model */
export interface SceneResponse {
  scene: Scene;
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

export function isSceneListResponse(v: unknown): v is SceneListResponse {
  return (
    isObject(v) &&
    Array.isArray(v.scenes) &&
    v.scenes.every((scene) => isSceneMinimal(scene))
  );
}

export function isSceneObjectResponse(v: unknown): v is SceneObjectResponse {
  return isObject(v) && isSceneObject(v.object);
}

export function isSceneObjectListResponse(
  v: unknown,
): v is SceneObjectListResponse {
  return (
    isObject(v) &&
    Array.isArray(v.objects) &&
    v.objects.every((obj) => isSceneObject(obj))
  );
}

export function isSceneObjectPagedResponse(
  v: unknown,
): v is SceneObjectPagedResponse {
  return isObject(v) && isSceneObjectListResponse(v) && isPagingLinks(v._links);
}
