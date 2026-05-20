import { supabase } from './supabase';

export interface ExpenseSheetRow {
  date: string;
  trip_code: string;
  category: string;
  amount: number;
  gst: number;
  net: number;
  receipt_url: string;
  notes: string;
}

export async function appendExpenseToSheets(row: ExpenseSheetRow) {
  return supabase.functions.invoke('sheets-append-expense', { body: { row } });
}

export async function exportSettlementToSheets(tourId: string) {
  return supabase.functions.invoke('sheets-export-settlement', { body: { tour_id: tourId } });
}
