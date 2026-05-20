const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SmsPayload {
  to: string;
  body: string;
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const fromNumber = Deno.env.get('TWILIO_FROM_NUMBER');

  if (!accountSid || !authToken || !fromNumber) {
    return Response.json({ error: 'Twilio secrets are not configured.' }, { status: 500, headers: corsHeaders });
  }

  const payload = (await request.json()) as SmsPayload;
  if (!payload.to || !payload.body) {
    return Response.json({ error: 'Missing "to" or "body".' }, { status: 400, headers: corsHeaders });
  }

  const credentials = btoa(`${accountSid}:${authToken}`);
  const form = new URLSearchParams({
    From: fromNumber,
    To: payload.to,
    Body: payload.body,
  });

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form,
  });

  const result = await response.json();
  return Response.json(result, { status: response.status, headers: corsHeaders });
});
