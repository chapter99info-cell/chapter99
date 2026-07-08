import { useState } from 'react'
import { Check, Copy, ExternalLink } from 'lucide-react'
import { brandColor } from '../../lib/useBrand'
import { PAYMENT_LINKS, type PaymentLinkKey } from '../../lib/paymentLinks'
import PaymentQrCode from '../../components/PaymentQrCode'

const LINK_ORDER: PaymentLinkKey[] = ['setupFee', 'monthly']

export default function PaymentLinksPanel() {
  const [copied, setCopied] = useState<PaymentLinkKey | null>(null)

  async function copyLink(key: PaymentLinkKey) {
    try {
      await navigator.clipboard.writeText(PAYMENT_LINKS[key].url)
      setCopied(key)
      window.setTimeout(() => setCopied(null), 2000)
    } catch {
      setCopied(null)
    }
  }

  const primary = brandColor('primary')
  const muted = brandColor('textMuted')
  const border = brandColor('border')

  return (
    <div
      className="mt-6 rounded-xl border-2 p-5 sm:p-6"
      style={{ borderColor: primary, backgroundColor: `${primary}08` }}
    >
      <h3 className="text-lg font-bold" style={{ color: brandColor('text') }}>
        Square payment links
      </h3>
      <p className="mt-1 text-sm" style={{ color: muted }}>
        ส่งลิงก์ให้ตรงประเภท — Setup ครั้งเดียว กับ รายเดือน ไม่เหมือนกัน
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {LINK_ORDER.map((key) => {
          const link = PAYMENT_LINKS[key]
          const isCopied = copied === key
          const isSetup = key === 'setupFee'

          return (
            <div
              key={key}
              className="rounded-lg border-2 bg-white p-4"
              style={{ borderColor: isSetup ? primary : border }}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: isSetup ? primary : muted }}
                  >
                    {isSetup ? 'One-time setup' : 'Monthly subscription'}
                  </p>
                  <p className="mt-1 text-base font-bold" style={{ color: brandColor('text') }}>
                    {link.labelTh}
                  </p>
                  <p className="text-sm" style={{ color: muted }}>
                    {link.descriptionTh}
                  </p>
                </div>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold text-white"
                  style={{ backgroundColor: primary }}
                >
                  Open
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
              </div>

              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={link.url}
                  aria-label={`${link.labelEn} URL`}
                  className="min-w-0 flex-1 rounded-lg border-2 px-3 py-2 font-mono text-xs sm:text-sm"
                  style={{ borderColor: border, color: brandColor('text') }}
                  onFocus={(e) => e.target.select()}
                />
                <button
                  type="button"
                  onClick={() => void copyLink(key)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border-2 px-3 py-2 text-sm font-semibold"
                  style={{ borderColor: border, color: brandColor('text') }}
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <PaymentQrCode
                url={link.url}
                label={link.labelTh}
                size={120}
                className="mt-4"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
