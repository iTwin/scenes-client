---
"@itwin/scenes-client": minor
---

Normalize visibility flag across scene objects

- Add optional top-level `visible` flag to all scene object types, to indicate if the object should be shown or hidden.
- Mark `visible` as deprecated in `Layer`, `Repository`, and `RepositoryResource` object types. Consumers should use `visible` in object metadata instead.
