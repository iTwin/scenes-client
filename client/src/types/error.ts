// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

//@naron: is there a way to maintain one source of truth for exception? theres also one existing in scenes service?
//@naron: 1. shared npm package published privately and have both service and client dependent on it?
//@naron: 2. OpenApi/Swagger codegen? define api schema in OPenAPi then generate both server DTOs and client side TS interfaces from that spec
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
