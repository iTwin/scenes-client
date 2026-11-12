---
"@itwin/scenes-client": patch
---

Fix `SchemaVersion` and `SchemaData` so they work per kind when `K` is a union.

Before, `SchemaVersion<SchemaKind>` was only `"1.0.0"`, so the default `SceneObject`, `SceneObjectCreate`, `SceneObjectUpdate`, `CreateSceneObjectOperation` and `UpdateSceneObjectOperation` types accepted only version `1.0.0`. A Cutout `2.0.0` object did not match `SceneObject`.

- `SchemaVersion<K>` is now every version of every kind in `K`.
- `SchemaData<K, V>` is now the data of every valid pair of a kind and a version.
- `SceneObject<"Cutout">` is now `CutoutV1 | CutoutV2`, so it narrows by `version`.
