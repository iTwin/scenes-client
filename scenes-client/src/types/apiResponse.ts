// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
import { Scene, SceneMinimal, SceneObject } from "./scenes";

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
  scenes: Scene[] | SceneMinimal[]; // TODO: change to only minimal
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