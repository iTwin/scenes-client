// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

import { isObject } from "../../utilities";
import {
  isSceneDataCreateDTO,
  SceneCreateDTO,
  SceneDataCreateDTO,
} from "./sceneCreate.dto";

export interface SceneDTO extends SceneCreateDTO {
  id: string;
  sceneData: SceneDataCreateDTO;
  isPartial?: boolean;
  createdById: string;
  iTwinId: string;
  creationTime: string;
  lastModified: string;
}

export function isSceneDTO(v: unknown): v is SceneDTO {
  return (
    isObject(v) &&
    typeof v.id === "string" &&
    isSceneDataCreateDTO(v.sceneData) &&
    (v.isPartial === undefined || typeof v.isPartial === "boolean") &&
    typeof v.createdById === "string" &&
    typeof v.iTwinId === "string" &&
    typeof v.creationTime === "string" &&
    typeof v.lastModified === "string"
  );
}
