// Cloudflare Pages Function — POST /api/waitlist
// Stores a waitlist signup in the WAITLIST KV namespace (bound in the Pages project).
interface Env {
  WAITLIST: KVNamespace;
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let email = "";
  try {
    const body = (await request.json()) as { email?: string };
    email = (body.email ?? "").trim().toLowerCase();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }
  if (!EMAIL_RE.test(email)) return json({ error: "Enter a valid email" }, 400);

  const key = `email:${email}`;
  const existing = await env.WAITLIST.get(key);
  if (existing) return json({ ok: true, already: true });

  await env.WAITLIST.put(
    key,
    JSON.stringify({
      email,
      ts: new Date().toISOString(),
      ref: request.headers.get("referer") ?? null,
    }),
  );
  return json({ ok: true });
};
