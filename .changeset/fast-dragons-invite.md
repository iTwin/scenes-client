---
"@itwin/scenes-client": minor
---

Support image-based point markers in `GeospatialFeatureStyling` scene object types

- Add `Base64Image` and `HttpsUrl` string types documenting validation requirements
- Add `ImageMarkerSymbol` type with `url` (base64 data or HTTPS URL), optional `width`, and optional `height`
- Update `FeatureSymbol` union to include `ImageMarkerSymbol`
