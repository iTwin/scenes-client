/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { ImageSize } from "./imageSize.js";

/**
 * Options for retrieving scene object images.
 */
export interface GetImageOptions {
  /** Size of the image to retrieve. Defaults to small (thumbnail). */
  size?: ImageSize;
}
