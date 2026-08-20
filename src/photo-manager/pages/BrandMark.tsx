import { useEffect, useState } from 'react'
import { logoUrlForJob, parsePmStorageUrl, PM_ABN, PM_ADDRESS_LINE } from '../lib/brand'
import { isPmSupabaseConfigured, pmClient } from '../store/adapters/supabase'
import { usePhotoStore } from '../store/StoreContext'

export function BrandMark({
  jobType,
  compact,
  onDark,
  showAddress = true,
}: {
  jobType: string
  compact?: boolean
  onDark?: boolean
  showAddress?: boolean
}) {
  const logos = usePhotoStore().data.brandLogos
  const mapped = logoUrlForJob(logos, jobType)
  const src = useResolvedLogoSrc(mapped)
  const wordStyle = onDark ? { color: '#fff' } : undefined
  const meta = `${PM_ADDRESS_LINE} · ${PM_ABN}`
  const address = showAddress && !compact && !onDark

  if (!src) {
    return (
      <div>
        <div className="inv-brand" style={wordStyle}>
          Chapter99 Photography
        </div>
        {address && <div className="tagline">{meta}</div>}
      </div>
    )
  }

  return (
    <div className="pm-brand-mark">
      <img src={src} alt="Chapter99 Photography" className={compact ? 'pm-doc-logo sm' : 'pm-doc-logo'} />
      <div className="inv-brand" style={{ fontSize: compact ? 14 : 16, marginTop: 6, ...wordStyle }}>
        Chapter99 Photography
      </div>
      {address && <div className="tagline">{meta}</div>}
    </div>
  )
}

function useResolvedLogoSrc(url: string): string {
  const [src, setSrc] = useState(() => (looksInline(url) ? url : ''))

  useEffect(() => {
    if (!url) {
      setSrc('')
      return
    }
    if (looksInline(url)) {
      setSrc(url)
      return
    }

    let cancelled = false
    let objectUrl = ''

    void (async () => {
      const ok = await probeImage(url)
      if (cancelled) return
      if (ok) {
        setSrc(url)
        return
      }
      const parsed = parsePmStorageUrl(url)
      if (parsed && isPmSupabaseConfigured) {
        const { data, error } = await pmClient().storage.from(parsed.bucket).download(parsed.objectPath)
        if (error || !data) {
          if (!cancelled) {
            console.warn('[pm] document logo failed to load', url, error?.message)
            setSrc('')
          }
          return
        }
        objectUrl = URL.createObjectURL(data)
        if (cancelled) {
          URL.revokeObjectURL(objectUrl)
          return
        }
        setSrc(objectUrl)
        return
      }
      if (!cancelled) {
        console.warn('[pm] document logo failed to load', url)
        setSrc('')
      }
    })()

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [url])

  return src
}

function looksInline(url: string) {
  return url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('/')
}

function probeImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })
}
