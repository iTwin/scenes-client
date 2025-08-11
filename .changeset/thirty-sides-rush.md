---
"@bentley/scenes-client": patch
---

Fix SceneDTO type mismatch.
`SceneDTO.sceneData.objects` now uses correct response `SceneObjectMinimalDTO` instead of `SceneObjectCreateDTO`.
