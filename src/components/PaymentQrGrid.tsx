import { PAYMENT_LINKS, type PaymentLinkKey } from '../lib/paymentLinks'
import PaymentQrCode from './PaymentQrCode'

const QR_ORDER: PaymentLinkKey[] = ['setupFee', 'monthly']

export default function PaymentQrGrid({ className = '' }: { className?: string }) {
  return (
    <div className={`mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 ${className}`}>
      {QR_ORDER.map((key) => {
        const link = PAYMENT_LINKS[key]
        return (
          <PaymentQrCode key={key} url={link.url} label={link.labelTh} />
        )
      })}
    </div>
  )
}
