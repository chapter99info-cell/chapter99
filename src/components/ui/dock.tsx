import type { LucideIcon } from 'lucide-react'

export type DockItem = {
  id: string
  label: string
  icon: LucideIcon
  current?: boolean
  badge?: string
  href?: string
  onSelect?: () => void
}

export function Dock({ items, ariaLabel }: { items: DockItem[]; ariaLabel: string }) {
  return (
    <nav className="hero-dock" aria-label={ariaLabel}>
      <div className="hero-dock-bar">
        {items.map((item, index) => (
          <span key={item.id} className="hero-dock-slot">
            {index === items.length - 2 ? <span className="hero-dock-split" aria-hidden="true" /> : null}
            <DockIcon item={item} />
          </span>
        ))}
      </div>
    </nav>
  )
}

function DockIcon({ item }: { item: DockItem }) {
  const Icon = item.icon
  const className = `hero-dock-btn${item.current ? ' is-current' : ''}`
  const body = (
    <>
      <Icon className="hero-dock-icon" strokeWidth={2.1} aria-hidden="true" />
      {item.badge ? <span className="hero-dock-badge">{item.badge}</span> : null}
      <span className="hero-dock-label">{item.label}</span>
    </>
  )
  if (item.href) {
    return (
      <a className={className} href={item.href} aria-current={item.current ? 'page' : undefined}>
        {body}
      </a>
    )
  }
  return (
    <button type="button" className={className} aria-current={item.current ? 'page' : undefined} onClick={item.onSelect}>
      {body}
    </button>
  )
}
