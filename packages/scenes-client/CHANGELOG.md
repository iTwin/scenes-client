# @itwin/scenes-client

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
