import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

// issue #70: structured data (JSON-LD) + OG/Twitter meta for otta.build.
// Source-assertion checks (mirrors the typography test) — the highest-leverage
// GEO/SEO surface is what renders in the built <head>, so pin the wiring.

const landingRoot = join(import.meta.dir, "..");
const read = (p: string) => readFileSync(join(landingRoot, p), "utf8");

describe("SeoHead component (issue #70)", () => {
  const seoHead = read("src/components/SeoHead.astro");

  test("emits canonical link", () => {
    expect(seoHead).toMatch(/rel="canonical"/);
  });

  test("emits Open Graph title/description/image", () => {
    expect(seoHead).toMatch(/property="og:title"/);
    expect(seoHead).toMatch(/property="og:description"/);
    expect(seoHead).toMatch(/property="og:image"/);
  });

  test("emits Twitter summary_large_image card", () => {
    expect(seoHead).toMatch(/name="twitter:card"/);
    expect(seoHead).toMatch(/summary_large_image/);
  });

  test("default og image points to an asset that exists in public/", () => {
    const m = seoHead.match(/image\s*=\s*"(\/[^"]+)"/);
    expect(m).not.toBeNull();
    const rel = m![1].replace(/^\//, "");
    expect(existsSync(join(landingRoot, "public", rel))).toBe(true);
  });
});

describe("JsonLd component (issue #70)", () => {
  const jsonLd = read("src/components/JsonLd.astro");

  test("injects an application/ld+json script", () => {
    expect(jsonLd).toMatch(/type="application\/ld\+json"/);
    expect(jsonLd).toMatch(/set:html=\{JSON\.stringify\(schema\)\}/);
  });
});

describe("landing index wiring (issue #70)", () => {
  const index = read("src/pages/index.astro");

  test("renders SeoHead and JsonLd", () => {
    expect(index).toMatch(/<SeoHead\b/);
    expect(index).toMatch(/<JsonLd\b/);
  });

  test("declares SoftwareApplication + Organization schema", () => {
    expect(index).toMatch(/"@type":\s*"SoftwareApplication"/);
    expect(index).toMatch(/"@type":\s*"Organization"/);
  });

  test("does not regress GTM / consent / PostHog analytics", () => {
    expect(index).toMatch(/GTM-W5J8ZHPR/);
    expect(index).toMatch(/<ConsentBanner\b/);
    expect(index).toMatch(/posthog\.init/);
  });
});
