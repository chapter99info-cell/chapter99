import type { SupabaseClient } from '@supabase/supabase-js'

/** All AMS tables live in Postgres schema `ams` (not public). */
export const AMS_SCHEMA = 'ams' as const

/**
 * Query helper for AMS tables/RPCs.
 * Requires `ams` in Supabase → Project Settings → API → Exposed schemas.
 */
export function amsDb(client: SupabaseClient) {
  return client.schema(AMS_SCHEMA)
}
