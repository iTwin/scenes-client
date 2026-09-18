---
"@itwin/scenes-client": patch
---

Add `activityId` property to `ScenesApiError`, populated from a failed request's response headers when present.
Consumers can share this value with iTwin Platform team to help diagnose a failed request.
