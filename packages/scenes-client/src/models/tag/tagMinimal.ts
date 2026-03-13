/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { isObject } from "../../utilities.js";

/** Minimal tag info embedded in scene responses */
export interface TagMinimal {
  /** Globally unique identifier for the tag (UUID). */
  id: string;
  /** User defined display name for the tag. */
  displayName: string;
}

export function isTagMinimal(v: unknown): v is TagMinimal {
  return isObject(v) && typeof v.id === "string" && typeof v.displayName === "string";
}
