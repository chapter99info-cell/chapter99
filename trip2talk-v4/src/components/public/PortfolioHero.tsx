import { useMemo, useState } from 'react';

const heroImages = [
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80',
];

const tours = [
  { name: 'Blue Mountains Golden Hour', date: '18 Jun 2026', price: 340, seats: 2 },
  { name: 'Great Ocean Road Editorial', date: '04 Jul 2026', price: 520, seats: 6 },
  { name: 'Tasmania Wild Coast', date: '21 Aug 2026', price: 890, seats: 0 },
];

export default function PortfolioHero() {
  const [mode, setMode] = useState<'photographer' | 'model'>('photographer');
  const [bookingOpen, setBookingOpen] = useState(false);

  const modeDetails = useMemo(() => {
    if (mode === 'photographer') {
      return {
        title: 'Photographer Mode',
        items: ['GPS drops for every scene', 'Golden-hour call sheets', 'Recommended kit: 24-70mm, polariser, rain shell'],
      };
    }
    return {
      title: 'Model Mode',
      items: ['Outfit palette matched to each landscape', 'Pose coaching and styling notes', 'Private gallery for portfolio selects'],
    };
  }, [mode]);

  return (
    <main className="min-h-screen bg-jet text-white">
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-3">
          {heroImages.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`Australian landscape ${index + 1}`}
              className="h-full min-h-[34vh] w-full object-cover opacity-70"
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-jet" />
        <div className="relative z-10 flex min-h-screen flex-col justify-end px-6 pb-16 pt-24 sm:px-10 lg:px-16">
          <p className="mb-4 text-xs uppercase tracking-[0.55em] text-gold">Australia</p>
          <h1 className="max-w-5xl font-display text-5xl font-light leading-tight tracking-[0.12em] text-white sm:text-7xl">
            Trip2Talk · Premium Photography Tours · Australia
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            Cinematic touring for photographers, creators, and models who want production-grade locations with local support.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setBookingOpen(true)}
              className="rounded-full bg-gold px-8 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-jet shadow-lg shadow-gold/20 transition hover:bg-gold-light"
            >
              Book Now
            </button>
            <div className="flex rounded-full border border-gold/30 bg-black/45 p-1 backdrop-blur">
              <button
                onClick={() => setMode('photographer')}
                className={`rounded-full px-5 py-3 text-xs uppercase tracking-widest transition ${mode === 'photographer' ? 'bg-gold text-jet' : 'text-zinc-400 hover:text-white'}`}
              >
                Photographer Mode
              </button>
              <button
                onClick={() => setMode('model')}
                className={`rounded-full px-5 py-3 text-xs uppercase tracking-widest transition ${mode === 'model' ? 'bg-gold text-jet' : 'text-zinc-400 hover:text-white'}`}
              >
                Model Mode
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-charcoal-border bg-charcoal px-6 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.35em] text-gold">{modeDetails.title}</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {modeDetails.items.map((item) => (
              <div key={item} className="rounded-2xl border border-charcoal-border bg-jet/60 p-5 text-zinc-300">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-dark-gradient px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-gold">Next departures</p>
              <h2 className="mt-3 font-display text-4xl text-white">Tour schedule</h2>
            </div>
            <p className="max-w-xl text-zinc-400">Small groups, luxury pacing, and itinerary notes tuned for natural light.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {tours.map((tour) => (
              <article key={tour.name} className="rounded-3xl border border-charcoal-border bg-charcoal/80 p-6 shadow-2xl shadow-black/20">
                <div className="mb-8 flex items-center justify-between gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-widest ${tour.seats === 0 ? 'bg-red-500/10 text-red-300' : tour.seats <= 2 ? 'bg-gold/10 text-gold' : 'bg-emerald-400/10 text-emerald-300'}`}>
                    {tour.seats === 0 ? 'Full' : tour.seats <= 2 ? `${tour.seats} seats left!` : 'Available'}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-zinc-500">{tour.date}</span>
                </div>
                <h3 className="font-display text-2xl text-white">{tour.name}</h3>
                <p className="mt-4 text-3xl text-gold">AUD ${tour.price}</p>
                <button
                  onClick={() => setBookingOpen(true)}
                  disabled={tour.seats === 0}
                  className="mt-6 w-full rounded-xl border border-gold/40 px-4 py-3 text-sm uppercase tracking-widest text-gold transition hover:bg-gold hover:text-jet disabled:cursor-not-allowed disabled:border-zinc-700 disabled:text-zinc-600 disabled:hover:bg-transparent"
                >
                  {tour.seats === 0 ? 'Join waitlist' : 'Reserve'}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {bookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-gold/30 bg-charcoal p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-gold">Booking enquiry</p>
                <h2 className="mt-3 font-display text-3xl">Start your Trip2Talk booking</h2>
              </div>
              <button onClick={() => setBookingOpen(false)} className="text-zinc-500 hover:text-white">Close</button>
            </div>
            <form className="mt-8 space-y-4">
              <input className="w-full rounded-xl border border-charcoal-border bg-jet px-4 py-3 text-white outline-none focus:border-gold" placeholder="Full name" />
              <input className="w-full rounded-xl border border-charcoal-border bg-jet px-4 py-3 text-white outline-none focus:border-gold" placeholder="Email or phone" />
              <select className="w-full rounded-xl border border-charcoal-border bg-jet px-4 py-3 text-white outline-none focus:border-gold">
                {tours.map((tour) => <option key={tour.name}>{tour.name}</option>)}
              </select>
              <button type="button" onClick={() => setBookingOpen(false)} className="w-full rounded-xl bg-gold px-4 py-4 text-sm font-semibold uppercase tracking-widest text-jet">
                Send booking request
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
