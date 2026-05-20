import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { captureReceiptPhoto, saveExpenseOffline } from '../../lib/expenseDb';
import { syncOfflineExpenses } from '../../lib/syncService';
import { calcDaysUntilExpiry, getAlertLevel } from '../../lib/alertSystem';
import type { TourSettlement } from '../../types/tour';

const fallbackSettlements: TourSettlement[] = [
  { tour_id: 'bm-01', tour_code: 'BM-1806', title: 'Blue Mountains Golden Hour', departure_date: '2026-06-18', total_bookings: 10, total_collected: 3400, total_commissions_due: 500, net_settlement_owner: 2900, lead_staff_name: 'Ploy', staff_payid: 'ploy@payid' },
  { tour_id: 'gor-02', tour_code: 'GOR-0407', title: 'Great Ocean Road Editorial', departure_date: '2026-07-04', total_bookings: 8, total_collected: 4160, total_commissions_due: 480, net_settlement_owner: 3680, lead_staff_name: 'Mali', staff_payid: 'mali@payid' },
  { tour_id: 'tas-03', tour_code: 'TAS-2108', title: 'Tasmania Wild Coast', departure_date: '2026-08-21', total_bookings: 12, total_collected: 10680, total_commissions_due: 900, net_settlement_owner: 9780, lead_staff_name: 'Noah', staff_payid: 'noah@payid' },
];

const fallbackAssets = [
  { id: 'da', name: 'DA permit', expiry_date: '2026-06-15', blocks_trip_creation: true },
  { id: 'rego', name: 'Vehicle rego', expiry_date: '2026-05-28', blocks_trip_creation: true },
  { id: 'insurance', name: 'Public liability insurance', expiry_date: '2026-08-01', blocks_trip_creation: true },
];

const upcomingSafety = [
  { code: 'BM-1806', title: 'Blue Mountains Golden Hour', departs: 'Tomorrow 06:00', flagged: 2, passengers: 10 },
  { code: 'SYD-2006', title: 'Sydney Night Portraits', departs: 'Today 17:30', flagged: 0, passengers: 6 },
];

export default function OwnerDashboard() {
  const [settlements, setSettlements] = useState<TourSettlement[]>(fallbackSettlements);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [expensePhoto, setExpensePhoto] = useState<Blob | undefined>();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('fuel');
  const [notes, setNotes] = useState('');
  const [syncStatus, setSyncStatus] = useState('Ready for offline capture');

  useEffect(() => {
    let mounted = true;
    supabase
      .from('tour_settlement')
      .select('*')
      .then(({ data }) => {
        if (mounted && data && data.length > 0) setSettlements(data as TourSettlement[]);
      });
    return () => { mounted = false; };
  }, []);

  const stats = useMemo(() => {
    const totalCollected = settlements.reduce((sum, row) => sum + row.total_collected, 0);
    const totalCommissions = settlements.reduce((sum, row) => sum + row.total_commissions_due, 0);
    const net = settlements.reduce((sum, row) => sum + row.net_settlement_owner, 0);
    const netProfit = totalCollected ? Math.round((net / totalCollected) * 100) : 0;
    return { totalCollected, totalCommissions, net, netProfit, openTours: settlements.length };
  }, [settlements]);

  const startExpenseDrop = async () => {
    const captured = await captureReceiptPhoto();
    setExpensePhoto(captured?.blob);
    setExpenseOpen(true);
  };

  const saveExpense = async () => {
    const numericAmount = Number(amount);
    if (!numericAmount) return;

    await saveExpenseOffline({
      offline_id: crypto.randomUUID(),
      amount_aud: numericAmount,
      category,
      notes,
      photo_blob: expensePhoto,
      recorded_at: new Date().toISOString(),
      synced: false,
    });
    setSyncStatus('Saved offline. Syncing when network is available...');
    setExpenseOpen(false);
    setAmount('');
    setNotes('');

    if (navigator.onLine) {
      const result = await syncOfflineExpenses();
      setSyncStatus(`Sync complete: ${result.synced} synced, ${result.failed} failed`);
    }
  };

  return (
    <main className="min-h-screen bg-jet px-5 py-8 text-white sm:px-8 lg:px-12">
      <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-gold">Owner Hub - Saen</p>
          <h1 className="mt-3 font-display text-4xl">Trip2Talk operating cockpit</h1>
        </div>
        <button onClick={startExpenseDrop} className="animate-gold-pulse rounded-2xl bg-gold px-6 py-4 text-sm font-bold uppercase tracking-widest text-jet">
          Quick Expense Drop
        </button>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          ['Net Profit', `${stats.netProfit}%`],
          ['Total Collected AUD', `$${stats.totalCollected.toLocaleString()}`],
          ['Pending Commissions', `$${stats.totalCommissions.toLocaleString()}`],
          ['Open Tours', String(stats.openTours)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl border border-charcoal-border bg-charcoal p-5">
            <p className="text-xs uppercase tracking-widest text-zinc-500">{label}</p>
            <p className="mt-3 text-3xl text-gold">{value}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-charcoal-border bg-charcoal p-6">
          <h2 className="font-display text-2xl">Tour settlement</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-xs uppercase tracking-widest text-zinc-500">
                <tr>
                  <th className="py-3">Tour code</th>
                  <th>Bookings</th>
                  <th>Collected</th>
                  <th>Commission</th>
                  <th>Net to owner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-border">
                {settlements.map((row) => (
                  <tr key={row.tour_id}>
                    <td className="py-4">
                      <p className="text-gold">{row.tour_code}</p>
                      <p className="text-xs text-zinc-500">{row.title}</p>
                    </td>
                    <td>{row.total_bookings}</td>
                    <td>AUD ${row.total_collected.toLocaleString()}</td>
                    <td>AUD ${row.total_commissions_due.toLocaleString()}</td>
                    <td className="font-semibold text-emerald-300">AUD ${row.net_settlement_owner.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-charcoal-border bg-charcoal p-6">
            <h2 className="font-display text-2xl">Asset compliance</h2>
            <div className="mt-5 space-y-3">
              {fallbackAssets.map((asset) => {
                const days = calcDaysUntilExpiry(asset.expiry_date);
                const level = getAlertLevel(days);
                const color = level === 'ok' ? 'text-emerald-300' : level === 'warning' ? 'text-amber-300' : 'text-red-300';
                return (
                  <div key={asset.id} className="rounded-2xl border border-charcoal-border bg-jet p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p>{asset.name}</p>
                      <span className={`text-xs uppercase tracking-widest ${color}`}>{level}</span>
                    </div>
                    <p className="mt-2 text-sm text-zinc-500">{days} days until expiry - {asset.expiry_date}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-3xl border border-charcoal-border bg-charcoal p-6">
            <h2 className="font-display text-2xl">Safety brief</h2>
            <div className="mt-5 space-y-3">
              {upcomingSafety.map((tour) => (
                <div key={tour.code} className="rounded-2xl border border-charcoal-border bg-jet p-4">
                  <p className="text-gold">{tour.code} - {tour.departs}</p>
                  <p className="mt-1 text-sm text-zinc-400">{tour.title}</p>
                  <p className="mt-2 text-sm">{tour.flagged} flagged passenger(s) / {tour.passengers} total</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <p className="mt-5 text-sm text-zinc-500">{syncStatus}</p>

      {expenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6">
          <div className="w-full max-w-md rounded-3xl border border-gold/30 bg-charcoal p-6">
            <h2 className="font-display text-2xl">Quick Expense Drop</h2>
            <p className="mt-2 text-sm text-zinc-500">{expensePhoto ? 'Receipt photo attached.' : 'No photo attached. You can still save the expense offline.'}</p>
            <div className="mt-5 space-y-3">
              <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="Amount AUD" className="w-full rounded-xl border border-charcoal-border bg-jet px-4 py-3 outline-none focus:border-gold" />
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-charcoal-border bg-jet px-4 py-3 outline-none focus:border-gold">
                {['fuel', 'lodge', 'meals', 'equipment', 'marketing', 'other'].map((item) => <option key={item}>{item}</option>)}
              </select>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" className="min-h-24 w-full rounded-xl border border-charcoal-border bg-jet px-4 py-3 outline-none focus:border-gold" />
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setExpenseOpen(false)} className="rounded-xl border border-charcoal-border px-4 py-3 text-zinc-300">Cancel</button>
                <button onClick={saveExpense} className="rounded-xl bg-gold px-4 py-3 font-semibold text-jet">Save offline</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
