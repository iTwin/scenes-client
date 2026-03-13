---
"@itwin/scenes-client": minor
---

Support scene tags.

- Added tag CRUD APIs to `SceneClient`: `getTag`, `getTags`, `getAllTags`, `postTag`, `patchTag`, and `deleteTag`.
- Added tag model types and response guards (`Tag`, `TagMinimal`, `TagCreate`, `TagUpdate`).
- Updated scene payloads so create/update/upsert can accept `tagIds?: string[]`.
- Updated all scene response models to include `tags: TagMinimal[]`.
