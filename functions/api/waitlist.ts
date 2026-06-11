// Cloudflare Pages Function — POST /api/waitlist
// Stores a waitlist signup in the WAITLIST KV namespace (bound in the Pages project)
// and fires a Telegram notification (via the Hermes bot) on each new signup.
interface Env {
  WAITLIST: KVNamespace;
  TELEGRAM_BOT_TOKEN?: string; // Hermes bot token (Pages secret)
  TELEGRAM_CHAT_ID?: string; // recipient chat id (Pages secret/var)
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

async function notifyTelegram(env: Env, email: string, ref: string | null) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return;
  const text = `🟣 New Otta waitlist signup\n${email}\nref: ${ref ?? "direct"}`;
  await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: env.TELEGRAM_CHAT_ID,
      text,
      disable_web_page_preview: true,
    }),
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

  // fire-and-forget notification — never blocks or fails the signup response
  context.waitUntil(notifyTelegram(env, email, ref));

  return json({ ok: true });
};
