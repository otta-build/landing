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
    name: "Idea & Session",
    summary: "An idea becomes a persistent session with memory.",
    detail:
      "Say what you want. Every raw idea is initialized as a dedicated session with its own memory. Teams can pause, resume, and move many sessions forward in parallel without context decay.",
    enforces: "No context is lost; your ideas compile into structured session streams.",
  },
  {
    step: "02",
    name: "Autonomous Build",
    summary: "AI executors build across isolated slots.",
    detail:
      "Specialized agents (such as Claude Code or Codex) spin up in their own git worktrees, executing tasks on autopilot without manual ticket-grooming.",
    enforces: "Parallel dev speed with zero risk of branch collisions.",
  },
  {
    step: "03",
    name: "Govern & Gate",
    summary: "GitHub-App-first merge-blocking verification.",
    detail:
      "Otta's native GitHub App enforces rigorous quality gates before a single line of code is integrated. Strict test-driven TDD, typechecks, and visual screenshot checks must pass.",
    enforces: "Hard quality gates — never polite suggestions in a prompt.",
  },
  {
    step: "04",
    name: "Measure & Telemetry",
    summary: "Continuous cycle-time and cost tracking.",
    detail:
      "Otta Pulse logs exact token/API expenses, cycle times, and review depth for every agent run, compiling live DORA metrics for execution visibility.",
    enforces: "Full budget accountability and quantitative performance ledger.",
  },
  {
    step: "05",
    name: "Self-Learn & Flywheel",
    summary: "Lessons compile back into preflight rules.",
    detail:
      "The system analyzes defects and failed runs, committing gotchas back into a git-canonical brain. Past errors automatically graduate into preflight guards so you never repeat a mistake.",
    enforces: "The platform gets cleaner, faster, and cheaper the longer it works.",
  },
];

// Core differentiators vs generic "AI writes code" tools.
export const differentiators = [
  {
    title: "GitHub-App-First Governance",
    body: "Otta installs as a native GitHub App. Merge-blocking checks, required visual evidence, and manual promotion gates are enforced at the repository level—meaning agents cannot self-approve or bypass rules.",
  },
  {
    title: "Persistent Session Memory",
    body: "Most agents start from scratch every run. Otta gives every idea a persistent session with memory, allowing teams to collaborate across parallel streams without repeating mistakes or losing context.",
  },
  {
    title: "Actionable Measurement",
    body: "Get real-time DORA metrics, PR cycle times, code quality trends, and exact token/API expense tracking. View exactly how much value your agent fleet is shipping and where they get blocked.",
  },
  {
    title: "The Self-Learning Flywheel",
    body: "Otta closes the loop between execution and intelligence. Hard-won code retro summaries and fixed bugs compile back into git-canonical brain rules, making future runs faster and cheaper.",
  },
  {
    title: "Vibe Coding, Production Quality",
    body: "Keep the speed, lose the chaos. Otta turns scattered, speculative vibe-coding sessions into a structured, reliable path to production-ready software.",
  },
  {
    title: "Data Sovereignty & Control",
    body: "Self-host on your own infrastructure. Your code, secrets, and agent memories remain completely under your control—by default, on every tier.",
  },
];

// Memory / brain layer.
export const memoryLayers = [
  {
    name: "Session memory",
    role: "Context-retentive workspace streams",
    detail:
      "Every new idea or task starts a persistent session with memory. Teams can pause, resume, and run dozens of tasks in parallel without context decay.",
  },
  {
    name: "Git brain",
    role: "Version-controlled wisdom ledger",
    detail:
      "Decisions, custom architecture guidelines, and bugfixes are stored directly in a private repository. High-signal, structured reference guidelines that agents never drift from.",
  },
  {
    name: "Flywheel",
    role: "Retro → preflight rule translation",
    detail:
      "Defects and failed runs are analyzed automatically. Hard-won retro lessons are translated directly into automated preflight checks, ensuring past mistakes are never repeated.",
  },
];

// Head-to-head comparison. `us` = this product, `them` = Factory.ai / generic agents.
export const comparisonRows = [
  {
    dimension: "Focus",
    us: "Governance, measurement, and learning layer wrapping existing execution agents",
    them: "Raw autonomous coding agents focused purely on file-writing",
  },
  {
    dimension: "Quality gates",
    us: "GitHub-App-first merge-blocking TDD, visual screenshots, and health checks",
    them: "Static file checks and code compilation only",
  },
  {
    dimension: "Memory",
    us: "Persistent sessions with memory + git-canonical brain for continuous self-learning",
    them: "Temporary task-based history; no cross-session recall",
  },
  {
    dimension: "Integration",
    us: "GitHub App, MCP Server, and CLI that fit inside your existing dev setup (Claude Code, Codex)",
    them: "Siloed web UI or proprietary desktop workspaces that force workflow migration",
  },
  {
    dimension: "Target audience",
    us: "Teams, small teams, founders, and builders who need delivery discipline",
    them: "Enterprise teams focused on ticket-to-code volume rather than quality gates",
  },
  {
    dimension: "Data control",
    us: "Self-hostable on your own infra, every tier",
    them: "On-prem is an Enterprise-only, custom-quote feature",
  },
];

export const philosophy = {
  quote: "From raw concept to production software — with adaptive gates.",
  body: "Otta turns vibe coding into a self-learning software factory. Instead of treating AI coding as a one-shot prompt, Otta gives every idea a structured production journey through adaptive quality gates — product clarity, implementation, tests, review, deployment, verification, and real-world feedback. Each gate checks, measures, and improves the work. When something breaks, fails, or produces poor results, Otta learns from that failure, adapts the gate, and prevents the same class of problem from happening again.",
};
