import type { LucideIcon } from 'lucide-react'

type Props = {
  icon: LucideIcon
  label: string
}

export function PressIcon({ icon: Icon, label }: Props) {
  return (
    <i className="press-ic" aria-hidden="true" title={label}>
      <Icon strokeWidth={2.25} size={24} />
    </i>
  )
}

export function BrandGlyph() {
  return (
    <i className="press-ic" aria-hidden="true">
      <svg viewBox="0 0 24 24" width={24} height={24} fill="currentColor">
        <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0m1.191 14.963-3.055-3.26-5.963 3.26L10.732 8.1l3.131 3.259L19.752 8.1z" />
      </svg>
    </i>
  )
}

export function DecoLines() {
  return (
    <svg className="deco-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <line x1="0" y1="18" x2="14" y2="0" />
      <line x1="4" y1="22" x2="18" y2="4" />
      <line x1="86" y1="0" x2="100" y2="18" />
      <line x1="82" y1="4" x2="96" y2="22" />
      <line x1="0" y1="82" x2="14" y2="100" />
      <line x1="4" y1="78" x2="18" y2="96" />
      <line x1="86" y1="100" x2="100" y2="82" />
      <line x1="82" y1="96" x2="96" y2="78" />
    </svg>
  )
}
