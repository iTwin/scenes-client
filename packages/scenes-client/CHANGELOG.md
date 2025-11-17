# @itwin/scenes-client

## 0.2.0

### Minor Changes

- 44d7ff7: Add optional frustum properties to `View3d` SceneObject types
  - Non-breaking. New optional properties:
    - `fov` – angle of the field of view in radians for perspective views
    - `width` – width of the frustum in meters for orthographic views

- 7468e29: Normalize visibility flag across scene objects
  - Add optional top-level `visible` flag to all scene object types, to indicate if the object should be shown or hidden.
  - Mark `visible` as deprecated in `Layer`, `Repository`, and `RepositoryResource` object types. Consumers should use `visible` in object metadata instead.

## 0.1.0

### Minor Changes

- 825efa8: **BREAKING CHANGE**: Require default `FeatureSymbology` in Category `ExpressionStyling` type
  - Export new `FeatureSymbology` type
  - Add required `default` property to `ExpressionStyling.stylingOptions`

### Patch Changes

- fbc9aa7: Enhance `UnrealAtmosphericStyling` SceneObject types for HDRI backdrop support
  - Added optional properties:
    - `HDRIImage` – name of the HDRI to apply as background
    - `HDRIZRotation` – rotation of the HDRI image (0–360°)
    - `sunIntensity` – intensity of the sun for shadows (0–100)

## 0.0.4

### Patch Changes

- 6ad365f: - Add `RestrictedString` type alias with TSDoc explaining expected format and note on sanitization
  - Change `ExpressionStyling.stylingOptions` category `rule.value` type to `RestrictedString`
  - No runtime behavior changes

## 0.0.3

### Patch Changes

- fb0f436: Improve TS inference for scene object data based on kind
  - Fix `SceneObject`, `SceneObjectMinimal`, and `SceneObjectCreate` types so the `data` field is properly inferred from the `kind` attribute.
  - Improves type safety and editor autocomplete for consumers.

## 0.0.2

### Patch Changes

- b0aac18: Fix handling optional fields in create and patch functions
  - Ignore undefined values in Scene/SceneObject payloads
  - Allow passing `null` to explicitly remove optional fields

## 0.0.1

### Patch Changes

- b4b4e28: Initial release of @itwin/scenes-client package
