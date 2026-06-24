# ⚠️ otta-build/landing — NOT the deployed source

**The live otta.build site does NOT deploy from this repo.** This is a stale,
partial fork. Do not edit it expecting changes to reach production.

## Canonical source (edit + deploy here)

The live otta.build landing page is built and deployed from the **monorepo**:

```
~/dev/otta/apps/landing        (repo: wiselancer/otta — apps/landing)
```

Deploy (Cloudflare Pages project `otta`, direct-upload):

```bash
cd ~/dev/otta/apps/landing
bunx astro build
bunx wrangler pages deploy dist --project-name otta --branch main   # --branch main = production
```

## Why this repo exists

The 2026-06 org move (`otta-build/{plugin,pulse,cockpit,landing}`) created this
repo, but the landing page (like `apps/cockpit`) was never actually migrated out
of the monorepo — active development + deploys stayed there. Completing the split
(porting the live monorepo `apps/landing` into this repo and switching the CF
Pages source) is a deliberate future task, tracked separately. Until then, **this
repo is frozen; the monorepo is canonical.**
