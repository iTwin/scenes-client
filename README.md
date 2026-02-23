# Scenes

[![latest version](https://img.shields.io/github/v/release/iTwin/scenes-client?label=latest)](https://github.com/iTwin/scenes-client/releases/latest)
[![CI](https://github.com/iTwin/scenes-client/actions/workflows/CI.yaml/badge.svg)](https://github.com/iTwin/scenes-client/actions/workflows/CI.yaml)
[![CodeQL](https://github.com/iTwin/scenes-client/actions/workflows/codeql-analysis.yaml/badge.svg)](https://github.com/iTwin/scenes-client/actions/workflows/codeql-analysis.yaml)

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
- [pnpm >=10.30.1](https://pnpm.io/): Package manager used for this repository. Install with `npm install -g pnpm@10.30.1`.

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
2. Run tests using the commands above or use the [Vitest extension](https://marketplace.visualstudio.com/items?itemName=vitest.explorer) in VS Code

## Contributing

For information on how to contribute to this project, please see [CONTRIBUTING.md](./CONTRIBUTING.md).

---

Copyright © Bentley Systems, Incorporated. All rights reserved. See [LICENSE.md](./LICENSE.md) for license terms and full copyright notice.
