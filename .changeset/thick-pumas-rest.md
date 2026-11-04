---
"@itwin/scenes-client": minor
---

Add retry policy to `SceneClient`.

**Behavior change:** requests that fail with a `429`, `5xx`, or network error are now automatically retried by default, where previously the error surfaced after a single attempt. To restore the previous single-attempt behavior, pass `{ maxRetries: 0 }`.

- A `429` honors the `Retry-After` header, unless the wait it asks for would exceed `maxDelayMs`, in which case the retry is abandoned and the `429` is surfaced immediately.
- `5xx`/network errors are only retried for idempotent requests (GET, PUT, DELETE) to avoid duplicating a POST/PATCH that may have already been processed.
- Optionally pass `retryOptions` to client constructor to override the default policy (`maxRetries`, `baseDelayMs`, `maxDelayMs`). Invalid values (negative, `NaN`) fall back to the defaults.
