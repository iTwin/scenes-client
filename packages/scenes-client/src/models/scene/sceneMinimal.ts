// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
import { isObject } from "../../utilities.js";
import { Scene } from "./scene.js";

export type SceneMinimal = Omit<Scene, "sceneData" | "isPartial">;

export function isSceneMinimal(v: unknown): v is SceneMinimal {
  return (
    isObject(v) &&
    typeof v.id === "string" &&
    typeof v.createdById === "string" &&
    typeof v.iTwinId === "string" &&
    typeof v.creationTime === "string" &&
    typeof v.lastModified === "string"
  );
}
