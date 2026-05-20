import type { Booking, ClientRecord } from "../types";

export const bookings: Booking[] = [
  {
    id: "BKG-2401",
    clientName: "Amelia Hart",
    tourTitle: "Tasmanian Light Chase",
    status: "confirmed",
    travelWindow: "Aug 2026",
    valueAud: 19600,
    owner: "Concierge",
    lastTouchpoint: "Deposit receipt sent",
  },
  {
    id: "BKG-2402",
    clientName: "Noah Chen",
    tourTitle: "Kimberley Aerial Expedition",
    status: "proposal_sent",
    travelWindow: "Sep 2026",
    valueAud: 24800,
    owner: "Operations",
    lastTouchpoint: "Aviation terms awaiting approval",
  },
  {
    id: "BKG-2403",
    clientName: "Priya Raman",
    tourTitle: "Sydney Harbour After Dark",
    status: "qualified",
    travelWindow: "Nov 2026",
    valueAud: 8400,
    owner: "Guide",
    lastTouchpoint: "Lens preference captured",
  },
];

export const clients: ClientRecord[] = [
  {
    id: "CL-102",
    name: "Amelia Hart",
    email: "amelia@example.com",
    phone: "+61 400 111 222",
    consentStatus: "captured",
    location: "Melbourne, VIC",
    lifetimeValueAud: 29400,
  },
  {
    id: "CL-103",
    name: "Noah Chen",
    email: "noah@example.com",
    phone: "+61 411 333 444",
    consentStatus: "pending",
    location: "Singapore",
    lifetimeValueAud: 24800,
  },
  {
    id: "CL-104",
    name: "Priya Raman",
    email: "priya@example.com",
    phone: "+61 422 555 666",
    consentStatus: "captured",
    location: "Brisbane, QLD",
    lifetimeValueAud: 8400,
  },
];
