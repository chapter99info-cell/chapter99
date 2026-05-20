import { useCallback, useEffect, useMemo, useState } from "react";

type AppRole = "owner" | "guide" | "operations" | "sales" | "safety";

type RoleConfig = {
  role: AppRole;
  pin: string;
  label: string;
  title: string;
  subtitle: string;
  accent: string;
  stats: Array<{ label: string; value: string; tone: string }>;
  actions: string[];
};

type SessionState = {
  role: AppRole;
  authenticatedAt: number;
};

const SESSION_KEY = "chapter99.pin-session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const PIN_LENGTH = 4;

const roleConfigs: RoleConfig[] = [
  {
    role: "owner",
    pin: "9999",
    label: "Owner",
    title: "Owner Command",
    subtitle: "Net profit, settlements, and emergency overrides.",
    accent: "from-gold-100 via-gold-300 to-gold-700",
    stats: [
      { label: "Net profit", value: "$18.4k", tone: "text-gold-100" },
      { label: "Pending settlements", value: "7", tone: "text-champagne" },
      { label: "Blocked trips", value: "1", tone: "text-ruby" }
    ],
    actions: ["Quick expense drop", "Approve settlement", "Unlock trip override"]
  },
  {
    role: "guide",
    pin: "1111",
    label: "Lead Guide",
    title: "Guide Manifest",
    subtitle: "Bookings, commissions, customer flags, and day sheet.",
    accent: "from-jade via-gold-300 to-gold-700",
    stats: [
      { label: "Today guests", value: "18", tone: "text-jade" },
      { label: "Commission", value: "$740", tone: "text-gold-100" },
      { label: "Visa badges", value: "4", tone: "text-champagne" }
    ],
    actions: ["Open manifest", "Capture PayID", "Send guest SMS"]
  },
  {
    role: "operations",
    pin: "2222",
    label: "Operations",
    title: "Tour Control",
    subtitle: "Assets, trip readiness, DA/Rego/insurance, and rostering.",
    accent: "from-ember via-gold-400 to-gold-700",
    stats: [
      { label: "Ready assets", value: "12", tone: "text-gold-100" },
      { label: "Briefs due", value: "3", tone: "text-ember" },
      { label: "Open checks", value: "9", tone: "text-champagne" }
    ],
    actions: ["Run readiness check", "Schedule safety brief", "Assign vehicle"]
  },
  {
    role: "sales",
    pin: "3333",
    label: "Sales",
    title: "Booking Salon",
    subtitle: "Portfolio availability, booking schedule, and low-stock nudges.",
    accent: "from-gold-50 via-gold-300 to-ember",
    stats: [
      { label: "Lead value", value: "$9.8k", tone: "text-gold-100" },
      { label: "Low-stock tours", value: "5", tone: "text-ember" },
      { label: "Deposits today", value: "11", tone: "text-jade" }
    ],
    actions: ["Open schedule", "Send quote", "Reserve seats"]
  },
  {
    role: "safety",
    pin: "4444",
    label: "Safety",
    title: "Compliance Desk",
    subtitle: "OSHC waivers, encrypted medical notes, and incident readiness.",
    accent: "from-ruby via-gold-300 to-gold-700",
    stats: [
      { label: "Waivers missing", value: "2", tone: "text-ruby" },
      { label: "Medical flags", value: "6", tone: "text-gold-100" },
      { label: "Incidents open", value: "0", tone: "text-jade" }
    ],
    actions: ["Verify waiver", "Review medical note", "Export Privacy log"]
  }
];

const roleByPin = new Map(roleConfigs.map((role) => [role.pin, role]));
const roleByName = new Map(roleConfigs.map((role) => [role.role, role]));

function readStoredSession(): SessionState | null {
  try {
    const rawSession = window.localStorage.getItem(SESSION_KEY);

    if (!rawSession) {
      return null;
    }

    const parsed = JSON.parse(rawSession) as SessionState;
    const isKnownRole = roleByName.has(parsed.role);
    const isFresh = Date.now() - parsed.authenticatedAt < SESSION_TTL_MS;

    return isKnownRole && isFresh ? parsed : null;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

function persistSession(role: AppRole): SessionState {
  const session = { role, authenticatedAt: Date.now() };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

function App() {
  const [pin, setPin] = useState("");
  const [session, setSession] = useState<SessionState | null>(() => readStoredSession());
  const [isShaking, setIsShaking] = useState(false);
  const activeRole = session ? roleByName.get(session.role) ?? null : null;

  const maskedPin = useMemo(
    () =>
      Array.from({ length: PIN_LENGTH }, (_, index) => ({
        id: index,
        filled: index < pin.length
      })),
    [pin]
  );

  const rejectPin = useCallback(() => {
    setIsShaking(true);
    setPin("");
    window.setTimeout(() => setIsShaking(false), 380);
  }, []);

  const submitPin = useCallback(
    (candidate: string) => {
      const matchedRole = roleByPin.get(candidate);

      if (!matchedRole) {
        rejectPin();
        return;
      }

      setSession(persistSession(matchedRole.role));
      setPin("");
    },
    [rejectPin]
  );

  const addDigit = useCallback(
    (digit: string) => {
      setPin((currentPin) => {
        if (currentPin.length >= PIN_LENGTH) {
          return currentPin;
        }

        const nextPin = `${currentPin}${digit}`;

        if (nextPin.length === PIN_LENGTH) {
          window.setTimeout(() => submitPin(nextPin), 80);
        }

        return nextPin;
      });
    },
    [submitPin]
  );

  const clearLastDigit = useCallback(() => {
    setPin((currentPin) => currentPin.slice(0, -1));
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setPin("");
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (activeRole) {
        if (event.key === "Escape") {
          logout();
        }

        return;
      }

      if (/^[0-9]$/.test(event.key)) {
        addDigit(event.key);
        return;
      }

      if (event.key === "Backspace") {
        clearLastDigit();
        return;
      }

      if (event.key === "Escape") {
        setPin("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeRole, addDigit, clearLastDigit, logout]);

  return (
    <main className="min-h-screen overflow-hidden bg-velvet-950 bg-noir-radial text-champagne">
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(217,179,76,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(217,179,76,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />
      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-10 lg:px-12">
        <Header activeRole={activeRole} onLogout={logout} />
        {activeRole ? (
          <Dashboard roleConfig={activeRole} authenticatedAt={session?.authenticatedAt ?? Date.now()} />
        ) : (
          <PinGate
            maskedPin={maskedPin}
            isShaking={isShaking}
            onDigit={addDigit}
            onDelete={clearLastDigit}
            onClear={() => setPin("")}
          />
        )}
      </section>
    </main>
  );
}

type HeaderProps = {
  activeRole: RoleConfig | null;
  onLogout: () => void;
};

function Header({ activeRole, onLogout }: HeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-gold-400/15 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.5em] text-gold-300/80">
          Chapter 99
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-gold-50 sm:text-5xl">
          Private Touring Console
        </h1>
      </div>
      <div className="flex items-center gap-3">
        {activeRole ? (
          <>
            <span className="rounded-full border border-gold-300/25 bg-gold-300/10 px-4 py-2 text-sm font-semibold text-gold-100">
              {activeRole.label}
            </span>
            <button
              className="rounded-full border border-champagne/15 px-4 py-2 text-sm font-semibold text-champagne/80 transition hover:border-gold-300/50 hover:text-gold-100"
              onClick={onLogout}
              type="button"
            >
              Lock
            </button>
          </>
        ) : (
          <span className="rounded-full border border-gold-300/20 px-4 py-2 text-sm text-champagne/70">
            Enter staff PIN
          </span>
        )}
      </div>
    </header>
  );
}

type PinGateProps = {
  maskedPin: Array<{ id: number; filled: boolean }>;
  isShaking: boolean;
  onDigit: (digit: string) => void;
  onDelete: () => void;
  onClear: () => void;
};

function PinGate({ maskedPin, isShaking, onDigit, onDelete, onClear }: PinGateProps) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return (
    <div className="grid flex-1 place-items-center py-12">
      <div
        className={`w-full max-w-md rounded-[2rem] border border-gold-300/20 bg-velvet-900/80 p-8 shadow-aureate backdrop-blur ${isShaking ? "animate-shake" : ""}`}
      >
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-gold-300">
            Secure access
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-gold-50">
            Enter your PIN
          </h2>
          <p className="mt-3 text-sm leading-6 text-champagne/65">
            Keyboard digits, backspace, and escape are supported. Session unlock persists
            for twelve hours on this device.
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-3" aria-label="PIN progress">
          {maskedPin.map((dot) => (
            <span
              className={`h-4 w-4 rounded-full border border-gold-300/40 transition ${
                dot.filled ? "bg-gold-300 shadow-[0_0_18px_rgba(217,179,76,0.45)]" : "bg-velvet-800"
              }`}
              key={dot.id}
            />
          ))}
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          {keys.map((key) => (
            <NumpadButton key={key} label={key} onClick={() => onDigit(key)} />
          ))}
          <NumpadButton label="Clear" onClick={onClear} variant="ghost" />
          <NumpadButton label="0" onClick={() => onDigit("0")} />
          <NumpadButton label="Delete" onClick={onDelete} variant="ghost" />
        </div>

        <div className="mt-8 rounded-2xl border border-gold-300/15 bg-black/25 p-4 text-xs text-champagne/60">
          Demo routing: 9999 owner, 1111 guide, 2222 operations, 3333 sales, 4444
          safety.
        </div>
      </div>
    </div>
  );
}

type NumpadButtonProps = {
  label: string;
  onClick: () => void;
  variant?: "solid" | "ghost";
};

function NumpadButton({ label, onClick, variant = "solid" }: NumpadButtonProps) {
  return (
    <button
      className={
        variant === "solid"
          ? "rounded-2xl border border-gold-300/20 bg-gold-300/10 px-4 py-5 text-xl font-bold text-gold-50 shadow-inner-gold transition hover:-translate-y-0.5 hover:bg-gold-300/20 focus:outline-none focus:ring-2 focus:ring-gold-300/50"
          : "rounded-2xl border border-champagne/10 bg-white/5 px-4 py-5 text-sm font-semibold text-champagne/70 transition hover:border-gold-300/35 hover:text-gold-100 focus:outline-none focus:ring-2 focus:ring-gold-300/40"
      }
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

type DashboardProps = {
  roleConfig: RoleConfig;
  authenticatedAt: number;
};

function Dashboard({ roleConfig, authenticatedAt }: DashboardProps) {
  const unlockedAt = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  }).format(authenticatedAt);

  return (
    <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <section className="rounded-[2rem] border border-gold-300/20 bg-velvet-900/75 p-8 shadow-aureate backdrop-blur">
        <div
          className={`inline-flex rounded-full bg-gradient-to-r ${roleConfig.accent} bg-[length:200%_auto] px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-velvet-950 animate-shimmer`}
        >
          {roleConfig.label}
        </div>
        <h2 className="mt-6 font-display text-5xl font-bold text-gold-50 sm:text-6xl">
          {roleConfig.title}
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-champagne/72">
          {roleConfig.subtitle}
        </p>
        <p className="mt-6 text-sm text-champagne/50">Unlocked at {unlockedAt}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {roleConfig.stats.map((stat) => (
            <article
              className="rounded-3xl border border-gold-300/15 bg-black/25 p-5"
              key={stat.label}
            >
              <p className="text-xs uppercase tracking-[0.25em] text-champagne/45">
                {stat.label}
              </p>
              <p className={`mt-3 text-3xl font-bold ${stat.tone}`}>{stat.value}</p>
            </article>
          ))}
        </div>
      </section>

      <aside className="rounded-[2rem] border border-gold-300/20 bg-black/35 p-6 backdrop-blur">
        <h3 className="font-display text-3xl font-bold text-gold-50">Quick actions</h3>
        <div className="mt-6 space-y-4">
          {roleConfig.actions.map((action) => (
            <button
              className="group flex w-full items-center justify-between rounded-3xl border border-gold-300/15 bg-velvet-850/80 px-5 py-4 text-left font-semibold text-champagne transition hover:border-gold-300/45 hover:bg-gold-300/10"
              key={action}
              type="button"
            >
              <span>{action}</span>
              <span className="rounded-full bg-gold-300/15 px-3 py-1 text-gold-100 transition group-hover:bg-gold-300/25">
                Open
              </span>
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}

export default App;
