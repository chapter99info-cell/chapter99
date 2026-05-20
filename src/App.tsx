import { useEffect, useState } from "react";
import { GuestExperience } from "./components/GuestExperience";
import { PinGate } from "./components/PinGate";
import { StaffConsole } from "./components/StaffConsole";
import { readStoredStaffSession } from "./lib/pin-auth";
import type { AppInterface, StaffSession } from "./types";

function initialInterface(): AppInterface {
  const params = new URLSearchParams(window.location.search);
  return params.get("interface") === "staff" ? "staff" : "guest";
}

function App() {
  const [activeInterface, setActiveInterface] = useState<AppInterface>(initialInterface);
  const [staffSession, setStaffSession] = useState<StaffSession | null>(() => readStoredStaffSession());

  useEffect(() => {
    const url = new URL(window.location.href);
    if (activeInterface === "staff") {
      url.searchParams.set("interface", "staff");
    } else {
      url.searchParams.delete("interface");
    }
    window.history.replaceState(null, "", url);
  }, [activeInterface]);

  return (
    <main className="min-h-screen bg-jet text-stone-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.16),transparent_32rem),linear-gradient(135deg,#050505,#141414_45%,#050505)]" />
      <header className="sticky top-0 z-50 border-b border-white/10 bg-jet/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <button className="flex items-center gap-3" onClick={() => setActiveInterface("guest")} type="button">
            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-gold/40 bg-gold/10 text-lg font-bold text-gold">
              T2
            </span>
            <span className="text-left">
              <span className="block text-sm uppercase tracking-[0.35em] text-gold">Trip2Talk</span>
              <span className="block text-xs text-stone-500">V4 PWA + CRM</span>
            </span>
          </button>

          <div className="flex rounded-full border border-white/10 bg-white/[0.04] p-1 text-sm">
            <button
              className={`rounded-full px-4 py-2 transition ${
                activeInterface === "guest" ? "bg-gold text-jet" : "text-stone-300 hover:text-ivory"
              }`}
              onClick={() => setActiveInterface("guest")}
              type="button"
            >
              Guest PWA
            </button>
            <button
              className={`rounded-full px-4 py-2 transition ${
                activeInterface === "staff" ? "bg-gold text-jet" : "text-stone-300 hover:text-ivory"
              }`}
              onClick={() => setActiveInterface("staff")}
              type="button"
            >
              Staff PIN
            </button>
          </div>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 md:py-12">
        {activeInterface === "guest" ? (
          <GuestExperience />
        ) : staffSession ? (
          <StaffConsole
            session={staffSession}
            onSignOut={() => {
              setStaffSession(null);
              setActiveInterface("guest");
            }}
          />
        ) : (
          <PinGate onAuthenticated={setStaffSession} />
        )}
      </div>
    </main>
  );
}

export default App;
