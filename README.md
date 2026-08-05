# otta-build/landing

This repository is the production source for https://otta.build.

Otta dispatches the exact merge commit through `.github/workflows/deploy.yml`
to the Cloudflare Pages project `otta`. Cloudflare git-integration builds are
disabled so this guarded workflow is the only production deploy path.

## Local development

```bash
bun install
bun run dev
```

## Verification

```bash
bun test
bun run test:e2e
bun run build
```

## Production deployment

The owner-approved `.otta.yml` contract merges a green pull request and
dispatches its exact merge commit to the production workflow. The workflow
builds the site, runs the full test suite, emits `/build-info.json`, verifies
that Cloudflare git integration is still disabled, and then runs:

```bash
bunx wrangler pages deploy dist --project-name otta --branch main
```

The workflow verifies that `/build-info.json` reports the dispatched commit
before Otta records the release as live. Do not bypass the gated pull-request
flow or deploy an unmerged local checkout to production.
