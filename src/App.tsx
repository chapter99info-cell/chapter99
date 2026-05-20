import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";

type AccessRole = "public" | "staff" | "cohost" | "owner" | "platform";
type VisitorMode = "photographer" | "model";

type PinProfile = {
  role: AccessRole;
  label: string;
  subtitle: string;
  permissions: string[];
};

type TourCard = {
  id: string;
  title: string;
  region: string;
  departure: string;
  seatsLeft: number;
  price: number;
};

type BookingRow = {
  client: string;
  tour: string;
  channel: "Staff" | "Direct" | "Partner";
  installment: string;
  visa: string;
  commission: number;
};

type ExpenseDraft = {
  fileName: string;
  amount: string;
  category: "Fuel" | "Lodge" | "Meals";
};

const GOLD = "#D4AF37";

const PIN_MATRIX: Record<string, PinProfile> = {
  "1111": {
    role: "staff",
    label: "Tour Staff - Ploy",
    subtitle: "Assigned guests, PayID visibility, commission tracking",
    permissions: [
      "View assigned customer manifests",
      "Track $50-$100 per-head commission accrual",
      "Highlight visa-processing rows before departure",
    ],
  },
  "4444": {
    role: "cohost",
    label: "Co-Host / Cashier",
    subtitle: "POS, booking intake, installment controls",
    permissions: [
      "Create and adjust booking records",
      "Override installment plans and package pricing",
      "Swap PayID billing channels for approved exceptions",
    ],
  },
  "9999": {
    role: "owner",
    label: "Studio Owner - Saen",
    subtitle: "Profit cockpit, legal view, safety briefing unlock",
    permissions: [
      "Monitor live net profit and settlement due",
      "Capture ATO-ready receipts with Quick Expense Drop",
      "Access 24-hour safety briefings and encrypted medical summaries",
    ],
  },
  "3501": {
    role: "platform",
    label: "Platform Admin",
    subtitle: "Tenant diagnostics, health checks, scaling visibility",
    permissions: [
      "Inspect multi-studio health metrics",
      "Monitor server load and integration backlogs",
      "Review billing and tenant activation state",
    ],
  },
};

const TOURS: TourCard[] = [
  {
    id: "T2T-GOR-0426",
    title: "Great Ocean Road Golden Hour",
    region: "Victoria",
    departure: "26 Apr 2026",
    seatsLeft: 2,
    price: 349,
  },
  {
    id: "T2T-TAS-0508",
    title: "Tasmania Aurora Portrait Run",
    region: "Tasmania",
    departure: "8 May 2026",
    seatsLeft: 5,
    price: 1280,
  },
  {
    id: "T2T-NZV-0614",
    title: "Snowline Visa-Ready Editorial",
    region: "Queenstown",
    departure: "14 Jun 2026",
    seatsLeft: 1,
    price: 2190,
  },
];

const BOOKINGS: BookingRow[] = [
  {
    client: "Mali T.",
    tour: "Great Ocean Road",
    channel: "Staff",
    installment: "$100 deposit paid / $249 due",
    visa: "No visa action",
    commission: 75,
  },
  {
    client: "Beam K.",
    tour: "Snowline Editorial",
    channel: "Staff",
    installment: "$500 paid / $1,690 due",
    visa: "NZ visa required",
    commission: 100,
  },
  {
    client: "Nicha S.",
    tour: "Tasmania Aurora",
    channel: "Direct",
    installment: "$100 deposit paid / $1,180 due",
    visa: "Student OSHC pending",
    commission: 0,
  },
];

const SYSTEM_HEALTH = [
  { label: "Supabase realtime", value: "Healthy", tone: "text-emerald-300" },
  { label: "Drive receipt queue", value: "2 pending", tone: "text-amber-200" },
  { label: "Twilio SMS", value: "Ready", tone: "text-emerald-300" },
  { label: "Policy lock", value: "Clear", tone: "text-emerald-300" },
];

function App() {
  const [pin, setPin] = useState("");
  const [profile, setProfile] = useState<PinProfile | null>(null);
  const [pinError, setPinError] = useState("");
  const [mode, setMode] = useState<VisitorMode>("photographer");
  const [expense, setExpense] = useState<ExpenseDraft>({
    fileName: "",
    amount: "",
    category: "Fuel",
  });
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const role = profile?.role ?? "public";

  const totalCommission = useMemo(
    () => BOOKINGS.reduce((sum, row) => sum + row.commission, 0),
    [],
  );

  const ownerSettlement = useMemo(() => {
    const collected = 4580;
    const operatingExpenses = 1265;
    return {
      collected,
      staffDue: totalCommission,
      net: collected - operatingExpenses - totalCommission,
      margin: Math.round(
        ((collected - operatingExpenses - totalCommission) / collected) * 100,
      ),
    };
  }, [totalCommission]);

  function handlePinSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextProfile = PIN_MATRIX[pin];

    if (!nextProfile) {
      setPinError("Invalid PIN. Public portfolio mode remains active.");
      setProfile(null);
      return;
    }

    setPinError("");
    setProfile(nextProfile);
  }

  function handleCameraCapture(event: ChangeEvent<HTMLInputElement>) {
    const receipt = event.target.files?.[0];

    if (!receipt) {
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    setExpense((current) => ({
      ...current,
      fileName: `T2T-GOR-0426_${today}_${current.amount || "AMOUNT"}_Receipt.jpg`,
    }));
  }

  return (
    <main className="min-h-screen text-stone-100">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-5 rounded-[2rem] border border-[#D4AF37]/25 bg-black/45 p-6 shadow-2xl shadow-black/40 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#D4AF37]">
              Trip2Talk V4
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Luxury Photography Tour PWA + CRM
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-300 sm:text-base">
              A dark-and-gold operating shell for premium tour bookings,
              staff-led PayID settlement, Australian compliance, safety
              briefings, and ATO-ready expense capture.
            </p>
          </div>

          <form
            onSubmit={handlePinSubmit}
            className="rounded-3xl border border-white/10 bg-stone-950/80 p-4"
          >
            <label
              htmlFor="pin"
              className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400"
            >
              Secure 4-digit PIN
            </label>
            <div className="mt-3 flex gap-2">
              <input
                id="pin"
                inputMode="numeric"
                maxLength={4}
                pattern="[0-9]{4}"
                value={pin}
                onChange={(event) => setPin(event.target.value)}
                placeholder="Public"
                className="w-32 rounded-2xl border border-white/10 bg-black px-4 py-3 text-center text-lg tracking-[0.35em] text-[#D4AF37] outline-none transition focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                className="rounded-2xl bg-[#D4AF37] px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-black transition hover:bg-amber-300"
              >
                Unlock
              </button>
            </div>
            {pinError ? (
              <p className="mt-2 text-xs text-rose-300">{pinError}</p>
            ) : (
              <p className="mt-2 text-xs text-stone-500">
                Public, 1111, 4444, 9999, 3501
              </p>
            )}
          </form>
        </header>

        <AccessBanner profile={profile} />

        {role === "public" && (
          <PublicPortfolio mode={mode} onModeChange={setMode} />
        )}
        {role === "staff" && <StaffDashboard totalCommission={totalCommission} />}
        {role === "cohost" && <CoHostDashboard />}
        {role === "owner" && (
          <OwnerDashboard
            settlement={ownerSettlement}
            expense={expense}
            onExpenseChange={setExpense}
            cameraInputRef={cameraInputRef}
            onCameraCapture={handleCameraCapture}
          />
        )}
        {role === "platform" && <PlatformHub />}
      </section>
    </main>
  );
}

function AccessBanner({ profile }: { profile: PinProfile | null }) {
  if (!profile) {
    return (
      <section className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-sm font-semibold text-[#D4AF37]">Public access</p>
          <h2 className="mt-2 text-2xl font-semibold">
            Seasonal portfolio, availability, and booking intent capture
          </h2>
        </div>
        <p className="text-sm leading-6 text-stone-300">
          Visitors can browse premium landscapes, switch between photographer
          and model planning modes, and see low-seat urgency badges before
          moving into the booking flow.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[2rem] border border-[#D4AF37]/30 bg-[#D4AF37]/10 p-5">
      <p className="text-sm font-semibold text-[#D4AF37]">{profile.label}</p>
      <h2 className="mt-2 text-2xl font-semibold">{profile.subtitle}</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {profile.permissions.map((permission) => (
          <span
            key={permission}
            className="rounded-full border border-[#D4AF37]/25 bg-black/40 px-3 py-1 text-xs text-stone-200"
          >
            {permission}
          </span>
        ))}
      </div>
    </section>
  );
}

function PublicPortfolio({
  mode,
  onModeChange,
}: {
  mode: VisitorMode;
  onModeChange: (mode: VisitorMode) => void;
}) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-stone-950 shadow-2xl shadow-black/40">
        <div className="min-h-[28rem] bg-[radial-gradient(circle_at_25%_20%,rgba(212,175,55,0.35),transparent_18rem),linear-gradient(135deg,#0b0b0b,#252016_48%,#050505)] p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#D4AF37]">
            Masterpiece gallery
          </p>
          <h2 className="mt-16 max-w-2xl text-5xl font-semibold leading-tight">
            Australian light, cinematic portraits, and travel compliance in one
            operating system.
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-6 text-stone-300">
            Built for small-group photography tours where guest experience,
            legal evidence, and settlement clarity must stay synchronized.
          </p>
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
        <div className="flex rounded-full border border-white/10 bg-black/50 p-1">
          {(["photographer", "model"] as const).map((nextMode) => (
            <button
              key={nextMode}
              type="button"
              onClick={() => onModeChange(nextMode)}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
                mode === nextMode
                  ? "bg-[#D4AF37] text-black"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              {nextMode} mode
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-3xl bg-black/40 p-5">
          <h3 className="text-xl font-semibold">
            {mode === "photographer"
              ? "Coordinates, light windows, gear notes"
              : "Outfit ideas, posing prep, weather cues"}
          </h3>
          <p className="mt-3 text-sm leading-6 text-stone-300">
            {mode === "photographer"
              ? "Surface sunrise and blue-hour plans, focal length suggestions, drone restrictions, and tripod-safe lookout notes."
              : "Recommend wind-safe silhouettes, warm layers, color palettes against sandstone and snow, and comfort-first footwear."}
          </p>
        </div>

        <div className="mt-5 space-y-3">
          {TOURS.map((tour) => (
            <TourAvailability key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TourAvailability({ tour }: { tour: TourCard }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-stone-950/80 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#D4AF37]">{tour.id}</p>
          <h3 className="mt-1 text-lg font-semibold">{tour.title}</h3>
          <p className="text-sm text-stone-400">
            {tour.region} - {tour.departure}
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold">${tour.price}</p>
          <span
            className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              tour.seatsLeft <= 2
                ? "bg-rose-400/15 text-rose-200"
                : "bg-emerald-400/15 text-emerald-200"
            }`}
          >
            {tour.seatsLeft <= 2
              ? `Only ${tour.seatsLeft} seats left!`
              : `${tour.seatsLeft} seats left`}
          </span>
        </div>
      </div>
    </article>
  );
}

function StaffDashboard({ totalCommission }: { totalCommission: number }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#D4AF37]">Staff cockpit</p>
          <h2 className="text-3xl font-semibold">Assigned client tracker</h2>
        </div>
        <div className="rounded-3xl border border-[#D4AF37]/30 bg-black/50 px-5 py-3">
          <p className="text-xs uppercase tracking-[0.24em] text-stone-400">
            Commission due
          </p>
          <p className="text-2xl font-semibold text-[#D4AF37]">
            ${totalCommission}
          </p>
        </div>
      </div>
      <BookingTable staffMode />
    </section>
  );
}

function CoHostDashboard() {
  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
        <p className="text-sm font-semibold text-[#D4AF37]">POS module</p>
        <h2 className="mt-2 text-3xl font-semibold">Booking entry controls</h2>
        <div className="mt-5 grid gap-3">
          {["Package price override", "Installment schedule", "PayID channel"].map(
            (field) => (
              <label key={field} className="grid gap-2 text-sm text-stone-300">
                {field}
                <input
                  className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#D4AF37]"
                  placeholder={`Enter ${field.toLowerCase()}`}
                />
              </label>
            ),
          )}
          <button className="mt-2 rounded-2xl bg-[#D4AF37] px-5 py-3 font-bold text-black">
            Save booking adjustment
          </button>
        </div>
      </div>
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
        <BookingTable />
      </div>
    </section>
  );
}

function OwnerDashboard({
  settlement,
  expense,
  onExpenseChange,
  cameraInputRef,
  onCameraCapture,
}: {
  settlement: { collected: number; staffDue: number; net: number; margin: number };
  expense: ExpenseDraft;
  onExpenseChange: (expense: ExpenseDraft) => void;
  cameraInputRef: React.RefObject<HTMLInputElement | null>;
  onCameraCapture: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
        <p className="text-sm font-semibold text-[#D4AF37]">Owner hub</p>
        <h2 className="mt-2 text-3xl font-semibold">
          Real-time net settlement
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Metric label="Total collected" value={`$${settlement.collected}`} />
          <Metric label="Staff commission due" value={`$${settlement.staffDue}`} />
          <Metric label="Net settlement amount" value={`$${settlement.net}`} />
          <Metric label="Net profit margin" value={`${settlement.margin}%`} />
        </div>

        <div className="mt-5 rounded-3xl border border-rose-300/20 bg-rose-950/20 p-5">
          <p className="text-sm font-semibold text-rose-200">
            24-hour Safety Briefing - Owner only
          </p>
          <p className="mt-2 text-sm leading-6 text-stone-300">
            Encrypted medical profile summary becomes visible here exactly 24
            hours before departure. Allergy and critical medication records are
            never exposed to staff or co-host views.
          </p>
        </div>
      </div>

      <div className="rounded-[2rem] border border-[#D4AF37]/25 bg-[#D4AF37]/10 p-5">
        <p className="text-sm font-semibold text-[#D4AF37]">
          Quick Expense Drop
        </p>
        <h2 className="mt-2 text-3xl font-semibold">ATO-ready receipt capture</h2>
        <div className="mt-5 grid gap-3">
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={onCameraCapture}
          />
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="rounded-2xl bg-[#D4AF37] px-5 py-3 font-bold text-black"
          >
            Open device camera
          </button>
          <label className="grid gap-2 text-sm text-stone-300">
            Amount
            <input
              inputMode="decimal"
              value={expense.amount}
              onChange={(event) =>
                onExpenseChange({ ...expense, amount: event.target.value })
              }
              placeholder="129.50"
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#D4AF37]"
            />
          </label>
          <label className="grid gap-2 text-sm text-stone-300">
            Category
            <select
              value={expense.category}
              onChange={(event) =>
                onExpenseChange({
                  ...expense,
                  category: event.target.value as ExpenseDraft["category"],
                })
              }
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#D4AF37]"
            >
              <option>Fuel</option>
              <option>Lodge</option>
              <option>Meals</option>
            </select>
          </label>
          <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
              Structured file name
            </p>
            <p className="mt-2 break-all text-sm text-stone-200">
              {expense.fileName || "Capture a receipt to generate file name"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlatformHub() {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
      <p className="text-sm font-semibold text-[#D4AF37]">Platform hub</p>
      <h2 className="mt-2 text-3xl font-semibold">
        Tenant diagnostics and integration health
      </h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {SYSTEM_HEALTH.map((item) => (
          <div
            key={item.label}
            className="rounded-3xl border border-white/10 bg-black/50 p-5"
          >
            <p className="text-sm text-stone-400">{item.label}</p>
            <p className={`mt-2 text-2xl font-semibold ${item.tone}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function BookingTable({ staffMode = false }: { staffMode?: boolean }) {
  return (
    <div className="mt-5 overflow-hidden rounded-3xl border border-white/10">
      <div className="grid grid-cols-5 bg-black/70 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
        <span>Client</span>
        <span>Tour</span>
        <span>Channel</span>
        <span>Installment</span>
        <span>{staffMode ? "Visa / commission" : "Visa"}</span>
      </div>
      {BOOKINGS.map((booking) => (
        <div
          key={`${booking.client}-${booking.tour}`}
          className="grid grid-cols-5 gap-3 border-t border-white/10 px-4 py-4 text-sm text-stone-200"
        >
          <span className="font-semibold">{booking.client}</span>
          <span>{booking.tour}</span>
          <span>{booking.channel}</span>
          <span>{booking.installment}</span>
          <span>
            <span
              className={`rounded-full px-2 py-1 text-xs ${
                booking.visa.toLowerCase().includes("required") ||
                booking.visa.toLowerCase().includes("pending")
                  ? "bg-amber-300/15 text-amber-100"
                  : "bg-emerald-300/15 text-emerald-100"
              }`}
            >
              {booking.visa}
            </span>
            {staffMode && booking.commission > 0 ? (
              <span className="ml-2 text-[#D4AF37]">+${booking.commission}</span>
            ) : null}
          </span>
        </div>
      ))}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/50 p-5">
      <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold" style={{ color: GOLD }}>
        {value}
      </p>
    </div>
  );
}

export default App;
