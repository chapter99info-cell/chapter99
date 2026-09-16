# Deploy PIN login Edge Function

The PIN pad on `/admin/login` calls **`verify-admin-pin`**.  
If you see *"Failed to send a request to the Edge Function"*, the function is **not deployed** (404).

## Prerequisites (one-time)

1. **SQL Editor** — run `supabase/migrations/008_admin_pin_auth.sql` (creates lockout tables).
2. **Dashboard → Project Settings → Edge Functions → Secrets**
   - Name: `ADMIN_PIN`
   - Value: your 4-digit PIN (e.g. `9501`)

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically for Edge Functions.

---

## Option A — Supabase Dashboard (no CLI)

1. Open [Supabase Dashboard](https://supabase.com/dashboard/project/jjbwiriphyxsnrnpoqnn/functions)
2. **Edge Functions** → **Deploy a new function** (or **Create function**)
3. **Name:** `verify-admin-pin` (exact name)
4. **Paste** the full contents of `supabase/functions/verify-admin-pin/index.ts`
5. **Deploy**
6. Confirm secret `ADMIN_PIN` is set under **Secrets**

Test: https://chapter99info.com/admin/login → enter PIN.

---

## Option B — Terminal (Supabase CLI)

```powershell
cd "d:\Agency chapter99\chapter99"
supabase login
supabase link --project-ref jjbwiriphyxsnrnpoqnn
supabase secrets set ADMIN_PIN=9501
supabase functions deploy verify-admin-pin --project-ref jjbwiriphyxsnrnpoqnn
```

Use the Supabase account that owns **chapter99-creator-network**.  
If you get **403**, you are logged into the wrong org — use Option A instead.

---

## Verify deployment

```powershell
Invoke-WebRequest -Uri "https://jjbwiriphyxsnrnpoqnn.supabase.co/functions/v1/verify-admin-pin" `
  -Method POST -ContentType "application/json" `
  -Body '{"action":"verify","pin":"0000"}' -UseBasicParsing
```

- **404** = function not deployed yet  
- **401/503** = deployed (wrong PIN or missing `ADMIN_PIN` secret)  
- **200** with `"ok":true` = working with correct PIN
