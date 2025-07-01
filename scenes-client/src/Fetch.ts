/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

export interface RequestArgs<T> {
  endpoint: string;
  getAccessToken: () => Promise<string>;
  postProcess: (response: Response) => Promise<T>;
  additionalHeaders?: Record<string, string>;
  urlPrefix: "" | "dev-" | "qa-";
  fetchOptions?: Omit<RequestInit, "headers">;
}

export type UrlPrefix = RequestArgs<any>["urlPrefix"];

export async function callApi<T>({
  baseUrl,
  getAccessToken,
  additionalHeaders,
  endpoint,
  urlPrefix,
  postProcess,
  fetchOptions,
}: RequestArgs<T> & { baseUrl: string }): Promise<T> {
  const url = getUrl(baseUrl, urlPrefix);
  const headers = {
    Authorization: await getAccessToken(),
    Accept: "application/json",
    ...additionalHeaders,
  };
  const response = await fetch(`${url}${endpoint}`, { ...fetchOptions, headers });
  return postProcess(response);
}

function getUrl(baseUrl: string, urlPrefix: "" | "dev-" | "qa-") {
  if (urlPrefix === "") {
    return baseUrl;
  }
  return baseUrl.replace("https://", `https://${urlPrefix}`);
}