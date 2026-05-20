import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { calcDaysUntilExpiry, getAlertLevel } from '../../lib/alertSystem';

const pins = [
  { role: 'staff', pin: '1111', active: true, owner: 'Ploy' },
  { role: 'cashier', pin: '4444', active: true, owner: 'Co-host desk' },
  { role: 'owner', pin: '9999', active: true, owner: 'Saen' },
  { role: 'superadmin', pin: '3501', active: true, owner: 'Platform' },
];

const accessLog = Array.from({ length: 8 }).map((_, index) => ({
  id: index + 1,
  role: ['owner', 'staff', 'cashier', 'superadmin'][index % 4],
  at: new Date(Date.now() - index * 1000 * 60 * 17).toISOString(),
  result: index % 5 === 0 ? 'denied' : 'granted',
}));

const assets = [
  { id: 'da', name: 'DA permit', expiry_date: '2026-06-15' },
  { id: 'rego', name: 'Vehicle rego', expiry_date: '2026-05-28' },
  { id: 'insurance', name: 'Public liability insurance', expiry_date: '2026-08-01' },
];

export default function PlatformHub() {
  const [supabaseStatus, setSupabaseStatus] = useState('Checking');
  const [edgeStatus, setEdgeStatus] = useState('Ready');

  useEffect(() => {
    let mounted = true;
    supabase
      .from('assets')
      .select('id', { count: 'exact', head: true })
      .then(({ error }) => {
        if (mounted) setSupabaseStatus(error ? 'Degraded' : 'Connected');
      });
    return () => { mounted = false; };
  }, []);

  const pingEdge = async () => {
    setEdgeStatus('Pinging');
    const { error } = await supabase.functions.invoke('check-asset-expiry');
    setEdgeStatus(error ? 'Unavailable' : 'Reachable');
  };

  return (
    <main className="min-h-screen bg-jet px-5 py-8 text-white sm:px-8 lg:px-12">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.4em] text-gold">Super Admin</p>
        <h1 className="mt-3 font-display text-4xl">Platform health and access</h1>
      </header>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-charcoal-border bg-charcoal p-5">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Supabase connection</p>
          <p className="mt-3 text-2xl text-gold">{supabaseStatus}</p>
        </div>
        <div className="rounded-3xl border border-charcoal-border bg-charcoal p-5">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Edge Function status</p>
          <p className="mt-3 text-2xl text-gold">{edgeStatus}</p>
          <button onClick={pingEdge} className="mt-4 rounded-xl border border-gold/40 px-4 py-2 text-xs uppercase tracking-widest text-gold">Ping</button>
        </div>
        <div className="rounded-3xl border border-charcoal-border bg-charcoal p-5">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Access events</p>
          <p className="mt-3 text-2xl text-gold">{accessLog.length}</p>
        </div>
        <div className="rounded-3xl border border-charcoal-border bg-charcoal p-5">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Active PIN roles</p>
          <p className="mt-3 text-2xl text-gold">{pins.filter((pin) => pin.active).length}</p>
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-charcoal-border bg-charcoal p-6">
          <h2 className="font-display text-2xl">PIN registry management</h2>
          <div className="mt-5 space-y-3">
            {pins.map((pin) => (
              <div key={pin.role} className="flex items-center justify-between gap-4 rounded-2xl border border-charcoal-border bg-jet p-4">
                <div>
                  <p className="capitalize text-white">{pin.role}</p>
                  <p className="text-xs text-zinc-500">{pin.owner} - PIN {pin.pin}</p>
                </div>
                <button className="rounded-full border border-red-400/30 px-3 py-1 text-xs uppercase tracking-widest text-red-300">
                  Deactivate
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-charcoal-border bg-charcoal p-6">
          <h2 className="font-display text-2xl">Access log viewer</h2>
          <div className="mt-5 max-h-80 space-y-3 overflow-auto">
            {accessLog.map((event) => (
              <div key={event.id} className="flex items-center justify-between gap-4 rounded-2xl border border-charcoal-border bg-jet p-4">
                <div>
                  <p className="capitalize">{event.role}</p>
                  <p className="text-xs text-zinc-500">{event.at}</p>
                </div>
                <span className={event.result === 'granted' ? 'text-emerald-300' : 'text-red-300'}>{event.result}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-charcoal-border bg-charcoal p-6">
        <h2 className="font-display text-2xl">Asset compliance overview</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {assets.map((asset) => {
            const days = calcDaysUntilExpiry(asset.expiry_date);
            const level = getAlertLevel(days);
            return (
              <div key={asset.id} className="rounded-2xl border border-charcoal-border bg-jet p-4">
                <p className="text-white">{asset.name}</p>
                <p className="mt-2 text-sm text-zinc-500">{asset.expiry_date}</p>
                <p className={`mt-4 text-xs uppercase tracking-widest ${level === 'ok' ? 'text-emerald-300' : level === 'warning' ? 'text-amber-300' : 'text-red-300'}`}>
                  {level} - {days} days
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
