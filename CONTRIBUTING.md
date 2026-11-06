# Contributing

## Issues

We welcome contributions to make this package better. You can submit feature requests or report bugs by creating an [issue](https://github.com/iTwin/scenes-client/issues).

### Writing Good Bug Reports and Feature Requests

File a single issue per problem and feature request. Do not enumerate multiple bugs or feature requests in the same issue.

Do not add your issue as a comment to an existing issue unless it's for the identical input. Many issues look similar, but have different causes.

The more information you can provide, the more likely someone will be successful at reproducing the issue and finding a fix.

Please include the following with each issue:

- Version of the package
- Reproducible steps (1... 2... 3...) that cause the issue
- What you expected to see, versus what you actually saw
- Images, animations, or a link to a video showing the issue occurring
- A code snippet that demonstrates the issue or a link to a code repository the developers can easily pull down to recreate the issue locally

### Pull Requests

All submissions go through a review process.
We use GitHub pull requests for this purpose.
All pull requests must be approved by at least one person and must pass build checks before they can be merged to the `main` branch.
Consult [GitHub Help](https://help.github.com/articles/about-pull-requests/) for more information on using pull requests.

### File Headers

Please add the following header at the top of every new source file.

```ts
/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
```

## Schema Documentation (`docs/schemas/`)

The JSON schema files under `docs/schemas/` are **auto-generated** and kept in sync with the Scenes API. Do not edit these files directly — any manual changes will be overwritten.

## Versioning with Changesets

This repository uses [Changesets](https://github.com/changesets/changesets) to manage package versioning and changelogs. When making changes that affect the public API or behavior, please add a changeset by running:

```shell
pnpm changeset
```

Follow the prompts to describe your changes and select the appropriate version bump (major, minor, or patch). Versioning should follow [semver](https://semver.org/) conventions. If no version bump is required (such as for documentation-only changes), use `pnpm changeset --empty`.

When changesets are added and merged into the main branch, a release pull request (PR) will be automatically created by the Changesets GitHub Action. This PR will contain the version updates and changelog entries generated from your changesets. Review the release PR to ensure the version bumps and changelog messages are accurate before merging. Once the release PR is merged, the new package version will be published automatically.

For more details, see the [Changesets documentation](https://github.com/changesets/changesets/blob/main/README.md).

## Beta Versions

Ad hoc publishes let you push a one-off build of `@itwin/scenes-client` to npm under the `beta` dist-tag, so consumers can start testing before it's part of a stable release. This never affects the `latest` tag; stable releases go through the normal changesets workflow on `main`.

Use the **Manual Beta Publish** GitHub Action (`manual-beta-publish.yaml`), which publishes whatever version is currently set in `packages/scenes-client/package.json`.

**To publish a beta version:**

1. Set the version you want published in `packages/scenes-client/package.json`, e.g. `1.2.0-beta.0`, and commit/push it to your branch.
2. Trigger the **Manual Publish** workflow from the Actions tab, selecting your branch.
3. The `validate` job runs lint/typecheck/audit/build/tests and resolves the version, shown in its step summary. The `publish` job then pauses for codeowner approval on the `npm-beta-publish` environment before publishing to npm under the `beta` dist-tag.
4. To publish another beta, bump the version again (e.g. `1.2.0-beta.1`), push, and re-trigger the workflow.

Consumers can then install the latest beta with `npm install @itwin/scenes-client@beta`, or pin a specific one, e.g. `npm install @itwin/scenes-client@1.2.0-beta.0`.

#### Before merging to main

Reset `packages/scenes-client/package.json`'s `version` field and commit — CI blocks the merge otherwise. Your changesets remain untouched and will drive the stable version bump and changelog when the branch merges to `main`.
