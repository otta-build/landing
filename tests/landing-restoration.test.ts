import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { readFile, rm } from "node:fs/promises";
import { $ } from "bun";

let html = "";
let hero = "";
let getStarted = "";
let content = "";
let pricing = "";
let waitlist = "";
let deployWorkflow = "";

beforeAll(async () => {
  await rm("dist", { recursive: true, force: true });
  await $`bun run build`.quiet();

  [html, hero, getStarted, content, pricing, waitlist, deployWorkflow] = await Promise.all([
    readFile("dist/index.html", "utf8"),
    readFile("src/components/Hero.astro", "utf8"),
    readFile("src/components/GetStarted.astro", "utf8"),
    readFile("src/data/content.ts", "utf8"),
    readFile("src/data/pricing.ts", "utf8"),
    readFile("src/components/Waitlist.astro", "utf8"),
    readFile(".github/workflows/deploy.yml", "utf8"),
  ]);
});

afterAll(async () => {
  await rm("dist", { recursive: true, force: true });
});

describe("dark landing restoration", () => {
  test("renders one continuous dark product shell", () => {
    expect(html).toContain('data-theme="otta-dark"');
    expect(html).not.toMatch(/<body[^>]*bg-white/);
  });

  test("ships an accessible progressive-enhancement scenario console", () => {
    expect(hero).toContain("data-scenario-control");
    expect(hero).toContain("aria-pressed");
    expect(hero).toContain("data-scenario-panel");
    expect(hero).toContain("hidden={!isDefault}");
    expect(html).toContain('data-scenario="gate-failure"');
  });

  test("keeps live Pulse proof fallbacks and update hooks", () => {
    expect(hero).toContain("data-pulse-metric");
    expect(hero).toContain("AbortSignal.timeout(4000)");
    expect(html).toContain("1,750");
    expect(html).toContain("8 min");
  });

  test("documents maintained Claude Code and Codex paths", () => {
    expect(getStarted).toContain("/plugin marketplace add otta-build/plugin");
    expect(getStarted).toContain("/plugin install --scope user otta@otta");
    expect(getStarted).toContain("$otta-setup");
    expect(getStarted).not.toContain("Cockpit");
  });

  test("uses verified current product language", () => {
    expect(content).toContain("delivery control plane");
    expect(content).toContain("builder → reviewer → qa → devops");
    expect(content).not.toMatch(/automatically adapts|every tier|Autonomous Build/);
  });

  test("does not advertise dormant or unshipped execution surfaces", () => {
    expect(pricing).not.toMatch(/cockpit|cloud runner|desktop app/i);
    expect(pricing).toContain("early-access roadmap");
  });

  test("preserves conversion and deployment release contracts", () => {
    expect(waitlist).toContain('fetch("/api/waitlist"');
    expect(waitlist).toContain("get_access_requested");
    expect(waitlist).toContain("btn.removeAttribute(\"disabled\")");
    expect(deployWorkflow).toContain("Verify Cloudflare git integration stays disabled");
    expect(deployWorkflow).toContain("tests/inline-script-syntax.test.ts");
  });
});
