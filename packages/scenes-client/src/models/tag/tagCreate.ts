/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

/** Payload for creating a new tag */
export interface TagCreate {
  /** Optional identifier for the tag (UUID) */
  id?: string;
  /** User defined display name for the tag. Must be unique within the iTwin. */
  displayName: string;
}
