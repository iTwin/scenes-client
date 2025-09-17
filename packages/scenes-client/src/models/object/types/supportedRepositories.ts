/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

/** Repository classes that can be added to a scene in their entirety as "Repository" objects. */
export const SUPPORTED_REPOSITORIES = ["IndexedMedia", "Forms", "Storage"] as const;

/** Type representing all supported "Repository" object classes. */
export type SupportedRepository = (typeof SUPPORTED_REPOSITORIES)[number];

/**
 * Checks if the value is a supported "Repository" object class.
 * @param repoClass The repository class to check
 * @returns True if the repository class is supported as a "Repository" object, false otherwise.
 */
export function isSupportedRepository(repoClass: unknown): repoClass is SupportedRepository {
  return SUPPORTED_REPOSITORIES.includes(repoClass as SupportedRepository);
}
