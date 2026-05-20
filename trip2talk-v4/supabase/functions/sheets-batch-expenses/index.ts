import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const GOOGLE_APPS_SCRIPT_URL = Deno.env.get('GOOGLE_APPS_SCRIPT_URL')!;
const GOOGLE_APPS_SCRIPT_TOKEN = Deno.env.get('GOOGLE_APPS_SCRIPT_TOKEN')!;

serve(async (req) => {
  const { rows } = await req.json();
  const res = await fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'batch_expenses',
      token: GOOGLE_APPS_SCRIPT_TOKEN,
      rows,
    }),
  });
  const data = await res.json();
  return new Response(JSON.stringify({ success: res.ok, ...data }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
