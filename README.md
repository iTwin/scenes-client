# @itwin/scenes-client

## About

This package hosts client-side code and TypeScript types for interacting with Scenes API.

## Documentation

- **[Client Usage](./packages/scenes-client/README.md)** - Installation, configuration, and code examples
- **[Scene Object Schemas](./docs/README.md)** - JSON schema definitions and examples for scene objects

## Development & Testing

This is a pnpm workspace. To get started:

```sh
# Install all dependencies (run once at root)
pnpm install

# Run only unit tests in client
pnpm test:client:unit

# Run only integration tests in client
pnpm test:client:integration

# Run all tests in client
pnpm test:client

# Run lint in client
pnpm lint:client

# Build the client package
pnpm build:client

# Type check the client package
pnpm typecheck:client
```

### Test Configuration

For scenes-client integration tests:

1. Create a `.env` file in the `packages/scenes-client/tests` folder based on `.env.template`
2. Set `HOST_URL` to your local host or use `https://dev-api.bentley.com/scenes`
3. Run tests using the commands above or use the Vitest extension in VS Code

### Alternative: Local Development in Package Directory

```sh
# Navigate to the package directory
cd packages/scenes-client

# Run commands locally within the package
pnpm test:unit        # Run only unit tests
pnpm test:integration # Run only integration tests
pnpm test            # Run all tests
pnpm lint            # Run linting
pnpm build           # Build package
pnpm typecheck       # Type check
```


## Issues

Please report bugs, feature requests, or questions using the [GitHub Issues](./issues) page.

---

Copyright © Bentley Systems, Incorporated. All rights reserved. See [LICENSE.md](./LICENSE.md) for license terms and full copyright notice.
