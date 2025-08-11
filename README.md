# Scenes

[![CI](https://github.com/iTwin/scenes-client/actions/workflows/CI.yaml/badge.svg)](https://github.com/iTwin/scenes-client/actions/workflows/CI.yaml)

## About

This repository contains a TypeScript client for interacting with the Scenes API.

> **Getting started?** Begin with the [Scenes API Overview](https://developer.bentley.com/apis/scenes/overview/), then dive into [Schema Docs](./docs/README.md) for implementation details.

## Documentation

- **[Client Usage](./packages/scenes-client/README.md)** - Installation, configuration, and code examples
- **[Scene Object Schemas](./docs/README.md)** - JSON schema definitions and examples for scene objects

## Quick Start

```sh
pnpm install           # Install dependencies
pnpm run test:client   # Run tests
pnpm run build:client  # Build the package
```

## Project Structure

```
scenes-client/
├── docs/                          # Scene documentation
│   ├── README.md                  # Schema guide with examples
│   └── schemas/                   # JSON schema definitions
├── packages/
│   └── scenes-client/             # Main client package
│       ├── src/                   # Source code
│       ├── tests/                 # Tests
│       └── README.md              # Usage docs
├── .changeset/                    # Versioning config
└── README.md
```

## Development & Testing

### Prerequisites

- [Node >=20](https://nodejs.org/en/) : Node installation also includes the **npm** package manager.
- [pnpm >=9](https://pnpm.io/): Package manager used for this repository. Install with `npm install -g pnpm@9`.

### Top-level Commands

This is a pnpm workspace. All commands should be run from the repository root:

```sh
pnpm install                      # Install all dependencies
pnpm run build:client             # Build client
pnpm run test:client:unit         # Run client unit tests
pnpm run test:client:integration  # Run client integration tests
pnpm run lint:client              # Lint code
pnpm run typecheck:client         # Type check
```

### Integration Test Setup

1. Create an `.env` file in the [scenes-client/tests](packages/scenes-client/tests) folder based on [.env.template](packages/scenes-client/tests/.env.template)
2. Set `HOST_URL` to your local host or use `https://dev-api.bentley.com/scenes`
3. Run tests using the commands above or use the Vitest extension in VS Code

## Contributing

### Issues

We welcome contributions to make this package better. You can submit feature requests or report bugs by creating an [issue](https://github.com/iTwin/scenes-client/issues).

### Versioning with Changesets

This repository uses [Changesets](https://github.com/changesets/changesets) to manage package versioning and changelogs. When making changes that affect the public API or behavior, please add a changeset by running:

```shell
pnpm changeset
```

Follow the prompts to describe your changes and select the appropriate version bump (major, minor, or patch). Versioning should follow [semver](https://semver.org/) conventions. If no version bump is required (such as for documentation-only changes), use `pnpm changeset --empty`.

When changesets are added and merged into the main branch, a release pull request (PR) will be automatically created by the Changesets GitHub Action. This PR will contain the version updates and changelog entries generated from your changesets. Review the release PR to ensure the version bumps and changelog messages are accurate before merging. Once the release PR is merged, the new package version will be published automatically.

For more details, see the [Changesets documentation](https://github.com/changesets/changesets/blob/main/README.md).

---

Copyright © Bentley Systems, Incorporated. All rights reserved. See [LICENSE.md](./LICENSE.md) for license terms and full copyright notice.
