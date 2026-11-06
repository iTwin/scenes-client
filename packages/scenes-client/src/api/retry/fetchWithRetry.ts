/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { sleep } from "../../utilities.js";
import { RetryPolicy } from "./retryPolicy.js";

/**
 * Determines whether an HTTP method is safe to retry without risking a duplicate side effect.
 * @param method - The HTTP method of the request.
 */
function isIdempotentMethod(method: string): boolean {
  return ["GET", "PUT", "DELETE"].includes(method.toUpperCase());
}

/**
 * Determines whether a response with the given status and method is safe to retry.
 * @param status - The HTTP status code of the response.
 * @param isIdempotent - Whether the HTTP method of the request is idempotent.
 * @returns True if the request is safe to retry, false otherwise.
 */
function isRetryable(status: number, isIdempotent: boolean): boolean {
  if (status === 429) {
    return true; // Rate-limited requests weren't processed, so any method is safe to retry
  }
  // 408: the server timed out waiting for the request; 5xx: transient server-side failures
  return isIdempotent && [408, 500, 502, 503, 504].includes(status);
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
 * Computes a retry delay using capped exponential backoff with "equal jitter":
 * a random delay between half and all of `min(maxDelayMs, baseDelayMs * 2^attempt)`.
 * Always waits at least half the backoff, while spreading out requests that failed at the same time.
 * @param attempt - The zero-based retry attempt number.
 * @param retryPolicy - The resolved retry policy to compute the delay from.
 * @returns The computed backoff delay in milliseconds.
 */
function computeDelayMs(attempt: number, retryPolicy: RetryPolicy): number {
  const { baseDelayMs, maxDelayMs } = retryPolicy;
  const delayMs = Math.min(maxDelayMs, baseDelayMs * 2 ** attempt);
  return delayMs / 2 + Math.random() * (delayMs / 2);
}

/**
 * Fetches a URL with retries on transient errors:
 *   - 429: retried for all methods, since the request wasn't processed.
 *   - 408, 5xx and network errors: retried for idempotent methods only.
 * A `Retry-After` header on a retryable response is honored if it's at most `maxRetryAfterMs`; if it's longer, the response is returned immediately without retrying.
 * Otherwise the delay comes from exponential backoff.
 * @param url - The URL to fetch.
 * @param fetchOptions - Fetch options (method, body, headers, etc.)
 * @param retryPolicy - The resolved retry policy to apply (max retries, backoff delays, max retry-after)
 */
export async function fetchWithRetry(
  url: string,
  fetchOptions: RequestInit,
  retryPolicy: RetryPolicy,
): Promise<Response> {
  const isIdempotent = isIdempotentMethod(fetchOptions.method ?? "GET"); // fetch defaults to GET

  for (let attempt = 0; attempt < retryPolicy.maxRetries; attempt++) {
    let response: Response;
    try {
      response = await fetch(url, fetchOptions);
    } catch (networkError) {
      if (!isIdempotent) {
        throw networkError;
      }
      await sleep(computeDelayMs(attempt, retryPolicy));
      continue;
    }

    if (response.ok || !isRetryable(response.status, isIdempotent)) {
      return response;
    }

    const retryAfterMs = parseRetryAfterMs(response);
    // The server asked for a longer wait than we're willing to make: surface the response instead.
    if (retryAfterMs !== undefined && retryAfterMs > retryPolicy.maxRetryAfterMs) {
      return response;
    }

    // Discard the body before retrying so the underlying socket can be reused/released.
    response.body?.cancel().catch(() => {});
    await sleep(retryAfterMs ?? computeDelayMs(attempt, retryPolicy));
  }

  // Final attempt: result or error goes straight to the caller
  return fetch(url, fetchOptions);
}
