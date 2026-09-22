import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { track, type TrackEvent } from '../../lib/toolkit/analytics'
import { useTranslation } from '../../cinematic/i18n/LanguageContext'
import { SiteLayout } from '../../site/SiteLayout'
import '../../site/toolkit-mvp.css'

export function ToolkitShell({
  title,
  children,
  opened,
}: {
  title: { th: string; en: string }
  children: ReactNode
  opened?: string
}) {
  return (
    <SiteLayout>
      <ToolkitChrome title={title} opened={opened}>
        {children}
      </ToolkitChrome>
    </SiteLayout>
  )
}

function ToolkitChrome({
  title,
  children,
  opened,
}: {
  title: { th: string; en: string }
  children: ReactNode
  opened?: string
}) {
  const { t } = useTranslation()
  useEffect(() => {
    document.title = `${t(title)} — Chapter99`
    if (opened) track('tool_opened', { tool: opened })
  }, [opened, t, title])
  return (
    <div className="tk-mvp">
      <div className="tk-wrap">{children}</div>
    </div>
  )
}

export function Crumb() {
  const { t } = useTranslation()
  return (
    <div className="tk-crumb">
      <Link to="/toolkit">{t({ th: '← เครื่องมือฟรี', en: '← Free Toolkit' })}</Link>
    </div>
  )
}

export async function copyText(text: string, tool: string) {
  try {
    await navigator.clipboard.writeText(text)
    track('tool_result_copied', { tool })
    return true
  } catch {
    return false
  }
}

export async function shareText(text: string, tool: string) {
  track('tool_result_shared', { tool })
  if (navigator.share) {
    try {
      await navigator.share({ text })
      return
    } catch {
      /* user cancelled */
    }
  }
  await copyText(text, tool)
}

export function trackContact(from: string) {
  track('tool_to_contact_clicked' as TrackEvent, { from })
}
