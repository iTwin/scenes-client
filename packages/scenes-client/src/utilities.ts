import { PagingLinks } from "./models/index";


export async function* iteratePagedEndpoint<T extends { _links?: PagingLinks; }>(
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
