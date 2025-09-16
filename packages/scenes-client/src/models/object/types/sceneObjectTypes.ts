// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
import type { ResourceStylingObject, StandardObject } from "../sceneObject.js";
import type { ResourceStylingObjectCreate, StandardObjectCreate } from "../sceneObjectCreate.js";

// Version-specific create type aliases
/** CameraAnimation (v1.0.0) Scene Object Creation Type */
export type CameraAnimationCreateV1 = StandardObjectCreate<"CameraAnimation", "1.0.0">;
/** Latest CameraAnimation creation type. Currently points to 1.0.0. */
export type CameraAnimationCreate = CameraAnimationCreateV1;

/** Cutout (v1.0.0) Scene Object Creation Type */
export type CutoutCreateV1 = StandardObjectCreate<"Cutout", "1.0.0">;
/** Latest Cutout creation type. Currently points to 1.0.0. */
export type CutoutCreate = CutoutCreateV1;

/** Layer (v1.0.0) Scene Object Creation Type */
export type LayerCreateV1 = StandardObjectCreate<"Layer", "1.0.0">;
/** Latest Layer creation type. Currently points to 1.0.0. */
export type LayerCreate = LayerCreateV1;

/** MaterialDecoration (v1.0.0) Scene Object Creation Type */
export type MaterialDecorationCreateV1 = StandardObjectCreate<"MaterialDecoration", "1.0.0">;
/** Latest MaterialDecoration creation type. Currently points to 1.0.0. */
export type MaterialDecorationCreate = MaterialDecorationCreateV1;

/** Movie (v1.0.0) Scene Object Creation Type */
export type MovieCreateV1 = StandardObjectCreate<"Movie", "1.0.0">;
/** Latest Movie creation type. Currently points to 1.0.0. */
export type MovieCreate = MovieCreateV1;

/** RepositoryResource (v1.0.0) Scene Object Creation Type */
export type RepositoryResourceCreateV1 = StandardObjectCreate<"RepositoryResource", "1.0.0">;
/** Latest RepositoryResource creation type. Currently points to 1.0.0. */
export type RepositoryResourceCreate = RepositoryResourceCreateV1;

/** View3d (v1.0.0) Scene Object Creation Type */
export type View3dCreateV1 = StandardObjectCreate<"View3d", "1.0.0">;
/** Latest View3d creation type. Currently points to 1.0.0. */
export type View3dCreate = View3dCreateV1;

/** GoogleTilesStyling (v1.0.0) Scene Object Creation Type */
export type GoogleTilesStylingCreateV1 = StandardObjectCreate<"GoogleTilesStyling", "1.0.0">;
/** Latest GoogleTilesStyling creation type. Currently points to 1.0.0. */
export type GoogleTilesStylingCreate = GoogleTilesStylingCreateV1;

/** ITwinDisplayStyleOptions (v1.0.0) Scene Object Creation Type */
export type ITwinDisplayStyleOptionsCreateV1 = StandardObjectCreate<
  "ITwinDisplayStyleOptions",
  "1.0.0"
>;
/** Latest ITwinDisplayStyleOptions creation type. Currently points to 1.0.0. */
export type ITwinDisplayStyleOptionsCreate = ITwinDisplayStyleOptionsCreateV1;

/** UnrealAtmosphericStyling (v1.0.0) Scene Object Creation Type */
export type UnrealAtmosphericStylingCreateV1 = StandardObjectCreate<
  "UnrealAtmosphericStyling",
  "1.0.0"
>;
/** Latest UnrealAtmosphericStyling creation type. Currently points to 1.0.0. */
export type UnrealAtmosphericStylingCreate = UnrealAtmosphericStylingCreateV1;

/** ExpressionStyling (v1.0.0) Scene Object Creation Type */
export type ExpressionStylingCreateV1 = ResourceStylingObjectCreate<"ExpressionStyling", "1.0.0">;
/** Latest ExpressionStyling creation type. Currently points to 1.0.0. */
export type ExpressionStylingCreate = ExpressionStylingCreateV1;

/** ScheduleSimulation (v1.0.0) Scene Object Creation Type */
export type ScheduleSimulationCreateV1 = ResourceStylingObjectCreate<"ScheduleSimulation", "1.0.0">;
/** Latest ScheduleSimulation creation type. Currently points to 1.0.0. */
export type ScheduleSimulationCreate = ScheduleSimulationCreateV1;

/** iModelVisibility (v1.0.0) Scene Object Creation Type */
export type iModelVisibilityCreateV1 = ResourceStylingObjectCreate<"iModelVisibility", "1.0.0">;
/** Latest iModelVisibility creation type. Currently points to 1.0.0. */
export type iModelVisibilityCreate = iModelVisibilityCreateV1;

/** RealityDataStyling (v1.0.0) Scene Object Creation Type */
export type RealityDataStylingCreateV1 = ResourceStylingObjectCreate<"RealityDataStyling", "1.0.0">;
/** Latest RealityDataStyling creation type. Currently points to 1.0.0. */
export type RealityDataStylingCreate = RealityDataStylingCreateV1;

// Version-specific response type aliases
/** CameraAnimation (v1.0.0) Scene Object Response Type. */
export type CameraAnimationV1 = StandardObject<"CameraAnimation", "1.0.0">;
/** Latest CameraAnimation response type. Currently points to 1.0.0. */
export type CameraAnimation = CameraAnimationV1;

/** Cutout (v1.0.0) Scene Object Response Type. */
export type CutoutV1 = StandardObject<"Cutout", "1.0.0">;
/** Latest Cutout response type. Currently points to 1.0.0. */
export type Cutout = CutoutV1;

/** Layer (v1.0.0) Scene Object Response Type. */
export type LayerV1 = StandardObject<"Layer", "1.0.0">;
/** Latest Layer response type. Currently points to 1.0.0. */
export type Layer = LayerV1;

/** MaterialDecoration (v1.0.0) Scene Object Response Type. */
export type MaterialDecorationV1 = StandardObject<"MaterialDecoration", "1.0.0">;
/** Latest MaterialDecoration response type. Currently points to 1.0.0. */
export type MaterialDecoration = MaterialDecorationV1;

/** Movie (v1.0.0) Scene Object Response Type. */
export type MovieV1 = StandardObject<"Movie", "1.0.0">;
/** Latest Movie response type. Currently points to 1.0.0. */
export type Movie = MovieV1;

/** RepositoryResource (v1.0.0) Scene Object Response Type. */
export type RepositoryResourceV1 = StandardObject<"RepositoryResource", "1.0.0">;
/** Latest RepositoryResource response type. Currently points to 1.0.0. */
export type RepositoryResource = RepositoryResourceV1;

/** View3d (v1.0.0) Scene Object Response Type. */
export type View3dV1 = StandardObject<"View3d", "1.0.0">;
/** Latest View3d response type. Currently points to 1.0.0. */
export type View3d = View3dV1;

/** GoogleTilesStyling (v1.0.0) Scene Object Response Type. */
export type GoogleTilesStylingV1 = StandardObject<"GoogleTilesStyling", "1.0.0">;
/** Latest GoogleTilesStyling response type. Currently points to 1.0.0. */
export type GoogleTilesStyling = GoogleTilesStylingV1;

/** ITwinDisplayStyleOptions (v1.0.0) Scene Object Response Type. */
export type ITwinDisplayStyleOptionsV1 = StandardObject<"ITwinDisplayStyleOptions", "1.0.0">;
/** Latest ITwinDisplayStyleOptions response type. Currently points to 1.0.0. */
export type ITwinDisplayStyleOptions = ITwinDisplayStyleOptionsV1;

/** UnrealAtmosphericStyling (v1.0.0) Scene Object Response Type. */
export type UnrealAtmosphericStylingV1 = StandardObject<"UnrealAtmosphericStyling", "1.0.0">;
/** Latest UnrealAtmosphericStyling response type. Currently points to 1.0.0. */
export type UnrealAtmosphericStyling = UnrealAtmosphericStylingV1;

/** ExpressionStyling (v1.0.0) Scene Object Response Type. */
export type ExpressionStylingV1 = ResourceStylingObject<"ExpressionStyling", "1.0.0">;
/** Latest ExpressionStyling response type. Currently points to 1.0.0. */
export type ExpressionStyling = ExpressionStylingV1;

/** ScheduleSimulation (v1.0.0) Scene Object Response Type. */
export type ScheduleSimulationV1 = ResourceStylingObject<"ScheduleSimulation", "1.0.0">;
/** Latest ScheduleSimulation response type. Currently points to 1.0.0. */
export type ScheduleSimulation = ScheduleSimulationV1;

/** iModelVisibility (v1.0.0) Scene Object Response Type. */
export type iModelVisibilityV1 = ResourceStylingObject<"iModelVisibility", "1.0.0">;
/** Latest iModelVisibility response type. Currently points to 1.0.0. */
export type iModelVisibility = iModelVisibilityV1;

/** RealityDataStyling (v1.0.0) Scene Object Response Type. */
export type RealityDataStylingV1 = ResourceStylingObject<"RealityDataStyling", "1.0.0">;
/** Latest RealityDataStyling response type. Currently points to 1.0.0. */
export type RealityDataStyling = RealityDataStylingV1;

/** Union of all scene object creation types. */
export type SceneObjectCreateType =
  | CameraAnimationCreateV1
  | CutoutCreateV1
  | LayerCreateV1
  | MaterialDecorationCreateV1
  | MovieCreateV1
  | RepositoryResourceCreateV1
  | View3dCreateV1
  | GoogleTilesStylingCreateV1
  | ITwinDisplayStyleOptionsCreateV1
  | UnrealAtmosphericStylingCreateV1
  | ExpressionStylingCreateV1
  | ScheduleSimulationCreateV1
  | iModelVisibilityCreateV1
  | RealityDataStylingCreateV1;

/** Union of all scene object types */
export type SceneObjectType =
  | CameraAnimationV1
  | CutoutV1
  | LayerV1
  | MaterialDecorationV1
  | MovieV1
  | RepositoryResourceV1
  | View3dV1
  | GoogleTilesStylingV1
  | ITwinDisplayStyleOptionsV1
  | UnrealAtmosphericStylingV1
  | ExpressionStylingV1
  | ScheduleSimulationV1
  | iModelVisibilityV1
  | RealityDataStylingV1;
