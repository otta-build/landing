// Cloudflare Pages Function — POST /api/waitlist
interface Env {
  WAITLIST: KVNamespace;
  NOTIFY_URL?: string;    // https://notify.petrenko.cv
  NOTIFY_SECRET?: string;
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

async function notify(env: Env, message: string) {
  if (!env.NOTIFY_URL || !env.NOTIFY_SECRET) return;
  await fetch(`${env.NOTIFY_URL}/send`, {
    method: "POST",
    headers: { "content-type": "application/json", "authorization": `Bearer ${env.NOTIFY_SECRET}` },
    body: JSON.stringify({ channel: "otta", message }),
  }).catch(() => {});
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
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

  const ref = request.headers.get("referer") ?? null;
  await env.WAITLIST.put(key, JSON.stringify({ email, ts: new Date().toISOString(), ref }));

  context.waitUntil(notify(env, `🟣 New Otta Cockpit request\n${email}\nref: ${ref ?? "direct"}`));

  return json({ ok: true });
};
