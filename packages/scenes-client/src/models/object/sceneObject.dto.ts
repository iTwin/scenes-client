// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

import { isObject } from "../../utilities";
import {
  isSceneObjectCreateDTO,
  SceneObjectCreateDTO,
} from "./sceneObjectCreate.dto";

export interface SceneObjectDTO extends SceneObjectCreateDTO {
  /** Unique identifier for the scene object (UUID). */
  id: string;
  /** Id of the scene containing the object (UUID). */
  sceneId: string;
  /** Id of the user who created the scene object (UUID). */
  createdById: string;
  /** Time the scene object was created as an ISO8601 string, 'YYYY-MM-DDTHH:mm:ss.sssZ'. */
  creationTime: string;
  /** Time the scene object was last modified as an ISO8601 string, 'YYYY-MM-DDTHH:mm:ss.sssZ'. */
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
