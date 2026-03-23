---
"@itwin/scenes-client": minor
---

Add ResourceSettings v1.0.0 schema support

- Update `SceneApiSchemas` interface to include ResourceSettings v1.0.0 schema
- Add create types (`ResourceSettingsCreate`/`ResourceSettingsV1`) and response types (`ResourceSettings`/`ResourceSettingsV1`)
- Marked `transparency` as deprecated in `RealityDataStyling` and `GISStyling`. Use `ResourceSettings.transparency` instead
