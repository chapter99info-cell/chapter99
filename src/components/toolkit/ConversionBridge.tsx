import { Link } from 'react-router-dom'
import { track } from '../../lib/toolkit/analytics'
import { useTranslation } from '../../cinematic/i18n/LanguageContext'

const BRIDGE = {
  'english-message': {
    en: 'Need a simpler way to manage customer messages?',
    th: 'อยากให้การจัดการข้อความลูกค้าง่ายขึ้นไหม?',
    cta: { en: 'See Professional', th: 'ดูแพ็กเกจ Professional' },
    to: '/pricing#professional',
  },
  'price-list': {
    en: 'Want this price list on your website?',
    th: 'อยากให้รายการราคานี้อยู่บนเว็บไซต์ของคุณไหม?',
    cta: { en: 'See Starter', th: 'ดูแพ็กเกจ Starter' },
    to: '/pricing#starter',
  },
  'review-reply': {
    en: 'Want customers to find and review you more easily?',
    th: 'อยากให้ลูกค้าค้นเจอและรีวิวคุณได้ง่ายขึ้นไหม?',
    cta: { en: 'Check My Business', th: 'ตรวจธุรกิจของฉัน' },
    to: '/business-check',
  },
  'poster-studio': {
    en: 'Don’t have an online booking link yet?',
    th: 'ยังไม่มีลิงก์จองออนไลน์ใช่ไหม?',
    cta: { en: 'See how Chapter99 can set it up', th: 'ดูว่า Chapter99 ตั้งให้ได้อย่างไร' },
    to: '/pricing',
  },
} as const

export function ConversionBridge({ tool }: { tool: keyof typeof BRIDGE }) {
  const { t } = useTranslation()
  const b = BRIDGE[tool]
  return (
    <div className="tk-next" data-bridge={tool}>
      <span>{t({ th: b.th, en: b.en })}</span>
      <Link
        className="tk-btn tk-btn-dark tk-btn-sm"
        to={b.to}
        onClick={() => track('tool_to_packages_clicked', { tool, destination: b.to, package: tool === 'english-message' ? 'professional' : tool === 'price-list' ? 'starter' : undefined })}
      >
        {t(b.cta)}
      </Link>
    </div>
  )
}
