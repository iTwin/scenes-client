---
"@itwin/scenes-client": minor
---

Add Cutout v2.0.0 schema support

- Add `CutoutCreateV2` and `CutoutV2` types; `CutoutCreate` and `Cutout` latest aliases now point to v2.0.0 (v1 types remain available as `CutoutCreateV1`/`CutoutV1`)
- Cutout v2 supports a `cutout` discriminated union of geometry types (`PolygonSetCutout`, `PlaneCutout`, `BoxCutout`) and an optional `appliesTo` list for targeting specific scene objects
- Added `Quaternion`, `ClippingPlane`, `ClippingPolygon`, and `ClippingBox` types
