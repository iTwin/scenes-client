---
"@itwin/scenes-client": minor
---

Add Cutout v2.0.0 schema support

- Add `CutoutCreateV2` and `CutoutV2` types; `CutoutCreate` and `Cutout` latest aliases now point to v2.0.0 (v1 types remain available as `CutoutCreateV1`/`CutoutV1`)
- Cutout v2 requires an `appliesTo` list to scope the cutout to specific scene objects, and a `cutout` field defining the clipping geometry as one of `PolygonSetCutout`, `PlaneCutout`, or `BoxCutout`
- Added `Quaternion`, `ClippingPlane`, `ClippingPolygon`, and `ClippingBox` types
