import { serve }        from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const OWNER_PHONE  = Deno.env.get('OWNER_PHONE')!;
const TWILIO_SID   = Deno.env.get('TWILIO_ACCOUNT_SID')!;
const TWILIO_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')!;
const TWILIO_FROM  = Deno.env.get('TWILIO_FROM_NUMBER')!;

serve(async () => {
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  const { data: assets } = await supabase.from('assets').select('*').eq('is_active', true);
  const today = new Date();

  for (const asset of assets ?? []) {
    const days = Math.ceil((new Date(asset.expiry_date).getTime() - today.getTime()) / 86400000);
    const send = async (msg: string) => {
      await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`, {
        method: 'POST',
        headers: { 'Authorization': 'Basic ' + btoa(`${TWILIO_SID}:${TWILIO_TOKEN}`), 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ To: OWNER_PHONE, From: TWILIO_FROM, Body: msg }),
      });
    };
    if (days <= 30 && days > 7 && !asset.alert_30d_sent) {
      await send(`TRIP2TALK: ${asset.name} expires in ${days} days (${asset.expiry_date}). Renew to avoid trip blocks.`);
      await supabase.from('assets').update({ alert_30d_sent: true }).eq('id', asset.id);
    }
    if (days <= 7 && days >= 0 && !asset.alert_7d_sent) {
      await send(`URGENT TRIP2TALK: ${asset.name} expires in ${days} days! Trip creation WILL be blocked on expiry.`);
      await supabase.from('assets').update({ alert_7d_sent: true }).eq('id', asset.id);
    }
  }
  return new Response(JSON.stringify({ checked: assets?.length ?? 0 }), { headers: { 'Content-Type': 'application/json' } });
});
