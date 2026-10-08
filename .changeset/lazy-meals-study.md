---
"@itwin/scenes-client": minor
---

Support scene object images.

- Added scene object image endpoints to `SceneClient`: `uploadObjectImage`, `getObjectImage`, and `deleteObjectImage`.
- Added `ImageCreate`, `ImageResponse`, `ImageSize`, and `ImageContentType` types.
- Added optional `image?: Link` property to `SceneObject`, which points to the object's small thumbnail image when one exists.
- Add list of objects that support image uploads
  - Added `IMAGE_ENABLED_OBJECT_KINDS` constant and `ImageEnabledObjectKind` type.
  - Added `isImageEnabledObjectKind()` function to check if and object kind supports thumbnails before calling `uploadObjectImage`.
