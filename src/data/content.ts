// Structured landing-page content. Edit copy here.
import { BRAND } from "../config";

// Proof metrics (OTT-70).
//
// These were hardcoded for months and drifted badly — measured against the
// 90-day window they claimed, "457 merged PRs" was really 1,386 and "210
// releases" was really 813. They now read from Pulse's public /status
// endpoint at runtime, so the page cannot go stale again.
//
// `fallback` is what renders server-side and whatever survives if the fetch
// fails: real figures, captured 2026-08-02, deliberately rounded DOWN so the
// static path can never overstate. `key` is the field on /status; `unit`
// tells the client how to format it.
export const PULSE_STATUS_URL = "https://pulse.otta.build/status";

export const proofMetrics = [
  { key: "pr_merged", fallback: "1,750", label: "merged PRs", sub: "all time" },
  { key: "deploy_tag", fallback: "960", label: "releases", sub: "auto-tagged" },
  {
    key: "pr_cycle_p50_minutes",
    // 8.7 measured from live Pulse once the field shipped, rounded down. The
    // first value here was a guess made before the endpoint could answer.
    fallback: "8 min",
    label: "median PR cycle",
    sub: "open → merged",
    unit: "min" as const,
  },
  { key: "gate_verdict", fallback: "2,650", label: "gate verdicts", sub: "enforced at merge" },
  { key: "issue_shipped", fallback: "560", label: "issues shipped", sub: "idea → production" },
  { key: "repos", fallback: "65", label: "repos watched", sub: "live" },
];

export const buildScenarios = [
  {
    key: "gate-failure",
    label: "Gate failure",
    issue: "PR #184 · authentication regression",
    status: "Merge blocked",
    lines: [
      ["builder", "Regression test added and implementation submitted"],
      ["reviewer", "Acceptance evidence matches 4 of 5 criteria"],
      ["qa", "Session expiry path fails in the real browser"],
      ["pulse", "gate_verdict: fail · merge remains blocked"],
      ["next", "Return the exact failure to the builder"],
    ],
  },
  {
    key: "visual-proof",
    label: "Visual proof",
    issue: "PR #190 · responsive results grid",
    status: "Evidence ready",
    lines: [
      ["builder", "Focused regression test passes"],
      ["reviewer", "Scope and acceptance criteria verified"],
      ["qa", "Desktop and 390px screenshots attached"],
      ["pulse", "visual evidence receipt linked to the PR"],
      ["next", "DevOps stage can evaluate release readiness"],
    ],
  },
  {
    key: "deploy-evidence",
    label: "Deploy evidence",
    issue: "Release v1.12.0 · Apache plugin",
    status: "Verified release",
    lines: [
      ["builder", "Claude Code commands and Codex skills packaged"],
      ["reviewer", "Public install surfaces confirmed"],
      ["devops", "Tag, artifact, and deployment evidence recorded"],
      ["pulse", "deploy_tag joined to its originating pull request"],
      ["next", "Shipped and verified are visible as separate states"],
    ],
  },
] as const;

// The pipeline: what fires at each stage and what it ENFORCES.
export const pipelineStages = [
  {
    step: "01",
    name: "Define",
    summary: "Turn intent into a testable delivery contract.",
    detail:
      "Start from a real issue with falsifiable acceptance criteria, explicit scope, and a verification plan the whole delivery loop can carry forward.",
    enforces: "The builder and reviewer work from the same acceptance contract.",
  },
  {
    step: "02",
    name: "Build",
    summary: "Run Otta inside the coding harness you already use.",
    detail:
      "Native Claude Code commands and Codex skills guide test-first implementation in an isolated branch or worktree without forcing a separate coding environment.",
    enforces: "A failing check comes before the smallest implementation that passes it.",
  },
  {
    step: "03",
    name: "Specialist review",
    summary: "Four roles examine the change from different angles.",
    detail:
      "The delivery path moves through builder → reviewer → qa → devops. Each specialist produces evidence for its own concern instead of letting the author self-approve.",
    enforces: "Implementation, specification, user experience, and release readiness stay distinct.",
  },
  {
    step: "04",
    name: "Enforce",
    summary: "Pulse carries lifecycle evidence into GitHub.",
    detail:
      "Otta Pulse reconstructs the issue-to-PR lifecycle from GitHub events and reports merge-gate verdicts, so repository policy does not depend on a prompt being remembered.",
    enforces: "Acceptance, test, review, and visual evidence can block a premature merge.",
  },
  {
    step: "05",
    name: "Verify & learn",
    summary: "Close the loop with release evidence and reviewed lessons.",
    detail:
      "Release tags and deployment checks complete the delivery record. High-signal lessons can be promoted through explicit LEARN receipts instead of silently rewriting project rules.",
    enforces: "Shipped, deployed, and verified remain separate, inspectable states.",
  },
];

// Core differentiators vs generic "AI writes code" tools.
export const differentiators = [
  {
    title: "Harness-native delivery",
    body: "Use the Otta plugin in Claude Code or the Otta skills in Codex. The workflow lives where the agent already works instead of moving your code into a proprietary cockpit.",
  },
  {
    title: "GitHub-enforced evidence",
    body: "Pulse turns acceptance criteria, tests, reviews, visual proof, and lifecycle events into repository-level verdicts that an implementation agent cannot approve for itself.",
  },
  {
    title: "Specialist separation",
    body: "Builder, reviewer, QA, and DevOps are four specialist stages with different responsibilities. A green typecheck cannot masquerade as product or release verification.",
  },
  {
    title: "Traceable lifecycle",
    body: "Issue, branch, pull request, release, and deploy events stay linked. Pulse exposes what merged and shipped without asking a harness to remember the history.",
  },
  {
    title: "Evidence before confidence",
    body: "Otta asks for the smallest failing test, real browser proof for UI work, and explicit deploy evidence. Completion is a demonstrated state, not an agent's closing sentence.",
  },
  {
    title: "Reviewable learning",
    body: "Optional telemetry and LEARN receipts surface reusable lessons for review. They do not silently mutate the rules or pretend the separate autonomous-engine roadmap is already shipped.",
  },
];

// Memory / brain layer.
export const memoryLayers = [
  {
    name: "Acceptance record",
    role: "Issue → branch → pull request",
    detail:
      "A fenced acceptance block carries the same testable intent from the issue into implementation, review, and the final pull request evidence.",
  },
  {
    name: "Pulse ledger",
    role: "GitHub lifecycle reconstruction",
    detail:
      "GitHub events connect issues, verdicts, merged pull requests, version tags, and deployments so the delivery state remains inspectable across agent runs.",
  },
  {
    name: "LEARN receipt",
    role: "Reviewed improvement signal",
    detail:
      "When a failure reveals a durable pattern, Otta can package the lesson for explicit review and promotion into repository knowledge or a deterministic guard.",
  },
];

// Head-to-head comparison. `us` = this product, `them` = Factory.ai / generic agents.
export const comparisonRows = [
  {
    dimension: "Focus",
    us: "Delivery control and evidence around the coding agents your team already uses",
    them: "A replacement coding environment optimized for autonomous task execution",
  },
  {
    dimension: "Quality gates",
    us: "Acceptance, regression, review, visual, and release evidence enforced through the repository workflow",
    them: "Checks vary by platform and often remain inside the agent run",
  },
  {
    dimension: "Review model",
    us: "Builder → reviewer → qa → devops as distinct specialist stages",
    them: "The same agent loop may build, judge, and declare completion",
  },
  {
    dimension: "Integration",
    us: "Native Claude Code plugin, Codex skills, and Pulse GitHub enforcement",
    them: "Siloed web UI or proprietary desktop workspaces that force workflow migration",
  },
  {
    dimension: "Target audience",
    us: "Teams, small teams, founders, and builders who need delivery discipline",
    them: "Enterprise teams focused on ticket-to-code volume rather than quality gates",
  },
  {
    dimension: "Completion evidence",
    us: "Merged, released, deployed, and verified remain separate lifecycle states",
    them: "Task completion is commonly reported at code or pull-request creation",
  },
];

export const philosophy = {
  quote: "Let agents move fast. Make the evidence keep up.",
  body: "Otta is the delivery control plane around Claude Code and Codex. Native workflows guide the work from a real issue through test-first implementation and specialist review; Pulse carries the evidence into GitHub and keeps merged, released, deployed, and verified states honest.",
};
