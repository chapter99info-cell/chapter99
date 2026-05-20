import type { Tour } from "../types";

export const featuredTours: Tour[] = [
  {
    id: "tas-luxe-001",
    slug: "tasmanian-light-chase",
    title: "Tasmanian Light Chase",
    region: "Cradle Mountain, Bay of Fires, Freycinet",
    duration: "7 days / 6 nights",
    priceAud: 9800,
    capacity: 8,
    heroImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      "Golden-hour landscape coaching with accredited local guides",
      "Private lodge stays with curated Australian wine pairings",
      "Night-sky and astrophotography masterclass",
    ],
    inclusions: [
      "Luxury transfers from Hobart",
      "All park access permits and guide fees",
      "Daily image critique and post-processing salons",
    ],
    complianceNotes: [
      "GST-inclusive AUD pricing",
      "Australian Consumer Law refund terms surfaced before checkout",
      "Emergency contact and dietary records stored with consent",
    ],
  },
  {
    id: "kim-luxe-002",
    slug: "kimberley-aerial-expedition",
    title: "Kimberley Aerial Expedition",
    region: "Broome, Horizontal Falls, Mitchell Plateau",
    duration: "6 days / 5 nights",
    priceAud: 12400,
    capacity: 6,
    heroImage:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      "Doors-off helicopter compositions with safety briefing",
      "Cultural access coordinated with Traditional Owner partners",
      "Medium-format kit handling support",
    ],
    inclusions: [
      "Boutique station accommodation",
      "Aviation transfers and ground logistics",
      "Satellite communications and remote-area safety pack",
    ],
    complianceNotes: [
      "Supplier insurance details tracked in CRM",
      "Remote travel waivers recorded per traveller",
      "Media release consent separated from booking terms",
    ],
  },
  {
    id: "syd-luxe-003",
    slug: "sydney-harbour-after-dark",
    title: "Sydney Harbour After Dark",
    region: "Sydney CBD, Barangaroo, North Head",
    duration: "3 days / 2 nights",
    priceAud: 4200,
    capacity: 10,
    heroImage:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      "Architectural long exposure routes with concierge access",
      "Private harbour charter at blue hour",
      "Street portrait practicum with model releases",
    ],
    inclusions: [
      "Five-star hotel base",
      "Curated dining reservations",
      "Secure cloud gallery delivery",
    ],
    complianceNotes: [
      "Privacy Act collection notice linked at enquiry",
      "Card surcharge disclosure ready for payment step",
      "NSW public liability certificate attached to supplier record",
    ],
  },
];
