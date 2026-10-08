/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { SchemaKind } from "./sceneObjectSchemas.js";

/** Scene object kinds that support image attachments. */
export const IMAGE_ENABLED_OBJECT_KINDS = ["View3d"] as const satisfies readonly SchemaKind[];

/** Type representing all object kinds that support image attachments. */
export type ImageEnabledObjectKind = (typeof IMAGE_ENABLED_OBJECT_KINDS)[number];

/**
 * Checks if the given object kind supports image attachments.
 * @param kind The object kind to check
 * @returns True if the object kind supports image attachments, false otherwise.
 */
export function isImageEnabledObjectKind(kind: unknown): kind is ImageEnabledObjectKind {
  return IMAGE_ENABLED_OBJECT_KINDS.includes(kind as ImageEnabledObjectKind);
}
