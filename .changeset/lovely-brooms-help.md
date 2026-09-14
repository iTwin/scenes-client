---
"@itwin/scenes-client": patch
---

Loosen `isSceneMinimal` to accept responses without `visibility` and mark `SceneMinimal.visibility` optional.
Temp change for compatibility with deployments where the visibility feature is not yet available, will be reverted in next version.
