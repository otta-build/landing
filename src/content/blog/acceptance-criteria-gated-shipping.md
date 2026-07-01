---
title: "Why Otta gates every merge on acceptance criteria, not vibes"
description: "Inside the builder → reviewer → qa → devops pipeline: how Otta turns a one-line idea into production software that only ships when every acceptance criterion has real evidence behind it."
pubDate: 2026-07-01
---

Most "AI writes code" tools optimize for one thing: getting a diff that compiles. Otta optimizes for something harder — a diff that is *provably correct against a stated intent*, produced by a pipeline that cannot quietly skip the parts it finds inconvenient. That difference shows up nowhere more clearly than in how a single idea moves through Otta's four-stage execution pipeline: builder, reviewer, qa, and devops.

## The problem with "looks right"

Vibe coding is fast because it skips verification. An agent reads a prompt, writes some files, and the human skims the diff and says "looks right." That works for throwaway scripts. It fails for anything that has to survive contact with real users, real data, and real regressions — because "looks right" is not a falsifiable claim. Nobody can point to the moment it was checked.

Otta's answer is to make every unit of work start from a falsifiable contract instead of a prompt. Before a single line of implementation code is written, the work is expressed as a GitHub issue with an acceptance block: a GIVEN/WHEN/THEN scenario plus a list of checkbox acceptance criteria (ACs). Each AC has to describe an *observable, verifiable outcome* — not "improve performance" but "P95 API latency for `/leads` drops below 300ms under the existing k6 load profile." If an AC can't be falsified, it gets rewritten until it can.

## Four stages, one contract

The acceptance block is the contract every stage in the pipeline reads and writes against:

- **Builder** creates an isolated git worktree, writes the smallest failing test that captures the intended behavior, confirms it fails for the right reason, then implements the minimal code to pass it — TDD is not optional, and a passing typecheck is explicitly not accepted as test coverage.
- **Reviewer** re-runs the affected tests (never just the type checker), browser-verifies user-facing changes, and rejects any PR whose acceptance block still has unchecked boxes without a stated `[test-impractical: <reason>]` rationale.
- **QA** re-executes the verification plan on a real environment — staging or a preview deploy — and checks each AC off only when it has direct evidence: a passing test name, a screenshot, an HTTP response, a query result.
- **DevOps** promotes the change once every gate is green, and only then. Nothing merges on "the pipeline is probably fine."

Git-worktree isolation matters here as much as the review discipline does. Every task gets its own working tree and branch, so parallel agents — or a human and an agent working the same repo at the same time — never collide on uncommitted state or half-finished refactors. A task that fails halfway through leaves the main checkout untouched.

## What a real acceptance block looks like

This isn't an abstract idea — it's a literal artifact the pipeline produces and reads on every task. A trimmed example, close to what ships in an actual PR body:

```acceptance
GIVEN a merged PR that adds rate limiting to the /api/leads endpoint
WHEN a client exceeds 100 requests/minute from a single API key
THEN the endpoint returns 429 with a Retry-After header, and existing
     clients under the limit see zero behavior change

- [ ] AC1: requests beyond 100/min return HTTP 429 with Retry-After
- [ ] AC2: requests at or under the limit are unaffected (regression test)
- [ ] AC3: the limit is per-API-key, not global
```

Every checkbox is a promise the reviewer and QA stages have to independently confirm, not take on faith from the builder's own commit message. That asymmetry — the person (or agent) who writes the code is never the last one to sign off on whether it's correct — is the whole point.

## Why the gate matters more than the model

It's tempting to think shipping discipline is a solved problem once the underlying model gets good enough. It isn't. A better model still needs an external check for whether its own output satisfies the original intent, because "I believe this is correct" and "this is correct" are different claims, and only the second one survives production traffic. The gate is what converts a fast, cheap first draft into something a team can trust merging without re-reading every line.

This is also why the pipeline treats a failing gate as data, not friction. When QA catches a broken AC, that failure gets fed back — the flywheel that turns hard-won review findings into preflight rules so the same class of mistake doesn't reappear on the next task. Speed and rigor aren't a tradeoff here; the rigor is what makes the next run faster.

If you're evaluating AI coding tools by how quickly they produce a diff, you're measuring the wrong thing. The number that matters is how many of those diffs ship correct on the first real check — and that number only goes up when shipping is gated on evidence, not on vibes.
