import { ExternalLink } from 'lucide-react'
import { PAYMENT_LINKS } from '../lib/paymentLinks'

export default function PaymentLinkButtons({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-3 sm:flex-row sm:justify-center ${className}`}>
      <a
        href={PAYMENT_LINKS.setupFee.url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-interactive inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#2D5016] bg-white px-6 py-3.5 text-base font-bold text-[#2D5016] hover:bg-[#2D5016] hover:text-white sm:w-auto sm:px-8"
      >
        {PAYMENT_LINKS.setupFee.labelTh}
        <ExternalLink className="h-4 w-4" aria-hidden />
      </a>
      <a
        href={PAYMENT_LINKS.monthly.url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-interactive inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2D5016] px-6 py-3.5 text-base font-bold text-white hover:bg-[#234012] sm:w-auto sm:px-8"
      >
        {PAYMENT_LINKS.monthly.labelTh}
        <ExternalLink className="h-4 w-4" aria-hidden />
      </a>
    </div>
  )
}
