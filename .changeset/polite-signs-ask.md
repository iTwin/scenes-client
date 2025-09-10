---
"@bentley/scenes-client": minor
---

- Update `getScene()` method to fetch all objects using pagination
- Add `getSceneMetadata()` method for fetching scene metadata with object links
- Add `SceneWithLinks` interface as the new return type for GET/PATCH scene endpoints

**Breaking change:**
- `updateScene()` now returns `SceneWithLinks` (scene metadata + links) instead of full scene with objects
