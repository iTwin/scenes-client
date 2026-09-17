---
"@itwin/scenes-client": minor
---

Support scene shares.

- Added scene share endpoints to `SceneClient`: `getSceneShare`, `getAllSceneShares`, `postSceneShare`, and `revokeSceneShare`.
- Added scene share model types and response guards: `SceneShare`, `SceneShareCreate`, `SceneShareResponse`, `SceneShareListResponse`.
- Added `isPubliclyShared: boolean` to the following response types, indicating whether the scene currently has at least one active public share:
  - `Scene`, `SceneMinimal`, `SceneWithLinks`, `SceneListResponse` items, and `SceneContext`
- Documented scene shares in the README, including how to configure a `SceneClient` with a `shareKey` for unauthenticated read-only access.
