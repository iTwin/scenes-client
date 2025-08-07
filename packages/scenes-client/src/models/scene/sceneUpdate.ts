// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

export interface SceneUpdate {
  /** User defined display name of the scene */
  displayName?: string;
  /** Optional parent Id for the scene (UUID) */
  parentId?: string;
}
