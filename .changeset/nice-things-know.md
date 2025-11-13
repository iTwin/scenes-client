---
"@itwin/scenes-client": major
---

BREAKING CHANGE: Normalize visibility flag across scene objects

- Add optional top-level `visible` flag to all scene object types, to indicate if that object should be shown or hidden.
- Remove `visible` from `Layer`, `Repository`, and `RepositoryResource` object types. Consumers should use `visible` in object metadata instead.
