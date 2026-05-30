// ============================================================
// Supabase Edge Function — `vectorize`
// Cienki proxy: frontend → ta funkcja → Railway DRS image-tools service.
//
// ENV: DRS_TOOLS_URL = baza Railway
// Input  (POST JSON): { imageBase64, colorMode?:'color'|'bw', detail?:'low'|'medium'|'high', targetDPI?, inputDPI? }
// Output (JSON): { svg, pngBase64, pathCount, outputDPI, srcWidth, srcHeight, outWidth, outHeight, elapsed }
// verify_jwt = false
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
    const r = await fetch(base + '/vectorize', {
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
