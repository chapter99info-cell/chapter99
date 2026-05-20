# Trip2Talk V4

Luxury photography tour Progressive Web App and CRM foundation for Australian operations.

## Stack

- Vite + React + TypeScript
- Tailwind CSS luxury dark/gold theme (`#D4AF37`)
- Supabase PostgreSQL + Realtime-ready data model
- PWA manifest and service worker shell
- PIN-driven internal staff console
- Integration event queue for Google Sheets, Google Drive, Twilio and Resend

## Getting started

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and set:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

Without Supabase configuration, the staff console runs in preview mode with PIN `1937`.
Production PIN checks should use the Supabase `verify_staff_pin` RPC from the migration.

## Scripts

- `npm run dev` - start the local Vite server
- `npm run build` - type-check and build the PWA
- `npm run preview` - preview the production build
- `npm run lint` - run ESLint
- `npm run typecheck` - run TypeScript checks

## Supabase

Initial schema lives in:

```text
supabase/migrations/20260520000000_trip2talk_v4_initial.sql
```

It includes:

- staff PIN profiles and auditable PIN sessions
- tours, itinerary items, clients and bookings
- media asset references for gallery delivery
- integration event queue
- audit events
- RLS defaults with public read access only for active tours and itinerary items

Seed a production staff PIN only through a secure admin workflow:

```sql
insert into public.staff_pin_profiles (label, role, pin_hash)
values ('Operations Lead', 'admin', crypt('1234', gen_salt('bf')));
```

## Integration boundaries

The PWA never stores Twilio, Resend or Google API secrets. It queues integration events in
Supabase; Edge Functions or another server-side worker should process the queue with provider
credentials.
