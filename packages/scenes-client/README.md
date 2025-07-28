# @itwin/scenes-client

## About

This package provides client-side code and TypeScript types for interacting with the [iTwin Platform Scenes API](https://developer.bentley.com/apis/scenes/overview/).

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

## Development & Testing

This package is part of a pnpm workspace.

### Quick Start

```sh
# From the root directory, install all dependencies
cd ../../  # Go to workspace root
pnpm install

# Run commands from root
pnpm test:client     # Run tests
pnpm lint:client     # Run linting
pnpm build:client    # Build package
```

### Alternative: Local Development

```sh
# Or work directly in this package directory
pnpm test     # Run tests locally
pnpm lint     # Run linting locally
pnpm build    # Build locally
```

### Test Configuration

1. Create a `.env` file in the `tests` folder based on `.env.template`.
2. Set `HOST_URL` to your local host or use `https://dev-itwinscenes-eus.bentley.com`.
3. Run tests with either approach above or use the Vitest extension in VS Code.

---

Copyright © Bentley Systems, Incorporated. All rights reserved.
See [LICENSE.md](./LICENSE.md) for license terms and full copyright notice.
