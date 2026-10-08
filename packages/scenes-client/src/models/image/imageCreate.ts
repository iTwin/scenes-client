/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

/**
 * Image content types supported.
 */
export type ImageContentType = "image/png" | "image/jpeg";

/** Payload for creating a new image */
export interface ImageCreate {
  /** The raw image bytes (must be PNG or JPEG) */
  image: Uint8Array | ArrayBuffer | Blob;
  /** The content type of the image ("image/png" | "image/jpeg") */
  contentType: ImageContentType;
}
