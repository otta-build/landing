import type { APIRoute } from "astro";
import { getBuildSha } from "../lib/build-sha";

// otta-build/landing#16 — served at https://otta.build/build-info.json.
// `otta-deploy-verify.sh`'s deploy verifier fetches `deploy.health_url` and
// checks the deployed commit against the merge SHA, so this needs to exist
// and to carry the SHA that was actually built. `prerender = true` makes this
// a static endpoint: it runs once at build time (same as every other page),
// so the commit is baked into the artifact that ships, not computed per
// request against a stale running process.
export const prerender = true;

export const GET: APIRoute = () => {
  const commit = getBuildSha();
  return new Response(JSON.stringify({ commit }), {
    headers: { "content-type": "application/json" },
  });
};
