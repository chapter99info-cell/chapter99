import { Expense, SyncResult } from '../types';

const sheetsWebhookUrl = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL;

export async function appendExpensesToSheet(expenses: Expense[]): Promise<SyncResult> {
  if (!sheetsWebhookUrl) {
    return {
      ok: false,
      message: 'Google Sheets webhook is not configured.',
      syncedCount: 0,
    };
  }

  const response = await fetch(sheetsWebhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ expenses }),
  });

  if (!response.ok) {
    return {
      ok: false,
      message: `Google Sheets sync failed with ${response.status}.`,
      syncedCount: 0,
    };
  }

  return {
    ok: true,
    message: 'Expenses synced to Google Sheets.',
    syncedCount: expenses.length,
  };
}
