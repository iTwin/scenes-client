/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { SchemaKind } from "./sceneObjectSchemas.js";

/** Schemas that define resource-specific styling options */
export type ResourceStylingSchemas =
  | "ExpressionStyling"
  | "ScheduleSimulation"
  | "iModelVisibility"
  | "RealityDataStyling";

/** Standard schemas without additional metadata requirements */
export type StandardSchemas = Exclude<SchemaKind, ResourceStylingSchemas>;
