/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { isObject } from "../../utilities.js";

/**
 * A public share of a scene. Grants unauthenticated, read-only access to the scene and the
 * resources it references (iModels, reality data, GIS layers, etc.) via a single `shareKey`.
 *
 * Shares are dynamic and always reflect the current state of the scene:
 *   - if a new resource is added, the share will automatically grant access to it.
 *   - if a resource is removed, the share will no longer grant access.
 *
 * Deleting the scene automatically revokes all of its shares.
 */
export interface SceneShare {
  /** Unique identifier for the share (UUID). */
  id: string;
  /** Id of the scene being shared (UUID). */
  sceneId: string;
  /** iTwin Id associated with the shared scene (UUID). */
  iTwinId: string;
  /** Share contract name. `SceneDefault` gives read-only access to repository resource in the scene. */
  contractName: string;
  /**
   * ShareKey to access the scene.
   * Use `Authorization: Basic <shareKey>` for unauthenticated read access
   */
  shareKey: string;
  /** Share expiration as an ISO8601 string, 'YYYY-MM-DDTHH:mm:ss.sssZ'. */
  expiration: string;
  /** Id of the user who created the share (UUID). */
  createdById: string;
  /** Id of the user who last modified the share (UUID). */
  lastModifiedById: string;
  /** Time the share was created as an ISO8601 string, 'YYYY-MM-DDTHH:mm:ss.sssZ'. */
  creationTime: string;
  /** Time the share was last modified as an ISO8601 string, 'YYYY-MM-DDTHH:mm:ss.sssZ'. */
  lastModified: string;
}

export function isSceneShare(v: unknown): v is SceneShare {
  return (
    isObject(v) &&
    typeof v.id === "string" &&
    typeof v.sceneId === "string" &&
    typeof v.iTwinId === "string" &&
    typeof v.contractName === "string" &&
    typeof v.shareKey === "string" &&
    typeof v.expiration === "string" &&
    typeof v.createdById === "string" &&
    typeof v.lastModifiedById === "string" &&
    typeof v.creationTime === "string" &&
    typeof v.lastModified === "string"
  );
}
