// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
import { isObject } from "../../utilities";
import { SceneDTO } from "./scene.dto";

export type SceneMinimalDTO = Omit<SceneDTO, "sceneData" | "isPartial">;

export function isSceneMinimalDTO(v: unknown): v is SceneMinimalDTO {
  return (
    isObject(v) &&
    typeof v.id === "string" &&
    typeof v.createdById === "string" &&
    typeof v.iTwinId === "string" &&
    typeof v.creationTime === "string" &&
    typeof v.lastModified === "string"
  );
}
