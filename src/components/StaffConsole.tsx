import {
  BellRing,
  CalendarCheck,
  Cloud,
  DatabaseZap,
  FileText,
  LogOut,
  MessageSquareText,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { bookings, clients } from "../data/crm";
import { integrationBlueprint, queueIntegrationEvent } from "../lib/integrations";
import { clearStoredStaffSession } from "../lib/pin-auth";
import type { BookingStatus, StaffSession } from "../types";

interface StaffConsoleProps {
  session: StaffSession;
  onSignOut: () => void;
}

const statusLabels: Record<BookingStatus, string> = {
  inquiry: "Inquiry",
  qualified: "Qualified",
  proposal_sent: "Proposal sent",
  confirmed: "Confirmed",
  in_tour: "In tour",
  completed: "Completed",
};

const statusStyles: Record<BookingStatus, string> = {
  inquiry: "border-stone-500/30 text-stone-300",
  qualified: "border-blue-400/30 text-blue-200",
  proposal_sent: "border-gold/40 text-gold",
  confirmed: "border-emerald-400/30 text-emerald-200",
  in_tour: "border-purple-400/30 text-purple-200",
  completed: "border-stone-300/30 text-stone-200",
};

const formatter = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

export function StaffConsole({ session, onSignOut }: StaffConsoleProps) {
  const [eventState, setEventState] = useState<string>("Integration queue idle");
  const pipelineValue = useMemo(
    () => bookings.reduce((total, booking) => total + booking.valueAud, 0),
    [],
  );

  function signOut() {
    clearStoredStaffSession();
    onSignOut();
  }

  async function queueDemoEvent() {
    setEventState("Queuing concierge email event...");
    try {
      const result = await queueIntegrationEvent({
        channel: "resend",
        eventType: "proposal_ready",
        payload: {
          booking_id: bookings[1].id,
          template: "luxury-proposal",
          requested_by: session.label,
        },
      });
      setEventState(result.queued ? "Event queued in Supabase" : "Preview event logged locally");
    } catch (error) {
      setEventState(error instanceof Error ? error.message : "Unable to queue integration event");
    }
  }

  return (
    <div className="space-y-8">
      <section className="panel-luxury flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="eyebrow">PIN session active</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-ivory">
            Welcome, {session.label}
          </h1>
          <p className="mt-2 text-sm text-stone-400">
            Role: {session.role} · Session expires {new Date(session.expiresAt).toLocaleString("en-AU")}
          </p>
        </div>
        <button className="button-ghost" onClick={signOut} type="button">
          <LogOut className="h-5 w-5" /> Lock console
        </button>
      </section>

      <section className="grid gap-5 md:grid-cols-4">
        {[
          { icon: CalendarCheck, label: "Pipeline value", value: formatter.format(pipelineValue) },
          { icon: Users, label: "Active clients", value: clients.length.toString() },
          { icon: ShieldCheck, label: "Consent captured", value: "67%" },
          { icon: DatabaseZap, label: "Realtime source", value: "Supabase" },
        ].map(({ icon: Icon, label, value }) => (
          <article className="rounded-3xl border border-gold/15 bg-white/[0.04] p-5" key={label}>
            <Icon className="h-6 w-6 text-gold" />
            <p className="mt-5 text-sm text-stone-500">{label}</p>
            <p className="mt-1 text-3xl font-semibold text-ivory">{value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.35fr_0.85fr]">
        <div className="panel-luxury overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 p-6">
            <div>
              <p className="eyebrow">CRM pipeline</p>
              <h2 className="mt-2 text-2xl font-semibold text-ivory">Bookings command board</h2>
            </div>
            <BellRing className="h-6 w-6 text-gold" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.2em] text-stone-500">
                <tr>
                  <th className="px-6 py-4">Booking</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Travel</th>
                  <th className="px-6 py-4">Owner</th>
                  <th className="px-6 py-4">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {bookings.map((booking) => (
                  <tr className="text-stone-300" key={booking.id}>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-ivory">{booking.id}</p>
                      <p className="text-xs text-stone-500">{booking.tourTitle}</p>
                    </td>
                    <td className="px-6 py-4">{booking.clientName}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full border px-3 py-1 text-xs ${statusStyles[booking.status]}`}>
                        {statusLabels[booking.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">{booking.travelWindow}</td>
                    <td className="px-6 py-4">{booking.owner}</td>
                    <td className="px-6 py-4 text-gold">{formatter.format(booking.valueAud)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="panel-luxury p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Integrations</p>
                <h2 className="mt-2 text-2xl font-semibold text-ivory">Server-side event queue</h2>
              </div>
              <Cloud className="h-7 w-7 text-gold" />
            </div>
            <div className="mt-5 space-y-3">
              {integrationBlueprint.map((integration) => (
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4" key={integration.channel}>
                  <p className="font-semibold text-ivory">{integration.channel.replace("_", " ")}</p>
                  <p className="mt-1 text-xs leading-5 text-stone-400">{integration.purpose}</p>
                </div>
              ))}
            </div>
            <button className="button-gold mt-5 w-full" onClick={queueDemoEvent} type="button">
              <MessageSquareText className="h-5 w-5" /> Queue proposal email
            </button>
            <p className="mt-3 text-xs text-stone-500">{eventState}</p>
          </div>

          <div className="panel-luxury p-6">
            <FileText className="h-7 w-7 text-gold" />
            <h2 className="mt-4 text-2xl font-semibold text-ivory">Compliance workspace</h2>
            <ul className="mt-4 space-y-3 text-sm text-stone-300">
              <li>Privacy collection notice attached to each enquiry.</li>
              <li>ACL cancellation disclosure checkpoint before deposit.</li>
              <li>Supplier insurance and permits tracked per itinerary.</li>
              <li>SMS/email consent stored independently from booking terms.</li>
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}
