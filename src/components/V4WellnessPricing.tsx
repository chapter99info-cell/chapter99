import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'

const VIDEOS = {
  spaMassage:
    'https://euiwkvozrhnbxttfuchh.supabase.co/storage/v1/object/public/Chapter%2099%20web/VDO/Thai_mass.mp4',
  foodshot:
    'https://euiwkvozrhnbxttfuchh.supabase.co/storage/v1/object/public/Chapter%2099%20web/VDO/foodshot.mp4',
  cinematic:
    'https://euiwkvozrhnbxttfuchh.supabase.co/storage/v1/object/public/Chapter%2099%20web/VDO/hf_20260623_011229_0975c984-b9e4-4913-af12-a588218640e1.mp4',
} as const

const tierVideos: Record<string, string> = {
  'Smart Relax':
    'https://euiwkvozrhnbxttfuchh.supabase.co/storage/v1/object/public/Chapter%2099%20web/VDO/hf_20260605_050850_dc39cb41-a876-4895-aabb-af78fba0405e.mp4',
  'Pro Vibe':
    'https://euiwkvozrhnbxttfuchh.supabase.co/storage/v1/object/public/Chapter%2099%20web/VDO/01luxurious.mp4',
  'Premium Oasis':
    'https://euiwkvozrhnbxttfuchh.supabase.co/storage/v1/object/public/Chapter%2099%20web/VDO/Thai_mass.02mp4',
}

type Tier = {
  name: string
  setup: number
  monthly: number
  target: string
  features: string[]
  recommended?: boolean
}

const tiers: Tier[] = [
  {
    name: 'Smart Relax',
    setup: 199,
    monthly: 19,
    target: 'Automated booking system for small massage shops.',
    features: [
      'ระบบจองคิวผ่าน PWA (ลูกค้าจองเวลา/คอร์สได้เอง)',
      'ภาพบรรยากาศสปาพรีเมียม (AI/Stock Photo)',
      'เมนูดิจิทัลแสดงคอร์สนวดและราคา',
    ],
  },
  {
    name: 'Pro Vibe',
    setup: 499,
    monthly: 49,
    target: 'Growing shops needing real atmosphere photos.',
    recommended: true,
    features: [
      'ถ่ายภาพสถานที่จริง 5-10 มุม (หน้าร้าน/ห้องนวด)',
      'ระบบจองคิวแบบระบุตัวหมอนวดได้',
      'ระบบเก็บบันทึกประวัติลูกค้าเบื้องต้น',
    ],
  },
  {
    name: 'Premium Oasis',
    setup: 999,
    monthly: 89,
    target: 'Premium spas needing full marketing production.',
    features: [
      'ถ่ายภาพจัดเต็ม 15-20 ภาพ (คอร์ส/พนักงาน/ร้าน)',
      'ถ่ายทำคลิป Reel 1-2 คลิป สำหรับลง Social Media',
      'ระบบจัดการคิวพนักงานและตารางเวลาแบบครบวงจร',
    ],
  },
]

function formatAud(value: number) {
  return `A$${value.toLocaleString('en-AU')}`
}

function VideoBanner() {
  return (
    <div className="relative mb-10 h-[220px] w-full overflow-hidden rounded-2xl sm:mb-12 md:h-[340px]">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={VIDEOS.spaMassage}
        autoPlay
        muted
        loop
        playsInline
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(9,11,10,0.3) 0%, rgba(9,11,10,0.85) 100%)',
        }}
      />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <p
          className="mb-3 uppercase text-[#B8C9B0]"
          style={{ fontSize: '11px', letterSpacing: '0.3em', opacity: 0.7 }}
        >
          V4 Wellness &amp; Spa
        </p>
        <h2 className="text-4xl font-light tracking-tight text-white md:text-5xl">
          Premium Spa Management
        </h2>
        <p className="mt-3 text-sm font-light text-white/60">
          Booking · POS · Visual Production · one clear monthly fee
        </p>
      </div>
    </div>
  )
}

function CardVideoThumbnail({ src }: { src: string }) {
  return (
    <div className="mb-6 h-[120px] w-full overflow-hidden rounded-xl">
      <div className="relative h-full w-full overflow-hidden rounded-xl">
        <video
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          src={src}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#090B0A]/60" />
      </div>
    </div>
  )
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
        className={`group relative flex flex-col rounded-2xl border p-6 transition-all duration-300 sm:p-8 ${
          isRecommended
            ? 'border-[#B8C9B0]/35 bg-[#121614] shadow-[0_0_0_1.5px_rgba(184,201,176,0.6),0_8px_32px_rgba(184,201,176,0.072)]'
            : 'border-white/[0.07] bg-[#0E100F] hover:border-[#B8C9B0]/20 hover:shadow-[0_0_0_1.5px_#B8C9B0,0_8px_32px_rgba(184,201,176,0.12)]'
        } ${!isRecommended ? '' : 'hover:shadow-[0_0_0_1.5px_#B8C9B0,0_8px_32px_rgba(184,201,176,0.12)]'}`}
      >
        {isRecommended && (
          <span className="absolute -top-3 left-6 z-10 rounded-full border border-[#B8C9B0]/40 bg-[#E8EDE5] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#2A3328] sm:left-8">
            Recommended
          </span>
        )}

        <CardVideoThumbnail src={tierVideos[tier.name]} />

        <header className="mb-6 sm:mb-8">
          <h3 className="text-lg font-medium tracking-tight text-[#F4F6F3]">{tier.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#F4F6F3]/45">{tier.target}</p>
        </header>

        <div className="space-y-4">
          <div className="rounded-xl border border-[#B8C9B0]/15 bg-[#B8C9B0]/[0.04] px-4 py-4 sm:px-5 sm:py-5">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#B8C9B0]/70">
              Monthly subscription
            </p>
            <div className="flex items-end gap-1.5">
              <span className="text-4xl font-semibold leading-none tracking-[-0.04em] text-white sm:text-5xl">
                {formatAud(tier.monthly)}
              </span>
              <span className="mb-1 text-sm text-white/45">/month</span>
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 sm:px-5 sm:py-4">
            <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white/30">
              One-time setup
            </p>
            <p className="text-base font-medium text-white/55 sm:text-lg">
              {formatAud(tier.setup)}
              <span className="ml-1.5 text-sm font-normal text-white/30">setup fee</span>
            </p>
          </div>
        </div>

        <ul className="mb-8 mt-8 flex flex-1 flex-col gap-3 border-t border-white/[0.06] pt-8 sm:mb-10">
          {tier.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm leading-relaxed text-[#F4F6F3]/65">
              <Check
                className={`mt-0.5 h-4 w-4 shrink-0 ${isRecommended ? 'text-[#B8C9B0]' : 'text-white/40'}`}
                strokeWidth={1.75}
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className={`btn-interactive block rounded-full py-3.5 text-center text-sm font-medium ${
            isRecommended
              ? 'bg-[#E8EDE5] text-[#1A1F1A] hover:bg-[#F4F6F3]'
              : 'border border-white/12 text-[#F4F6F3] hover:border-[#B8C9B0]/30 hover:bg-[#B8C9B0]/[0.06]'
          }`}
        >
          เริ่มต้นใช้งาน
        </a>
      </article>
    </div>
  )
}

export default function V4WellnessPricing() {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setRevealed(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <section id="wellness-pricing" className="bg-[#090B0A] px-5 py-20 sm:px-6 sm:py-24">
      <div
        className={`mx-auto max-w-6xl transition-all duration-[800ms] ease-out ${
          revealed ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <VideoBanner />

        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3">
          {tiers.map((tier, index) => (
            <PricingCard key={tier.name} tier={tier} staggerDelay={index * 150} revealed={revealed} />
          ))}
        </div>
      </div>
    </section>
  )
}
