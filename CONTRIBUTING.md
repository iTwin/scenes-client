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

## Publishing Beta Versions

Use the **Publish Beta Version** GitHub Action to publish beta changes as a prerelease under the `beta` npm dist-tag, before it's ready to ship in a stable release. This uses Changesets' built-in [prerelease mode](https://changesets.dev/guide/prereleases) — the workflow computes and commits the `-beta.N` version bump for you based on your branch's pending changesets; you never choose or edit a version by hand.

Before dispatching it:

1. Make sure your branch has at least one pending changeset (`pnpm changeset`). The workflow fails fast if none is found, since there's nothing to bump.
2. Do **not** trigger this from `main` — the workflow refuses to run there. Entering prerelease mode on `main` would cause the regular release workflow to start publishing prereleases instead of stable releases on every merge.
3. Trigger the workflow from the [Actions tab](https://github.com/iTwin/scenes-client/actions/workflows/publish-beta-version.yaml) on your branch. This requires approval from one of the code owners.

Each run:

- Enters beta prerelease mode if not already in it (first run on the branch only).
- Applies your branch's pending changesets, computing the next `-beta.N` version (`1.2.0-beta.0`, then `1.2.0-beta.1`, etc. on subsequent runs).
- Publishes to npm under the `beta` dist-tag.
- Commits and pushes the resulting version bump and changelog back to your branch, so the next beta run picks up from the right state.

Consumers can then install the published beta version, e.g. `npm install @itwin/scenes-client@1.2.0-beta.0`.

#### Before merging to main

Your branch must exit prerelease mode before it's merged, otherwise your changesets will be left in a prerelease state. Run:

```shell
pnpm changeset pre exit
```

Commit the resulting deletion of `.changeset/pre.json` and push. Your original changesets remain untouched and will still drive the real version bump and changelog when the branch is merged to `main` and released through the normal process.
