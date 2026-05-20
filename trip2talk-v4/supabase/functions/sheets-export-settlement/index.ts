import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const GOOGLE_APPS_SCRIPT_URL = Deno.env.get('GOOGLE_APPS_SCRIPT_URL')!;
const GOOGLE_APPS_SCRIPT_TOKEN = Deno.env.get('GOOGLE_APPS_SCRIPT_TOKEN')!;

serve(async (req) => {
  const { tour_id } = await req.json();
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  const { data, error } = await supabase
    .from('tour_settlement')
    .select('*')
    .eq('tour_id', tour_id)
    .single();

  if (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const res = await fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'export_settlement',
      token: GOOGLE_APPS_SCRIPT_TOKEN,
      settlement: data,
    }),
  });
  const body = await res.json();
  return new Response(JSON.stringify({ success: res.ok, ...body }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
