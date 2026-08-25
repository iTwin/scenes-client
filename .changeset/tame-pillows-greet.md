---
"@itwin/scenes-client": minor
---

Add `visibility` property to `SceneCreate`, `SceneUpdate`, and `SceneMinimal` interfaces

- Export `SceneVisibility` enum (`PRIVATE`, `ITWIN`) for the `visibility` property
- Scenes default to `private` (only visible to creator or users with `SCENES_MANAGE` permission). Set to `iTwin` to make a scene visible to all iTwin members with `SCENES_READ` permission.
