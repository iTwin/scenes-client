/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { PagingLinks } from "./models/index.js";

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
 * Omit that works correctly with union types.
 * This applies the omit operation to each union member individually, preserving type-specific properties.
 * See https://github.com/microsoft/TypeScript/issues/54525.
 *
 * @example
 * ```typescript
 * type UnionType = { a: string; b: number } | { a: string; c: boolean };
 * type Result = UnionOmit<UnionType, 'a'>;
 * // Result: { b: number } | { c: boolean }
 * ```
 */
export type UnionOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;
