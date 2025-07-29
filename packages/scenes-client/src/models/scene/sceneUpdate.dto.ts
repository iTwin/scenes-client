// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

export interface SceneUpdateDTO {
  /** User defined display name of the scene */
  displayName?: string;
  /** Optional parent Id for the scene (UUID) */
  parentId?: string;
}
