// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
import { isObject, UnionOmit } from "../../utilities.js";
import { SceneObject } from "./sceneObject.js";
import { isSceneObjectCreate } from "./sceneObjectCreate.js";

export type SceneObjectMinimal = UnionOmit<
  SceneObject,
  "sceneId" | "createdById" | "creationTime" | "lastModified"
>;

export function isSceneObjectMinimal(v: unknown): v is SceneObjectMinimal {
  return isObject(v) && typeof v.id === "string" && isSceneObjectCreate(v);
}
