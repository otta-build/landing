import type { APIRoute } from "astro";
import { SITE } from "../config";
import { answerPages } from "../data/answers";

/**
 * /llms.txt — a plain-text map of the site for assistants.
 *
 * Generated from `answerPages` rather than checked in as a static file. A
 * hand-maintained copy is a promise to update two things whenever one changes,
 * and the failure is silent: the file still serves 200 while pointing at a
 * page that no longer exists, or omitting one that does.
 */
export const GET: APIRoute = () => {
  const url = (path: string) => new URL(path, SITE.website).href;

  const body = `# ${"Otta"}

> ${SITE.subtitle}

Otta runs autonomous coding agents inside GitHub. Work is picked up from an
issue, built by an execution agent in an isolated git worktree, and shipped as
an ordinary pull request that cannot merge until a required Check Run — the
Otta Gate — passes. The gate aggregates CI status, a machine-readable
acceptance block, a lifecycle link back to the originating issue, coverage, a
secret scan of the diff, and a check for previously reopened or reverted work.

## Answers

${answerPages
  .map((p) => `- [${p.prompt}](${url(`/${p.slug}/`)}): ${p.directAnswer}`)
  .join("\n\n")}

## Site

- [Homepage](${url("/")}): ${SITE.tagline}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
