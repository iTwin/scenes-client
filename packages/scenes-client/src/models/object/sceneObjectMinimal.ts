// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
import { isObject } from "../../utilities";
import { SceneObject } from "./sceneObject";
import { isSceneObjectCreate } from "./sceneObjectCreate";

export type SceneObjectMinimal = Omit<
  SceneObject,
  "sceneId" | "createdById" | "creationTime" | "lastModified"
>;

export function isSceneObjectMinimal(
  v: unknown,
): v is SceneObjectMinimal {
  return isObject(v) && typeof v.id === "string" && isSceneObjectCreate(v);
}
