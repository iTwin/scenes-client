---
"@itwin/scenes-client": minor
---

Add new client method `putScene(params: PutSceneParams)`

- Fully replaces an existing scene and all its objects in a single request. If the specified scene does not exist, it will be created.
- Uses new types `SceneUpsert` and `PutSceneParams`
