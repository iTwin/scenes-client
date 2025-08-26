# @bentley/scenes-client

## 0.4.0

### Minor Changes

- 700aa76: Add RealityDataStyling v1.0.0 schema support
  - Update `SceneApiSchemas` interface to include RealityDataStyling v1.0.0 schema
  - Add create types (`RealityDataStylingCreate`/`RealityDataStylingCreateV1`) and response types (`RealityDataStyling`/`RealityDataStylingV1`)

### Patch Changes

- 5824870: Change `lineWeight` in ExpressionStyling to allow `ExpressionOrConditions` instead of only `ExpressionString`
- 5247c5e: Fix SceneObjectMinimal losing schema-specific properties.
  Add UnionOmit to preserve type safety when omitting fields from union types.

## 0.3.0

### Minor Changes

- 615001a: Expose strongly typed scene object interfaces with schema validation.
  - Added `ScenesApiSchemas` registry containing all schema definitions supported by the Scenes API
  - Added schema-specific typed interfaces for create, update, and response objects:
    - Create: `StandardObjectCreate<K,V>`, `ITwinScopedObjectCreate<K,V>`, `ResourceStylingObjectCreate<K,V>`
    - Update: `MetadataSceneObjectUpdate`, `StandardSceneObjectDataUpdate<K,V>`, `ITwinScopedObjectDataUpdate<K,V>`, `ResourceStylingObjectDataUpdate<K,V>`
    - Response: `StandardObject<K,V>`, `ITwinScopedObject<K,V>`, `ResourceStylingObject<K,V>`
  - `SceneObjectCreate`, `SceneObjectUpdate`, and `SceneObject` are now schema-driven union types
  - Enables compile-time validation, autocomplete, and automatic type resolution based on schema kind

## 0.2.2

### Patch Changes

- 0f5df03: Switch to NodeNext module resolution for better Node.js compatibility.
  Ensures reliable Node.js usage without bundling, while staying compatible with bundled apps.

## 0.2.1

### Patch Changes

- 4a0ed8a: Fix usage examples in client README

## 0.2.0

### Minor Changes

- 8265a19: Enable ESM compatibility

  **Breaking Changes:**
  - Package now uses ESM module resolution and explicit file extensions
  - Import statements must use `.js` extensions when importing typescript files
  - Requires modern bundlers that support ESM

## 0.1.0

### Minor Changes

- bde0333: Rename interfaces for better client experience.
  Breaking change to expose clean domain models rather than using data transfer object naming.
  - Renamed `SceneDTO` to `Scene`
  - Renamed `SceneCreateDTO` to `SceneCreate`
  - Renamed `SceneObjectDTO` to `SceneObject`
  - Renamed `SceneObjectCreateDTO` to `SceneObjectCreate`

### Patch Changes

- 77db34e: Fix SceneDTO type mismatch.
  `SceneDTO.sceneData.objects` now uses correct response `SceneObjectMinimalDTO` instead of `SceneObjectCreateDTO`.
- 9099882: Update README with usage examples

## 0.0.1

### Patch Changes

- f7db02d: Initial release of scenes-client package
