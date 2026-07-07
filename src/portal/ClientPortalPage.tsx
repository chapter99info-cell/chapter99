import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ExternalLink, Star } from 'lucide-react'
import { AGENCY_CONFIG } from '../lib/agency-config'
import { brandColor } from '../lib/useBrand'
import { fetchProjectPortal } from './portalService'
import type { ProjectPortalView } from '../types/agency'

export default function ClientPortalPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const [portal, setPortal] = useState<ProjectPortalView | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!projectId) {
      setError('Invalid project link.')
      setLoading(false)
      return
    }
    void fetchProjectPortal(projectId)
      .then((data) => {
        if (!data) setError('Project not found.')
        else setPortal(data)
      })
      .catch(() => setError('Unable to load project.'))
      .finally(() => setLoading(false))
  }, [projectId])

  const primary = brandColor('primary')
  const text = brandColor('text')

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center text-xl font-semibold"
        style={{ backgroundColor: brandColor('background'), color: text }}
      >
        Loading…
      </div>
    )
  }

  if (error || !portal) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center"
        style={{ backgroundColor: brandColor('background'), color: text }}
      >
        <p className="text-2xl font-bold">{error || 'Not found'}</p>
        <p className="text-lg" style={{ color: brandColor('textMuted') }}>
          Contact {AGENCY_CONFIG.contact.email}
        </p>
      </div>
    )
  }

  const btnClass =
    'flex min-h-[64px] w-full max-w-lg items-center justify-center gap-3 rounded-2xl border-4 px-6 py-5 text-xl font-bold shadow-md transition-transform active:scale-[0.98]'

  return (
    <div
      className="min-h-screen px-4 py-10 sm:px-6"
      style={{ backgroundColor: brandColor('background'), color: text }}
    >
      <div className="mx-auto max-w-lg text-center">
        <img
          src={AGENCY_CONFIG.logoUrl}
          alt={AGENCY_CONFIG.brandName}
          className="mx-auto h-20 w-20 rounded-2xl object-contain"
        />
        <h1 className="mt-6 text-3xl font-bold leading-tight sm:text-4xl">{portal.businessName}</h1>
        <p className="mt-3 text-xl" style={{ color: brandColor('textMuted') }}>
          ยินดีต้อนรับ · Welcome
        </p>
        <p className="mt-2 text-lg" style={{ color: brandColor('textMuted') }}>
          Powered by {portal.brandName}
        </p>

        <div className="mt-10 flex flex-col items-center gap-5">
          {portal.galleryUrl && (
            <a
              href={portal.galleryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={btnClass}
              style={{ borderColor: primary, backgroundColor: primary, color: '#fff' }}
            >
              ดูแกลเลอรี่ภาพถ่าย (View Photos)
              <ExternalLink className="h-7 w-7 shrink-0" aria-hidden />
            </a>
          )}

          {portal.liveWebUrl && (
            <a
              href={portal.liveWebUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={btnClass}
              style={{ borderColor: text, backgroundColor: text, color: '#fff' }}
            >
              เปิดใช้งานเว็บไซต์ (Launch App)
              <ExternalLink className="h-7 w-7 shrink-0" aria-hidden />
            </a>
          )}

          {portal.googleReviewLink && (
            <a
              href={portal.googleReviewLink}
              target="_blank"
              rel="noopener noreferrer"
              className={btnClass}
              style={{
                borderColor: brandColor('secondary'),
                backgroundColor: brandColor('secondary'),
                color: text,
              }}
            >
              <Star className="h-8 w-8 fill-current" aria-hidden />
              ให้คะแนนรีวิว Google (Leave a Review)
            </a>
          )}

          {!portal.galleryUrl && !portal.liveWebUrl && !portal.googleReviewLink && (
            <p className="text-lg font-semibold" style={{ color: brandColor('textMuted') }}>
              Your deliverables will appear here soon.
            </p>
          )}
        </div>

        {portal.googleMapsEmbedUrl && (
          <div className="mt-10 overflow-hidden rounded-2xl border-4" style={{ borderColor: brandColor('border') }}>
            <iframe
              title="Location map"
              src={portal.googleMapsEmbedUrl}
              className="h-64 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </div>
    </div>
  )
}
