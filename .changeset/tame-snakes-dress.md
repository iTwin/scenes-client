---
"@itwin/scenes-client": minor
---

Support scene images.

- Added scene image endpoints to `SceneClient`: `uploadSceneImage`, `getSceneImage`, and `deleteSceneImage`.
- Added optional `image?: Link` property to `SceneMinimal` (and by extension `Scene`, `SceneWithLinks`, and `SceneListResponse` items), which points to the scene's small thumbnail image when one exists.
