// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

export interface ScenesErrorDetail {
  code: string;
  message: string;
}

export interface ScenesErrorResponse {
  code: string;
  message: string;
  target?: string;
  details?: ScenesErrorDetail[];
}

export class ScenesApiError extends Error {
  code: string;
  target?: string;
  details?: ScenesErrorDetail[];
  status: number;
  constructor(resp: ScenesErrorResponse, status: number) {
    super(resp.message);
    this.name = "ScenesApiError";
    this.code = resp.code;
    this.target = resp.target;
    this.details = resp.details;
    this.status = status;
  }
}
