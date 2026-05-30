// ============================================================
// Supabase Edge Function — `remove-bg`
// Cienki proxy: frontend → ta funkcja → Railway DRS image-tools service.
// Ciężka robota (sharp + AI) NIE może biec w Deno, więc forwardujemy do Railway.
// (architecture rule #13: mózg na serwerze; tu tylko bramka + CORS)
//
// ENV: DRS_TOOLS_URL = baza Railway (np. https://xxx.up.railway.app)
// Input  (POST JSON): { imageBase64, mode?:'auto'|'simple'|'flood'|'ai', tolerance? }
// Output (JSON): { resultBase64, method, bgColor, confidence, changed, width, height, elapsed }
// verify_jwt = false (Pączek's call dla optima — wejście to obraz, nie dane klienta)
// ============================================================
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'POST required' }, 405);

  const base = (Deno.env.get('DRS_TOOLS_URL') || '').replace(/\/$/, '');
  if (!base) return json({ error: 'DRS_TOOLS_URL not configured on server' }, 503);

  let body: unknown;
  try { body = await req.json(); } catch { return json({ error: 'invalid JSON body' }, 400); }

  try {
    const r = await fetch(base + '/remove-bg', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await r.text();
    return new Response(text, { status: r.status, headers: { ...CORS, 'Content-Type': 'application/json' } });
  } catch (e) {
    return json({ error: 'upstream (Railway) unreachable: ' + (e instanceof Error ? e.message : String(e)) }, 502);
  }
});
