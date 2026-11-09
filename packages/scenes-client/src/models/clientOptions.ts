/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { RetryOptions } from "./retryOptions.js";

/** Options for configuring a {@link SceneClient}. */
export interface SceneClientOptions {
  /** Base URL for the API. Defaults to production. */
  baseUrl?: string;
  /** Overrides for the retry policy on transient errors. */
  retry?: RetryOptions;
}
