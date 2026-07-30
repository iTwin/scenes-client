---
"@itwin/scenes-client": minor
---

**BREAKING CHANGE**: Remove `putScene` operation and related types (`PutSceneParams`, `SceneUpsert`).
  - Consumers can use `patchScene` to update scene metadata or `patchObjectsOperations` to make atomic changes to scene data.
