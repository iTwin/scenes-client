---
"@bentley/scenes-client": minor
---

Move `iTwinId` from metadata to `RepositoryResource` schema

**Breaking Changes:**
- Remove `ITwinScopedObjectCreate` and `ITwinScopedObject` interfaces
- Add `iTwinId` as required field in `RepositoryResource` schema data
- Consolidate object update interfaces into single `SceneObjectUpdate` interface for all kinds
