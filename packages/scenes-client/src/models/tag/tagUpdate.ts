/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

/** Payload for updating a tag */
export interface TagUpdate {
  /** User defined display name for the tag. Must be unique within the iTwin. */
  displayName: string;
}
