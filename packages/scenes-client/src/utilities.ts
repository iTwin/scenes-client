// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
import { PagingLinks } from "./models/index";

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

export function* batched<T>(items: T[], batchSize: number) {
  for (let i = 0; i < items.length; i += batchSize) {
    yield items.slice(i, i + batchSize);
  }
}

// type guards for runtime type checking
export function isObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object";
}
