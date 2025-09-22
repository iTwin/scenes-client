/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

/**
 * Arguments for configuring an API request.
 * @template T - The expected response type after post-processing.
 * @property endpoint - Optional endpoint path to append to the base URL.
 * @property postProcess - Function to process the raw HTTP response and return the desired result.
 * @property additionalHeaders - Optional additional HTTP headers to include in the request.
 * @property fetchOptions - Optional fetch options (method, body, etc.), excluding headers.
 */
export interface RequestArgs<T> {
  endpoint?: string;
  postProcess: (response: Response) => Promise<T>;
  additionalHeaders?: Record<string, string>;
  fetchOptions?: Omit<RequestInit, "headers">;
}

/**
 * Authentication and base URL arguments for API requests.
 * @property getAccessToken - Async function to retrieve the access token for authentication.
 * @property baseUrl - The base URL for the API.
 */
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
