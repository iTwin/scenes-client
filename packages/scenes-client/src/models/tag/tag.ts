/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { isObject } from "../../utilities.js";
import { isTagMinimal, TagMinimal } from "./tagMinimal.js";

/** Tag response model */
export interface Tag extends TagMinimal {
  /** iTwin Id associated with the tag (UUID). */
  iTwinId: string;
  /** Id of the user who created the tag (UUID). */
  createdById: string;
  /** Time the tag was created as an ISO8601 string, 'YYYY-MM-DDTHH:mm:ss.sssZ'. */
  creationTime: string;
  /** Time the tag was last modified as an ISO8601 string, 'YYYY-MM-DDTHH:mm:ss.sssZ'. */
  lastModified: string;
}

export function isTag(v: unknown): v is Tag {
  return (
    isObject(v) &&
    isTagMinimal(v) &&
    typeof v.iTwinId === "string" &&
    typeof v.createdById === "string" &&
    typeof v.creationTime === "string" &&
    typeof v.lastModified === "string"
  );
}
