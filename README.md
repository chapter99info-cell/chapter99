# Trip2Talk V4

Phase 1 scaffold for a luxury photography tour PWA + CRM system.

## Stack

- Vite + React + TypeScript
- Tailwind CSS dark/gold UI shell
- Supabase PostgreSQL schema migrations for PIN access, tours, CRM safety, and compliance alerts

## Commands

```bash
npm install
npm run dev
npm run build
```

## Supabase schema order

Apply the SQL files in order:

1. `supabase/00-schema-auth.sql`
2. `supabase/01-schema-tours-staff.sql`
3. `supabase/02-schema-crm-safety.sql`
4. `supabase/03-schema-alerts.sql`
