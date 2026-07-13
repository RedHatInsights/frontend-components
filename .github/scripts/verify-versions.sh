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
    git tag --list "${pkg}-*" \
      | sed "s|^${pkg}-||" \
      | grep '^[0-9]' \
      | sort -V \
      | tail -1
  )" || true
  [[ -z "$tag_ver" ]] && tag_ver="NONE"

  # --- npm registry version ---
  npm_ver="$(npm view "$pkg" version 2>/dev/null)" || true
  [[ -z "$npm_ver" ]] && npm_ver="NOT_ON_NPM"

  # --- Compare ---
  if [[ "$disk_ver" == "$tag_ver" && "$disk_ver" == "$npm_ver" ]]; then
    status="OK"
    marker="✓"
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
  exit 1
else
  echo "All package versions are aligned across disk, git tags, and npm registry."
  exit 0
fi
