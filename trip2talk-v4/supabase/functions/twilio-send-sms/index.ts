import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
const ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')!;
const AUTH_TOKEN  = Deno.env.get('TWILIO_AUTH_TOKEN')!;
const FROM        = Deno.env.get('TWILIO_FROM_NUMBER')!;

serve(async (req) => {
  const { to, message } = await req.json();
  const url  = `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`;
  const body = new URLSearchParams({ To: to, From: FROM, Body: message });
  const res  = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': 'Basic ' + btoa(`${ACCOUNT_SID}:${AUTH_TOKEN}`), 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const data = await res.json();
  return new Response(JSON.stringify({ success: res.ok, sid: data.sid, error: data.message }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
