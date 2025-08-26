// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
import type { SchemaKind } from "./sceneObjectSchemas.js";

/** Schemas that define resource-specific styling options */
export type ResourceStylingSchemas =
  | "ExpressionStyling"
  | "ScheduleSimulation"
  | "iModelVisibility"
  | "RealityDataStyling";

/** Schemas that define iTwin-scoped resources */
export type ITwinScopedSchemas = "RepositoryResource";

/** Standard schemas without additional metadata requirements */
export type StandardSchemas = Exclude<
  SchemaKind,
  ResourceStylingSchemas | ITwinScopedSchemas
>;
