import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

/**
 * OTT-71 — otta.build was invisible to crawlers, and the way it failed hid it.
 *
 * The site is a single page with no `404.astro`, so Cloudflare Pages fell back
 * to `index.html` for every unknown path and returned it with HTTP 200. An
 * external audit of `/robots.txt`, `/sitemap.xml`, `/sitemap-index.xml` and
 * `/rss.xml` therefore got a 200 with an HTML body from all four. Nothing was
 * being 404'd; everything was being answered with the homepage. A missing file
 * and a served file are indistinguishable in that state, which is why this went
 * unnoticed while the same audit on petrenko.cv came back clean.
 *
 * So the fix is two things that must land together: ship the files, AND ship a
 * real 404 so a future missing file fails loudly instead of silently.
 *
 * Asserts on `dist/` rather than on source. That is the whole point — a config
 * value can look right in `src/` and never reach the output (an integration not
 * registered, a `site` not set), and only the built tree proves what a crawler
 * receives. Same reasoning as the inline-script guard next to this file.
 */

const root = join(import.meta.dir, "..");
const distDir = join(root, "dist");

function build() {
  if (!existsSync(distDir)) {
    spawnSync("bunx", ["astro", "build"], { cwd: root, stdio: "ignore" });
  }
}

describe("otta.build is crawlable (OTT-71)", () => {
  build();

  test("a real 404 page is emitted, so unknown paths stop resolving to the homepage", () => {
    const notFound = join(distDir, "404.html");
    expect(existsSync(notFound), "no dist/404.html — Cloudflare Pages will serve index.html with a 200 for every unknown path").toBe(true);

    // It must not BE the homepage, or the soft-404 survives under a new name.
    const body = readFileSync(notFound, "utf8");
    const home = readFileSync(join(distDir, "index.html"), "utf8");
    expect(body).not.toBe(home);
    expect(body).toMatch(/404/);
  });

  test("robots.txt is a real file that names the sitemap", () => {
    const robots = join(distDir, "robots.txt");
    expect(existsSync(robots), "no dist/robots.txt").toBe(true);

    const txt = readFileSync(robots, "utf8");
    expect(txt).not.toMatch(/<html/i); // the soft-404 signature
    expect(txt).toMatch(/^Sitemap:\s*https:\/\/otta\.build\/sitemap-index\.xml$/m);
  });

  test("the AI crawlers that read otta.build are allowed by name", () => {
    // Otta's buyers ask assistants about agent governance before they ask
    // Google. A default-allow robots.txt technically permits these, but naming
    // them is what makes the intent auditable — and it is the same list
    // leadcognition.io's seo-integrity-check enforces, kept in sync on purpose.
    const txt = readFileSync(join(distDir, "robots.txt"), "utf8");
    for (const bot of ["GPTBot", "ClaudeBot", "PerplexityBot", "CCBot", "Google-Extended"]) {
      expect(txt, `${bot} not named in robots.txt`).toMatch(new RegExp(`User-agent:\\s*${bot}\\b`, "i"));
    }
  });

  test("a sitemap is emitted and points at the real origin", () => {
    const index = join(distDir, "sitemap-index.xml");
    expect(existsSync(index), "no dist/sitemap-index.xml — @astrojs/sitemap needs `site` set in astro.config").toBe(true);
    expect(readFileSync(index, "utf8")).toMatch(/https:\/\/otta\.build\//);
  });

  test("the homepage carries structured data that parses", () => {
    const html = readFileSync(join(distDir, "index.html"), "utf8");
    const blocks = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    expect(blocks.length, "no JSON-LD on the homepage").toBeGreaterThan(0);

    for (const b of blocks) {
      // Throws on malformed JSON, which is the failure mode worth catching:
      // an invalid block is ignored wholesale, exactly like the PostHog bug.
      const parsed = JSON.parse(b[1]!);
      expect(parsed["@context"]).toBe("https://schema.org");
    }
  });
});
