import { expect, test } from "bun:test";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = join(import.meta.dir, "..");
const writer = join(root, "scripts", "write-build-info.sh");

test("build info is generated from the deploying commit", () => {
  const output = join(mkdtempSync(join(tmpdir(), "otta-build-info-")), "build-info.json");
  const commit = "0123456789abcdef0123456789abcdef01234567";
  const result = spawnSync("bash", [writer], {
    cwd: root,
    env: { ...process.env, GITHUB_SHA: commit, BUILD_INFO_PATH: output },
  });

  expect(result.status).toBe(0);
  expect(JSON.parse(readFileSync(output, "utf8"))).toEqual({ commit });
});

test("build info rejects a missing or malformed commit", () => {
  for (const commit of ["", "main", "abc123"]) {
    const output = join(mkdtempSync(join(tmpdir(), "otta-build-info-")), "build-info.json");
    const result = spawnSync("bash", [writer], {
      cwd: root,
      env: { ...process.env, GITHUB_SHA: commit, BUILD_INFO_PATH: output },
    });

    expect(result.status).not.toBe(0);
  }
});

test("delivery passes the released Otta v1.12.1 readiness contract", () => {
  const workflow = readFileSync(join(root, ".github", "workflows", "deploy.yml"), "utf8");
  const contract = readFileSync(join(root, ".otta.yml"), "utf8");
  const readiness = spawnSync("bash", [join(root, "scripts", "verify-otta-deploy-readiness.sh")], {
    cwd: root,
    env: process.env,
    encoding: "utf8",
    timeout: 30_000,
  });

  expect(readiness.status, readiness.stderr || readiness.stdout).toBe(0);
  expect(readiness.stdout).toContain("PASS same-SHA no-op");
  expect(readiness.stdout).toContain("PASS runtime health verification");
  expect(readiness.stdout).toContain("PASS per-environment concurrency");
  expect(workflow).toContain("workflow_dispatch:");
  expect(workflow).toContain("commit_sha:");
  expect(workflow).toContain("run-name: deploy production ${{ inputs.commit_sha }}");
  expect(workflow).toContain("ref: ${{ inputs.commit_sha }}");
  expect(workflow).toContain("bash scripts/write-build-info.sh");
  expect(workflow).not.toMatch(/\n\s*push:/);

  expect(contract).toContain('default: "production"');
  expect(contract).toContain('production:');
  expect(contract).toContain('auto: "merge-and-deploy"');
  expect(contract).toContain('target: "production"');
  expect(contract).toContain("allow_production: true");
  expect(contract).toContain('executor: "github-workflow"');
  expect(contract).toContain('verify: "health-sha"');
  expect(contract).toContain('health_url: "https://otta.build/build-info.json"');
  expect(contract).toContain('health_commit_field: "commit"');
});
