import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'

type Tier = {
  name: string
  nameTh: string
  setup: number | string
  monthly: number
  target: string
  targetTh: string
  features: string[]
  recommended?: boolean
}

const tiers: Tier[] = [
  {
    name: 'Starter',
    nameTh: 'Starter',
    setup: 199,
    monthly: 19,
    target: 'Uber drivers, Tradies, Freelancers',
    targetTh: 'คนขับ Uber, ช่างไฟ/ช่างประปา, ฟรีแลนซ์',
    features: [
      'One-page website',
      'Income & expense tracker for ATO',
      'เว็บหน้าเดียว ใช้งานง่าย',
      'ระบบบันทึกรายรับ-รายจ่ายสำหรับยื่นภาษี ATO',
    ],
  },
  {
    name: 'Professional',
    nameTh: 'Professional',
    setup: 499,
    monthly: 39,
    target: 'Restaurants, Massage shops',
    targetTh: 'ร้านอาหาร, ร้านนวด',
    recommended: true,
    features: [
      'Full PWA + Booking / Brief system',
      'Google Review CTA button',
      'Client Portal page for your customers',
      'PWA ครบ + ระบบจอง/บรีฟ',
      'ปุ่มชวนรีวิว Google',
      'หน้า Client Portal สำหรับลูกค้าของคุณ',
    ],
  },
  {
    name: 'Ultimate Business',
    nameTh: 'Ultimate Business',
    setup: '999+',
    monthly: 49,
    target: 'Full-service premium clients',
    targetTh: 'ลูกค้า Premium บริการครบวงจร',
    features: [
      'Everything in Professional',
      'Photography & video production add-ons',
      'Optional AI chatbot add-on (BYOK or agency-managed)',
      'Custom features tailored to your business',
      'ทุกอย่างใน Professional',
      'เพิ่มงานถ่ายภาพ/วิดีโอ',
      'AI Chatbot (ใช้ Key เองหรือให้เราดูแล)',
      'ฟีเจอร์ปรับแต่งตามธุรกิจ',
    ],
  },
]

function formatAud(value: number | string) {
  if (typeof value === 'string') return `A$${value}`
  return `A$${value.toLocaleString('en-AU')}`
}

function PricingCard({
  tier,
  staggerDelay,
  revealed,
}: {
  tier: Tier
  staggerDelay: number
  revealed: boolean
}) {
  const isRecommended = tier.recommended
  const [cardVisible, setCardVisible] = useState(false)

  useEffect(() => {
    if (!revealed) return
    const timer = window.setTimeout(() => setCardVisible(true), staggerDelay)
    return () => clearTimeout(timer)
  }, [revealed, staggerDelay])

  return (
    <div
      className="transition-all duration-[800ms] ease-out"
      style={{
        opacity: cardVisible ? 1 : 0,
        transform: cardVisible ? 'translateY(0)' : 'translateY(2rem)',
      }}
    >
      <article
        className={`group relative flex h-full flex-col rounded-2xl border p-6 transition-all duration-300 sm:p-8 ${
          isRecommended
            ? 'border-[#2D5016]/40 bg-white shadow-[0_8px_32px_rgba(45,80,22,0.12)]'
            : 'border-black/10 bg-[#FAFAFA] hover:border-[#2D5016]/25 hover:shadow-lg'
        }`}
      >
        {isRecommended && (
          <span className="absolute -top-3 left-6 z-10 rounded-full bg-[#2D5016] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white sm:left-8">
            Recommended
          </span>
        )}

        <header className="mb-6 sm:mb-8">
          <h3 className="text-xl font-bold tracking-tight text-[#1A1A1A]">{tier.name}</h3>
          <p className="mt-1 text-sm font-medium text-[#2D5016]">{tier.nameTh}</p>
          <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">{tier.target}</p>
          <p className="mt-1 text-sm leading-relaxed text-[#6B7280]/80">{tier.targetTh}</p>
        </header>

        <div className="space-y-4">
          <div className="rounded-xl border border-[#2D5016]/15 bg-[#2D5016]/[0.04] px-4 py-4 sm:px-5 sm:py-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2D5016]/80">
              Monthly
            </p>
            <div className="flex items-end gap-1.5">
              <span className="text-4xl font-bold leading-none tracking-tight text-[#1A1A1A] sm:text-5xl">
                {formatAud(tier.monthly)}
              </span>
              <span className="mb-1 text-sm text-[#6B7280]">/mo</span>
            </div>
          </div>

          <div className="rounded-xl border border-black/[0.06] bg-white px-4 py-3 sm:px-5 sm:py-4">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B7280]">
              Setup (one-time)
            </p>
            <p className="text-lg font-bold text-[#1A1A1A]">
              {formatAud(tier.setup)}
            </p>
          </div>
        </div>

        <ul className="mb-8 mt-8 flex flex-1 flex-col gap-3 border-t border-black/[0.06] pt-8">
          {tier.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm leading-relaxed text-[#1A1A1A]/80">
              <Check
                className={`mt-0.5 h-4 w-4 shrink-0 ${isRecommended ? 'text-[#2D5016]' : 'text-[#6B7280]'}`}
                strokeWidth={2}
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className={`btn-interactive mt-auto block rounded-full py-3.5 text-center text-sm font-semibold ${
            isRecommended
              ? 'bg-[#2D5016] text-white hover:bg-[#234012]'
              : 'border-2 border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white'
          }`}
        >
          นัด Demo ฟรี
        </a>
      </article>
    </div>
  )
}

export default function PricingTiersSection() {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setRevealed(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <section id="pricing" className="bg-[#F8F5F0] px-5 py-20 sm:px-6 sm:py-24">
      <div
        className={`mx-auto max-w-6xl transition-all duration-[800ms] ease-out ${
          revealed ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="mb-12 text-center sm:mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2D5016]">
            Pricing
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#1A1A1A] sm:text-4xl md:text-5xl">
            Simple plans for Thai businesses abroad
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#6B7280] sm:text-lg">
            เลือกแพ็กที่เหมาะกับธุรกิจของคุณ — เริ่มจากเว็บหน้าเดียว ไปจนถึงระบบครบวงจร
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-5">
          {tiers.map((tier, index) => (
            <PricingCard key={tier.name} tier={tier} staggerDelay={index * 120} revealed={revealed} />
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-[#6B7280]">
          Production photography &amp; video add-ons available on Ultimate Business only.
          AI chatbot add-on is Ultimate-only — admin tools stay separate.
        </p>
      </div>
    </section>
  )
}
