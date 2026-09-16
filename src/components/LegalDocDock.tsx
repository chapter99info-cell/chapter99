import {
  Activity,
  Bot,
  Cookie,
  FileText,
  Landmark,
  Lock,
  MessageCircleQuestion,
  Receipt,
  Scale,
  Server,
  Shield,
  type LucideIcon,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { legalNav } from '../data/legal'

const icons: Record<string, LucideIcon> = {
  '/legal': Landmark,
  '/legal/terms': FileText,
  '/legal/privacy': Shield,
  '/legal/cookies': Cookie,
  '/legal/acceptable-use': Scale,
  '/legal/refunds': Receipt,
  '/legal/data-security': Lock,
  '/legal/subprocessors': Server,
  '/legal/ai': Bot,
  '/legal/availability': Activity,
  '/legal/complaints': MessageCircleQuestion,
}

export function LegalDocDock() {
  const { pathname } = useLocation()

  return (
    <nav className="legal-subnav" aria-label="เอกสารอื่นใน Trust Centre">
      {legalNav.map((item) => {
        const Icon = icons[item.to] ?? FileText
        const current = pathname === item.to
        return (
          <Link
            key={item.to}
            className="legal-dock-btn"
            to={item.to}
            aria-label={item.label}
            aria-current={current ? 'page' : undefined}
          >
            <span className="legal-dock-tip">{item.label}</span>
            <span className="legal-dock-icon" aria-hidden="true">
              <Icon size={18} strokeWidth={1.9} />
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
