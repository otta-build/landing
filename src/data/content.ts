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
    name: "Describe",
    summary: "Plain-language intent becomes a fully-specified issue.",
    detail:
      "Say what you want. The system writes a Linear issue with a GIVEN/WHEN/THEN acceptance block, estimate, priority, and milestone — no ticket-grooming ceremony.",
    enforces: "Acceptance criteria exist before any code does.",
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
    name: "Ship · health-gated",
    summary: "Serialized merge, verified live before the next one.",
    detail:
      "Merges hit main one at a time. The deploy waits until the live health endpoint reports the exact merged commit before anything else moves.",
    enforces: "The thing that deployed is the thing you reviewed.",
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

// Memory / brain layer.
export const memoryLayers = [
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
  quote: "Eliminate comprehension debt.",
  body: `Historically, relying solely on detached LLM prompts introduced a high level of "comprehension debt," where developers struggled to keep up with verifying messy or unaligned AI outputs. Otta forces agents to adhere strictly to human-authored technical specifications. By incorporating automated QA checkpoints, self-reflection loops, and reputation tracking, it allows agents to autonomously execute heavy software engineering tasks while keeping the developer strictly "above the loop" as an architectural gatekeeper.`,
};
