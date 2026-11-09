/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { isObject } from "../../utilities.js";

/**
 * Reference to the source that a scene was copied or duplicated from.
 *
 * Purely informational: the service validates the reference only when it is written at creation.
 * It cannot be changed or removed afterwards, creates no ongoing relationship or synchronization between the scenes,
 * and may become a stale reference if the source scene is later deleted.
 */
export interface SceneSource {
  /**
   * Id of the scene this source references.
   * The reference is validated at the time of creation, but does not change if the source scene is later deleted.
   * Clients should verify the source's existence if their workflow requires it.
   */
  id: string;
  /**
   * The source scene's last modified date at the time it was copied, as an ISO8601 string.
   * When setting a scene source, supply this value exactly as returned by the API (`response.scene.lastModified`).
   */
  lastModified: string;
}

/** Type guard that checks whether a value is a {@link SceneSource}. */
export function isSceneSource(v: unknown): v is SceneSource {
  return isObject(v) && typeof v.id === "string" && typeof v.lastModified === "string";
}
