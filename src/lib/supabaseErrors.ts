import type { PostgrestError } from '@supabase/supabase-js'

/** Surface actionable Supabase/PostgREST errors in the admin UI */
export function formatSupabaseError(err: unknown): string {
  if (!err || typeof err !== 'object') {
    return err instanceof Error ? err.message : 'Unknown error'
  }

  const pg = err as PostgrestError
  const code = pg.code ?? ''
  const message = pg.message ?? 'Request failed'
  const details = pg.details ? ` (${pg.details})` : ''

  if (code === 'PGRST205') {
    return `${code}: ${message}${details} — Tables may be PascalCase ("Client") instead of lowercase. Run supabase/migrations/003_normalize_agency_table_names.sql in project jjbwiriphyxsnrnpoqnn.`
  }

  if (code === 'PGRST204') {
    return `${code}: ${message}${details} — Columns may be camelCase or tables singular (client vs clients). Run supabase/migrations/004_normalize_column_names.sql.`
  }

  if (code === '42501' || message.toLowerCase().includes('row-level security')) {
    return `${code}: ${message}${details} — Check RLS policies allow authenticated users on this table.`
  }

  return code ? `${code}: ${message}${details}` : message
}
