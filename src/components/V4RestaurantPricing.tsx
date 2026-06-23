import { Check } from 'lucide-react'

const FOODSHOT_VIDEO =
  'https://euiwkvozrhnbxttfuchh.supabase.co/storage/v1/object/public/Chapter%2099%20web/VDO/foodshot.mp4'

function VideoBanner() {
  return (
    <div className="relative mb-10 h-[220px] w-full overflow-hidden rounded-2xl sm:mb-14 md:h-[340px]">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={FOODSHOT_VIDEO}
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
          className="mb-3 uppercase text-white/70"
          style={{ fontSize: '11px', letterSpacing: '0.3em', opacity: 0.7 }}
        >
          V4 Restaurant
        </p>
        <h2 className="text-4xl font-light tracking-tight text-white md:text-5xl">
          F&amp;B Digital Solutions
        </h2>
        <p className="mt-3 text-sm font-light text-white/60">
          QR Menu · Photography · POS · Google Sheets sync
        </p>
      </div>
    </div>
  )
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
    name: 'Smart Starter',
    setup: 299,
    monthly: 39,
    target: 'Fast setup, run by AI.',
    features: [
      'ระบบ QR Menu PWA + Online Order',
      'ภาพอาหารแบบ AI Gen Match Style ทั้งร้าน',
      'จัดการหลังบ้านผ่าน Google Sheet Sync',
      'ระบบ Allergen tags พื้นฐาน',
    ],
  },
  {
    name: 'Pro Visuals',
    setup: 599,
    monthly: 79,
    target: 'Standard restaurants needing real visuals.',
    recommended: true,
    features: [
      'ถ่ายภาพจริง 10-15 Hero Dishes (แสงพรีเมียม)',
      'ถ่ายวิดีโอ Reel สั้น 1 คลิป (บรรยากาศ+อาหาร)',
      'ระบบ QR Menu + สั่งอาหารออนไลน์เต็มรูปแบบ',
    ],
  },
  {
    name: 'Premium Cinematic',
    setup: 1199,
    monthly: 129,
    target: 'High-end branding & production.',
    features: [
      'ถ่ายภาพจริง 25-30 เมนู (คลุมเมนูหลัก)',
      'ถ่ายวิดีโอ Reel แบบ Cinematic 3 คลิป',
      'รองรับการเชื่อมต่อ Kitchen Printer และระบบคิว',
    ],
  },
]

function formatAud(value: number) {
  return `A$${value.toLocaleString('en-AU')}`
}

function PricingCard({ tier }: { tier: Tier }) {
  const isRecommended = tier.recommended

  if (isRecommended) {
    return (
      <article
        className="relative flex flex-col rounded-2xl p-8 transition-colors duration-200"
        style={{
          background: 'linear-gradient(135deg, #1a1208 0%, #2d1f00 50%, #1a1208 100%)',
          border: '1.5px solid #E8A838',
          boxShadow: '0 0 0 1px rgba(232,168,56,0.2), 0 8px 40px rgba(232,168,56,0.15)',
        }}
      >
        <span
          className="absolute -top-3 left-8 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em]"
          style={{ background: '#E8A838', color: '#0C0C0C', fontWeight: 700 }}
        >
          Recommended
        </span>

        <header className="mb-8">
          <h3 className="text-lg tracking-tight text-white" style={{ fontWeight: 700 }}>
            {tier.name}
          </h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'rgba(215,226,234,0.65)' }}>
            {tier.target}
          </p>
        </header>

        <div className="mb-2">
          <div className="flex items-end gap-1">
            <span
              className="text-5xl font-semibold leading-none tracking-[-0.04em]"
              style={{ color: '#E8A838' }}
            >
              {formatAud(tier.monthly)}
            </span>
            <span className="mb-1 text-sm" style={{ color: 'rgba(232,168,56,0.6)' }}>
              /month
            </span>
          </div>
          <p className="mt-3 text-sm" style={{ color: 'rgba(232,168,56,0.5)' }}>
            {formatAud(tier.setup)} <span>setup</span>
          </p>
        </div>

        <ul className="mb-10 mt-8 flex flex-1 flex-col gap-3 border-t border-white/[0.06] pt-8">
          {tier.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-3 text-sm leading-relaxed"
              style={{ color: 'rgba(215,226,234,0.9)' }}
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: '#E8A838' }} strokeWidth={1.75} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="btn-interactive block rounded-full border-none py-3.5 text-center text-sm hover:bg-[#c47f15]"
          style={{ background: '#E8A838', color: '#0C0C0C', fontWeight: 700 }}
        >
          เริ่มต้นใช้งาน
        </a>
      </article>
    )
  }

  return (
    <article className="relative flex flex-col rounded-2xl border border-white/[0.08] bg-[#111111] p-8 transition-colors duration-200 hover:border-white/15">
      <header className="mb-8">
        <h3 className="text-lg font-medium tracking-tight text-white">{tier.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/45">{tier.target}</p>
      </header>

      <div className="mb-2">
        <div className="flex items-end gap-1">
          <span className="text-5xl font-semibold leading-none tracking-[-0.04em] text-white">
            {formatAud(tier.monthly)}
          </span>
          <span className="mb-1 text-sm text-white/50">/month</span>
        </div>
        <p className="mt-3 text-sm text-white/35">
          {formatAud(tier.setup)} <span className="text-white/25">setup</span>
        </p>
      </div>

      <ul className="mb-10 mt-8 flex flex-1 flex-col gap-3 border-t border-white/[0.06] pt-8">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm leading-relaxed text-white/65">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-white/50" strokeWidth={1.75} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <a
        href="#contact"
        className="btn-interactive block rounded-full border border-white/15 py-3.5 text-center text-sm font-medium text-white hover:border-white/30 hover:bg-white/[0.04]"
      >
        เริ่มต้นใช้งาน
      </a>
    </article>
  )
}

export default function V4RestaurantPricing() {
  return (
    <section id="pricing" className="bg-[#080808] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <VideoBanner />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
          {tiers.map((tier) => (
            <PricingCard key={tier.name} tier={tier} />
          ))}
        </div>
      </div>
    </section>
  )
}
