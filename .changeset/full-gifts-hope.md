---
"@itwin/scenes-client": minor
---

Enhance `iModelVisibility` SceneObject types with optional visibility override properties

- Added optional properties:
  - `perModelCategoryVisibility`: allows category visibility to be overridden in the context of individual models
  - `alwaysDrawn`: set of elements that should always be rendered
  - `neverDrawn`: set of elements that should never be rendered
