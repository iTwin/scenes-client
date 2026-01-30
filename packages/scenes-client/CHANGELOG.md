# @itwin/scenes-client

## 0.6.0

### Minor Changes

- 2bef474: **BREAKING CHANGE**: Remove deprecated `visible` property from `Layer`, `Repository`, and `RepositoryResource` SceneObject data types.
  - Consumers must use `visible` field in top-level object metadata instead.

## 0.5.0

### Minor Changes

- 438b307: Add new client method `patchObjectsOperations(params: PatchObjectsOperationsParams)`
  - Accepts a list of ordered scene object operations to perform atomically
    - Operations execute in the order provided. If any operation fails, all changes are rolled back.
    - Allows up to 100 operations per request.
  - Supported operations:
    - **add**: create a new object using the `SceneObjectCreate` payload.
    - **update**: partially update an existing object by id using the `SceneObjectUpdate` payload.
    - **remove**: delete an existing object by id.
  - New types:
    - `OperationType`: enum for supported operations
    - `CreateSceneObjectOperation<K,V>`, `UpdateSceneObjectOperation<K,V>`, `DeleteSceneObjectOperation`
    - `SceneObjectOperation`: union type for all operations
  - New create/update operation types allow for strongly typing the payloads
  - Marked `patchObjects` as deprecated; updating multiple objects can be achieved via update operations instead.

## 0.4.1

### Patch Changes

- 1fd1ad5: Address CVE-2025-64718, CVE-2025-58752, and CVE-2025-54798

## 0.4.0

### Minor Changes

- d7df6d2: Add new client method `putScene(params: PutSceneParams)`
  - Fully replaces an existing scene and all its objects in a single request. If the specified scene does not exist, it will be created.
  - Uses new types `SceneUpsert` and `PutSceneParams`

## 0.3.0

### Minor Changes

- 6347911: Enhance `iModelVisibility` SceneObject types with optional visibility override properties
  - Added optional properties:
    - `perModelCategoryVisibility`: allows category visibility to be overridden in the context of individual models
    - `alwaysDrawn`: set of elements that should always be rendered
    - `neverDrawn`: set of elements that should never be rendered

- e23f5c3: Add GISStyling v1.0.0 schema support
  - Update `SceneApiSchemas` interface to include GISStyling v1.0.0 schema
  - Add create types (`GISStylingCreate`/`GISStylingCreateV1`) and response types (`GISStyling`/`GISStylingV1`)

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
