const clients = [
  { name: 'Mina Chen', booking: 'BM-1806-04', status: 'confirmed', tour: 'Blue Mountains Golden Hour', nzVisa: false },
  { name: 'Arisa Wong', booking: 'GOR-0407-02', status: 'paid', tour: 'Great Ocean Road Editorial', nzVisa: true },
  { name: 'Nok P.', booking: 'TAS-2108-09', status: 'pending', tour: 'Tasmania Wild Coast', nzVisa: false },
  { name: 'June Lee', booking: 'NZ-1209-01', status: 'waitlist', tour: 'Queenstown Portfolio Sprint', nzVisa: true },
];

const statusClass: Record<string, string> = {
  confirmed: 'bg-emerald-400/10 text-emerald-300',
  paid: 'bg-gold/10 text-gold',
  pending: 'bg-amber-400/10 text-amber-300',
  waitlist: 'bg-sky-400/10 text-sky-300',
};

export default function StaffDashboard() {
  const earned = 1280;

  return (
    <main className="min-h-screen bg-jet px-5 py-8 text-white sm:px-8 lg:px-12">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.4em] text-gold">Staff Dashboard - Ploy</p>
        <h1 className="mt-3 font-display text-4xl">Client care and commissions</h1>
        <p className="mt-3 max-w-2xl text-zinc-400">Read-only roster for assigned bookings, visa watch items, and monthly commission progress.</p>
      </header>

      <section className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="rounded-3xl border border-charcoal-border bg-charcoal p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl">Assigned clients</h2>
            <span className="rounded-full border border-charcoal-border px-3 py-1 text-xs uppercase tracking-widest text-zinc-500">Read only</span>
          </div>
          <div className="space-y-3">
            {clients.map((client) => (
              <article key={client.booking} className="rounded-2xl border border-charcoal-border bg-jet p-4">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                  <div>
                    <p className="text-lg text-white">{client.name}</p>
                    <p className="mt-1 text-sm text-zinc-500">{client.booking} - {client.tour}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-widest ${statusClass[client.status]}`}>
                      {client.status}
                    </span>
                    {client.nzVisa && (
                      <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs uppercase tracking-widest text-amber-300">
                        NZ visa processing
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <section className="rounded-3xl border border-gold/30 bg-gold/10 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-gold">Commission tracker</p>
            <p className="mt-4 font-display text-4xl text-white">AUD ${earned.toLocaleString()}</p>
            <p className="mt-3 text-sm text-zinc-400">You've earned this month. Pending owner settlement remains view-only.</p>
          </section>

          <section className="rounded-3xl border border-charcoal-border bg-charcoal p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-gold">NZ visa watch</p>
            <div className="mt-4 space-y-3">
              {clients.filter((client) => client.nzVisa).map((client) => (
                <div key={client.booking} className="rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4">
                  <p className="text-amber-200">{client.name}</p>
                  <p className="mt-1 text-xs text-zinc-500">{client.tour}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}
