---
"@itwin/scenes-client": minor
---

Add retry policy to `SceneClient`.

**Behavior change:** transient failures are now retried by default (previously they surfaced after a single attempt). Pass `{ retryOptions: { maxRetries: 0 } }` to restore single-attempt behavior.

- Retries `429` for all requests, and `408`, `5xx` and network errors for idempotent requests (GET, PUT, DELETE) only.
- Waits using the `Retry-After` header when present, otherwise exponential backoff with jitter.
- Added `RetryOptions` type (`maxRetries`, `baseDelayMs`, `maxDelayMs`, `maxRetryAfterMs`) for clients to override defaults.
- `SceneClient` constructor now accepts an options object (`{ baseUrl?: string, retry?: RetryOptions }`). The previous `baseUrl` string form is still supported.
