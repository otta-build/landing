import { execSync } from "node:child_process";

// otta-build/landing#16 — the SHA in the build-info artifact must be the
// commit actually being built, never a checked-in constant. GitHub Actions
// sets GITHUB_SHA for every job (push AND pull_request), so it's authoritative
// in CI. Locally there is no such variable, so fall back to the real checkout
// HEAD rather than emit an empty or wrong value.
const SHA_RE = /^[0-9a-f]{40}$/;

export function getBuildSha(): string {
  const fromEnv = process.env.GITHUB_SHA;
  if (fromEnv && SHA_RE.test(fromEnv)) return fromEnv;

  try {
    const fromGit = execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
    if (SHA_RE.test(fromGit)) return fromGit;
  } catch {
    // fall through to the error below
  }

  throw new Error(
    "build-info: no commit SHA available — set GITHUB_SHA or build inside a git checkout",
  );
}
