---
"@bentley/scenes-client": minor
---

Expose strongly typed scene object interfaces with schema validation.

- Added `ScenesApiSchemas` registry containing all schema definitions supported by the Scenes API
- Added schema-specific typed interfaces for create, update, and response objects:
  - Create: `StandardObjectCreate<K,V>`, `ITwinScopedObjectCreate<K,V>`, `ResourceStylingObjectCreate<K,V>`
  - Update: `MetadataSceneObjectUpdate`, `StandardSceneObjectDataUpdate<K,V>`, `ITwinScopedObjectDataUpdate<K,V>`, `ResourceStylingObjectDataUpdate<K,V>`
  - Response: `StandardObject<K,V>`, `ITwinScopedObject<K,V>`, `ResourceStylingObject<K,V>`
- `SceneObjectCreate`, `SceneObjectUpdate`, and `SceneObject` are now schema-driven union types
- Enables compile-time validation, autocomplete, and automatic type resolution based on schema kind
