/**
 * Client portal data layer — Supabase read only. No AI imports.
 */
import { AGENCY_CONFIG } from '../lib/agency-config'
import { supabase } from '../lib/supabase'
import type { ProjectPortalView } from '../types/agency'

export async function fetchProjectPortal(projectId: string): Promise<ProjectPortalView | null> {
  const { data, error } = await supabase
    .from('project_public_view')
    .select(
      'id, live_web_url, gallery_url, google_review_link, google_maps_embed_url, facebook_url, line_oa_url'
    )
    .eq('id', projectId)
    .maybeSingle()

  if (error || !data) return null

  return {
    id: String(data.id),
    businessName: AGENCY_CONFIG.brandName,
    brandName: AGENCY_CONFIG.brandName,
    liveWebUrl: data.live_web_url != null ? String(data.live_web_url) : null,
    galleryUrl: data.gallery_url != null ? String(data.gallery_url) : null,
    googleReviewLink: data.google_review_link != null ? String(data.google_review_link) : null,
    googleMapsEmbedUrl: data.google_maps_embed_url != null ? String(data.google_maps_embed_url) : null,
    facebookUrl: data.facebook_url != null ? String(data.facebook_url) : null,
    lineOaUrl: data.line_oa_url != null ? String(data.line_oa_url) : null,
  }
}
