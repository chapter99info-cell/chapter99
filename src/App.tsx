// src/App.tsx
import { useState, useEffect, useCallback } from 'react';
import { StaffRole } from './types/tour';

// Lazy imports for code splitting
import { lazy, Suspense } from 'react';
const OwnerDashboard = lazy(() => import('./components/owner/OwnerDashboard'));
const StaffDashboard = lazy(() => import('./components/staff/StaffDashboard'));
const ClientVIPHub = lazy(() => import('./components/client/ClientVIPHub'));
const CashierPOS = lazy(() => import('./components/cashier/CashierPOS'));
const PublicPortfolio = lazy(() => import('./components/public/PublicPortfolio'));

// PIN → Role mapping (in production: hash-compare server-side)
const PIN_MAP: Record<string, StaffRole> = {
  '1111': 'staff',
  '4444': 'cashier',
  '9999': 'owner',
};

type AppView = StaffRole | 'public' | 'client';

interface PINState {
  digits: string[];
  error: string;
  attempts: number;
  locked_until?: number;
}

export default function App() {
  const [view, setView] = useState<AppView>('public');
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinState, setPinState] = useState<PINState>({
    digits: ['', '', '', ''],
    error: '',
    attempts: 0,
  });

  // Auto-lock check
  useEffect(() => {
    if (pinState.locked_until && Date.now() < pinState.locked_until) {
      const remaining = Math.ceil((pinState.locked_until - Date.now()) / 1000);
      setPinState(p => ({ ...p, error: `Locked. Try again in ${remaining}s` }));
    }
  }, [pinState.locked_until]);

  // Session timeout: auto-logout after 30min inactivity
  useEffect(() => {
    if (view === 'public') return;
    let timer: ReturnType<typeof setTimeout>;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setView('public');
        setPinState({ digits: ['', '', '', ''], error: '', attempts: 0 });
      }, 30 * 60 * 1000);
    };
    window.addEventListener('mousemove', reset);
    window.addEventListener('touchstart', reset);
    reset();
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', reset);
      window.removeEventListener('touchstart', reset);
    };
  }, [view]);

  const handlePinDigit = useCallback((digit: string) => {
    if (pinState.locked_until && Date.now() < pinState.locked_until) return;

    setPinState(prev => {
      const emptyIdx = prev.digits.findIndex(d => d === '');
      if (emptyIdx === -1) return prev;
      const next = [...prev.digits];
      next[emptyIdx] = digit;

      // Auto-submit when 4 digits filled
      if (emptyIdx === 3) {
        const pin = next.join('');
        const role = PIN_MAP[pin];
        if (role) {
          setTimeout(() => {
            setView(role);
            setShowPinModal(false);
            setPinState({ digits: ['', '', '', ''], error: '', attempts: 0 });
          }, 200);
          return { ...prev, digits: next, error: '' };
        } else {
          const attempts = prev.attempts + 1;
          const locked_until = attempts >= 3
            ? Date.now() + 30_000
            : undefined;
          return {
            digits: ['', '', '', ''],
            error: attempts >= 3
              ? 'Too many attempts. Locked 30s.'
              : `Incorrect PIN (${3 - attempts} attempts left)`,
            attempts,
            locked_until,
          };
        }
      }
      return { ...prev, digits: next, error: '' };
    });
  }, [pinState.locked_until]);

  const handleBackspace = useCallback(() => {
    setPinState(prev => {
      const lastFilled = [...prev.digits].reverse().findIndex(d => d !== '');
      if (lastFilled === -1) return prev;
      const idx = 3 - lastFilled;
      const next = [...prev.digits];
      next[idx] = '';
      return { ...prev, digits: next, error: '' };
    });
  }, []);

  const handleLogout = () => {
    setView('public');
    setPinState({ digits: ['', '', '', ''], error: '', attempts: 0 });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* TOP BAR (non-public views) */}
      {view !== 'public' && (
        <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between 
          px-4 py-3 bg-neutral-900/90 backdrop-blur border-b border-amber-500/20">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold tracking-widest text-sm">
              TRIP2TALK
            </span>
            <span className="text-xs text-neutral-400 uppercase tracking-wider">
              {view === 'staff' ? '● Staff' 
                : view === 'cashier' ? '● Cashier'
                : view === 'owner' ? '◆ Owner Hub'
                : '◉ Client VIP'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-neutral-400 hover:text-amber-400 
              transition-colors px-3 py-1 rounded border border-neutral-700 
              hover:border-amber-500/50"
          >
            Lock ⇒
          </button>
        </header>
      )}

      {/* MAIN VIEWS */}
      <main className={view !== 'public' ? 'pt-14' : ''}>
        <Suspense fallback={<LoadingScreen />}>
          {view === 'public' && <PublicPortfolio onEnterPin={() => setShowPinModal(true)} />}
          {view === 'staff' && <StaffDashboard />}
          {view === 'cashier' && <CashierPOS />}
          {view === 'owner' && <OwnerDashboard />}
          {view === 'client' && <ClientVIPHub />}
        </Suspense>
      </main>

      {/* PIN MODAL */}
      {showPinModal && (
        <PINModal
          pinState={pinState}
          onDigit={handlePinDigit}
          onBackspace={handleBackspace}
          onClose={() => {
            setShowPinModal(false);
            setPinState({ digits: ['', '', '', ''], error: '', attempts: 0 });
          }}
        />
      )}

      {/* FAB: Enter PIN (public view only) */}
      {view === 'public' && !showPinModal && (
        <button
          onClick={() => setShowPinModal(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full 
            bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg 
            shadow-amber-500/30 flex items-center justify-center
            hover:scale-110 transition-transform active:scale-95"
          aria-label="Staff Login"
        >
          <span className="text-neutral-900 font-bold text-lg">🔐</span>
        </button>
      )}
    </div>
  );
}

// ─── PIN MODAL ─────────────────────────────────────────────
interface PINModalProps {
  pinState: PINState;
  onDigit: (d: string) => void;
  onBackspace: () => void;
  onClose: () => void;
}

function PINModal({ pinState, onDigit, onBackspace, onClose }: PINModalProps) {
  // Physical keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') onDigit(e.key);
      if (e.key === 'Backspace') onBackspace();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onDigit, onBackspace, onClose]);

  const KEYS = [
    ['1','2','3'],
    ['4','5','6'],
    ['7','8','9'],
    ['','0','⌫'],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center 
      bg-black/80 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-80 bg-neutral-900 rounded-2xl border border-amber-500/30 
        shadow-2xl shadow-amber-500/10 p-8 flex flex-col items-center gap-6">
        
        {/* Close */}
        <button onClick={onClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-white text-lg">
          ✕
        </button>

        {/* Logo */}
        <div className="text-center">
          <p className="text-amber-400 font-bold tracking-[0.3em] text-sm uppercase">
            Trip2Talk
          </p>
          <p className="text-neutral-400 text-xs mt-1">Staff Access Portal</p>
        </div>

        {/* PIN Dots */}
        <div className="flex gap-4">
          {pinState.digits.map((d, i) => (
            <div key={i}
              className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center
                transition-all duration-200
                ${d ? 'border-amber-400 bg-amber-400/10' : 'border-neutral-600 bg-neutral-800'}
              `}
            >
              {d && <div className="w-3 h-3 rounded-full bg-amber-400" />}
            </div>
          ))}
        </div>

        {/* Error */}
        {pinState.error && (
          <p className="text-red-400 text-xs text-center animate-shake">
            {pinState.error}
          </p>
        )}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {KEYS.flat().map((key, i) => {
            if (!key) return <div key={i} />;
            return (
              <button
                key={i}
                onClick={() => key === '⌫' ? onBackspace() : onDigit(key)}
                className={`h-14 rounded-xl font-semibold text-lg transition-all 
                  active:scale-95 select-none
                  ${key === '⌫'
                    ? 'bg-neutral-700 hover:bg-neutral-600 text-amber-400'
                    : 'bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 hover:border-amber-500/40 text-white'
                  }`}
              >
                {key}
              </button>
            );
          })}
        </div>

        {/* Hint */}
        <p className="text-neutral-600 text-xs">
          Enter 4-digit PIN to continue
        </p>
      </div>
    </div>
  );
}

// ─── LOADING SCREEN ─────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent 
          rounded-full animate-spin" />
        <p className="text-neutral-500 text-sm tracking-widest">LOADING...</p>
      </div>
    </div>
  );
}
