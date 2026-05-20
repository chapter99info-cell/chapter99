import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
const RESEND_KEY  = Deno.env.get('RESEND_API_KEY')!;
const FROM_EMAIL  = Deno.env.get('FROM_EMAIL')!;

serve(async (req) => {
  const { to, subject, html, attachments } = await req.json();
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html, attachments }),
  });
  const data = await res.json();
  return new Response(JSON.stringify({ success: res.ok, id: data.id, error: data.message }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
