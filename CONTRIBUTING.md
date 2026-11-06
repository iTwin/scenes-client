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

Beta prereleases let you publish work-in-progress changes to `@itwin/scenes-client` under the `beta` npm dist-tag before they're included in a stable release. This never affects the `latest` tag, so it has no effect on consumers who install the package normally.

This uses Changesets' built-in [prerelease mode](https://changesets.dev/guide/prereleases). A branch is "in beta prerelease mode" for as long as `.changeset/pre.json` exists on it with `"mode": "pre"`. No separate prerelease branch needs to be created or maintained; your normal feature branch can transiently become one for as long as you're iterating.

**To start on your feature branch:**

1. Make sure you have at least one pending changeset (`pnpm changeset`) describing the change.
2. Enter beta prerelease mode and commit the result:
   ```shell
   pnpm changeset pre enter beta
   git add .changeset/pre.json
   git commit -m "Enter beta prerelease mode"
   ```
3. Push. The **Changesets Beta Prerelease** GitHub Action (`release-beta-workflow.yaml`) will open (or update) a "Release beta packages" pull request against your branch, computing the next `-beta.N` version (`1.2.0-beta.0`, then `1.2.0-beta.1`, etc. on subsequent pushes) from your pending changesets.
4. Once you're ready to actually publish, merge the PR into your branch. This publishes to npm under the `beta` dist-tag. Merging is the approval checkpoint, the same model the stable release workflow uses.
5. Repeat as the design iterates: add a new changeset, push, and merge the resulting PR to publish another beta version. Do not run `pnpm changeset pre enter` or `pre exit` again mid-cycle.

Consumers can then install the latest beta with `npm install @itwin/scenes-client@beta`, or pin a specific one, e.g. `npm install @itwin/scenes-client@1.2.0-beta.0`.

#### Before merging to main

Once the feature is finalized, exit prerelease mode before opening your PR to `main`, otherwise your changesets will be left in a prerelease state and CI will block the merge. Run:

```shell
pnpm changeset pre exit
```

Commit the changes and push. This sets `"mode": "exit"` in `.changeset/pre.json`.
Your original changesets remain untouched and will still drive the real version bump and changelog when the branch is merged to `main`.
