import type { IntegrationEvent } from "../types";
import { supabase } from "./supabase";

export async function queueIntegrationEvent(event: IntegrationEvent) {
  if (!supabase) {
    console.info("Integration event queued locally until Supabase is configured", event);
    return { queued: false, mode: "local-preview" as const };
  }

  const { error } = await supabase.from("integration_events").insert({
    channel: event.channel,
    event_type: event.eventType,
    payload: event.payload,
  });

  if (error) {
    throw error;
  }

  return { queued: true, mode: "supabase" as const };
}

export const integrationBlueprint = [
  {
    channel: "google_sheets",
    purpose: "Append booking pipeline rows and finance reconciliation snapshots.",
    boundary: "Supabase Edge Function with Google service account credentials.",
  },
  {
    channel: "google_drive",
    purpose: "Create client gallery folders and supplier compliance document vaults.",
    boundary: "Supabase Edge Function with scoped Drive API access.",
  },
  {
    channel: "twilio",
    purpose: "Send operational SMS updates, emergency reminders and concierge check-ins.",
    boundary: "Server-side SMS worker; never expose Twilio credentials in the PWA.",
  },
  {
    channel: "resend",
    purpose: "Send branded proposal, receipt and pre-departure email journeys.",
    boundary: "Server-side email worker with consent-aware templates.",
  },
] as const;
