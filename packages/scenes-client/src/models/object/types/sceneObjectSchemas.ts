// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY. PLEASE DO NOT EDIT IT DIRECTLY.

// CommonTypes interfaces
/** GUID string */
export type Guid = string;

/** String containing only alphanumeric characters */
export type AlphaNumericString = string;

/** String containing only web safe characters */
export type SafeString = string;

/** A JavaScript (JSEP) expression for frontend rendering that excludes potentially dangerous constructs. It's up to the frontend to validate and execute this expression safely. */
export type ExpressionString = string;

/** Expression that determines styling conditions or a single expression. */
export type ExpressionOrConditions =
  | ExpressionString
  | { conditions: [ExpressionString, ExpressionString][] };

/** Date time in format: YYYY-MM-DDThh:mm:ssZ or YYYY-MM-DDThh:mm:ss.sssZ */
export type DateTime = string;

/** Id64 string. See https://www.itwinjs.org/learning/common/id64/ */
export type Id64 = string;

/** Compressed Id64 set. */
export type CompressedId64Set = string;

export type Vector3d = { x: number; y: number; z: number };

/** Array of 16 numbers representing a 4x4 matrix in row-major order */
export type Transform = number[];

/** A single plane represented as an inward unit normal and a signed distance */
export type ClipPlane = {
  normal?: Vector3d;
  distance?: number;
  invisible?: boolean;
  interior?: boolean;
};

/** Collection of ClipPlanes, often used for bounding regions of space. */
export type ClipPlaneSet = { planes: ClipPlane[] };

/** An unsigned 32-bit integer in 0xTTBBGGRR format. */
export type ColorDef = number;

/** An immutable representation of a color with r, g, and b components each in the integer range [0, 255] */
export type RgbColor = { r: number; g: number; b: number };

/** If defined and not equal to -1 (Invalid), the pixel pattern used to draw the edges. If undefined, edges are drawn using the element's line pattern. The patterns are, in order:
0: Code0 (Solid), 2155905152 (0x80808080): Code1 (1 lit pixel followed by 7 unlit pixels), 4177066232 (0xf8f8f8f8): Code2 (5 lit pixels followed by 3 unlit pixels), 4292935648 (0xffe0ffe0): Code3 (11 lit pixels followed by 5 unlit pixels), 4262526480 (0xfe10fe10): Code4 (7 lit pixels followed by 4 unlit pixels followed by 1 lit pixel followed by 1 lit pixel), 3772834016 (0xe0e0e0e0): Code5 (3 lit pixels followed by 5 unlit pixels), 4169726088 (0xf888f888): Code6 (5 lit pixels followed by 3 unlit followed by 1 lit followed by 3 unlit followed by 1 lit followed by 3 unlit), 4279828248 (0xff18ff18): Code7 (8 lit pixels followed by 3 unlit followed by 2 lit followed by 3 unlit), 3435973836 (0xcccccccc): HiddenLine (2 lit pixels followed by 2 unlit pixels - default style for drawing hidden edges), 1 (0x00000001): Invisible, -1: Invalid */
export type LinePixels =
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
export type HiddenLineStyle = {
  ovrColor?: boolean;
  color?: ColorDef;
  pattern?: LinePixels;
  width?: number;
};

/**
 * All schema definitions and versions supported by the Scenes API.
 * Each schema can have multiple versions, each version defining its expected data structure.
 *
 * `{ [SchemaKind]: { [Version]: Definition } }`
 */
export interface ScenesApiSchemas {
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
      polygon: Vector3d[];
      /** Transform from local to world. */
      transformFromClip?: Transform;
      /** Transform from world to local. */
      transformToClip?: Transform;
      /** Upper bound on Z. */
      zHigh?: number;
      /** Lower bound on Z. */
      zLow?: number;
      /** True if this shape is invisible. */
      invisible: boolean;
      /** True if this shape is a masking set. */
      mask: boolean;
      /** The union of convex regions. */
      clipPlanes?: { convexSets: ClipPlaneSet[] };
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
      decorationId?: Guid;
    };
  };
  Movie: {
    /** A sequence of camera animations, or clips, which can be played independently or sequentially */
    "1.0.0": {
      /** Series of CameraAnimations in the movie. */
      animations: Guid[];
    };
  };
  RepositoryResource: {
    /** Reference to a single repository resource */
    "1.0.0": {
      /** Whether the layer is turned on or off */
      visible: boolean;
      /** Id of the iTwin this repository resource is associated with */
      iTwinId: Guid;
      /** Id of the repository. Should be the same as class for internal repos and a GUID for custom repos */
      repositoryId: SafeString;
      /** Id of the individual resource */
      id: SafeString;
      /** Class of the repository, such as iModels or RealityData */
      class: SafeString;
      /** SubClass of the repository if applicable */
      subClass?: SafeString;
    };
  };
  View3d: {
    /** Representation of a 3D view */
    "1.0.0": {
      /** Location of the eye of the camera. */
      position: Vector3d;
      /** Whether the view is orthographic or perspective */
      isOrthographic: boolean;
      /** Aspect ratio of the view */
      aspectRatio: number;
      /** Direction the camera is pointing towards */
      direction: Vector3d;
      /** Defines 'up' direction relative to camera in the view */
      up: Vector3d;
      /** Near plane distance */
      near: number;
      /** Far plane distance */
      far: number;
      /** Earth-Centered, Earth-Fixed transform */
      ecefTransform: Transform;
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
      backgroundColor?: ColorDef;
      /** Monochrome color */
      monochromeColor?: ColorDef;
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
            visible?: HiddenLineStyle;
            hidden?: HiddenLineStyle;
            transThreshold?: number;
          };
          appearance?: {
            rgb?: RgbColor;
            lineRgb?: RgbColor;
            weight?: number;
            transparency?: number;
            lineTransparency?: number;
            linePixels?: LinePixels;
            ignoresMaterial?: boolean;
            nonLocatable?: boolean;
            emphasized?: boolean;
          };
        };
        insideColor?: RgbColor;
        outsideColor?: RgbColor;
        intersectionStyle?: { color?: RgbColor; width?: number };
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
        heliodonDate: DateTime;
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
            defines?: { [key: string]: ExpressionString };
            show?: ExpressionOrConditions;
            color: ExpressionOrConditions;
            lineWeight?: ExpressionOrConditions;
            lineColor?: ExpressionOrConditions;
          }
        | {
            styleType: "Category";
            rules: {
              name: SafeString;
              value: ExpressionString | number | boolean;
              symbology: {
                lineColor: ColorDef;
                fillColor: ColorDef;
                weight: number;
                linePixels?: LinePixels;
              };
            }[];
          };
    };
  };
  ScheduleSimulation: {
    /** 4D scheduling simulation for a specific iModel. */
    "1.0.0": {
      /** The Id of a RenderTimeline element containing a RenderSchedule.Script used to animate the schedule of a specific iModel */
      timelineId: Id64;
      /** The point in time expressed in seconds in the Unix epoch */
      timePoint: number;
    };
  };
  iModelVisibility: {
    /** Defines styling options for a specific iModel, including visible/hidden models and categories, rendering quality, and position adjustments. */
    "1.0.0": {
      /** Object maintaining visibility of categories in an iModel */
      categories: {
        shownList: CompressedId64Set;
        hiddenList: CompressedId64Set;
      };
      /** Object maintaining visibility of models in an iModel */
      models: { shownList: CompressedId64Set; hiddenList: CompressedId64Set };
      /** Matrix used for adjusting the positioning of the iModel */
      adjustment?: number[];
      /** Quality of iModel rendering */
      quality?: number;
    };
  };
  RealityDataStyling: {
    /** Defines styling options for a specific reality data resource. */
    "1.0.0": {
      /** If true, reality data will not be drawn when using Viewport.readPixels */
      nonLocatable?: boolean;
      /** The color of the Feature */
      rgb?: RgbColor;
      /** Transparency in the range [0.0, 1.0] where 0 indicates fully opaque and 1 indicates fully transparent. */
      transparency?: number;
      /** Settings that control how a reality model - whether a ContextRealityModel or a persistent reality Model - is displayed within a Viewport. */
      displayProps?: {
        /** If the reality model's color is overridden with another color, a ratio in the range [0.0, 1.0] with which to mix the two colors together. A ratio of 0 uses only the reality model's color, a ratio of 1 uses only the override color, and a ratio of 0.5 mixes the two colors equally. */
        overrideColorRatio?: number;
        /** Settings that control how a point cloud reality model is displayed within a Viewport. */
        pointCloud?: {
          /** The shape drawn for each point in the cloud. */
          shape?: "square" | "round";
          /** Specifies how the sizes of the individual points within a point cloud are computed. Pixel: Each point is an exact number of pixels in diameter. Voxel: Each point is the size of a 'voxel' in meters */
          sizeMode?: "voxel" | "pixel";
          /** Settings that control how points are displayed when 'sizeMode' is 'pixel'. */
          pixelSettings?: {
            /** The radius of each point in pixels The maximum size will vary based on the graphics hardware in use, but typically is limited to 32 or 64 pixels. */
            size?: number;
          };
          /** Settings that control how points are displayed when 'sizeMode' is 'voxel'. */
          voxelSettings?: {
            /** Scale factor applied to the size of each point. */
            scale?: number;
            /** Minimum radius of each point in pixels. */
            minPixelsPerVoxel?: number;
            /** Maximum radius of each point in pixels. */
            maxPixelsPerVoxel?: number;
          };
          /** Settings that control the Eye Dome Lighting (EDL) effect applied to a point cloud. */
          eyeDome?: {
            /** Off: EDL is not calculated. On: EDL is calculated using a single pass. Full: EDL is calculated with full algorithm including optional filtering. */
            mode?: "off" | "on" | "full";
            /** Increasing this value increases contrast on slopes and edges. */
            strength?: number;
            /** Increase the thickness of contours from eye dome lighting. */
            radius?: number;
            /** Flag for whether or not to apply filtering pass in the Eye Dome Lighting (EDL) effect. It only applies if edlMode is 'full'. */
            filter?: number;
            /** Weighting value in the range [0.0, 1.0] to apply to the full image when combining it with the half and quarter sized ones. */
            mixWts1?: number;
            /** Weighting value in the range [0.0, 1.0] to apply to the half sized image when combining it with the full and quarter sized ones. */
            mixWts2?: number;
            /** Weighting value in the range [0.0, 1.0] to apply to the quarter sized image when combining it with the full and half sized one. */
            mixWts4?: number;
          };
        };
      };
    };
  };
}

// Helper types that enforce coupling between schema kinds and versions

/**
 * All schema kinds supported by the Scenes API
 */
export type SchemaKind = keyof ScenesApiSchemas;

/**
 * Available versions for a specific schema kind
 * @template K Schema kind to get versions for
 */
export type SchemaVersion<K extends SchemaKind> = keyof ScenesApiSchemas[K];

/**
 * Gets the data structure for a specific schema kind and version.
 * Core type that provides the actual schema interface.
 * @template K Schema kind (ex: 'Layer', 'View3d')
 * @template V Schema version (ex: '1.0.0')
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
> = ScenesApiSchemas[K][V];
