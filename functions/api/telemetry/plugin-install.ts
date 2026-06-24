// Cloudflare Pages Function — POST /api/telemetry/plugin-install
// Anonymous ping from the Otta plugin install-git-hooks.sh.
interface Env {
  WAITLIST: KVNamespace;
  NOTIFY_URL?: string;
  NOTIFY_SECRET?: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
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
  const { env } = context;
  const today = new Date().toISOString().slice(0, 10);
  const countKey = `plugin-install-count:${today}`;

  const existing = await env.WAITLIST.get(countKey);
  const count = existing ? parseInt(existing, 10) + 1 : 1;
  await env.WAITLIST.put(countKey, String(count), { expirationTtl: 60 * 60 * 24 * 90 });

  if (count === 1) {
    context.waitUntil(notify(env, `🔌 First Otta plugin install today (${today})`));
  }

  return json({ ok: true });
};

export const onRequestOptions: PagesFunction = () =>
  new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
    },
  });
