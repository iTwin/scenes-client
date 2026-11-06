// Used by manual-beta-publish.yaml to validate that a version is a proper
// '<major>.<minor>.<patch>-beta.<N>' prerelease (build metadata optional) before it's
// published under the 'beta' npm dist-tag. Exits non-zero if not.
//
// Usage: node validate-beta-version.js <version>
const semver = require("semver");

const version = process.argv[2];
const parsed = semver.parse(version);

if (
  !parsed ||
  parsed.prerelease.length !== 2 ||
  parsed.prerelease[0] !== "beta" ||
  typeof parsed.prerelease[1] !== "number"
) {
  console.error(
    `Version '${version}' must be a '<major>.<minor>.<patch>-beta.<N>' prerelease (build metadata optional).`,
  );
  process.exit(1);
}
