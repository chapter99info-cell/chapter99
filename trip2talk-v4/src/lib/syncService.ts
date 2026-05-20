// Background sync: IndexedDB -> Supabase -> Google Sheets
import { supabase }              from './supabase';
import { getUnsyncedExpenses, markExpenseSynced } from './expenseDb';

export interface SyncResult { synced: number; failed: number; errors: string[]; }

export async function syncOfflineExpenses(): Promise<SyncResult> {
  const result: SyncResult = { synced: 0, failed: 0, errors: [] };
  const pending = await getUnsyncedExpenses();
  if (pending.length === 0) return result;

  for (const expense of pending) {
    try {
      // 1. Insert into Supabase
      const { error } = await supabase
        .from('expenses')
        .insert({
          tour_id:          expense.tour_id,
          category:         expense.category,
          amount_aud:       expense.amount_aud,
          notes:            expense.notes,
          offline_id:       expense.offline_id,
          recorded_at:      expense.recorded_at,
          recorded_by_role: 'owner',
          synced_to_drive:  false,
          synced_to_sheets: false,
        })
        .select('id')
        .single();

      if (error) throw error;

      // 2. Upload photo + sync to Sheets via Edge Function
      if (expense.photo_blob) {
        const base64 = await blobToBase64(expense.photo_blob);
        await supabase.functions.invoke('sheets-append-expense', {
          body: {
            row: {
              date:        expense.recorded_at.slice(0, 10),
              trip_code:   expense.tour_id ?? 'UNASSIGNED',
              category:    expense.category,
              amount:      expense.amount_aud,
              gst:         parseFloat((expense.amount_aud / 11).toFixed(2)),
              net:         parseFloat((expense.amount_aud - expense.amount_aud / 11).toFixed(2)),
              receipt_url: '',
              notes:       expense.notes ?? '',
            },
            file_base64: base64,
            mime_type:   expense.photo_blob.type,
            trip_id:     expense.tour_id,
            date:        expense.recorded_at.slice(0, 10),
            amount:      expense.amount_aud,
          },
        });
      }

      // 3. Mark as synced in IndexedDB
      await markExpenseSynced(expense.offline_id);
      result.synced++;
    } catch (err) {
      result.failed++;
      result.errors.push(String(err));
    }
  }
  return result;
}

// Register online event listener - auto-sync when connection restored
export function registerAutoSync(onSyncComplete?: (result: SyncResult) => void) {
  window.addEventListener('online', async () => {
    console.log('[syncService] Back online - syncing offline expenses...');
    const result = await syncOfflineExpenses();
    console.log('[syncService] Sync complete:', result);
    onSyncComplete?.(result);
  });
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader     = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror   = reject;
    reader.readAsDataURL(blob);
  });
}
