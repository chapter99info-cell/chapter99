import { useState } from 'react'
import { logoUrlForJob } from '../lib/brand'
import { usePhotoStore } from '../store/StoreContext'

export function BrandMark({
  jobType,
  compact,
  onDark,
}: {
  jobType: string
  compact?: boolean
  onDark?: boolean
}) {
  const logos = usePhotoStore().data.brandLogos
  const [failed, setFailed] = useState(false)
  const url = logoUrlForJob(logos, jobType)
  const wordStyle = onDark ? { color: '#fff' } : undefined

  if (!url || failed) {
    return (
      <div>
        <div className="inv-brand" style={wordStyle}>
          Chapter99 Photography
        </div>
        {!compact && !onDark && <div className="tagline">Forestville, Sydney NSW 2087</div>}
      </div>
    )
  }

  return (
    <div className="pm-brand-mark">
      <img
        src={url}
        alt="Chapter99 Photography"
        className={compact ? 'pm-doc-logo sm' : 'pm-doc-logo'}
        onError={() => setFailed(true)}
      />
      <div className="inv-brand" style={{ fontSize: compact ? 14 : 16, marginTop: 6, ...wordStyle }}>
        Chapter99 Photography
      </div>
    </div>
  )
}
