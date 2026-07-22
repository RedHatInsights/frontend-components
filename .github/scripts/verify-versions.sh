#!/usr/bin/env bash
# verify-versions.sh
#
# Compares package versions across three sources (package.json, git tags, npm registry)
# for all releasable packages in this monorepo. Intended to run before `nx release`
# in CI to prevent releasing from an inconsistent state.
#
# Exit 0: all versions aligned
# Exit 1: at least one mismatch detected
# Note: When running locally in a fork, ensure tags are synced first:
#   git fetch upstream --tags

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

mismatch=0
registry_error=0
npm_stderr_file="$(mktemp)"
trap 'rm -f "$npm_stderr_file"' EXIT  # clean up temp file on exit
# Column widths for alignment
printf "%-60s %-12s %-12s %-15s %s\n" "PACKAGE" "DISK" "GIT TAG" "NPM" "STATUS"
printf '%.0s-' {1..110}
printf '\n'

for dir in "$REPO_ROOT"/packages/*/; do
  dirname="$(basename "$dir")"

  pkg_json="$dir/package.json"
  if [[ ! -f "$pkg_json" ]]; then
    continue
  fi

  # Read package name and version from package.json using node (always available in CI,
  # avoids jq dependency and handles edge cases better than grep/sed)
  pkg="$(node -p "require('$pkg_json').name")"
  disk_ver="$(node -p "require('$pkg_json').version")"

  # Skip private packages — they are not published to npm or tagged
  private="$(node -p "require('$pkg_json').private || false")"
  if [[ "$private" == "true" ]]; then
    continue
  fi

  # --- Git tag version ---
  # Tag pattern from nx.json: {projectName}-{version} where projectName = npm package name
  # Use glob "${pkg}-*" then strip the prefix and filter for version-like results.
  # This handles the ambiguity where e.g. "@redhat-cloud-services/frontend-components-config-*"
  # also matches "@redhat-cloud-services/frontend-components-config-utilities-*".
  # After stripping "${pkg}-", the utilities tags become "utilities-4.12.0" which does NOT
  # start with a digit, so grep '^[0-9]' filters them out.
  tag_ver="$(
    git tag --merged HEAD --list "${pkg}-*" \
      | sed "s|^${pkg}-||" \
      | grep '^[0-9]' \
      | sort -V \
      | tail -1
  )" || true
  [[ -z "$tag_ver" ]] && tag_ver="NONE"

  # --- npm registry version ---
  npm_ver="$(npm view "$pkg" version --fetch-timeout=10000 2>"$npm_stderr_file")" && npm_rc=0 || npm_rc=$?
  if [[ $npm_rc -ne 0 ]]; then
    if grep -q 'E404' "$npm_stderr_file"; then
      npm_ver="NOT_ON_NPM"
    else
      npm_ver="REGISTRY_ERROR"
    fi
  fi

  # --- Compare ---
  if [[ "$disk_ver" == "$tag_ver" && "$disk_ver" == "$npm_ver" ]]; then
    status="OK"
    marker="✓"
  elif [[ "$npm_ver" == "REGISTRY_ERROR" ]]; then
    status="REGISTRY_ERROR"
    marker="✗"
    mismatch=1
    registry_error=1
    echo "::error::${pkg}: npm registry lookup failed (timeout, auth, or outage). Cannot verify npm version."
  elif [[ "$tag_ver" == "NONE" && "$npm_ver" == "NOT_ON_NPM" ]]; then
    # New package: no tag, not published. Flag as informational but still a mismatch.
    status="NEW_PACKAGE"
    marker="!"
    mismatch=1
    echo "::error::${pkg}: new/unpublished package (disk=${disk_ver}, tag=NONE, npm=NOT_ON_NPM). Verify this is intentional."
  else
    status="MISMATCH"
    marker="✗"
    mismatch=1
    echo "::error::${pkg}: version mismatch (disk=${disk_ver}, tag=${tag_ver}, npm=${npm_ver})"
  fi

  printf "%-60s %-12s %-12s %-15s %s %s\n" "$pkg" "$disk_ver" "$tag_ver" "$npm_ver" "$marker" "$status"
done

echo ""
if [[ $mismatch -ne 0 ]]; then
  echo "Version verification FAILED. Fix mismatches before releasing."
  if [[ $registry_error -ne 0 ]]; then
    echo ""
    echo "npm registry lookup failed for one or more packages. Check registry status,"
    echo "network connectivity, and npm authentication before re-running."
  else
    echo ""
    echo "If disk and tag match but npm is behind, a prior npm publish likely failed."
    echo "Pull latest main with tags, build, and run 'npx nx release publish' to recover."
    echo "Subsequent releases will remain blocked until the missing version is published."
  fi
  exit 1
else
  echo "All package versions are aligned across disk, git tags, and npm registry."
  exit 0
fi
