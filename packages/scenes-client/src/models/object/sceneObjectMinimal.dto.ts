// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
import { isObject } from "../../utilities";
import { SceneObjectDTO } from "./sceneObject.dto";
import { isSceneObjectCreateDTO } from "./sceneObjectCreate.dto";

export type SceneObjectMinimalDTO = Omit<
  SceneObjectDTO,
  "sceneId" | "createdById" | "creationTime" | "lastModified"
>;

export function isSceneObjectMinimalDTO(
  v: unknown,
): v is SceneObjectMinimalDTO {
  return isObject(v) && typeof v.id === "string" && isSceneObjectCreateDTO(v);
}
