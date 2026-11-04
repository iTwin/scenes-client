/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

/**
 * Options for configuring how {@link SceneClient} retries failed requests.
 * Applies to 429s (rate limit), 5xx responses, and network errors.
 */
export interface RetryOptions {
  /** Maximum number of retry attempts after the initial request (default 3, max 10) */
  maxRetries?: number;
  /** Base delay in milliseconds used for exponential backoff between retries (default 500) */
  baseDelayMs?: number;
  /**
   * Maximum delay in milliseconds to wait before a retry (default 10000).
   * Also caps a server-provided `Retry-After`: if honoring it would mean waiting longer than this, the retry is abandoned and the error is surfaced immediately instead.
   */
  maxDelayMs?: number;
}

/** Default retry policy used when no user-supplied options are provided. */
export const RETRY_DEFAULTS: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelayMs: 500,
  maxDelayMs: 10000,
};
