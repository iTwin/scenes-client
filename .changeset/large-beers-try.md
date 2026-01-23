---
"@itwin/scenes-client": minor
---

Add new client method `patchObjectsOperations(params: PatchObjectsOperationsParams)`

- Accepts a list of ordered scene object operations to perform atomically
  - Operations execute in the order provided. If any operation fails, all changes are rolled back.
  - Allows up to 100 operations per request.
- Supported operations:
  - **add**: create a new object using the `SceneObjectCreate` payload.
  - **update**: partially update an existing object by id using the `SceneObjectUpdate` payload.
  - **remove**: delete an existing object by id.
- New types:
  - `OperationType`: enum for supported operations
  - `CreateSceneObjectOperation<K,V>`, `UpdateSceneObjectOperation<K,V>`, `DeleteSceneObjectOperation`
  - `SceneObjectOperation`: union type for all operations
- New create/update operation types allow for strongly typing the payloads
- Marked `patchObjects` as deprecated; updating multiple objects can be achieved via update operations instead.
