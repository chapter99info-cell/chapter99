import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { useLanguage } from '../i18n/LanguageContext'

interface PaymentQrCodeProps {
  url: string
  label: string
  size?: number
  className?: string
}

export default function PaymentQrCode({ url, label, size = 140, className = '' }: PaymentQrCodeProps) {
  const { lang } = useLanguage()
  const [dataUrl, setDataUrl] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    QRCode.toDataURL(url, {
      width: size,
      margin: 1,
      color: { dark: '#1A1A1A', light: '#FFFFFF' },
    })
      .then((result) => {
        if (!cancelled) setDataUrl(result)
      })
      .catch(() => {
        if (!cancelled) setDataUrl(null)
      })
    return () => {
      cancelled = true
    }
  }, [url, size])

  if (!dataUrl) return null

  return (
    <figure className={`flex flex-col items-center gap-2 ${className}`}>
      <img
        src={dataUrl}
        width={size}
        height={size}
        alt={`QR code — ${label}`}
        className="rounded-lg border border-[#1A1A1A]/10 bg-white p-2"
      />
      <figcaption className="text-center text-xs text-[#6B7280]">{lang === 'th' ? 'สแกน QR' : 'Scan QR'} · {label}</figcaption>
    </figure>
  )
}
