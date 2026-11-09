---
"@itwin/scenes-client": minor
---

Support setting scene source metadata.

- Added `SceneSource` type (`id`, `lastModified`) and `isSceneSource` type guard.
- Added optional `sourceScene?: SceneSource` to `SceneCreate`, identifying the scene a new scene was copied from. The reference is informational only and cannot be changed after creation.
- Added optional `sourceScene?: SceneSource` to `SceneMinimal` (and by extension `Scene`, `SceneWithLinks`, and `SceneListResponse`).
- Added optional `sourceSceneId` to `GetScenesParams` and `GetAllScenesParams`, allowing `getScenes` and `getAllScenes` to filter scenes by `sourceScene.id`.
