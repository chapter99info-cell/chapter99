import { ArrowRight, Camera, CheckCircle2, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { featuredTours } from "../data/tours";

const formatter = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

export function GuestExperience() {
  return (
    <div className="space-y-16">
      <section className="hero-grid min-h-[720px] overflow-hidden rounded-[2rem] border border-gold/15 bg-charcoal shadow-2xl">
        <div className="relative z-10 flex flex-col justify-center p-8 md:p-14">
          <p className="eyebrow">Luxury Australian photography tours</p>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.055em] text-ivory md:text-7xl">
            Capture rare light with a concierge team behind every frame.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">
            Trip2Talk V4 blends premium tour discovery, guided booking journeys, client
            galleries and a real-time CRM for photography experiences across Australia.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a className="button-gold" href="#tours">
              Explore signature tours <ArrowRight className="h-5 w-5" />
            </a>
            <a className="button-ghost" href="#compliance">
              View compliance posture
            </a>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["GST-ready", "AUD pricing and booking terms"],
              ["Consent-led", "Privacy and media releases"],
              ["Realtime", "Supabase-backed CRM events"],
            ].map(([title, body]) => (
              <div className="rounded-2xl border border-white/10 bg-black/35 p-4" key={title}>
                <p className="text-lg font-semibold text-gold">{title}</p>
                <p className="mt-1 text-sm text-stone-400">{body}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative min-h-[420px]">
          <img
            alt="Luxury photography tour landscape"
            className="absolute inset-0 h-full w-full object-cover"
            src={featuredTours[0].heroImage}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/10 via-black/35 to-jet" />
          <div className="absolute bottom-8 left-8 right-8 rounded-3xl border border-gold/20 bg-black/60 p-5 backdrop-blur">
            <p className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-gold">
              <Camera className="h-4 w-4" /> Next departure
            </p>
            <p className="mt-3 text-2xl font-semibold text-ivory">Tasmanian Light Chase</p>
            <p className="text-stone-300">7-seat premium cohort, waitlist enabled</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            icon: Sparkles,
            title: "Premium guest journey",
            body: "Discovery, qualification, proposal and deposit milestones are designed for high-value travel decisions.",
          },
          {
            icon: ShieldCheck,
            title: "Australian compliance",
            body: "ACL disclosures, Privacy Act consent, GST pricing and supplier records are visible from the booking workflow.",
          },
          {
            icon: MapPin,
            title: "Operational command",
            body: "Guides and concierge staff unlock role-specific workflows using secure PIN sessions.",
          },
        ].map(({ icon: Icon, title, body }) => (
          <article className="panel-luxury p-6" key={title}>
            <Icon className="h-8 w-8 text-gold" />
            <h2 className="mt-5 text-2xl font-semibold text-ivory">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-stone-400">{body}</p>
          </article>
        ))}
      </section>

      <section className="space-y-6" id="tours">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Signature itineraries</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-ivory">Designed for serious image makers.</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-stone-400">
            Tour cards are ready to be hydrated from Supabase and replicated into Google Sheets for
            finance and operations reporting.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {featuredTours.map((tour) => (
            <article className="group overflow-hidden rounded-[1.75rem] border border-gold/15 bg-white/[0.04]" key={tour.id}>
              <div className="relative h-64 overflow-hidden">
                <img
                  alt={tour.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  src={tour.heroImage}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-jet via-transparent" />
                <p className="absolute bottom-4 left-4 rounded-full bg-black/60 px-4 py-2 text-sm text-gold backdrop-blur">
                  {formatter.format(tour.priceAud)} pp
                </p>
              </div>
              <div className="space-y-5 p-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-stone-500">{tour.region}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-ivory">{tour.title}</h3>
                  <p className="mt-1 text-sm text-stone-400">
                    {tour.duration} · max {tour.capacity} guests
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-stone-300">
                  {tour.highlights.map((highlight) => (
                    <li className="flex gap-2" key={highlight}>
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel-luxury grid gap-8 p-8 md:grid-cols-[0.8fr_1fr]" id="compliance">
        <div>
          <p className="eyebrow">Australia-ready controls</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-ivory">Compliance is a product surface.</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            "GST-inclusive AUD pricing",
            "Australian Consumer Law cancellation disclosure",
            "Privacy Act collection notice and consent trail",
            "Supplier insurance and permit vault",
            "Emergency contacts and dietary needs with purpose limitation",
            "Media release consent separated from booking acceptance",
          ].map((item) => (
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-stone-300" key={item}>
              <CheckCircle2 className="mb-3 h-5 w-5 text-gold" />
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
