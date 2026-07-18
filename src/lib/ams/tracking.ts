import { supabase } from '../supabase'
import type { ProjectTracking } from '../../types/ams'

/** Public tracking via public.get_project_tracking → ams.* (SECURITY DEFINER) */
export async function fetchProjectTracking(
  publicToken: string
): Promise<ProjectTracking | null> {
  if (!publicToken || publicToken.length < 21) return null

  const { data, error } = await supabase.rpc('get_project_tracking', {
    p_token: publicToken,
  })

  if (error || !data || (Array.isArray(data) && data.length === 0)) return null
  const row = Array.isArray(data) ? data[0] : data
  return row as ProjectTracking
}
