#!/usr/bin/env bash
set -euo pipefail

commit="${GITHUB_SHA:-}"
output="${BUILD_INFO_PATH:-dist/build-info.json}"

if [[ ! "$commit" =~ ^[0-9a-fA-F]{40}$ ]]; then
  echo "build-info: GITHUB_SHA must be a full 40-character commit SHA" >&2
  exit 1
fi

mkdir -p "$(dirname "$output")"
printf '{"commit":"%s"}\n' "${commit,,}" > "$output"

