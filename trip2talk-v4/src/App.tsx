import { useState, useCallback, useEffect } from 'react';
import './index.css';
import type { PinRole } from './types/tour';
import { registerAutoSync } from './lib/syncService';
import PortfolioHero from './components/public/PortfolioHero';
import StaffDashboard from './components/staff/StaffDashboard';
import CashierPOS from './components/staff/CashierPOS';
import OwnerDashboard from './components/owner/OwnerDashboard';
import PlatformHub from './components/superadmin/PlatformHub';

const PIN_MAP: Record<string, PinRole> = {
  '1111': 'staff', '4444': 'cashier', '9999': 'owner', '3501': 'superadmin',
};

function Screen({ role }: { role: PinRole }) {
  if (role === 'public') return <PortfolioHero />;
  if (role === 'staff') return <StaffDashboard />;
  if (role === 'cashier') return <CashierPOS />;
  if (role === 'owner') return <OwnerDashboard />;
  return <PlatformHub />;
}

function PinEntry({ onSuccess }: { onSuccess: (r: PinRole) => void }) {
  const [digits, setDigits] = useState(['','','','']);
  const [error, setError]   = useState(false);
  const [shake, setShake]   = useState(false);

  const pushDigit = useCallback((v: string) => {
    setError(false);
    setDigits(prev => {
      const next = [...prev];
      const idx  = next.findIndex(d => d === '');
      if (idx === -1) return prev;
      next[idx] = v;
      if (idx === 3) {
        const pin  = [...next].join('');
        const role = PIN_MAP[pin];
        setTimeout(() => {
          if (role) { onSuccess(role); }
          else {
            setError(true); setShake(true);
            setTimeout(() => { setShake(false); setDigits(['','','','']); }, 600);
          }
        }, 150);
      }
      return next;
    });
  }, [onSuccess]);

  const del = useCallback(() => setDigits(prev => {
    const next = [...prev];
    for (let i = 3; i >= 0; i--) { if (next[i] !== '') { next[i] = ''; break; } }
    return next;
  }), []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (/^[0-9]$/.test(e.key)) pushDigit(e.key); if (e.key === 'Backspace') del(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [pushDigit, del]);

  const keys = ['1','2','3','4','5','6','7','8','9','','0','del'];

  return (
    <div className="min-h-screen bg-jet flex flex-col items-center justify-center px-6">
      <div className="mb-10 text-center animate-fade-in">
        <h1 className="text-gold font-display text-4xl font-light tracking-[0.35em] uppercase">Trip2Talk</h1>
        <p className="text-zinc-500 text-xs tracking-widest mt-1 uppercase">Premium Photography Tours · Australia</p>
        <div className="mt-3 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
      </div>

      <div className={`flex gap-4 mb-8 transition-transform ${shake ? 'animate-[shake_0.4s_ease]' : ''}`}>
        {digits.map((d, i) => (
          <div key={i} className={`w-4 h-4 rounded-full border transition-all duration-200 ${d !== '' ? 'bg-gold border-gold scale-110' : error ? 'border-red-500' : 'border-zinc-700'}`} />
        ))}
      </div>
      {error && <p className="text-red-400 text-xs tracking-widest mb-4 uppercase">Incorrect PIN</p>}

      <div className="grid grid-cols-3 gap-3 w-64">
        {keys.map((k, i) => k === '' ? <div key={i} /> : (
          <button key={i} onClick={() => k === 'del' ? del() : pushDigit(k)}
            className="h-16 rounded-xl bg-charcoal border border-charcoal-border text-white text-xl font-light
                       hover:bg-charcoal-light hover:border-gold/40 active:scale-95 transition-all focus:outline-none">
            {k === 'del' ? 'DEL' : k}
          </button>
        ))}
      </div>

      <button onClick={() => onSuccess('public')}
        className="mt-10 text-zinc-500 text-xs tracking-widest uppercase hover:text-gold transition-colors">
        Browse as Guest
      </button>

      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}`}</style>
    </div>
  );
}

export default function App() {
  const [role, setRole] = useState<PinRole | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('t2t_role') as PinRole | null;
    if (saved && (saved === 'public' || Object.values(PIN_MAP).includes(saved))) setRole(saved);
    registerAutoSync((result) => console.log('[AutoSync]', result));
  }, []);

  const login  = (r: PinRole) => { sessionStorage.setItem('t2t_role', r); setRole(r); };
  const logout = () => { sessionStorage.removeItem('t2t_role'); setRole(null); };

  if (!role) return <PinEntry onSuccess={login} />;

  return (
    <>
      {role !== 'public' && (
        <button onClick={logout}
          className="fixed top-4 right-4 z-50 text-zinc-500 text-xs hover:text-gold transition-colors tracking-widest uppercase">
          Exit
        </button>
      )}
      <Screen role={role} />
    </>
  );
}
