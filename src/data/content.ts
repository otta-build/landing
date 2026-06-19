// Structured landing-page content. Edit copy here.
import { BRAND } from "../config";

// Proof metrics — real numbers from shipping LeadCognition (a production AI SaaS)
// on this exact pipeline, 90-day window.
export const proofMetrics = [
  { value: "457", label: "merged PRs", sub: "last 90 days" },
  { value: "440", label: "production deploys", sub: "GitHub deployments" },
  { value: "7 min", label: "median PR cycle", sub: "open → merged" },
  { value: "2.8 min", label: "median CI loop", sub: "feedback speed" },
  { value: "210", label: "semver releases", sub: "auto-tagged" },
  { value: "6 / 3", label: "blockers caught", sub: "on 3 CI-green PRs" },
];

// The pipeline: what fires at each stage and what it ENFORCES.
export const pipelineStages = [
  {
    step: "01",
    name: "Describe → approve plan",
    summary: "Plain-language intent becomes a fully-specified, approvable plan.",
    detail:
      "Say what you want. The system writes an issue with a GIVEN/WHEN/THEN acceptance block, estimate, priority, and milestone. You approve the plan — the first of two human gates — and the autonomous run begins.",
    enforces: "Human gate #1: you sign off the plan before any code exists.",
  },
  {
    step: "02",
    name: "Isolate",
    summary: "One agent, one git worktree, zero collisions.",
    detail:
      "Every issue builds in its own worktree on its own dev slot. Many issues run in parallel without stepping on each other.",
    enforces: "Parallel work that never corrupts a shared branch.",
  },
  {
    step: "03",
    name: "Build · test-first",
    summary: "The failing test is written before the code.",
    detail:
      "The builder writes the smallest red test, makes it green, then typechecks and opens a PR. Typecheck is not test coverage — and the pipeline knows the difference.",
    enforces: "No production change ships without a test that proves it.",
  },
  {
    step: "04",
    name: "Review · prove it",
    summary: "Runs the tests, opens the browser, checks the criteria.",
    detail:
      "The reviewer re-runs the focused tests, browser-verifies the happy path plus loading / empty / error states, and rejects any PR whose acceptance boxes lack real evidence.",
    enforces: "Visual + behavioral proof, not “it compiles.”",
  },
  {
    step: "05",
    name: "Approve promote → ship",
    summary: "You approve the promote; the serialized merge ships, verified live.",
    detail:
      "A CI-green batch waits on staging behind a strict gate. You approve the promote — the second and final human gate — and merges hit main one at a time. The deploy waits until the live health endpoint reports the exact merged commit before anything else moves.",
    enforces: "Human gate #2: nothing reaches production until you approve it.",
  },
  {
    step: "06",
    name: "Release · zero ritual",
    summary: "Merge → semver tag → GitHub Release → release ledger.",
    detail:
      "The next version is computed from commit prefixes, tagged, and turned into a GitHub Release and a Linear release entry automatically.",
    enforces: "A complete, named release history with no manual steps.",
  },
];

// Core differentiators vs generic "AI writes code" tools.
export const differentiators = [
  {
    title: "Gates that don’t drift",
    body: "TDD, acceptance criteria, and review threads are enforced as CI checks and agent FAIL conditions — not polite suggestions in a prompt. Prompts drift. Gates don’t.",
  },
  {
    title: "Visual verification, built in",
    body: "User-facing work isn’t done until a real screenshot of the happy, loading, empty, and error states has been checked. A DOM measurement is not a picture.",
  },
  {
    title: "Memory that compounds",
    body: "A git-canonical brain plus a cross-agent semantic recall bus means your agents remember decisions, gotchas, and dead-ends — across sessions and across tools.",
  },
  {
    title: "Self-host the whole thing",
    body: "Built on Jean (Apache-2.0). Your repos, your infra, your data — by default, on every tier. Data control isn’t an enterprise upsell.",
  },
  {
    title: "Parallel build, serial integration",
    body: "Many issues build at once in isolated worktrees; they land on main one verified merge at a time. Speed where it’s safe, discipline where it counts.",
  },
  {
    title: "Proof, not promises",
    body: "This pipeline ships a real production SaaS every day. The metrics on this page are its own 90-day delivery record — not a demo.",
  },
];

// Memory / brain layer + the measure → learn flywheel.
export const memoryLayers = [
  {
    name: "Ledger",
    role: "Every run, measured",
    detail:
      "Otta records each run — time, tokens, tool calls, and cost — as an append-only event ledger. You see exactly what every shipped change took to build.",
  },
  {
    name: "Brain",
    role: "Canonical, exact-text project knowledge",
    detail:
      "Decisions, gotchas, and standing rules live in a version-controlled git repo. One hop to current truth, one hop to the reasoning behind it.",
  },
  {
    name: "Recall bus",
    role: "Cross-agent semantic memory",
    detail:
      "A self-hosted vector memory lets any agent — in any session, on any backend — recall what another already learned. Fuzzy search over hard-won context.",
  },
  {
    name: "Signal gate",
    role: "High-signal by design",
    detail:
      "The default is to write nothing. Only durable signal is captured — decisions, fixes, failed approaches — so recall stays sharp instead of drowning in transcripts.",
  },
];

// The flywheel — execute, measure, learn, improve. Learn → improve is the
// direction Otta is built toward (roadmap), not a delivered guarantee.
export const flywheel = {
  eyebrow: "The flywheel",
  heading: "It measures every run — and is built to get cheaper and cleaner over time.",
  body: "Otta already does the first half of the loop: it executes behind the gates and measures what each run costs. The platform is designed to close the loop — turning that telemetry into lessons that feed the next run’s plan and graduate proven patterns into new gates. The longer it runs on your codebase, the sharper the guard-rails are meant to get.",
  steps: [
    { name: "Execute", detail: "Run the work behind the gates.", live: true },
    { name: "Measure", detail: "Capture time, cost, and defects per run.", live: true },
    { name: "Learn", detail: "Distill telemetry into durable lessons.", live: false },
    { name: "Improve", detail: "Feed lessons into plans; graduate patterns into gates.", live: false },
  ],
};

// Head-to-head comparison. `us` = this product, `them` = Factory.ai / generic agents.
export const comparisonRows = [
  {
    dimension: "Quality gate",
    us: "Enforced TDD + visual + acceptance gate — proven after the work runs",
    them: "“Agent-readiness” = static file-existence checks, before the work runs",
  },
  {
    dimension: "Memory",
    us: "Git-canonical brain + cross-agent semantic recall of decisions",
    them: "Filesystem persistence — no curated decision knowledge",
  },
  {
    dimension: "Data control",
    us: "Self-hostable on your infra, every tier",
    them: "On-prem is an Enterprise-only, custom-quote feature",
  },
  {
    dimension: "Built for",
    us: "Solo founders & 1–5 person teams shipping like a senior org",
    them: "Enterprise / mid-market; little for small teams",
  },
  {
    dimension: "Cost",
    us: "Predictable, flat plans",
    them: "Token metering reviewers call “a blackhole”",
  },
  {
    dimension: "Tooling",
    us: "Linear / GitHub / GitLab as configuration",
    them: "Tightly coupled to GitHub + Jira",
  },
  {
    dimension: "Human checkpoints",
    us: "Acceptance + screenshot evidence gate the merge",
    them: "Background agents; wrong assumptions surface at PR review",
  },
];

export const philosophy = {
  quote: "Prompts drift. Gates don’t.",
  body: `${BRAND} doesn’t bet quality on a clever prompt or a bigger model. The rules that keep code correct — a failing test first, a screenshot of every state, acceptance criteria that map to a real check — are wired into the pipeline as gates that can’t be skipped, no matter which agent or model does the work. That’s what makes the autonomy safe: you approve the plan and the promote, and the gates hold the line on everything in between.`,
};
