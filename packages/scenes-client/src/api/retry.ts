/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { RETRY_DEFAULTS, RetryOptions } from "../models/index.js";
import { isNonNegativeFiniteNumber, isNonNegativeInteger, sleep } from "../utilities.js";

/** HTTP methods that are safe to retry on a 5xx response or network error. */
const IDEMPOTENT_METHODS = new Set(["GET", "HEAD", "PUT", "DELETE"]);

/** Extra random delay added on top of an honored `Retry-After` value, to avoid thundering-herd retries. */
const RETRY_AFTER_JITTER_MS = 1000;

/** Hard upper bound on `maxRetries`, regardless of user input */
const MAX_RETRIES_CEILING = 10;

/**
 * Resolves user-supplied retry options against the default retry policy.
 * `maxRetries` is capped at {@link MAX_RETRIES_CEILING} even if a larger value is supplied.
 * @param retryOptions User-supplied retry options.
 * @returns Resolved retry policy with all fields set to concrete values.
 */
export function resolveRetryPolicy(retryOptions: RetryOptions): Required<RetryOptions> {
  return {
    maxRetries: isNonNegativeInteger(retryOptions.maxRetries)
      ? Math.min(retryOptions.maxRetries, MAX_RETRIES_CEILING)
      : RETRY_DEFAULTS.maxRetries,

    baseDelayMs: isNonNegativeFiniteNumber(retryOptions.baseDelayMs)
      ? retryOptions.baseDelayMs
      : RETRY_DEFAULTS.baseDelayMs,

    maxDelayMs: isNonNegativeFiniteNumber(retryOptions.maxDelayMs)
      ? retryOptions.maxDelayMs
      : RETRY_DEFAULTS.maxDelayMs,
  };
}

/**
 * Determines whether an HTTP method is safe to retry without risking a duplicate side effect.
 * @param method - The HTTP method of the request.
 */
function isIdempotentMethod(method: string): boolean {
  return IDEMPOTENT_METHODS.has(method.toUpperCase());
}

/**
 * Computes a retry delay using exponential backoff with jitter.
 * @param attempt - The zero-based retry attempt number.
 * @param retryOptions - The resolved retry options to compute the delay from.
 */
function computeBackoffDelayMs(attempt: number, retryOptions: Required<RetryOptions>): number {
  const cappedDelayMs = Math.min(retryOptions.maxDelayMs, retryOptions.baseDelayMs * 2 ** attempt);
  return Math.random() * cappedDelayMs;
}

/**
 * Parses a `Retry-After` response header into a millisecond delay.
 * Supports both the delta-seconds and HTTP-date forms of the header.
 * A past HTTP-date resolves to 0 (retry now) rather than being treated as absent.
 * @param response - The HTTP response to read the header from.
 * @returns The delay in milliseconds, or undefined if the header is absent or invalid.
 */
function parseRetryAfterMs(response: Response): number | undefined {
  const header = response.headers.get("Retry-After");
  if (!header) {
    return undefined;
  }
  const seconds = Number(header);
  if (Number.isFinite(seconds)) {
    return seconds < 0 ? undefined : seconds * 1000;
  }
  const dateMs = Date.parse(header);
  return Number.isNaN(dateMs) ? undefined : Math.max(0, dateMs - Date.now());
}

/**
 * Determines how long to wait before retrying a failed response,
 * or undefined if it shouldn't be retried at all, i.e. if:
 *   - the status isn't retryable
 *   - the method isn't idempotent (for 5xx)
 *   - honoring the response's `Retry-After` would exceed `maxDelayMs`
 */
function resolveRetryDelayMs(
  response: Response,
  attempt: number,
  isIdempotent: boolean,
  retryOptions: Required<RetryOptions>,
): number | undefined {
  if (response.status === 429) {
    const retryAfterMs = parseRetryAfterMs(response);
    if (retryAfterMs === undefined) {
      return computeBackoffDelayMs(attempt, retryOptions);
    }
    return retryAfterMs <= retryOptions.maxDelayMs
      ? retryAfterMs + Math.random() * RETRY_AFTER_JITTER_MS
      : undefined;
  }
  if (response.status >= 500) {
    return isIdempotent ? computeBackoffDelayMs(attempt, retryOptions) : undefined;
  }
  return undefined;
}

/**
 * Fetches a URL with retries on transient errors:
 *   - 429s: retried for all methods, honoring `Retry-After` if it fits within `maxDelayMs`.
 *   - 5xx and network errors: retried for idempotent methods only.
 * @param url - The URL to fetch.
 * @param fetchOptions - Fetch options (method, body, headers, etc.)
 * @param retryOptions - The resolved retry policy to apply (max retries, backoff delay)
 */
export async function fetchWithRetry(
  url: string,
  fetchOptions: RequestInit | undefined,
  retryOptions: Required<RetryOptions>,
): Promise<Response> {
  const isIdempotent = isIdempotentMethod(fetchOptions?.method ?? "GET"); // fetch defaults to GET

  for (let attempt = 0; ; attempt++) {
    const retriesLeft = attempt < retryOptions.maxRetries;
    let response: Response;
    try {
      response = await fetch(url, fetchOptions);
    } catch (networkError) {
      if (!retriesLeft || !isIdempotent) {
        throw networkError;
      }
      await sleep(computeBackoffDelayMs(attempt, retryOptions));
      continue;
    }

    if (response.ok || !retriesLeft) {
      return response;
    }

    const delayMs = resolveRetryDelayMs(response, attempt, isIdempotent, retryOptions);
    if (delayMs === undefined) {
      return response;
    }
    void discardBody(response);
    await sleep(delayMs);
  }
}

/** Cancels an unused response body so the connection can be returned to the pool. Best-effort. */
async function discardBody(response: Response): Promise<void> {
  try {
    await response.body?.cancel();
  } catch {
    // Ignore: best-effort cleanup, not required for a correct retry.
  }
}
