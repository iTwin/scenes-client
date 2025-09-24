---
"@itwin/scenes-client": patch
---

Fix handling optional fields on POST/PATCH requests

- Ignore undefined values in Scene/SceneObject payloads
- Allow passing `null` to explicitly remove optional fields
