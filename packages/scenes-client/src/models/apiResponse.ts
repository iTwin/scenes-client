// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

import {
  Scene,
  SceneMinimal,
  SceneObject,
  isScene,
  isObject,
  isSceneMinimal,
  isSceneObject,
  isSceneObjectMinimal,
} from "./scene/scenes";

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

/** Scene response model following APIM structure */
export interface SceneResponse {
  scene: Scene;
}

/** Scene list response model following APIM structure */
export interface SceneListResponse {
  scenes: SceneMinimal[];
  _links: PagingLinks;
}

/** Scene object response model following APIM structure */
export interface SceneObjectResponse {
  object: SceneObject;
}

/** Scene object list response model following APIM structure */
export class SceneObjectListResponse {
  objects: Array<Omit<SceneObject, "sceneId">> = [];
  _links?: PagingLinks;
}

// type guards for runtime type checking
export function isSceneResponse(v: unknown): v is SceneResponse {
  return isObject(v) && "scene" in v && isScene(v.scene);
}

export function isSceneListResponse(v: unknown): v is SceneListResponse {
  return (
    isObject(v) &&
    "scenes" in v &&
    Array.isArray(v.scenes) &&
    v.scenes.every(isSceneMinimal) &&
    "_links" in v &&
    isObject(v._links) &&
    "self" in v._links &&
    isObject(v._links.self) &&
    typeof v._links.self.href === "string" &&
    ("prev" in v._links
      ? isObject(v._links.prev) && typeof v._links.prev.href === "string"
      : true) &&
    ("next" in v._links
      ? isObject(v._links.next) && typeof v._links.next.href === "string"
      : true)
  );
}

export function isSceneObjectResponse(v: unknown): v is SceneObjectResponse {
  return isObject(v) && "object" in v && isSceneObject(v.object);
}

export function isSceneObjectListResponse(
  v: unknown,
): v is SceneObjectListResponse {
  return (
    isObject(v) &&
    "objects" in v &&
    Array.isArray(v.objects) &&
    v.objects.every(isSceneObjectMinimal) &&
    ("_links" in v ? isObject(v._links) : true)
  );
}
