/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

/**
 * Options for configuring how SceneClient retries failed requests.
 * Applies to 429s (rate limit), 408/5xx responses, and network errors.
 * Supplied values are validated when the client is constructed; invalid values throw.
 */
export interface RetryOptions {
  /**
   * Maximum number of retry attempts after the initial request (default 3).
   * Must be an integer from 0 to 10; `0` disables retries.
   */
  maxRetries?: number;
  /**
   * Base delay in milliseconds for exponential backoff (default 500).
   * The backoff doubles on each retry, and the actual wait is a random value between half and all of it.
   * Must be a non-negative finite number.
   */
  baseDelayMs?: number;
  /**
   * Upper bound in milliseconds on the exponential backoff (default 5000).
   * Doesn't apply to a server-requested `Retry-After`; see `maxRetryAfterMs`.
   * Must be a non-negative finite number.
   */
  maxDelayMs?: number;
  /**
   * Longest server-requested `Retry-After` delay, in milliseconds, the client will wait for (default 10000).
   * If a response asks for a longer wait, it isn't retried and its error is thrown immediately instead.
   * Must be a non-negative finite number.
   */
  maxRetryAfterMs?: number;
}
