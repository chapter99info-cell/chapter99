import { LockKeyhole, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import type { StaffSession } from "../types";
import { storeStaffSession, verifyStaffPin } from "../lib/pin-auth";
import { isSupabaseConfigured } from "../lib/supabase";

interface PinGateProps {
  onAuthenticated: (session: StaffSession) => void;
}

export function PinGate({ onAuthenticated }: PinGateProps) {
  const [pin, setPin] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsVerifying(true);

    try {
      const session = await verifyStaffPin(pin);
      storeStaffSession(session);
      onAuthenticated(session);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "PIN verification failed.");
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <section className="mx-auto grid min-h-[620px] w-full max-w-5xl items-center gap-8 lg:grid-cols-[1fr_0.85fr]">
      <div className="space-y-6">
        <p className="eyebrow">Internal staff access</p>
        <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.04em] text-ivory md:text-7xl">
          Secure operations without email/password friction.
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-stone-300">
          Trip2Talk V4 uses a four-digit PIN interface for guides, concierge and operations
          teams. Production checks are delegated to Supabase RPC and auditable session records.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {["Role-aware CRM", "Real-time tour ops", "Australia compliance"].map((item) => (
            <div className="rounded-2xl border border-gold/20 bg-white/[0.04] p-4 text-sm text-stone-200" key={item}>
              <ShieldCheck className="mb-3 h-5 w-5 text-gold" />
              {item}
            </div>
          ))}
        </div>
      </div>

      <form className="panel-luxury p-8" onSubmit={handleSubmit}>
        <div className="mb-8 flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gold text-jet">
            <LockKeyhole className="h-7 w-7" />
          </span>
          <div>
            <h2 className="text-2xl font-semibold text-ivory">Enter staff PIN</h2>
            <p className="text-sm text-stone-400">
              {isSupabaseConfigured ? "Supabase verification enabled" : "Preview mode PIN: 1937"}
            </p>
          </div>
        </div>

        <label className="mb-3 block text-sm font-medium text-stone-300" htmlFor="pin">
          4-digit PIN
        </label>
        <input
          autoComplete="one-time-code"
          className="w-full rounded-2xl border border-gold/30 bg-black/50 px-5 py-4 text-center text-4xl font-semibold tracking-[0.5em] text-gold outline-none ring-0 transition focus:border-gold focus:shadow-[0_0_0_4px_rgba(212,175,55,0.12)]"
          id="pin"
          inputMode="numeric"
          maxLength={4}
          pattern="[0-9]{4}"
          value={pin}
          onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 4))}
        />

        {error ? <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}

        <button className="button-gold mt-6 w-full" disabled={isVerifying || pin.length !== 4} type="submit">
          {isVerifying ? "Verifying..." : "Unlock staff console"}
        </button>
      </form>
    </section>
  );
}
