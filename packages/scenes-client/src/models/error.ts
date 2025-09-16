/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { isObject } from "../utilities.js";

/**
 * Details for a specific error returned by the Scenes API.
 */
export interface ScenesErrorDetail {
  /** Error code for the detail. */
  code: string;
  /** Human-readable error message for the detail. */
  message: string;
}

/**
 * Error response structure returned by the Scenes API.
 */
export interface ScenesErrorResponse {
  /** Error code for the response. */
  code: string;
  /** Human-readable error message for the response. */
  message: string;
  /** Optional target field indicating the source of the error. */
  target?: string;
  /** Optional array of detailed error information. */
  details?: ScenesErrorDetail[];
}

/**
 * Error thrown by Scenes API client methods.
 * Contains code, message, HTTP status, and optional details.
 */
export class ScenesApiError extends Error {
  /** Error code for the response. */
  code: string;
  /** Optional target field indicating the source of the error. */
  target?: string;
  /** Optional array of detailed error information. */
  details?: ScenesErrorDetail[];
  /** HTTP status code of the response. */
  status: number;

  /**
   * Constructs a new ScenesApiError.
   * @param resp – The error response from the API.
   * @param status – The HTTP status code.
   */
  constructor(resp: ScenesErrorResponse, status: number) {
    super(resp.message);
    this.name = "ScenesApiError";
    this.code = resp.code;
    this.target = resp.target;
    this.details = resp.details;
    this.status = status;
  }
}

/**
 * Type guard to check if an unknown value is ScenesErrorResponse
 * @param v - The value to check
 */
export function isScenesErrorResponse(v: unknown): v is ScenesErrorResponse {
  return (
    isObject(v) &&
    typeof v.code === "string" &&
    typeof v.message === "string" &&
    (v.target === undefined || typeof v.target === "string") &&
    (v.details === undefined || Array.isArray(v.details))
  );
}

/**
 * Extracts error from parsed JSON response
 * @param responseJson - Parsed JSON response from API call
 * @returns {ScenesErrorResponse}
 */
function extractErrorFromResponse(responseJson: unknown): ScenesErrorResponse {
  // Check if response has an error field (expected pattern)
  if (
    isObject(responseJson) &&
    "error" in responseJson &&
    isScenesErrorResponse(responseJson.error)
  ) {
    return responseJson.error;
  }
  // Check for direct error response
  if (isScenesErrorResponse(responseJson)) {
    return responseJson;
  }
  return {
    code: "UnexpectedResponse",
    message: `Unexpected response: ${JSON.stringify(responseJson)}`,
  };
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
    err = extractErrorFromResponse(responseJson);
  } catch (parseError) {
    err = {
      code: "ParseError",
      message: `Failed to parse error response (${response.headers.get("content-type") ?? "unknown content-type"})`,
    };
  }

  throw new ScenesApiError(err, response.status);
}
