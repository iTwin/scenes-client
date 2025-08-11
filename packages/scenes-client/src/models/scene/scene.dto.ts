// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

import { isObject } from "../../utilities";
import { SceneCreateDTO } from "./sceneCreate.dto";
import { isSceneDataDTO, SceneDataDTO } from "./sceneData.dto";

export interface SceneDTO extends SceneCreateDTO {
  /** Unique identifier for the scene (UUID). */
  id: string;
  /** Scene informational objects. */
  sceneData: SceneDataDTO;
  /** Indicates sceneData was filtered because the user lacks necessary permissions to view all objects. */
  isPartial?: boolean;
  /** Id of the user who created the scene (UUID). */
  createdById: string;
  /** iTwin Id associated with the scene (UUID). */
  iTwinId: string;
  /** Time the scene was created as an ISO8601 string, 'YYYY-MM-DDTHH:mm:ss.sssZ'. */
  creationTime: string;
  /** Time the scene was last modified as an ISO8601 string, 'YYYY-MM-DDTHH:mm:ss.sssZ'. */
  lastModified: string;
}

export function isSceneDTO(v: unknown): v is SceneDTO {
  return (
    isObject(v) &&
    typeof v.id === "string" &&
    isSceneDataDTO(v.sceneData) &&
    (v.isPartial === undefined || typeof v.isPartial === "boolean") &&
    typeof v.createdById === "string" &&
    typeof v.iTwinId === "string" &&
    typeof v.creationTime === "string" &&
    typeof v.lastModified === "string"
  );
}
