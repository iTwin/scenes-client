/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { handleErrorResponse, ScenesApiError } from "../models/index.js";

/**
 * Arguments for configuring an API request.
 * @template T - The expected response type. Provide a type guard to receive a typed result; omit to receive the raw parsed JSON body.
 * @property endpoint - Optional endpoint path to append to the base URL.
 * @property typeGuard - Optional type guard to validate and narrow the JSON response body.
 * @property additionalHeaders - Optional additional HTTP headers to include in the request.
 * @property fetchOptions - Optional fetch options (method, body, etc.), excluding headers.
 */
export interface RequestArgs<T = unknown> {
  endpoint?: string;
  typeGuard?: (data: unknown) => data is T;
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
 * Throws {@link ScenesApiError} if the response is an error, or if a `typeGuard` is provided and the
 * response body does not match the expected shape.
 *
 * @param param.baseUrl - The base URL for the API.
 * @param param.getAccessToken - Function to get the access token.
 * @param param.additionalHeaders - Additional headers to include in the request.
 * @param param.endpoint - The endpoint to call, combined with the base URL.
 * @param param.typeGuard - Type guard to validate the response body.
 * @param param.fetchOptions - Additional options for the fetch request.
 * @returns The validated response body (`T`) when a `typeGuard` is supplied; the raw parsed JSON
 *   (`unknown`) when no `typeGuard` is given; or `undefined` for 204 No Content responses.
 */
export async function callApi<T>(
  args: RequestArgs<T> & AuthArgs & { typeGuard: (data: unknown) => data is T },
): Promise<T>;
export async function callApi(args: Omit<RequestArgs, "typeGuard"> & AuthArgs): Promise<unknown>;
export async function callApi<T>(args: RequestArgs<T> & AuthArgs): Promise<T | unknown> {
  const {
    baseUrl,
    getAccessToken,
    additionalHeaders,
    endpoint = "",
    typeGuard,
    fetchOptions,
  } = args;
  const headers = {
    Authorization: await getAccessToken(),
    Accept: "application/json",
    ...additionalHeaders,
  };
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    await handleErrorResponse(response);
  }
  if (response.status === 204) {
    return undefined;
  }

  const responseJson = await response.json();
  if (typeGuard && !typeGuard(responseJson)) {
    throw new ScenesApiError(
      { code: "InvalidResponse", message: "Unexpected response format" },
      response.status,
    );
  }
  return responseJson;
}
