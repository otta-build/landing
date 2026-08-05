import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

/**
 * otta-build/landing#16 — `.otta.yml` opts this repo into `merge-and-deploy`,
 * which polls the deployed SHA against the merge SHA before calling a deploy
 * verified. otta.build had no endpoint reporting the deployed commit at all
 * (`/health`, `/version`, `/_health`, `/build-info.json` all 404'd), so
 * `otta-deploy-verify.sh` had nothing to check — a deploy that silently
 * failed to publish would look identical to a successful one.
 *
 * This asserts on the BUILT output, same reasoning as the inline-script and
 * crawlability guards next to this file: a value can be correct in source and
 * never reach `dist/`. It also asserts the SHA in the artifact matches the
 * commit that was actually built (`git rev-parse HEAD`), not a checked-in
 * constant — that's the whole point of AC2 ("a stale value must be
 * impossible").
 */

const root = join(import.meta.dir, "..");
const distDir = join(root, "dist");
const artifact = join(distDir, "build-info.json");

const SHA_RE = /^[0-9a-f]{40}$/;

function build() {
  if (!existsSync(distDir)) {
    spawnSync("bunx", ["astro", "build"], { cwd: root, stdio: "ignore" });
  }
}

function gitHead(): string {
  return spawnSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).stdout.trim();
}

describe("build-info artifact carries the deploying commit SHA (landing#16)", () => {
  build();

  test("dist/build-info.json is emitted by the build", () => {
    expect(existsSync(artifact), "no dist/build-info.json — nothing for the deploy verifier to check").toBe(true);
  });

  test("the artifact's commit is a full 40-char hex SHA, present verbatim in the body", () => {
    const body = readFileSync(artifact, "utf8");
    const parsed = JSON.parse(body);
    expect(parsed.commit, "commit field is not a 40-char hex SHA").toMatch(SHA_RE);
    // otta-deploy-verify.sh's health check greps the raw response body for the
    // expected SHA string — the field must be present verbatim, not just parseable.
    expect(body).toContain(parsed.commit);
  });

  test("the SHA matches the commit that was actually built, not a stale/checked-in value", () => {
    const { commit } = JSON.parse(readFileSync(artifact, "utf8"));
    expect(commit).toBe(gitHead());
  });
});
