# otta.build landing

The marketing site for [otta.build](https://otta.build). Astro, deployed to
Cloudflare Pages.

## Canonical as of 2026-07-31

This repo is the source of truth again. It previously carried a note saying it
was **not** canonical, because live otta.build deployed from `apps/landing/` in
the `otta-build/dev` monorepo. That is being reversed deliberately.

**Why:** Otta's autonomous SEO/GEO loop only acts on repos that pass
`repo_tier.is_autonomy_eligible` — a standalone Astro site with `astro.config.*`
at the root and no `workspaces` key in `package.json`. The check is structural
on purpose: *"a repo that later gains app code next to its Astro site should
immediately stop qualifying, without anyone needing to remember to update a
config flag."*

`otta-build/dev` fails it on both counts — its Astro config lives at
`apps/landing/` and its root `package.json` declares workspaces — because it
also holds the Tauri desktop app and the plugin submodule. That is the check
working correctly: an auto-merging agent should not hold write access to a repo
full of application code.

Moving the site here is what makes autonomous SEO possible for otta.build
without weakening that boundary.

## Develop

```sh
bun install
bun run dev      # http://localhost:4321
bun run build
```

## Deploy

Cloudflare Pages builds and deploys this repo directly from git — no GitHub
Actions workflow, no API token, no runner. Push to `main` deploys production;
every PR gets its own preview URL automatically.

Build settings live in the Pages project (`otta`), not in this repo:
`build_command: bun run build`, `destination_dir: dist`. Node comes from
`.node-version` (Astro needs >= 22.12).

**Do not run `wrangler pages deploy` by hand.** It bypasses git and
reintroduces live/repo drift, and the Pages API token can write every project
in the account — a manual deploy has previously clobbered both otta.build and
dataforgtm.ai, which then needed restoring via the rollback API.

## Ownership

See `docs/repo-ownership.md` in `otta-build/dev` for the full per-app table.
