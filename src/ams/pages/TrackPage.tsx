import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { ProjectTracking } from '../../types/ams'
import { fetchProjectTracking } from '../../lib/ams/tracking'
import { brandColor, useBrandStyle } from '../../lib/useBrand'
import TrackingView from '../components/TrackingView'

export default function TrackPage() {
  const { publicToken = '' } = useParams<{ publicToken: string }>()
  const [tracking, setTracking] = useState<ProjectTracking | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const brandStyle = useBrandStyle()

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const data = await fetchProjectTracking(publicToken)
      if (cancelled) return
      if (!data) setNotFound(true)
      else setTracking(data)
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [publicToken])

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ ...brandStyle, backgroundColor: brandColor('background') }}
      >
        Loading…
      </div>
    )
  }

  if (notFound || !tracking) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-2 px-4"
        style={{ ...brandStyle, backgroundColor: brandColor('background'), color: brandColor('text') }}
      >
        <h1 className="font-serif text-2xl">Project not found</h1>
        <p className="text-sm" style={{ color: brandColor('textMuted') }}>
          Check the tracking link from your Chapter99 contact.
        </p>
      </div>
    )
  }

  return <TrackingView tracking={tracking} />
}
