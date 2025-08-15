// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY. PLEASE DO NOT EDIT IT DIRECTLY.

// CommonTypes interfaces
/** GUID string */
export type guid = string;

/** String containing only alphanumeric characters */
export type alphaNumericString = string;

/** String containing only web safe characters */
export type safeString = string;

/** A JavaScript (JSEP) expression for frontend rendering that excludes potentially dangerous constructs. It's up to the frontend to validate and execute this expression safely. */
export type expressionString = string;

/** Expression that determines styling conditions or a single expression. */
export type expressionOrConditions =
  | expressionString
  | { conditions: [expressionString, expressionString][] };

/** Date time in format: YYYY-MM-DDThh:mm:ssZ or YYYY-MM-DDThh:mm:ss.sssZ */
export type dateTime = string;

/** Id64 string. See https://www.itwinjs.org/learning/common/id64/ */
export type id64 = string;

/** Compressed Id64 set. */
export type compressedId64Set = string;

export type vector3d = { x: number; y: number; z: number };

/** Array of 16 numbers representing a 4x4 matrix in row-major order */
export type transform = number[];

/** A single plane represented as an inward unit normal and a signed distance */
export type clipPlane = {
  normal?: vector3d;
  distance?: number;
  invisible?: boolean;
  interior?: boolean;
};

/** Collection of ClipPlanes, often used for bounding regions of space. */
export type clipPlaneSet = { planes: clipPlane[] };

/** An unsigned 32-bit integer in 0xTTBBGGRR format. */
export type colorDef = number;

/** An immutable representation of a color with r, g, and b components each in the integer range [0, 255] */
export type rgbColor = { r: number; g: number; b: number };

/** If defined and not equal to -1 (Invalid), the pixel pattern used to draw the edges. If undefined, edges are drawn using the element's line pattern. The patterns are, in order:
0: Code0 (Solid), 2155905152 (0x80808080): Code1 (1 lit pixel followed by 7 unlit pixels), 4177066232 (0xf8f8f8f8): Code2 (5 lit pixels followed by 3 unlit pixels), 4292935648 (0xffe0ffe0): Code3 (11 lit pixels followed by 5 unlit pixels), 4262526480 (0xfe10fe10): Code4 (7 lit pixels followed by 4 unlit pixels followed by 1 lit pixel followed by 1 lit pixel), 3772834016 (0xe0e0e0e0): Code5 (3 lit pixels followed by 5 unlit pixels), 4169726088 (0xf888f888): Code6 (5 lit pixels followed by 3 unlit followed by 1 lit followed by 3 unlit followed by 1 lit followed by 3 unlit), 4279828248 (0xff18ff18): Code7 (8 lit pixels followed by 3 unlit followed by 2 lit followed by 3 unlit), 3435973836 (0xcccccccc): HiddenLine (2 lit pixels followed by 2 unlit pixels - default style for drawing hidden edges), 1 (0x00000001): Invisible, -1: Invalid */
export type linePixels =
  | 0
  | 2155905152
  | 4177066232
  | 4292935648
  | 4262526480
  | 3772834016
  | 4169726088
  | 4279828248
  | 3435973836
  | 1
  | -1;

/** JSON representation of a hidden line style, which can be used to define how hidden lines are rendered in a view. */
export type hiddenLineStyle = {
  ovrColor?: boolean;
  color?: colorDef;
  pattern?: linePixels;
  width?: number;
};

// Schema Version Registry
export interface SchemaVersionRegistry {
  CameraAnimation: {
    /** Camera animation is defined by a series of 3D views with a timestamp. Interpolation of camera position is done by the application itself. */
    "1.0.0": {
      /** Timestamps sequence in seconds. */
      input: number[];
      /** Series of 3D views (and optional settings/schedules) for the animation. */
      output: {
        camera: SchemaData<"View3d", "1.0.0">;
        settings?: SchemaData<"UnrealAtmosphericStyling", "1.0.0">;
        schedule?: SchemaData<"ScheduleSimulation", "1.0.0">;
      }[];
    };
  };
  Cutout: {
    /** A polygon-defined area projected along the Z-axis on 3D tiles, used to exclude specific regions from rendering. It's primarily used to prevent visual conflicts between overlapping data layers. */
    "1.0.0": {
      /** The points describing the polygon. */
      polygon: vector3d[];
      /** Transform from local to world. */
      transformFromClip?: transform;
      /** Transform from world to local. */
      transformToClip?: transform;
      /** Upper bound on Z. */
      zHigh?: number;
      /** Lower bound on Z. */
      zLow?: number;
      /** True if this shape is invisible. */
      invisible: boolean;
      /** True if this shape is a masking set. */
      mask: boolean;
      /** The union of convex regions. */
      clipPlanes?: { convexSets: clipPlaneSet[] };
    };
  };
  Layer: {
    /** Layers organize scene content and control data visibility. They are not limited to contain specific data types. */
    "1.0.0": {
      /** Whether the layer is turned on or off */
      visible: boolean;
    };
  };
  MaterialDecoration: {
    /** Reference to material mapping stored in the decoration service */
    "1.0.0": {
      /** Id of the material decoration for usage with the Decorations API */
      decorationId?: guid;
    };
  };
  Movie: {
    /** A sequence of camera animations, or clips, which can be played independently or sequentially */
    "1.0.0": {
      /** Series of CameraAnimations in the movie. */
      animations: guid[];
    };
  };
  RepositoryResource: {
    /** Reference to a single repository resource */
    "1.0.0": {
      /** Whether the layer is turned on or off */
      visible: boolean;
      /** Id of the repository. Should be the same as class for internal repos and a GUID for custom repos */
      repositoryId: safeString;
      /** Id of the individual resource */
      id: safeString;
      /** Class of the repository, such as iModels or RealityData */
      class: safeString;
      /** SubClass of the repository if applicable */
      subClass?: safeString;
    };
  };
  View3d: {
    /** Representation of a 3D view */
    "1.0.0": {
      /** Location of the eye of the camera. */
      position: vector3d;
      /** Whether the view is orthographic or perspective */
      isOrthographic: boolean;
      /** Aspect ratio of the view */
      aspectRatio: number;
      /** Direction the camera is pointing towards */
      direction: vector3d;
      /** Defines 'up' direction relative to camera in the view */
      up: vector3d;
      /** Near plane distance */
      near: number;
      /** Far plane distance */
      far: number;
      /** Earth-Centered, Earth-Fixed transform */
      ecefTransform: transform;
    };
  };
  GoogleTilesStyling: {
    /** Global setting to control styling options for Google tiles, such as rendering quality. */
    "1.0.0": {
      /** Quality of Google tiles rendering */
      quality: number;
      /** Matrix or vector used for adjusting the positioning of the tiles */
      adjustment?: number[];
    };
  };
  ITwinDisplayStyleOptions: {
    /** Global setting to control iModel styling when visualizing the scene in iTwin viewer applications. */
    "1.0.0": {
      /** Background color */
      backgroundColor?: colorDef;
      /** Monochrome color */
      monochromeColor?: colorDef;
      /** Monochrome mode. Flat = 0 and Scaled = 1 */
      monochromeMode?: 0 | 1;
      /** JSON representation of the view flags for the iTwin */
      iTwinViewFlags?: {
        noConstruct?: boolean;
        noDim?: boolean;
        noPattern?: boolean;
        noWeight?: boolean;
        noStyle?: boolean;
        noTransp?: boolean;
        noFill?: boolean;
        grid?: boolean;
        acs?: boolean;
        noTexture?: boolean;
        noMaterial?: boolean;
        noCameraLights?: boolean;
        noSourceLights?: boolean;
        noSolarLight?: boolean;
        visEdges?: boolean;
        hidEdges?: boolean;
        shadows?: boolean;
        clipVol?: boolean;
        monochrome?: boolean;
        renderMode?: 0 | 6 | 4 | 3;
        backgroundMap?: boolean;
        ambientOcclusion?: boolean;
        thematicDisplay?: boolean;
        wiremesh?: boolean;
        forceSurfaceDiscard?: boolean;
        noWhiteOnWhiteReversal?: boolean;
      };
      /** Describes symbology and behavior applied to a ClipVector when applied to a ViewState or ModelClipGroup */
      clipStyling?: {
        produceCutGeometry?: boolean;
        colorizeIntersection?: boolean;
        cutStyle?: {
          viewflags?: {
            renderMode?: 0 | 6 | 4 | 3;
            dimensions?: boolean;
            patterns?: boolean;
            weights?: boolean;
            styles?: boolean;
            transparency?: boolean;
            fill?: boolean;
            textures?: boolean;
            materials?: boolean;
            acsTriad?: boolean;
            grid?: boolean;
            visibleEdges?: boolean;
            hiddenEdges?: boolean;
            shadows?: boolean;
            clipVolume?: boolean;
            constructions?: boolean;
            monochrome?: boolean;
            backgroundMap?: boolean;
            ambientOcclusion?: boolean;
            thematicDisplay?: boolean;
            wiremesh?: boolean;
            forceSurfaceDiscard?: boolean;
            whiteOnWhiteReversal?: boolean;
            lighting?: boolean;
          };
          hiddenLine?: {
            visible?: hiddenLineStyle;
            hidden?: hiddenLineStyle;
            transThreshold?: number;
          };
          appearance?: {
            rgb?: rgbColor;
            lineRgb?: rgbColor;
            weight?: number;
            transparency?: number;
            lineTransparency?: number;
            linePixels?: linePixels;
            ignoresMaterial?: boolean;
            nonLocatable?: boolean;
            emphasized?: boolean;
          };
        };
        insideColor?: rgbColor;
        outsideColor?: rgbColor;
        intersectionStyle?: { color?: rgbColor; width?: number };
      };
      /** Controls how white-on-white reversal is applied to make white geometry more visible in the view.
 By default, pure white geometry is displayed as black instead if the backgroundColor is also pure white.
 These settings are only applied if the display style's whiteOnWhiteReversal flag is enabled. */
      whiteOnWhiteReversal?: { ignoreBackgroundColor?: boolean };
    };
  };
  UnrealAtmosphericStyling: {
    /** Global setting to control unreal atmospheric styling when visualizing the scene in Carrot. */
    "1.0.0": {
      /** Atmospheric styling settings for the scene */
      atmosphere: {
        sunAzimuth: number;
        sunPitch: number;
        heliodonLongitude: number;
        heliodonLatitude: number;
        heliodonDate: dateTime;
        weather: number;
        windOrientation: number;
        windForce: number;
        fog: number;
        exposure: number;
        useHeliodon: boolean;
      };
    };
  };
  ExpressionStyling: {
    /** Defines declarative styling options using expressions to control display properties based on element attributes. */
    "1.0.0": {
      /** Declarative styling options using expressions or categories to control display properties such as color, visibility, and appearance. Expressions are defined with JSEP (JavaScript Expression Parser) valid syntax. */
      stylingOptions?:
        | {
            styleType: "Expression";
            defines?: { [key: string]: expressionString };
            show?: expressionOrConditions;
            color: expressionOrConditions;
            lineWeight?: expressionString;
            lineColor?: expressionOrConditions;
          }
        | {
            styleType: "Category";
            rules: {
              name: safeString;
              value: expressionString | number | boolean;
              symbology: {
                lineColor: colorDef;
                fillColor: colorDef;
                weight: number;
                linePixels?: linePixels;
              };
            }[];
          };
    };
  };
  ScheduleSimulation: {
    /** 4D scheduling simulation for a specific iModel. */
    "1.0.0": {
      /** The Id of a RenderTimeline element containing a RenderSchedule.Script used to animate the schedule of a specific iModel */
      timelineId: id64;
      /** The point in time expressed in seconds in the Unix epoch */
      timePoint: number;
    };
  };
  iModelVisibility: {
    /** Defines styling options for a specific iModel, including visible/hidden models and categories, rendering quality, and position adjustments. */
    "1.0.0": {
      /** Object maintaining visibility of categories in an iModel */
      categories: {
        shownList: compressedId64Set;
        hiddenList: compressedId64Set;
      };
      /** Object maintaining visibility of models in an iModel */
      models: { shownList: compressedId64Set; hiddenList: compressedId64Set };
      /** Matrix used for adjusting the positioning of the iModel */
      adjustment?: number[];
      /** Quality of iModel rendering */
      quality?: number;
    };
  };
}

// Helper types that enforce coupling between schema kinds and versions

/**
 * All schema kinds supported by the Scene API
 */
export type SchemaKind = keyof SchemaVersionRegistry;

/**
 * Available versions for a specific schema kind
 * @template K - The schema kind to get versions for
 */
export type SchemaVersion<K extends SchemaKind> =
  keyof SchemaVersionRegistry[K];

/**
 * Defines the data structure for a specific schema kind and version.
 * Core type that provides the actual schema interface.
 *
 * @template K - The schema kind (ex: 'Layer', 'View3d')
 * @template V - The schema version (ex: '1.0.0')
 *
 * @example
 * ```typescript
 * // Get the data structure for View3d v1.0.0
 * type ViewData = SchemaData<'View3d', '1.0.0'>;
 * // Result: { position: vector3d; direction: vector3d; ... }
 *
 * // Type-safe usage
 * function processCamera(data: SchemaData<'CameraAnimation', '1.0.0'>) {
 *   data.input.forEach(timestamp => console.log(timestamp));
 *   data.output.forEach(frame => {
 *     console.log(frame.camera.position); // Fully typed!
 *   });
 * }
 * ```
 */
export type SchemaData<
  K extends SchemaKind,
  V extends SchemaVersion<K>,
> = SchemaVersionRegistry[K][V];
