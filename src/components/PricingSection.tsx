import { CheckCircle } from 'lucide-react'

type PricingCard = {
  badge: string
  badgeClass: string
  setup: number
  monthly: number
  promoSetup: number
  promoMonthly: number
  features: string[]
  ctaClass: string
  cardClass: string
  iconClass: string
  featured?: boolean
}

const plans: PricingCard[] = [
  {
    badge: 'Starter',
    badgeClass: 'bg-white/10 text-white/70',
    setup: 199,
    monthly: 29,
    promoSetup: 179,
    promoMonthly: 26,
    features: [
      'AI Gen ภาพทุกเมนู',
      'QR Menu PWA',
      'Google Sheet sync',
      'Allergen tags',
      'GST calculation',
    ],
    ctaClass:
      'mt-8 w-full rounded-full border border-white/20 py-3 text-white transition-colors duration-200 hover:bg-white hover:text-black',
    cardClass: 'bg-[#2A2A2A]',
    iconClass: 'text-[#E8A838]',
  },
  {
    badge: 'Professional',
    badgeClass: 'bg-black/20 text-black',
    setup: 499,
    monthly: 69,
    promoSetup: 449,
    promoMonthly: 62,
    features: [
      'ถ่ายภาพจริง 10-20 Hero Dishes',
      'AI Gen match style',
      'PWA + QR + Online Order',
      'POS Back-office',
      'Tax Export CSV',
      'Card + Sunday surcharge',
    ],
    ctaClass:
      'mt-8 w-full rounded-full bg-black py-3 text-white transition-colors duration-200 hover:bg-gray-800',
    cardClass: 'bg-[#E8A838]',
    iconClass: 'text-black',
    featured: true,
  },
  {
    badge: 'Business Plus',
    badgeClass: 'bg-white/10 text-white/70',
    setup: 999,
    monthly: 110,
    promoSetup: 899,
    promoMonthly: 99,
    features: [
      'ถ่ายภาพจริง 20+ Hero Dishes',
      'Reel Video 1-3 คลิป',
      'Full POS',
      'Takeaway + Dine-in',
      'GST BAS Report',
      'Multi-location',
    ],
    ctaClass:
      'mt-8 w-full rounded-full border border-white/20 py-3 text-white transition-colors duration-200 hover:bg-white hover:text-black',
    cardClass: 'bg-[#2A2A2A]',
    iconClass: 'text-[#E8A838]',
  },
]

function formatAud(amount: number) {
  return `A$${amount.toLocaleString('en-AU')}`
}

function PricingCardItem({ plan }: { plan: PricingCard }) {
  const textColor = plan.featured ? 'text-black' : 'text-white'
  const mutedClass = plan.featured ? 'text-black/45' : 'text-white/40'
  const subMutedClass = plan.featured ? 'text-black/50' : 'text-white/45'
  const promoBadgeClass = plan.featured
    ? 'bg-black/15 text-black'
    : 'bg-[#E8A838]/20 text-[#E8A838]'

  return (
    <article className={`rounded-2xl p-8 ${plan.cardClass}`}>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className={`inline-block rounded-full px-3 py-1 text-xs ${plan.badgeClass}`}>
          {plan.badge}
        </span>
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${promoBadgeClass}`}>
          10 เจ้าแรก −10%
        </span>
      </div>

      <div className="mb-1">
        <span className={`text-4xl font-semibold ${textColor}`}>{formatAud(plan.promoSetup)}</span>
        <span className={`ml-2 text-base ${plan.featured ? 'text-black/50' : 'text-white/40'}`}>
          setup
        </span>
        <span className={`ml-2 text-sm line-through ${mutedClass}`}>{formatAud(plan.setup)}</span>
      </div>

      <p className={`mb-8 mt-1 text-sm ${plan.featured ? 'text-black/60' : 'text-white/50'}`}>
        <span className="font-medium">+ {formatAud(plan.promoMonthly)}/เดือน</span>
        <span className={`ml-2 line-through ${subMutedClass}`}>
          {formatAud(plan.monthly)}/เดือน
        </span>
      </p>

      <ul className={`space-y-3 text-sm ${plan.featured ? 'text-black/80' : 'text-white/70'}`}>
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start">
            <CheckCircle className={`mr-3 mt-0.5 h-4 w-4 shrink-0 ${plan.iconClass}`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <a href="#contact" className={`block text-center font-semibold ${plan.ctaClass}`}>
        เริ่มต้น
      </a>
    </article>
  )
}

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-[#1A1A1A] px-6 py-24">
      <div className="mx-auto max-w-[88rem]">
        <p className="mb-4 text-sm uppercase tracking-[0.1em] text-white/40">Pricing</p>
        <h2 className="mb-6 text-5xl font-semibold leading-tight tracking-[-0.03em] text-white md:text-6xl">
          Transparent.
          <br />
          No surprises.
        </h2>

        <div className="mb-12 inline-flex items-center gap-2 rounded-full border border-[#E8A838]/30 bg-[#E8A838]/10 px-5 py-2.5">
          <span className="text-sm font-semibold text-[#E8A838]">โปร 10 เจ้าแรก</span>
          <span className="text-sm text-white/60">ลด 10% จากราคาปกติ — เหลือเพียง 10 ร้าน</span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <PricingCardItem key={plan.badge} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  )
}
