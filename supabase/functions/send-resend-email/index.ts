const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const apiKey = Deno.env.get('RESEND_API_KEY');
  const fromEmail = Deno.env.get('RESEND_FROM_EMAIL');

  if (!apiKey || !fromEmail) {
    return Response.json({ error: 'Resend secrets are not configured.' }, { status: 500, headers: corsHeaders });
  }

  const payload = (await request.json()) as EmailPayload;
  if (!payload.to || !payload.subject || !payload.html) {
    return Response.json({ error: 'Missing "to", "subject", or "html".' }, { status: 400, headers: corsHeaders });
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    }),
  });

  const result = await response.json();
  return Response.json(result, { status: response.status, headers: corsHeaders });
});
