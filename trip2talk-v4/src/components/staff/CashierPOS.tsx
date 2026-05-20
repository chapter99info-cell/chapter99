import { useMemo, useState } from 'react';

const tours = [
  { id: 'bm-01', code: 'BM-1806', title: 'Blue Mountains Golden Hour', price: 340, payid: 'saen@trip2talk' },
  { id: 'gor-02', code: 'GOR-0407', title: 'Great Ocean Road Editorial', price: 520, payid: 'ploy@trip2talk' },
  { id: 'tas-03', code: 'TAS-2108', title: 'Tasmania Wild Coast', price: 890, payid: 'saen@trip2talk' },
];

export default function CashierPOS() {
  const [customerName, setCustomerName] = useState('');
  const [tourId, setTourId] = useState(tours[0].id);
  const [paymentMethod, setPaymentMethod] = useState('payid');
  const [price, setPrice] = useState(String(tours[0].price));
  const [deposit, setDeposit] = useState('100');
  const [installments, setInstallments] = useState('2');
  const [waiverAccepted, setWaiverAccepted] = useState(false);
  const [waiverTime, setWaiverTime] = useState<string | null>(null);

  const selectedTour = useMemo(() => tours.find((tour) => tour.id === tourId) ?? tours[0], [tourId]);
  const balance = Math.max(Number(price || 0) - Number(deposit || 0), 0);
  const installmentAmount = installments ? balance / Number(installments) : balance;

  const changeTour = (nextTourId: string) => {
    const next = tours.find((tour) => tour.id === nextTourId) ?? tours[0];
    setTourId(next.id);
    setPrice(String(next.price));
  };

  const acceptWaiver = (checked: boolean) => {
    setWaiverAccepted(checked);
    setWaiverTime(checked ? new Date().toISOString() : null);
  };

  return (
    <main className="min-h-screen bg-jet px-5 py-8 text-white sm:px-8 lg:px-12">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.4em] text-gold">Co-Host / Cashier POS</p>
        <h1 className="mt-3 font-display text-4xl">New booking desk</h1>
        <p className="mt-3 max-w-2xl text-zinc-400">Capture payment plan, PayID handoff, and OSHC waiver timestamp before confirmation.</p>
      </header>

      <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <form className="rounded-3xl border border-charcoal-border bg-charcoal p-6">
          <h2 className="font-display text-2xl">Booking form</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-zinc-500">Customer name</span>
              <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full rounded-xl border border-charcoal-border bg-jet px-4 py-3 outline-none focus:border-gold" placeholder="Full legal name" />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-zinc-500">Tour selector</span>
              <select value={tourId} onChange={(e) => changeTour(e.target.value)} className="w-full rounded-xl border border-charcoal-border bg-jet px-4 py-3 outline-none focus:border-gold">
                {tours.map((tour) => <option key={tour.id} value={tour.id}>{tour.code} - {tour.title}</option>)}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-zinc-500">Payment method</span>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full rounded-xl border border-charcoal-border bg-jet px-4 py-3 outline-none focus:border-gold">
                <option value="payid">PayID</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank transfer</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-zinc-500">PayID auto-display</span>
              <input readOnly value={paymentMethod === 'payid' ? selectedTour.payid : 'Not required'} className="w-full rounded-xl border border-charcoal-border bg-black/40 px-4 py-3 text-gold outline-none" />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-zinc-500">Price override AUD</span>
              <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" className="w-full rounded-xl border border-charcoal-border bg-jet px-4 py-3 outline-none focus:border-gold" />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-zinc-500">Deposit AUD</span>
              <input value={deposit} onChange={(e) => setDeposit(e.target.value)} type="number" className="w-full rounded-xl border border-charcoal-border bg-jet px-4 py-3 outline-none focus:border-gold" />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-xs uppercase tracking-widest text-zinc-500">Installment count</span>
              <input value={installments} onChange={(e) => setInstallments(e.target.value)} type="number" min="1" className="w-full rounded-xl border border-charcoal-border bg-jet px-4 py-3 outline-none focus:border-gold" />
            </label>
          </div>

          <div className="mt-6 rounded-2xl border border-gold/20 bg-gold/10 p-5">
            <p className="text-xs uppercase tracking-widest text-gold">Installment plan builder</p>
            <p className="mt-3 text-2xl">Deposit AUD ${Number(deposit || 0).toFixed(2)}</p>
            <p className="mt-2 text-zinc-300">{installments || 1} installment(s) of AUD ${installmentAmount.toFixed(2)} after deposit.</p>
          </div>
        </form>

        <aside className="rounded-3xl border border-charcoal-border bg-charcoal p-6">
          <h2 className="font-display text-2xl">OSHC waiver flow</h2>
          <div className="mt-5 max-h-[420px] overflow-auto rounded-2xl border border-charcoal-border bg-jet p-5 text-sm leading-7 text-zinc-300">
            <p className="text-gold">English</p>
            <p>I confirm I understand Trip2Talk safety instructions, travel timing, non-refundable deposit terms, and that I am responsible for providing accurate OSHC or travel insurance details where required.</p>
            <p className="mt-5 text-gold">ภาษาไทย</p>
            <p>ข้าพเจ้าเข้าใจคำแนะนำด้านความปลอดภัย เงื่อนไขเวลาเดินทาง เงินมัดจำที่ไม่สามารถคืนได้ และยืนยันว่าจะให้ข้อมูล OSHC หรือประกันการเดินทางอย่างถูกต้องเมื่อจำเป็น</p>
          </div>
          <label className="mt-5 flex items-start gap-3 rounded-2xl border border-charcoal-border bg-jet p-4">
            <input checked={waiverAccepted} onChange={(e) => acceptWaiver(e.target.checked)} type="checkbox" className="mt-1 h-5 w-5 accent-gold" />
            <span className="text-sm text-zinc-300">Customer has reviewed and accepted the bilingual waiver.</span>
          </label>
          <p className="mt-3 text-xs text-zinc-500">Timestamp: {waiverTime ?? 'Not accepted'}</p>
          <button
            disabled={!customerName || !waiverAccepted}
            className="mt-6 w-full rounded-xl bg-gold px-4 py-4 text-sm font-semibold uppercase tracking-widest text-jet disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500"
          >
            Create booking
          </button>
        </aside>
      </section>
    </main>
  );
}
