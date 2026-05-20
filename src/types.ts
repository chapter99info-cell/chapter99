export type AppInterface = "guest" | "staff";

export type StaffRole = "admin" | "operations" | "guide" | "concierge";

export type BookingStatus =
  | "inquiry"
  | "qualified"
  | "proposal_sent"
  | "confirmed"
  | "in_tour"
  | "completed";

export type IntegrationChannel = "google_sheets" | "google_drive" | "twilio" | "resend";

export interface Tour {
  id: string;
  slug: string;
  title: string;
  region: string;
  duration: string;
  priceAud: number;
  capacity: number;
  heroImage: string;
  highlights: string[];
  inclusions: string[];
  complianceNotes: string[];
}

export interface Booking {
  id: string;
  clientName: string;
  tourTitle: string;
  status: BookingStatus;
  travelWindow: string;
  valueAud: number;
  owner: string;
  lastTouchpoint: string;
}

export interface ClientRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  consentStatus: "captured" | "pending";
  location: string;
  lifetimeValueAud: number;
}

export interface StaffSession {
  token: string;
  role: StaffRole;
  label: string;
  expiresAt: string;
}

export interface IntegrationEvent {
  channel: IntegrationChannel;
  eventType: string;
  payload: Record<string, unknown>;
}
