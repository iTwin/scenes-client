// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

export interface RequestArgs<T> {
  endpoint: string;
  postProcess: (response: Response) => Promise<T>;
  additionalHeaders?: Record<string, string>;
  fetchOptions?: Omit<RequestInit, "headers">;
}

export interface AuthArgs {
  getAccessToken: () => Promise<string>;
  baseUrl: string;
};

export async function callApi<T>({
  baseUrl,
  getAccessToken,
  additionalHeaders,
  endpoint,
  postProcess,
  fetchOptions,
}: RequestArgs<T> & AuthArgs): Promise<T> {
  const headers = {
    Authorization: await getAccessToken(),
    Accept: "application/json",
    ...additionalHeaders,
  };
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...fetchOptions,
    headers,
  });
  return postProcess(response);
}
