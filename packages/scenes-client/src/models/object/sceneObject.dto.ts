// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

import { isObject } from "../../utilities";
import {
  isSceneObjectCreateDTO,
  SceneObjectCreateDTO,
} from "./sceneObjectCreate.dto";

export interface SceneObjectDTO extends SceneObjectCreateDTO {
  id: string;
  sceneId: string;
  createdById: string;
  creationTime: string;
  lastModified: string;
}

export function isSceneObjectDTO(v: unknown): v is SceneObjectDTO {
  return (
    isObject(v) &&
    typeof v.id === "string" &&
    typeof v.sceneId === "string" &&
    typeof v.createdById === "string" &&
    typeof v.creationTime === "string" &&
    typeof v.lastModified === "string" &&
    isSceneObjectCreateDTO(v)
  );
}
