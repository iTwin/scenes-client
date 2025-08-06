# @bentley/scenes-client

## About

This package provides client-side code and TypeScript types for interacting with the Scenes API.

## Usage

```ts
import { SceneClient } from "@itwin/scenes-client";

const client = new SceneClient(
  getAccessToken: async () => "<itwin_platform_auth_token>",
  baseUrl: HOST_URL, // default prod: https://api.bentley.com/scenes
);

const scene = await client.getScene({
  iTwinId: "<itwin_id>",
  sceneId: "<scene_id>",
});
console.log(scene);
/*
{
  id: "<scene_id>",
  displayName: "My Scene",
  iTwinId: "<itwin_id>",
  createdById: "<creator_id>",
  creationTime: "2025-01-01T10:00:00.000Z",
  lastModified: "2025-01-01T10:01:00.000Z",
  sceneData: { objects: [...] },
  isPartial: false
}
*/
```

## Issues

Please report bugs, feature requests, or questions using the [GitHub Issues](../../issues) page.

## Contributing

See [Contributing](../../README.md#contributing).

---

Copyright © Bentley Systems, Incorporated. All rights reserved.
See [LICENSE.md](./LICENSE.md) for license terms and full copyright notice.
