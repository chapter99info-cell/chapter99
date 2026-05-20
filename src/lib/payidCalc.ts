// src/lib/payidCalc.ts
import type { CommissionLedger, Expense, Tour, PayIDSettlement } from '../types/tour';

const TAX_RATE = 0.25; // Simplified 25% flat estimate
const GST_RATE = 0.10;

export function calcStaffCommission(
  pax_count: number,
  rate_per_pax: number,
  bonus_threshold: number,
  bonus_amount: number
): { base: number; bonus: number; total: number } {
  const base = pax_count * rate_per_pax;
  const bonus = pax_count >= bonus_threshold ? bonus_amount : 0;
  return { base, bonus, total: base + bonus };
}

export function calcTourSettlement(
  tour: Tour,
  bookings_revenue: number,
  expenses: Expense[],
  commissions: CommissionLedger[]
): PayIDSettlement {
  const total_expenses = expenses
    .filter(e => e.ato_deductible)
    .reduce((sum, e) => sum + e.amount_aud, 0);

  const gst_collected = bookings_revenue * GST_RATE;
  const gst_paid = expenses
    .filter(e => e.gst_claimable)
    .reduce((sum, e) => sum + e.gst_amount, 0);

  const net_gst = gst_collected - gst_paid;
  const total_commission = commissions.reduce(
    (sum, c) => sum + c.total_commission, 0
  );

  const net_profit = bookings_revenue - total_expenses - total_commission;
  const taxable_income = net_profit - net_gst;
  const tax_estimate = Math.max(0, taxable_income * TAX_RATE);
  const owner_net = net_profit - tax_estimate;

  return {
    staff_id: commissions[0]?.staff_id ?? '',
    staff_name: '',
    tour_id: tour.id,
    trip_code: tour.trip_code,
    gross_revenue: bookings_revenue,
    total_expenses,
    net_profit,
    staff_commission: total_commission,
    owner_net,
    gst_collected,
    tax_estimate,
    settlement_date: new Date().toISOString(),
  };
}

export function calcYTDSummary(settlements: PayIDSettlement[]): {
  ytd_revenue: number;
  ytd_expenses: number;
  ytd_commission: number;
  ytd_tax: number;
  ytd_owner_net: number;
  ytd_gst: number;
  profit_margin_pct: number;
} {
  const ytd_revenue = settlements.reduce((s, x) => s + x.gross_revenue, 0);
  const ytd_expenses = settlements.reduce((s, x) => s + x.total_expenses, 0);
  const ytd_commission = settlements.reduce((s, x) => s + x.staff_commission, 0);
  const ytd_tax = settlements.reduce((s, x) => s + x.tax_estimate, 0);
  const ytd_owner_net = settlements.reduce((s, x) => s + x.owner_net, 0);
  const ytd_gst = settlements.reduce((s, x) => s + x.gst_collected, 0);
  const profit_margin_pct = ytd_revenue > 0
    ? Math.round((ytd_owner_net / ytd_revenue) * 100)
    : 0;

  return {
    ytd_revenue, ytd_expenses, ytd_commission,
    ytd_tax, ytd_owner_net, ytd_gst, profit_margin_pct,
  };
}

export function formatAUD(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency', currency: 'AUD', minimumFractionDigits: 2,
  }).format(amount);
}

export function generateReceiptFilename(
  trip_code: string,
  amount: number
): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const amt = amount.toFixed(2).replace('.', '-');
  return `${trip_code}_${date}_${amt}_Receipt.jpg`;
}
