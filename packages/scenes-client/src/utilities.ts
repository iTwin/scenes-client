// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
import {
  PagingLinks,
  ScenesApiError,
  ScenesErrorResponse,
} from "./models/index.js";

/**
 * Async generator for iterating through paged API endpoints
 * Follows the 'next' link in the response's _links property until no more pages are available.
 *
 * @template T - The response type, which must include an optional _links property.
 * @param initialUrl - The initial URL to start paging from.
 * @param delayMs - Milliseconds to wait between requests (for rate limiting).
 * @param fetch - Function to fetch and return a page of results from a URL.
 * @returns An async iterator yielding each page of results.
 */
export async function* iteratePagedEndpoint<T extends { _links?: PagingLinks }>(
  initialUrl: string,
  delayMs: number,
  fetch: (url: string) => Promise<T>,
): AsyncIterableIterator<T> {
  let url: string | undefined = initialUrl;
  while (url) {
    const response = await fetch(url);
    yield response;
    url = response._links?.next?.href;
    if (url && delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

/**
 * Generator that yields items in batches of the specified size.
 *
 * @template T - The type of items in the array.
 * @param items - The array of items to batch.
 * @param batchSize - The maximum number of items per batch.
 * @returns An iterator yielding arrays of items in batches.
 */
export function* batched<T>(items: T[], batchSize: number) {
  for (let i = 0; i < items.length; i += batchSize) {
    yield items.slice(i, i + batchSize);
  }
}

/**
 * Type guard for runtime type checking of plain objects.
 *
 * @param v - The value to check.
 * @returns True if v is a non-null object, false otherwise.
 */
export function isObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

/**
 * Handles API error responses
 * @param response HTTP response object from failed API call
 * @throws {ScenesApiError}
 */
export async function handleErrorResponse(response: Response): Promise<never> {
  let err: ScenesErrorResponse;
  try {
    const responseJson = await response.json();

    err =
      isObject(responseJson) && responseJson.error
        ? (responseJson.error as ScenesErrorResponse)
        : {
            code: "UnexpectedFormat",
            message: `Unexpected response format: ${JSON.stringify(responseJson)}`,
          };
  } catch (parseError) {
    err = {
      code: "ParseError",
      message: `Failed to parse error response (${response.headers.get("content-type") ?? "unknown content-type"})`,
    };
  }

  throw new ScenesApiError(err, response.status);
}
