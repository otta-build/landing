import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

/**
 * otta-build/dev#92 — otta.build recorded ONE analytics event in 90 days.
 *
 * Ported with the site from the monorepo. The sync that created this repo
 * predated the fix, so this repo shipped the broken snippet; the guard travels
 * with the site so the protection is not left behind in the monorepo.
 *
 * Root cause: the PostHog snippet in `src/pages/index.astro` was missing a `for(`
 * (a hand-edit that also left `e.__SV=1.0` and a stray space). That is a JS
 * syntax error, so the browser discarded the ENTIRE inline script block and
 * PostHog never initialised. No `$pageview`, and `get_access_requested` — the
 * waitlist conversion — never fired once.
 *
 * Nothing surfaced it because every call site is written
 * `window.posthog?.capture(...)`: with `posthog` undefined, optional chaining
 * makes each one a silent no-op. A broken analytics pipeline and a site with no
 * traffic look identical from the outside.
 *
 * This test parses every inline <script> in the BUILT output. A syntax error in
 * any of them fails the build instead of silently costing 90 days of data.
 * It checks the built HTML rather than the .astro sources because that is what
 * the browser actually receives — `define:vars` and Astro's transforms mean the
 * source is not valid standalone JS.
 */

const landingRoot = join(import.meta.dir, ".."); // repo root here (was apps/landing in the monorepo)
const distDir = join(landingRoot, "dist");

/** Inline scripts only — anything with src= is fetched, not parsed here. */
function inlineScripts(html: string): { attrs: string; body: string }[] {
  const out: { attrs: string; body: string }[] = [];
  const re = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const attrs = m[1] ?? "";
    const body = m[2] ?? "";
    // JSON payloads (JSON-LD, speculation rules) are data, not script.
    if (/type\s*=\s*["']application\/(ld\+)?json["']/i.test(attrs)) continue;
    if (/type\s*=\s*["']speculationrules["']/i.test(attrs)) continue;
    if (!body.trim()) continue;
    out.push({ attrs, body });
  }
  return out;
}

function htmlFiles(dir: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...htmlFiles(p));
    else if (entry.name.endsWith(".html")) found.push(p);
  }
  return found;
}

/** Parse without executing. `new Function` throws SyntaxError on malformed input
 *  and never runs the body, so this is safe for arbitrary page script. */
function syntaxError(code: string): string | null {
  try {
    new Function(code);
    return null;
  } catch (err) {
    if (err instanceof SyntaxError) return err.message;
    return null; // ReferenceError etc. would mean it parsed fine
  }
}

describe("built inline scripts parse (dev#92)", () => {
  if (!existsSync(distDir)) {
    // Build once so the guard is meaningful in a clean checkout and in CI.
    spawnSync("bunx", ["astro", "build"], { cwd: landingRoot, stdio: "ignore" });
  }

  test("dist exists so there is something to check", () => {
    expect(existsSync(distDir)).toBe(true);
  });

  test("every inline script in every built page is syntactically valid", () => {
    const pages = htmlFiles(distDir);
    expect(pages.length).toBeGreaterThan(0);

    const failures: string[] = [];
    for (const page of pages) {
      const html = readFileSync(page, "utf8");
      for (const [i, s] of inlineScripts(html).entries()) {
        const err = syntaxError(s.body);
        if (err) {
          failures.push(`${page.replace(distDir, "dist")} block#${i}: ${err}\n    ${s.body.slice(0, 160)}…`);
        }
      }
    }

    expect(failures).toEqual([]);
  });

  test("the PostHog snippet is present and parses — it is the conversion pipeline", () => {
    const index = join(distDir, "index.html");
    const html = readFileSync(index, "utf8");

    const ph = inlineScripts(html).find((s) => s.body.includes("posthog.init"));
    expect(ph, "PostHog init snippet missing from built index.html").toBeDefined();
    expect(syntaxError(ph!.body)).toBeNull();

    // Pin the specific corruption: a lost `for(` left the parens unbalanced.
    // Balance is what actually broke, so assert it directly rather than
    // pattern-matching the minified snippet.
    let depth = 0;
    let inStr: string | null = null;
    let esc = false;
    for (const ch of ph!.body) {
      if (inStr) {
        if (esc) esc = false;
        else if (ch === "\\") esc = true;
        else if (ch === inStr) inStr = null;
        continue;
      }
      if (ch === '"' || ch === "'") inStr = ch;
      else if (ch === "(") depth += 1;
      else if (ch === ")") depth -= 1;
    }
    expect(depth).toBe(0);
  });
});
