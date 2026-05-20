import { Expense } from '../types';
import { supabase } from './supabase';

const STORAGE_KEY = 'chapter99.expenses';

function readLocalExpenses(): Expense[] {
  const rawValue = localStorage.getItem(STORAGE_KEY);
  if (!rawValue) {
    return [];
  }

  try {
    return JSON.parse(rawValue) as Expense[];
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

function writeLocalExpenses(expenses: Expense[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

export async function listExpenses(): Promise<Expense[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('expenses')
      .select('id, category, description, amount, paid_by, created_at, synced_at')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data.map((item) => ({
        id: item.id,
        category: item.category,
        description: item.description,
        amount: Number(item.amount),
        paidBy: item.paid_by,
        createdAt: item.created_at,
        syncedAt: item.synced_at ?? undefined,
      }));
    }
  }

  return readLocalExpenses().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addExpense(expense: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> {
  const nextExpense: Expense = {
    ...expense,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  if (supabase) {
    const { error } = await supabase.from('expenses').insert({
      id: nextExpense.id,
      category: nextExpense.category,
      description: nextExpense.description,
      amount: nextExpense.amount,
      paid_by: nextExpense.paidBy,
      created_at: nextExpense.createdAt,
      synced_at: nextExpense.syncedAt,
    });

    if (!error) {
      return nextExpense;
    }
  }

  writeLocalExpenses([nextExpense, ...readLocalExpenses()]);
  return nextExpense;
}

export function clearLocalExpenses(): void {
  localStorage.removeItem(STORAGE_KEY);
}
