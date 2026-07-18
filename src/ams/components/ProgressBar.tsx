import type { ProjectStatus } from '../../types/ams'
import { progressPercent } from '../../types/ams'
import { brandColor } from '../../lib/useBrand'

const STATUS_STEPS: { key: ProjectStatus; label: string }[] = [
  { key: 'capturing', label: 'Capturing' },
  { key: 'editing', label: 'Editing' },
  { key: 'ready_for_review', label: 'Review' },
  { key: 'completed', label: 'Done' },
]

type ProgressBarProps = {
  status: ProjectStatus
  percent?: number
  className?: string
}

export default function ProgressBar({ status, percent, className = '' }: ProgressBarProps) {
  const pct = percent ?? progressPercent(status)
  const activeIdx = STATUS_STEPS.findIndex((s) => s.key === status)
  const primary = brandColor('primary')
  const secondary = brandColor('secondary')
  const muted = brandColor('textMuted')

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-sm" style={{ color: muted }}>
          Progress
        </span>
        <span className="font-mono text-sm font-semibold" style={{ color: secondary }}>
          {pct}%
        </span>
      </div>

      <div
        className="h-2 w-full overflow-hidden rounded-full"
        style={{ backgroundColor: 'rgba(26,26,26,0.1)' }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Project progress"
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: primary }}
        />
      </div>

      <ol className="mt-4 grid grid-cols-4 gap-1 text-center text-[11px] sm:text-xs">
        {STATUS_STEPS.map((step, i) => {
          const done = status === 'completed' || (activeIdx >= 0 && i <= activeIdx)
          const current = step.key === status
          return (
            <li
              key={step.key}
              style={{
                color: current ? secondary : done ? brandColor('text') : muted,
                fontWeight: current ? 600 : 400,
              }}
            >
              {step.label}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
