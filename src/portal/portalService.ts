/**
 * Client portal data layer — Supabase read only. No AI imports.
 */
import { AGENCY_CONFIG } from '../lib/agency-config'
import { AGENCY_TABLES } from '../lib/agencyTables'
import { supabase } from '../lib/supabase'
import type { ProjectPortalView } from '../types/agency'

export async function fetchProjectPortal(projectId: string): Promise<ProjectPortalView | null> {
  const { data, error } = await supabase
    .from(AGENCY_TABLES.project)
    .select(
      'id, live_web_url, gallery_url, google_review_link, google_maps_embed_url, facebook_url, line_oa_url, client:client_id(business_name)'
    )
    .eq('id', projectId)
    .maybeSingle()

  if (error || !data) return null

  const client = Array.isArray(data.client) ? data.client[0] : data.client

  return {
    id: String(data.id),
    businessName: String(client?.business_name ?? AGENCY_CONFIG.brandName),
    brandName: AGENCY_CONFIG.brandName,
    liveWebUrl: data.live_web_url != null ? String(data.live_web_url) : null,
    galleryUrl: data.gallery_url != null ? String(data.gallery_url) : null,
    googleReviewLink: data.google_review_link != null ? String(data.google_review_link) : null,
    googleMapsEmbedUrl: data.google_maps_embed_url != null ? String(data.google_maps_embed_url) : null,
    facebookUrl: data.facebook_url != null ? String(data.facebook_url) : null,
    lineOaUrl: data.line_oa_url != null ? String(data.line_oa_url) : null,
  }
}
