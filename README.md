# chapter99

## Quick Expense Drop -> Google Sheets bridge

This repository contains the integration scaffold for the PIN `9999` Quick Expense Drop flow:

```text
App
  -> src/lib/googleSheets.ts
  -> Supabase Edge Functions
       sheets-append-expense
       sheets-batch-expenses
       sheets-export-settlement
  -> scripts/driveAutoUpload.js Google Apps Script web app
  -> Google Drive + Google Sheets
```

### Google Sheet tabs

The Apps Script creates and maintains two tabs:

- `Expenses`: `Date | Trip Code | Category | Amount | GST | Net | Receipt URL`
- `Settlements`: `Tour Code | Bookings | Collected | Commission | Net to Owner`

Receipts are uploaded to a Drive folder named after the trip code, with names like:

```text
T2T-001_2025-06-01_45-50_Receipt.jpg
```

### Required configuration

Supabase Edge Function secrets:

- `GOOGLE_APPS_SCRIPT_WEB_APP_URL`: deployed Apps Script web app URL
- `GOOGLE_APPS_SCRIPT_SHARED_SECRET`: shared secret sent to Apps Script
- `QUICK_EXPENSE_PIN`: optional; defaults to `9999`

Apps Script properties:

- `SHEET_ID`: Google Sheet ID to write to
- `BRIDGE_SECRET`: must match `GOOGLE_APPS_SCRIPT_SHARED_SECRET`
- `ROOT_FOLDER_ID`: optional Drive folder ID for trip receipt folders

### Client usage

```ts
import { appendQuickExpenseDrop } from "./src/lib/googleSheets";

await appendQuickExpenseDrop(supabase, {
  pin: "9999",
  tripCode: "T2T-001",
  date: "2025-06-01",
  category: "Fuel",
  amount: 45.5,
  receipt: {
    base64: receiptBase64,
    mimeType: "image/jpeg",
  },
});
```
