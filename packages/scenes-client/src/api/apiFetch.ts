// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

export interface RequestArgs<T> {
  endpoint?: string;
  postProcess: (response: Response) => Promise<T>;
  additionalHeaders?: Record<string, string>;
  fetchOptions?: Omit<RequestInit, "headers">;
}

export interface AuthArgs {
  getAccessToken: () => Promise<string>;
  baseUrl: string;
}

/**
 * Generic function to call an API endpoint.
 * @param param.baseUrl - The base URL for the API.
 * @param param.getAccessToken - Function to get the access token.
 * @param param.additionalHeaders - Additional headers to include in the request.
 * @param param.endpoint - The endpoint to call, combined with the base URL.
 * @param param.postProcess - Function to post-process the response.
 * @param param.fetchOptions - Additional options for the fetch request.
 * @return determined by the postProcess function.
 */
export async function callApi<T>({
  baseUrl,
  getAccessToken,
  additionalHeaders,
  endpoint = "",
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
