import { ExternalLink } from 'lucide-react'
import type { ProjectTracking } from '../../types/ams'
import { PAYMENT_STATUS_LABELS, PROJECT_STATUS_LABELS } from '../../types/ams'
import { AGENCY_CONFIG } from '../../lib/agency-config'
import { brandColor, useBrandStyle } from '../../lib/useBrand'
import ProgressBar from './ProgressBar'

type TrackingViewProps = {
  tracking: ProjectTracking
}

export default function TrackingView({ tracking }: TrackingViewProps) {
  const brandStyle = useBrandStyle()
  const primary = brandColor('primary')
  const muted = brandColor('textMuted')

  return (
    <div
      className="min-h-screen"
      style={{ ...brandStyle, backgroundColor: brandColor('background'), color: brandColor('text') }}
    >
      <div className="mx-auto w-full max-w-lg px-4 py-10 sm:py-16">
        <p className="font-serif text-2xl font-bold" style={{ color: primary }}>
          {AGENCY_CONFIG.brandName}
        </p>
        <h1 className="mt-6 font-serif text-3xl text-balance">{tracking.title}</h1>
        <p className="mt-2 text-sm" style={{ color: muted }}>
          {tracking.service_type.replace(/_/g, ' ')} · {PROJECT_STATUS_LABELS[tracking.status]}
        </p>

        <div
          className="mt-10 rounded-2xl border bg-white p-5 sm:p-6"
          style={{ borderColor: brandColor('border') }}
        >
          <ProgressBar status={tracking.status} percent={tracking.progress_pct} />
        </div>

        <dl className="mt-6 grid gap-4 text-sm">
          <div
            className="flex justify-between border-b pb-3"
            style={{ borderColor: brandColor('border') }}
          >
            <dt style={{ color: muted }}>Deadline</dt>
            <dd style={{ color: tracking.is_overdue ? '#B91C1C' : brandColor('text') }}>
              {tracking.deadline ?? '—'}
              {tracking.is_overdue ? ' (overdue)' : ''}
            </dd>
          </div>
          <div
            className="flex justify-between border-b pb-3"
            style={{ borderColor: brandColor('border') }}
          >
            <dt style={{ color: muted }}>Payment</dt>
            <dd>{PAYMENT_STATUS_LABELS[tracking.payment_status]}</dd>
          </div>
          <div className="flex justify-between pb-1">
            <dt style={{ color: muted }}>Last update</dt>
            <dd style={{ color: muted }}>
              {new Date(tracking.updated_at).toLocaleString('en-AU')}
            </dd>
          </div>
        </dl>

        {tracking.deliverable_link ? (
          <a
            href={tracking.deliverable_link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3 text-center font-semibold text-white"
            style={{ backgroundColor: primary }}
          >
            Open delivery
            {tracking.deliverable_version ? ` (v${tracking.deliverable_version})` : ''}
            <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        ) : (
          <p
            className="mt-8 rounded-xl border bg-white px-4 py-4 text-center text-sm"
            style={{ borderColor: brandColor('border'), color: muted }}
          >
            Delivery link will appear here once payment is confirmed
            {tracking.payment_status === 'deposit_paid' ? ' (or per your deposit terms)' : ''}.
          </p>
        )}
      </div>
    </div>
  )
}
