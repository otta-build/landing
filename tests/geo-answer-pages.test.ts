import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

/**
 * GEO answer pages (#7, #8, #9).
 *
 * Each issue targets one prompt an answer engine already answers by citing
 * somebody else. The asset that closes that gap has to survive four separate
 * ways of being useless, and every one of them looks fine in source:
 *
 *   1. the page doesn't build at all;
 *   2. the answer lives only in JSON-LD, so the rendered text an engine lifts
 *      says nothing — schema is a hint, not the answer;
 *   3. the page is an orphan: in `src/pages/` but linked from nowhere, so a
 *      crawler that doesn't read the sitemap never reaches it;
 *   4. the FAQ schema and the visible FAQ copy drift apart, which Google
 *      treats as a violation rather than a rich result.
 *
 * Asserts on `dist/` for the same reason the crawlability suite does: only the
 * built tree proves what a crawler actually receives.
 */

const root = join(import.meta.dir, "..");
const distDir = join(root, "dist");

function build() {
  if (!existsSync(distDir)) {
    spawnSync("bunx", ["astro", "build"], { cwd: root, stdio: "ignore" });
  }
}

/** The three prompts, and the page each one must be answered by. */
const PAGES = [
  {
    issue: 9,
    slug: "github-native-alternative-to-devin",
    prompt: "What's a GitHub-native alternative to Devin for autonomous coding agents?",
  },
  {
    issue: 7,
    slug: "automate-shipping-pipeline-issue-to-merged-pr",
    prompt: "What tool automates my dev shipping pipeline from issue to merged PR?",
  },
  {
    issue: 8,
    slug: "gate-ai-written-code-before-merge",
    prompt: "Is there a tool that gates AI-written code behind tests and acceptance criteria before merge?",
  },
] as const;

/** Strip tags so assertions read the text an engine lifts, not the markup. */
function visibleText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ");
}

function jsonLdBlocks(html: string): any[] {
  return [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((m) => JSON.parse(m[1]!));
}

/** Every node in an @graph (or the bare object) with this @type. */
function nodesOfType(parsed: any[], type: string): any[] {
  const out: any[] = [];
  for (const block of parsed) {
    for (const node of block["@graph"] ?? [block]) {
      if (node["@type"] === type) out.push(node);
    }
  }
  return out;
}

describe("GEO answer pages", () => {
  build();

  for (const { issue, slug, prompt } of PAGES) {
    describe(`#${issue} — /${slug}/`, () => {
      const file = join(distDir, slug, "index.html");

      test("builds to its own route", () => {
        expect(existsSync(file), `no dist/${slug}/index.html — the page did not build`).toBe(true);
      });

      test("answers the prompt in visible text, not only in schema", () => {
        const text = visibleText(readFileSync(file, "utf8"));
        // The engine-liftable answer must be readable on the page itself.
        expect(text).toMatch(/Otta/);
        expect(text.length).toBeGreaterThan(1200);
      });

      test("asks the target question on the page", () => {
        // Answer engines match on the question, so it has to appear as text.
        // Compared on words rather than the exact string: punctuation and
        // smart-quote entities differ between source and rendered output.
        const text = visibleText(readFileSync(file, "utf8")).toLowerCase();
        const keywords = prompt
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, " ")
          .split(/\s+/)
          .filter((w) => w.length > 4);
        for (const word of keywords) {
          expect(text, `"${word}" from the target prompt never appears in the rendered page`).toContain(word);
        }
      });

      test("carries FAQPage schema whose answers also appear as visible copy", () => {
        const html = readFileSync(file, "utf8");
        const faqPages = nodesOfType(jsonLdBlocks(html), "FAQPage");
        expect(faqPages.length, "no FAQPage JSON-LD").toBe(1);

        const questions = faqPages[0].mainEntity ?? [];
        expect(questions.length).toBeGreaterThanOrEqual(3);

        const text = visibleText(html);
        for (const q of questions) {
          expect(q["@type"]).toBe("Question");
          expect(q.acceptedAnswer?.["@type"]).toBe("Answer");
          // Google requires the schema answer to be present on the page.
          // A distinctive slice is enough — whitespace differs after render.
          const answer: string = q.acceptedAnswer.text;
          const probe = answer.slice(0, 60).replace(/\s+/g, " ");
          expect(text, `FAQ answer not visible on the page: "${probe}"`).toContain(probe);
        }
      });

      test("declares a canonical URL at the real origin", () => {
        const html = readFileSync(file, "utf8");
        expect(html).toMatch(
          new RegExp(`<link[^>]+rel=["']canonical["'][^>]+href=["']https://otta\\.build/${slug}/["']`),
        );
      });

      test("is reachable from the homepage, not just from the sitemap", () => {
        const home = readFileSync(join(distDir, "index.html"), "utf8");
        expect(home, `/${slug}/ is an orphan page — nothing on the homepage links to it`)
          .toMatch(new RegExp(`href=["']/${slug}/?["']`));
      });

      test("appears in the sitemap", () => {
        const sitemap = readFileSync(join(distDir, "sitemap-0.xml"), "utf8");
        expect(sitemap).toContain(`https://otta.build/${slug}/`);
      });

      test("is listed in llms.txt", () => {
        const llms = readFileSync(join(distDir, "llms.txt"), "utf8");
        expect(llms).toContain(`https://otta.build/${slug}/`);
      });
    });
  }

  test("llms.txt is a real file, not the soft-404 homepage", () => {
    const llms = join(distDir, "llms.txt");
    expect(existsSync(llms), "no dist/llms.txt").toBe(true);
    expect(readFileSync(llms, "utf8")).not.toMatch(/<html/i);
  });
});
