# Otta Dark Landing Restoration Design

## Objective

Restore the visual experience that was live in Cloudflare deployment `6756cbb5`
while keeping the maintained `otta-build/landing` repository and all useful
functional releases that landed afterward.

This is a selective presentation migration. It is not a git rollback, a
Cloudflare rollback, or a wholesale copy of old source files.

## Approved visual baseline

The approved baseline is Option A: the July all-dark landing page represented by
Cloudflare deployment `6756cbb5` and the source lineage ending at landing commit
`971ce72` (`feat(landing): dark redesign, scenario arrow fix, scroll reveals,
modal`).

The baseline contributes:

- centered gradient hero;
- interactive build-scenario console;
- continuous dark page background and surface treatment;
- dark architecture, comparison, pricing, access, and footer sections;
- the two-path installation section;
- restrained purple glow, borders, typography hierarchy, and motion language.

The screenshot is a visual reference, not a pixel-perfect requirement where it
conflicts with accessibility, current content, or maintained functionality.

## Architecture

Current `main` at `508bd3a` remains the source of truth. Old components and CSS
are consulted as donors and reconciled manually into current components.

The restoration follows three boundaries:

1. **Presentation:** selectively port dark tokens, layout, surfaces, responsive
   behavior, and scenario interactions from `971ce72`.
2. **Content and data:** retain current copy, pricing data, live Pulse metrics,
   current install commands, and current routes unless a small copy reduction is
   required to fit the approved layout.
3. **Platform safeguards:** retain current analytics, consent, SEO, crawlability,
   build, and deployment behavior without reimplementation from old code.

No current file is replaced wholesale. Each component is reconciled against both
refs, with current behavior kept when the versions disagree.

## Current releases that must be preserved

| Capability | Current source/evidence | Preservation rule |
| --- | --- | --- |
| Live Pulse proof metrics | `src/components/Hero.astro` and current `/status` integration | Keep data attributes, fetch behavior, fallbacks, labels, and bento emphasis; restyle only. |
| Correct measured fallback | commit `53e1b4a` | Keep the measured PR-cycle fallback. |
| Crawlability and real 404 | `public/robots.txt`, `src/pages/404.astro`, `tests/crawlability.test.ts` | Preserve unchanged unless dark styling is added to the 404 page. |
| Social sharing metadata | `public/og.png` and current head metadata | Preserve current OG asset and metadata. |
| PostHog initialization and events | current `src/pages/index.astro` and waitlist capture | Preserve initialization and event names. |
| Inline-script syntax guard | `tests/inline-script-syntax.test.ts` | Preserve and keep in CI/deploy gates. |
| Consent and privacy | current consent banner behavior and `/privacy` route | Preserve behavior; only theme the visible UI. |
| Deployment authority | `.github/workflows/deploy.yml` | Preserve the single GitHub Actions direct-upload path and the git-integration-disabled check. |
| SEO/GEO routes | current pages, JSON-LD, sitemap, and reusable head behavior | Preserve routes and generated outputs. |
| Waitlist submission | current waitlist component and API path | Preserve request flow, validation, success state, and analytics capture. |
| Current install commands | current plugin installation copy | Restore the two-path layout around current commands; never restore stale command strings. |

## Content truth and current positioning

The restoration may improve homepage copy where the current or historical page
conflicts with verified product state. Copy must follow the 2026-08-04 product
surface audit and current repository releases:

- lead with Otta as the harness-agnostic agent delivery control plane;
- describe Pulse as the GitHub enforcement, evidence, and lifecycle spine;
- describe the Apache plugin as the native workflow surface for Claude Code and
  Codex;
- call `builder -> reviewer -> qa -> devops` four specialist stages, never four
  total gates, layers, integrations, or capabilities;
- distinguish local workflows, Pulse enforcement, optional telemetry, and LEARN
  receipts from the separate autonomous-engine roadmap;
- do not present the dormant Jean-derived Cockpit as active;
- do not claim a shipped remote cloud-harness connector;
- do not use volatile event or performance counts as durable claims. Live Pulse
  figures may remain in the proof strip because they are fetched and labeled as
  current evidence with static measured fallbacks.

Copy changes remain bounded to accuracy, hierarchy, and fit within the restored
layout. They do not introduce new pricing, packaging, or market-positioning
decisions.

## Component design

### Global visual system

`src/styles/global.css` receives the dark color tokens, border system, shadows,
gradient accents, typography rhythm, and responsive spacing derived from the
approved baseline.

The page defaults to readable dark surfaces without JavaScript. Motion is a
progressive enhancement. Content must never start permanently hidden.

### Hero and proof strip

`src/components/Hero.astro` regains the centered gradient headline, atmospheric
background, compact CTA group, and interactive scenario console. The console
uses the old interaction model but current claims and install/product language.

The current architecture cards and Pulse metrics remain. Their visual treatment
becomes dark and integrated with the hero. The two most important proof metrics
retain the current bento emphasis.

### Narrative sections

`Pipeline.astro`, `Differentiators.astro`, `Memory.astro`, `Comparison.astro`,
and `Philosophy.astro` retain their current semantic content and DOM landmarks.
They adopt the old dark section rhythm, cards, highlighted callouts, and table
treatment.

### Pricing and conversion

`Pricing.astro`, `PricingCard.astro`, `Waitlist.astro`, and `FinalCta.astro`
retain current data and behaviors while adopting the approved dark surfaces.
Focus, hover, error, loading, and success states must remain visually distinct.

### Installation section

Restore `GetStarted.astro` as a maintained component, using current plugin and
access instructions. Each command remains individually copyable. The old
paste-trap, stale `/plugin install` syntax, and combined copy-all behavior must
not return.

### Consent, privacy, 404, and auxiliary routes

Theme the consent banner and 404 page so they no longer appear visually detached
from the restored landing page. Do not change consent semantics, privacy copy,
status codes, metadata, or route behavior.

## Interaction and accessibility

- Scenario controls work with mouse, keyboard, and touch.
- Selected scenario state is exposed with appropriate ARIA state.
- Copy buttons announce success without replacing the command text.
- Focus indicators meet the dark background with visible contrast.
- Text and essential controls meet WCAG AA contrast.
- `prefers-reduced-motion: reduce` disables reveal, orb, and scenario transition
  motion without hiding content.
- With JavaScript disabled or failed, every section remains visible and the first
  scenario remains understandable.
- Mobile layouts avoid horizontal overflow and preserve usable tap targets.

## Data flow and failure handling

The Pulse metric data flow remains unchanged: current static fallbacks render in
HTML, client-side code requests live status, validates the response, and updates
matching metric nodes. Network, schema, or timeout failures leave the measured
fallbacks visible.

The waitlist flow remains unchanged. Visual work must not alter endpoint,
payload, validation, or event names. Failure states display inline and retain the
entered email where current behavior does so.

Scenario and reveal enhancements fail open. An exception in optional animation
code must not prevent metrics, CTAs, install commands, or page content from
rendering.

## Testing and verification

Implementation follows the repository test-first rule.

1. Add the smallest failing structural checks for the restored hero, scenario
   controls, two-path installation section, and progressive-enhancement contract.
2. Run the focused test and confirm it fails for the intended missing behavior.
3. Implement the smallest component migration that passes it.
4. Preserve and run `crawlability.test.ts` and `inline-script-syntax.test.ts`.
5. Run the full repository test target and production build.
6. Serve the production build and capture staging-sized desktop and mobile
   screenshots.
7. Compare the screenshots with deployment `6756cbb5` and current production.
8. Exercise scenario switching, copy buttons, consent actions, waitlist states,
   reduced motion, no-JavaScript visibility, `/privacy`, and a nonexistent route.

## Visual acceptance criteria

- At 1440px, the first viewport clearly matches the approved centered,
  purple-gradient, dark baseline.
- Dark continuity persists through the final conversion section; no white bands
  from current production remain on the homepage.
- The scenario console is legible and interactive rather than decorative.
- The current Pulse proof metrics remain visible and numerically correct.
- At 390px, hero, metrics, cards, pricing, install paths, and conversion controls
  stack without clipping or horizontal scrolling.
- No section disappears before scrolling or when JavaScript is disabled.
- Current crawlability, analytics guard, metadata, routes, and deployment checks
  remain green.

## Delivery

Work occurs on an isolated branch based on current `origin/main`. A preview and
before/after screenshots are reviewed before merging. Production changes only
through the repository's maintained `main` deployment workflow; no manual
rollback or direct production upload is part of this restoration.

## Out of scope

- New pricing or packaging decisions
- A broad copywriting or positioning rewrite
- Changes to Pulse APIs or metric definitions
- New analytics vendors or events unrelated to restored interactions
- Cockpit restoration or other Otta product surfaces
