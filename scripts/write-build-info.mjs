#!/usr/bin/env bun
// otta-build/landing#16 — stamps dist/build-info.json with the commit SHA
// actually being built, so otta-deploy-verify.sh's merge-and-deploy
// SHA-match check has something to verify a deploy against.
//
// Standalone script invoked directly from deploy.yml (not a src/ file, not a
// package.json script entry) — PR #15 is concurrently touching most of src/,
// package.json, and bun.lock, so the stamping step lives here to keep the two
// branches' change surfaces disjoint.
//
// GITHUB_SHA is set automatically on every GitHub Actions job (push AND
// pull_request), so it's authoritative in CI. Locally there is no such
// variable, so this falls back to the real checkout HEAD rather than emit an
// empty or wrong value — never a checked-in constant either way.
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SHA_RE = /^[0-9a-f]{40}$/;

function getBuildSha() {
  const fromEnv = process.env.GITHUB_SHA;
  if (fromEnv && SHA_RE.test(fromEnv)) return fromEnv;

  try {
    const fromGit = execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
    if (SHA_RE.test(fromGit)) return fromGit;
  } catch {
    // fall through to the error below
  }

  throw new Error(
    "write-build-info: no commit SHA available — set GITHUB_SHA or run inside a git checkout",
  );
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(root, "dist");
const outFile = join(distDir, "build-info.json");

if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true });

const commit = getBuildSha();
writeFileSync(outFile, JSON.stringify({ commit }) + "\n");
console.log(`write-build-info: wrote ${outFile} (commit=${commit})`);
