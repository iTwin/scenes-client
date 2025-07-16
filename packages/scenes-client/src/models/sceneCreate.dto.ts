// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

import { SceneDataCreateDto } from "./sceneObjectCreate.dto";

export interface SceneCreateDto {
  /** Optional identifier for the scene object (UUID) */
  id?: string;

  /** User defined display name of the scene */
  displayName: string;

  /** Optional parent Id for the scene (UUID) */
  parentId?: string;

  /** Scene informational objects */
  sceneData?: SceneDataCreateDto;
};
