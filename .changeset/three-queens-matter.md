---
"@itwin/scenes-client": patch
---

Improve TS inference for scene object data based on kind

- Fix `SceneObject`, `SceneObjectMinimal`, and `SceneObjectCreate` types so the `data` field is properly inferred from the `kind` attribute.
- Improves type safety and editor autocomplete for consumers.
