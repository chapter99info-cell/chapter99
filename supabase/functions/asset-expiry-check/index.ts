import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    return Response.json({ error: 'Supabase service secrets are not configured.' }, { status: 500, headers: corsHeaders });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const warningWindowDays = Number(Deno.env.get('ASSET_EXPIRY_WARNING_DAYS') ?? 30);
  const warningDate = new Date(Date.now() + warningWindowDays * 86_400_000).toISOString().slice(0, 10);

  const { data: assets, error } = await supabase
    .from('assets')
    .select('id, name, owner, expiry_date')
    .lte('expiry_date', warningDate)
    .order('expiry_date', { ascending: true });

  if (error) {
    return Response.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }

  const alerts = (assets ?? []).map((asset) => ({
    asset_id: asset.id,
    severity: new Date(asset.expiry_date) < new Date() ? 'critical' : 'warning',
    title: new Date(asset.expiry_date) < new Date() ? 'Asset expired' : 'Asset expiring soon',
    message: `${asset.name} for ${asset.owner} expires on ${asset.expiry_date}.`,
  }));

  if (alerts.length > 0) {
    const { error: insertError } = await supabase.from('alerts').upsert(alerts, {
      onConflict: 'asset_id,title',
      ignoreDuplicates: false,
    });

    if (insertError) {
      return Response.json({ error: insertError.message }, { status: 500, headers: corsHeaders });
    }
  }

  return Response.json({ checked: assets?.length ?? 0, alerts: alerts.length }, { headers: corsHeaders });
});
