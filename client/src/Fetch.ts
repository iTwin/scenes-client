// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

export interface RequestArgs<T> {
  endpoint: string;
  postProcess: (response: Response) => Promise<T>;
  additionalHeaders?: Record<string, string>;
  fetchOptions?: Omit<RequestInit, "headers">;
}

export type UrlPrefix = "" | "dev-" | "qa-";

export type AuthArgs = {
  getAccessToken: () => Promise<string>;
  urlPrefix: UrlPrefix;
  baseUrl: string;
};

export async function callApi<T>({
  baseUrl,
  getAccessToken,
  additionalHeaders,
  endpoint,
  urlPrefix,
  postProcess,
  fetchOptions,
}: RequestArgs<T> & AuthArgs): Promise<T> {
  const url = getUrl(baseUrl, urlPrefix);
  const headers = {
    Authorization: await getAccessToken(),
    Accept: "application/json",
    ...additionalHeaders,
  };
  const response = await fetch(`${url}${endpoint}`, {
    ...fetchOptions,
    headers,
  });
  return postProcess(response);
}

function getUrl(baseUrl: string, urlPrefix: "" | "dev-" | "qa-") {
  if (urlPrefix === "") {
    return baseUrl;
  }
  return baseUrl.replace("https://", `https://${urlPrefix}`);
}
