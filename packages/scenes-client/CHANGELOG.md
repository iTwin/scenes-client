# @bentley/scenes-client

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
