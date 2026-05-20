# Deployment Notes

## Supabase SQL

Run the SQL files in order:

1. `supabase/sql/00_extensions.sql`
2. `supabase/sql/01_core_tables.sql`
3. `supabase/sql/02_policies.sql`
4. `supabase/sql/03_seed_data.sql`

## Edge Function secrets

Configure these secrets before deploying Edge Functions:

```sh
supabase secrets set TWILIO_ACCOUNT_SID=...
supabase secrets set TWILIO_AUTH_TOKEN=...
supabase secrets set TWILIO_FROM_NUMBER=...
supabase secrets set RESEND_API_KEY=...
supabase secrets set RESEND_FROM_EMAIL=...
supabase secrets set ASSET_EXPIRY_WARNING_DAYS=30
```

Supabase provides `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Edge Function runtime.

## Edge Function deploy

```sh
supabase functions deploy send-twilio-sms
supabase functions deploy send-resend-email
supabase functions deploy asset-expiry-check
```

## Google Apps Script

1. Create a Google Sheet.
2. Open Extensions > Apps Script.
3. Paste `apps-script/Code.gs`.
4. Deploy as a web app with POST access.
5. Set the web app URL as `VITE_GOOGLE_SHEETS_WEBHOOK_URL`.
