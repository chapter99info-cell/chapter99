import { Expense, SyncResult } from '../types';
import { appendExpensesToSheet } from './sheets';

export async function syncExpenses(expenses: Expense[]): Promise<SyncResult> {
  const unsyncedExpenses = expenses.filter((expense) => !expense.syncedAt);
  if (unsyncedExpenses.length === 0) {
    return {
      ok: true,
      message: 'All expenses are already synced.',
      syncedCount: 0,
    };
  }

  return appendExpensesToSheet(unsyncedExpenses);
}

export function summarizeSync(result: SyncResult): string {
  if (result.ok && result.syncedCount > 0) {
    return `${result.syncedCount} expense records synced.`;
  }

  return result.message;
}
