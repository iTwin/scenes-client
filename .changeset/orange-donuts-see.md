---
"@itwin/scenes-client": patch
---

Enhance `UnrealAtmosphericStyling` SceneObject types for HDRI backdrop support

- Added optional properties:
  - `HDRIImage` – name of the HDRI to apply as background
  - `HDRIZRotation` – rotation of the HDRI image (0–360°)
  - `sunIntensity` – intensity of the sun for shadows (0–100)
