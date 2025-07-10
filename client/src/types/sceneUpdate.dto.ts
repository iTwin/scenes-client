// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

export type SceneUpdateDTO = {
  /** User defined display name of the scene */
  displayName?: string;
  /** Optional parent Id for the scene (UUID) */
  parentId?: string;
};
