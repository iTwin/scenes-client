// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

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
