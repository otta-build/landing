# Otta Dark Landing Restoration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the approved July all-dark Otta landing experience on current `main` while preserving every useful release and replacing stale product claims with verified current Pulse, Claude Code, and Codex content.

**Architecture:** Keep current Astro pages, behaviors, API paths, analytics, SEO, live Pulse data flow, and deployment workflow as the maintained base. Reconcile the old dark presentation into focused current components, add a progressive-enhancement scenario module and a current two-path installation section, and pin the restoration and content truth with source/build regression tests plus browser screenshots.

**Tech Stack:** Astro 6, TypeScript, Tailwind CSS 4, Bun test runner, Playwright/browser verification, Cloudflare Pages build output.

---

## File map

- Create `tests/landing-restoration.test.ts`: source and built-HTML contract for dark continuity, current terminology, progressive enhancement, scenario controls, installation paths, and preserved live metrics.
- Create `src/components/GetStarted.astro`: two maintained install paths with individually copyable Claude Code and Codex instructions.
- Modify `src/config.ts`: accurate harness-agnostic delivery-control-plane positioning and maintained links.
- Modify `src/data/content.ts`: verified pipeline, differentiator, evidence, comparison, and scenario copy.
- Modify `src/styles/global.css`: global dark tokens, reusable section/card/focus styles, no-JS visibility, and reduced-motion behavior.
- Modify `src/pages/index.astro`: dark shell, nav/footer, current JSON-LD, Get Started placement, and progressive-enhancement marker.
- Modify `src/components/Hero.astro`: centered gradient hero, accessible scenario console, current architecture/evidence content, and unchanged Pulse fetch contract.
- Modify `src/components/Philosophy.astro`, `Pipeline.astro`, `Differentiators.astro`, `Memory.astro`, and `Comparison.astro`: dark narrative surfaces and accurate labels.
- Modify `src/components/Pricing.astro`, `PricingCard.astro`, `Waitlist.astro`, and `FinalCta.astro`: dark conversion surfaces without changing pricing or waitlist behavior.
- Modify `src/pages/404.astro`, `src/pages/privacy.astro`, and the consent UI source located by `rg "consent" src`: visually align auxiliary UI without changing semantics or route behavior.

### Task 1: Pin the restoration contract

**Files:**
- Create: `tests/landing-restoration.test.ts`
- Test: `tests/landing-restoration.test.ts`

- [ ] **Step 1: Write the failing structural test**

Create a Bun test that reads the relevant source files and builds the site once. Pin concrete contracts rather than Tailwind implementation trivia:

```ts
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { readFile, rm } from "node:fs/promises";
import { $ } from "bun";

let html = "";
let hero = "";
let getStarted = "";
let content = "";

beforeAll(async () => {
  await rm("dist", { recursive: true, force: true });
  await $`bun run build`.quiet();
  [html, hero, getStarted, content] = await Promise.all([
    readFile("dist/index.html", "utf8"),
    readFile("src/components/Hero.astro", "utf8"),
    readFile("src/components/GetStarted.astro", "utf8"),
    readFile("src/data/content.ts", "utf8"),
  ]);
});

afterAll(async () => rm("dist", { recursive: true, force: true }));

describe("dark landing restoration", () => {
  test("renders one continuous dark product shell", () => {
    expect(html).toContain('data-theme="otta-dark"');
    expect(html).not.toMatch(/<body[^>]*bg-white/);
  });

  test("ships an accessible progressive-enhancement scenario console", () => {
    expect(hero).toContain('data-scenario-control');
    expect(hero).toContain('aria-pressed');
    expect(hero).toContain('data-scenario-panel');
    expect(hero).toContain('hidden={!isDefault}');
    expect(html).toContain('data-scenario="gate-failure"');
  });

  test("keeps live Pulse proof fallbacks and update hooks", () => {
    expect(hero).toContain('data-pulse-metric');
    expect(hero).toContain('AbortSignal.timeout(4000)');
    expect(html).toContain("1,750");
    expect(html).toContain("8 min");
  });

  test("documents maintained Claude Code and Codex paths", () => {
    expect(getStarted).toContain('/plugin marketplace add otta-build/plugin');
    expect(getStarted).toContain('/plugin install --scope user otta@otta');
    expect(getStarted).toContain('$otta-setup');
    expect(getStarted).not.toContain("Cockpit");
  });

  test("uses verified current product language", () => {
    expect(content).toContain("delivery control plane");
    expect(content).toContain("builder → reviewer → qa → devops");
    expect(content).not.toMatch(/automatically adapts|every tier|Autonomous Build/);
  });
});
```

- [ ] **Step 2: Run the focused test and confirm the intended failure**

Run: `rtk bun test tests/landing-restoration.test.ts`

Expected: FAIL because `src/components/GetStarted.astro` does not exist and the current page has no dark-theme or accessible scenario contract.

- [ ] **Step 3: Commit only the red test**

Run:

```bash
rtk git add tests/landing-restoration.test.ts
rtk git commit -m "test: pin dark landing restoration contract"
```

Expected: one commit containing the failing regression test and no implementation.

### Task 2: Correct the product-content source of truth

**Files:**
- Modify: `src/config.ts`
- Modify: `src/data/content.ts`
- Modify: `src/pages/index.astro`
- Test: `tests/landing-restoration.test.ts`

- [ ] **Step 1: Replace stale positioning in config**

Set the maintained headline/subtitle to:

```ts
tagline: "Delivery control for coding agents.",
subtitle:
  "Otta gives Claude Code and Codex a disciplined path from issue to verified release, with specialist review stages and Pulse-enforced GitHub evidence.",
```

Keep existing website, booking, and waitlist URLs. Do not add a Cockpit URL.

- [ ] **Step 2: Rewrite structured content around shipped surfaces**

Replace the five pipeline entries with these bounded stages:

```ts
[
  ["01", "Define", "Turn an issue into explicit acceptance criteria and a testable delivery contract."],
  ["02", "Build", "Run the native Otta workflow in Claude Code or Codex inside an isolated branch or worktree."],
  ["03", "Specialist review", "Move work through builder → reviewer → qa → devops with evidence at each handoff."],
  ["04", "Enforce", "Let Pulse reconstruct lifecycle state and enforce repository merge requirements in GitHub."],
  ["05", "Verify & learn", "Record release and deploy evidence, then promote reviewed lessons through explicit LEARN receipts."],
]
```

Rewrite differentiators, memory/evidence layers, comparison rows, and philosophy so they distinguish native plugin workflows, Pulse enforcement, optional telemetry, and reviewable LEARN receipts. Remove claims of a shipped autonomous engine, automatic rule adaptation, universal self-hosting, exact cost tracking, or persistent task memory supplied by the landing product.

- [ ] **Step 3: Correct JSON-LD and social alt text**

Use a feature list limited to page-evidenced capabilities:

```ts
featureList: [
  "Native delivery workflows for Claude Code and Codex",
  "Specialist builder, reviewer, QA, and DevOps stages",
  "GitHub merge gates and lifecycle evidence through Otta Pulse",
  "Acceptance-criteria, test, and visual-proof checks",
  "Release and deployment verification",
]
```

Update `og:image:alt` to the new delivery-control wording while preserving all OG tags, absolute asset URLs, and PostHog initialization byte-for-byte outside the copy.

- [ ] **Step 4: Run focused content assertions**

Run: `rtk bun test tests/landing-restoration.test.ts`

Expected: still FAIL only for the missing dark/scenario/GetStarted implementation; verified-language assertions PASS.

- [ ] **Step 5: Commit accurate content**

Run:

```bash
rtk git add src/config.ts src/data/content.ts src/pages/index.astro
rtk git commit -m "content: align landing with current Otta product"
```

### Task 3: Establish the continuous dark shell

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/pages/index.astro`
- Modify: `src/components/Philosophy.astro`
- Modify: `src/components/Pipeline.astro`
- Modify: `src/components/Differentiators.astro`
- Modify: `src/components/Memory.astro`
- Modify: `src/components/Comparison.astro`
- Test: `tests/landing-restoration.test.ts`

- [ ] **Step 1: Add global tokens and fail-open enhancement rules**

After the Tailwind import, add root tokens for ink, raised surfaces, borders, purple, text, and muted text. Add reusable `.otta-section`, `.otta-card`, `.otta-eyebrow`, `.otta-focus`, and `.text-gradient` rules. Ensure only `html.js [data-reveal]` may receive transition styles; do not set `opacity: 0` in server-rendered HTML. Include:

```css
:root { color-scheme: dark; --otta-bg: #07070b; --otta-surface: #101018; --otta-border: rgba(255,255,255,.1); --otta-accent: #8b7cff; --otta-text: #f7f7fb; --otta-muted: #a3a3b2; }
html { background: var(--otta-bg); scroll-behavior: smooth; }
body { min-width: 320px; overflow-x: clip; background: var(--otta-bg); color: var(--otta-text); }
:focus-visible { outline: 2px solid #a99cff; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}
```

- [ ] **Step 2: Convert the page shell, navigation, and footer**

Set `<html data-theme="otta-dark">`, make the body use the dark canvas, retain the sticky translucent nav, add `Get started` navigation, and theme the footer. Preserve every metadata, analytics, and route attribute.

- [ ] **Step 3: Reconcile narrative components**

Replace white/gray section backgrounds with transparent or raised dark surfaces, preserve headings/IDs/data iteration, and style the comparison table with a dark sticky header and clear Otta column. Correct Pipeline's visible count to five stages.

- [ ] **Step 4: Run the focused test**

Run: `rtk bun test tests/landing-restoration.test.ts`

Expected: dark-shell assertion PASS; test remains red for scenario/GetStarted.

- [ ] **Step 5: Commit the shell**

Run:

```bash
rtk git add src/styles/global.css src/pages/index.astro src/components/Philosophy.astro src/components/Pipeline.astro src/components/Differentiators.astro src/components/Memory.astro src/components/Comparison.astro
rtk git commit -m "design: restore continuous dark landing shell"
```

### Task 4: Restore the centered hero and scenario console

**Files:**
- Modify: `src/components/Hero.astro`
- Modify: `src/data/content.ts`
- Test: `tests/landing-restoration.test.ts`

- [ ] **Step 1: Define three honest scenario records**

Export scenarios keyed `gate-failure`, `visual-proof`, and `deploy-evidence`. Each record contains `label`, `issue`, and five short ledger lines that describe current workflow evidence. The default scenario must have meaningful HTML without JavaScript.

- [ ] **Step 2: Rebuild the hero layout from the approved baseline**

Use a centered eyebrow, gradient headline, compact description, two CTAs, atmospheric purple orbs, and a max-width console. Below it, retain current Pulse metric tiles and `data-pulse-metric`/`data-pulse-unit` attributes, fallbacks, 4-second fetch timeout, response validation, and bento emphasis.

- [ ] **Step 3: Add accessible scenario controls**

Render native buttons with `data-scenario-control`, `aria-pressed`, and `aria-controls`; render all panels with `data-scenario-panel`, and use Astro's `hidden={!isDefault}` so the first scenario is understandable without JavaScript. The script must toggle `hidden` and `aria-pressed`, support click/keyboard via native button behavior, and return early when nodes are absent.

- [ ] **Step 4: Keep optional motion isolated**

Move spotlight and orb motion behind `matchMedia('(prefers-reduced-motion: reduce)')`. An animation exception must not wrap or prevent the Pulse metric updater or scenario initialization.

- [ ] **Step 5: Run the focused test**

Run: `rtk bun test tests/landing-restoration.test.ts`

Expected: hero, scenario, and Pulse assertions PASS; GetStarted assertion remains red.

- [ ] **Step 6: Commit the hero**

Run:

```bash
rtk git add src/components/Hero.astro src/data/content.ts
rtk git commit -m "design: restore interactive dark hero"
```

### Task 5: Restore maintained two-path installation

**Files:**
- Create: `src/components/GetStarted.astro`
- Modify: `src/pages/index.astro`
- Test: `tests/landing-restoration.test.ts`

- [ ] **Step 1: Create two current installation cards**

Create `GetStarted.astro` with `id="get-started"`. The Claude Code card must display three separately copyable lines:

```text
/plugin marketplace add otta-build/plugin
/plugin install --scope user otta@otta
/otta:setup
```

Add a visible note to fully restart Claude Code after install. The Codex card must direct users to install Otta from the Codex Plugins surface and then run `$otta-setup`; state that Codex uses `$otta-*` skills, not `/otta:*` commands. Mention Pulse as the GitHub evidence/enforcement path without claiming a remote harness connector.

- [ ] **Step 2: Implement safe per-command copy controls**

Each button gets `data-copy-command` containing exactly one displayed command, an accessible label, and a sibling live status. On success, set the status to `Copied` and leave the command text unchanged; on failure, select the command text and set the status to `Select and copy`. Never create a combined copy-all command.

- [ ] **Step 3: Insert the section in the page flow**

Import `GetStarted` and render it after `Comparison` and before `Pricing`, then add a nav link to `#get-started`.

- [ ] **Step 4: Run the focused test**

Run: `rtk bun test tests/landing-restoration.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit installation restoration**

Run:

```bash
rtk git add src/components/GetStarted.astro src/pages/index.astro
rtk git commit -m "feat: restore current Otta setup paths"
```

### Task 6: Reconcile conversion and auxiliary surfaces

**Files:**
- Modify: `src/components/Pricing.astro`
- Modify: `src/components/PricingCard.astro`
- Modify: `src/components/Waitlist.astro`
- Modify: `src/components/FinalCta.astro`
- Modify: `src/pages/404.astro`
- Modify: `src/pages/privacy.astro`
- Modify: consent component found with `rg -l "cookie|consent" src`
- Test: `tests/crawlability.test.ts`
- Test: `tests/inline-script-syntax.test.ts`

- [ ] **Step 1: Theme pricing and conversion components**

Use the shared dark surface/border/focus tokens. Preserve pricing values, links, and conditional labels. In Waitlist, leave the form ID, input name/type, `/api/waitlist`, JSON payload, `get_access_requested`, success/reset behavior, and failure/email-retention behavior unchanged.

- [ ] **Step 2: Theme 404, privacy, and consent UI**

Apply the dark canvas and visible focus states while keeping 404 response behavior, privacy copy, consent storage/category semantics, and all control IDs/events unchanged.

- [ ] **Step 3: Verify browser-script and crawl contracts**

Run:

```bash
rtk bun test tests/inline-script-syntax.test.ts
rtk bun test tests/crawlability.test.ts
```

Expected: PASS for inline scripts, real 404, robots, sitemap, AI crawler rules, and JSON-LD.

- [ ] **Step 4: Commit conversion and auxiliary theming**

Run:

```bash
rtk git add src/components/Pricing.astro src/components/PricingCard.astro src/components/Waitlist.astro src/components/FinalCta.astro src/pages/404.astro src/pages/privacy.astro src
rtk git commit -m "design: finish dark conversion surfaces"
```

Before committing, use `rtk git diff --cached --stat` and `rtk git diff --cached --name-only` to ensure the broad final `src` path stages only scoped consent changes.

### Task 7: Full verification and visual proof

**Files:**
- Modify only if a discovered regression requires the smallest scoped fix.
- Create outside git: `output/playwright/landing-restoration/desktop-1440.png`
- Create outside git: `output/playwright/landing-restoration/mobile-390.png`
- Create outside git: `output/playwright/landing-restoration/no-js-1440.png`

- [ ] **Step 1: Run the full repository checks unpiped**

Run:

```bash
rtk bun test
rtk bun run build
```

Expected: all Bun tests PASS and Astro emits a successful production build. Do not pipe through `tail` or otherwise hide exit status.

- [ ] **Step 2: Serve the production build**

Run `rtk bun run preview -- --host 127.0.0.1` in a persistent terminal session and record the assigned port.

- [ ] **Step 3: Exercise desktop interactions at 1440 × 1000**

Verify the dark first viewport, each scenario button and ARIA state, each install-copy button, Pulse fallbacks/live update, nav anchors, consent actions, and waitlist validation/error behavior. Capture `desktop-1440.png` after fonts/layout settle.

- [ ] **Step 4: Exercise mobile at 390 × 844**

Verify no horizontal scrolling, 44px-class usable controls, stacked hero/metrics/pricing/install cards, and readable table overflow treatment. Capture `mobile-390.png`.

- [ ] **Step 5: Verify reduced motion and no JavaScript**

Emulate reduced motion and confirm orbs/reveals do not animate. Disable JavaScript, reload, confirm every section and the first scenario are visible, and capture `no-js-1440.png`.

- [ ] **Step 6: Verify auxiliary routes and status behavior**

Open `/privacy` and an unused path such as `/definitely-not-a-page`; confirm visual continuity and a real HTTP 404 for the latter. Confirm page metadata, JSON-LD, and OG image URLs remain present in built HTML.

- [ ] **Step 7: Compare against both references**

Compare the new screenshots with:

```text
/Users/wiselancer/dev/otta/output/playwright/landing-release-audit/last-pre-cutover-6756cbb5.png
/Users/wiselancer/dev/otta/output/playwright/landing-release-audit/current-dc939386.png
```

The result should recover the July centered gradient, all-dark continuity, and console rhythm while retaining the current proof strip, current routes, and current product language.

- [ ] **Step 8: Check the final diff and commit any verification fix**

Run:

```bash
rtk git status --short
rtk git diff origin/main...HEAD --stat
rtk git log --oneline origin/main..HEAD
```

If verification required code changes, rerun the focused test first, then the full suite and build, and commit with a message naming the repaired behavior. If no changes were needed, do not create an empty commit.

## Completion evidence

Completion requires all of the following in the handoff: branch and commit list; focused red-to-green test evidence; full Bun test count; build result; desktop/mobile/no-JS screenshot paths; interaction checklist result; unchanged deployment workflow confirmation; and an explicit statement that production has not been changed unless a separately authorized merge/deploy occurs.
