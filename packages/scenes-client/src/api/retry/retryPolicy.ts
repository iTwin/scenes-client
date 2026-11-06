/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { RetryOptions } from "../../models/retryOptions.js";

/** Hard upper bound on `maxRetries`; larger values are rejected. */
const MAX_RETRIES_CEILING = 10;

/** Fully resolved retry policy */
export type RetryPolicy = Required<RetryOptions>;

/** Default retry policy used when no user-supplied options are provided. */
export const RETRY_DEFAULTS: RetryPolicy = {
  maxRetries: 3,
  baseDelayMs: 500,
  maxDelayMs: 5_000,
  maxRetryAfterMs: 10_000,
};

/**
 * Resolves user-supplied retry options against {@link RETRY_DEFAULTS}.
 * @param options User-supplied retry options.
 * @throws {RangeError} If `maxRetries` is not an integer from 0 to {@link MAX_RETRIES_CEILING}
 *   (`NaN` would retry forever), or a delay is negative or not finite.
 */
export function resolveRetryPolicy(options: RetryOptions): RetryPolicy {
  const policy: RetryPolicy = {
    maxRetries: options.maxRetries ?? RETRY_DEFAULTS.maxRetries,
    baseDelayMs: options.baseDelayMs ?? RETRY_DEFAULTS.baseDelayMs,
    maxDelayMs: options.maxDelayMs ?? RETRY_DEFAULTS.maxDelayMs,
    maxRetryAfterMs: options.maxRetryAfterMs ?? RETRY_DEFAULTS.maxRetryAfterMs,
  };
  const { maxRetries } = policy;
  if (!(Number.isInteger(maxRetries) && maxRetries >= 0 && maxRetries <= MAX_RETRIES_CEILING)) {
    throw new RangeError(
      `retry.maxRetries must be an integer from 0 to ${MAX_RETRIES_CEILING}, received ${maxRetries}`,
    );
  }
  for (const name of ["baseDelayMs", "maxDelayMs", "maxRetryAfterMs"] as const) {
    const value = policy[name];
    if (!(Number.isFinite(value) && value >= 0)) {
      throw new RangeError(`retry.${name} must be a non-negative finite number, received ${value}`);
    }
  }
  return policy;
}
