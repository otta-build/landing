#!/usr/bin/env bash
set -euo pipefail

plugin_version="v1.12.1"
readiness_sha256="0fdc92026482440670796806227686ec5d0decde134e256f8331d7fb930f6829"
config_sha256="115b3cc178cf1d357bfddc69ac7000fc0a52b2f1f496b4220019f7a13c73e87d"
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
candidate="${OTTA_PLUGIN_ROOT:-$(cd "$repo_root/.." && pwd)/otta-plugin}"
temporary=""

checksum() {
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$1" | awk '{print $1}'
  else
    shasum -a 256 "$1" | awk '{print $1}'
  fi
}

if [ -f "$candidate/scripts/otta-deploy-readiness.sh" ] &&
   [ -f "$candidate/scripts/otta-deploy-config.sh" ] &&
   [ "$(checksum "$candidate/scripts/otta-deploy-readiness.sh")" = "$readiness_sha256" ] &&
   [ "$(checksum "$candidate/scripts/otta-deploy-config.sh")" = "$config_sha256" ]; then
  plugin_root="$candidate"
else
  temporary="$(mktemp -d)"
  trap 'rm -rf "$temporary"' EXIT
  plugin_root="$temporary"
  mkdir -p "$plugin_root/scripts"
  base="https://raw.githubusercontent.com/otta-build/plugin/$plugin_version/scripts"
  curl --fail --silent --show-error --location --retry 3 \
    "$base/otta-deploy-readiness.sh" -o "$plugin_root/scripts/otta-deploy-readiness.sh"
  curl --fail --silent --show-error --location --retry 3 \
    "$base/otta-deploy-config.sh" -o "$plugin_root/scripts/otta-deploy-config.sh"
  [ "$(checksum "$plugin_root/scripts/otta-deploy-readiness.sh")" = "$readiness_sha256" ]
  [ "$(checksum "$plugin_root/scripts/otta-deploy-config.sh")" = "$config_sha256" ]
fi

bash "$plugin_root/scripts/otta-deploy-readiness.sh" \
  --otta-yml "$repo_root/.otta.yml" \
  --environment production
