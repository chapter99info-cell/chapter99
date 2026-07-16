import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import PaymentLinkButtons from './PaymentLinkButtons'
import PaymentQrGrid from './PaymentQrGrid'
import { useLanguage } from '../i18n/LanguageContext'
import {
  CARD_STAGGER_S,
  FEATURE_BADGE_LAYOUTS,
  formatAud,
  PRICING_TIERS,
  SPEED_RAMP_EXIT,
  SPEED_RAMP_SPRING,
  SPEED_RAMP_TWEEN,
  type PricingTier,
} from './pricing/pricingData'

function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [locked])
}

function TierGridCard({
  tier,
  index,
  onSelect,
  reduceMotion,
}: {
  tier: PricingTier
  index: number
  onSelect: (tier: PricingTier) => void
  reduceMotion: boolean | null
}) {
  const ShowcaseIcon = tier.showcaseIcon
  const isRecommended = tier.recommended
  const { lang, t } = useLanguage()

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(tier)}
      className="group relative w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D5016] focus-visible:ring-offset-2"
      initial={reduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 28, scale: 0.92 }}
      whileInView={
        reduceMotion
          ? undefined
          : { opacity: 1, y: 0, scale: [0.92, 1.03, 1] }
      }
      viewport={{ once: true, margin: '-40px' }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              delay: index * CARD_STAGGER_S,
              opacity: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
              y: { ...SPEED_RAMP_SPRING, delay: index * CARD_STAGGER_S },
              scale: {
                duration: 0.3,
                times: [0, 0.65, 1],
                ease: [0.16, 1, 0.3, 1],
                delay: index * CARD_STAGGER_S,
              },
            }
      }
      whileHover={reduceMotion ? undefined : { scale: 1.02, y: -4 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
    >
      <article
        className={`relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-2xl border p-6 transition-shadow duration-200 sm:min-h-[360px] sm:p-7 ${
          isRecommended
            ? 'border-[#2D5016]/50 bg-white shadow-[0_12px_40px_rgba(45,80,22,0.14)]'
            : 'border-black/10 bg-[#FAFAFA] shadow-sm group-hover:shadow-lg'
        }`}
      >
        {isRecommended && (
          <span className="absolute right-4 top-4 rounded-full bg-[#2D5016] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Popular
          </span>
        )}

        <div
          className="mb-5 flex h-28 items-center justify-center rounded-xl sm:h-32"
          style={{ background: tier.showcaseGradient }}
        >
          <ShowcaseIcon className="h-12 w-12 text-white/90 sm:h-14 sm:w-14" strokeWidth={1.25} />
        </div>

        <h3 className="text-xl font-bold text-[#1A1A1A]">{lang === 'th' ? tier.nameTh : tier.name}</h3>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-[#1A1A1A]">
            {formatAud(tier.monthly)}
          </span>
          <span className="text-sm text-[#6B7280]">/mo</span>
        </div>
        <p className="mt-1 text-sm text-[#6B7280]">
          Setup {formatAud(tier.setup)}
        </p>

        <p className="mt-4 line-clamp-2 flex-1 text-sm leading-relaxed text-[#6B7280]">
          {lang === 'th' ? tier.targetTh : tier.target}
        </p>

        <span className="mt-5 inline-flex text-sm font-semibold text-[#2D5016] group-hover:underline">
          {t('pricing.viewDetails')}
        </span>
      </article>
    </motion.button>
  )
}

function TierExpandedPanel({
  tier,
  onClose,
  reduceMotion,
}: {
  tier: PricingTier
  onClose: () => void
  reduceMotion: boolean | null
}) {
  const ShowcaseIcon = tier.showcaseIcon
  const { lang, t } = useLanguage()

  const panelMotion = reduceMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.85 },
        animate: { opacity: 1, scale: [0.85, 1.05, 1] },
        exit: { opacity: 0, scale: 0.88 },
      }

  const panelTransition = reduceMotion
    ? { duration: 0.15 }
    : {
        scale: { duration: 0.32, times: [0, 0.62, 1], ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
      }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pricing-tier-title"
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={reduceMotion ? { duration: 0.1 } : SPEED_RAMP_EXIT}
    >
      <button
        type="button"
        aria-label="Close pricing details"
        className="absolute inset-0 bg-black/65 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        {...panelMotion}
        transition={panelTransition}
        className="relative z-10 flex max-h-[96vh] w-full flex-col overflow-hidden rounded-t-3xl bg-[#0E100F] shadow-2xl sm:max-h-[90vh] sm:max-w-2xl sm:rounded-3xl lg:max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Showcase with floating feature badges */}
        <div
          className="relative min-h-[220px] overflow-hidden sm:min-h-[280px]"
          style={{ background: tier.showcaseGradient }}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <ShowcaseIcon className="h-20 w-20 text-white/25 sm:h-28 sm:w-28" strokeWidth={1} />
          </div>

          {tier.features.map((feature, i) => {
            const layout = FEATURE_BADGE_LAYOUTS[i % FEATURE_BADGE_LAYOUTS.length]
            const Icon = feature.icon
            const featureLabel = lang === 'th' ? feature.labelTh : feature.label
            return (
              <motion.div
                key={feature.label}
                className="absolute z-10 flex max-w-[42%] items-center gap-2 rounded-full border border-white/20 bg-black/55 px-3 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-md sm:max-w-[38%] sm:px-4 sm:py-2.5 sm:text-sm"
                style={{
                  top: layout.top,
                  left: layout.left,
                  rotate: `${layout.rotate}deg`,
                }}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { ...SPEED_RAMP_SPRING, delay: 0.08 + i * 0.05 }
                }
              >
                <Icon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                <span className="leading-tight">{featureLabel}</span>
              </motion.div>
            )
          })}
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C8A84B]">
            {tier.recommended ? 'Recommended' : 'Package'}
          </p>
          <h3 id="pricing-tier-title" className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            {lang === 'th' ? tier.nameTh : tier.name}
          </h3>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">Monthly</p>
              <p className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                {formatAud(tier.monthly)}
                <span className="text-sm font-normal text-white/50">/mo</span>
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">Setup</p>
              <p className="mt-1 text-2xl font-bold text-white sm:text-3xl">{formatAud(tier.setup)}</p>
            </div>
          </div>

          <p className="mt-6 text-base leading-relaxed text-white/75">{lang === 'th' ? tier.targetTh : tier.target}</p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {tier.features.map((f) => {
              const Icon = f.icon
              return (
                <li
                  key={f.label}
                  className="inline-flex items-center gap-2 rounded-full border border-[#2D5016]/40 bg-[#2D5016]/20 px-3 py-1.5 text-xs font-medium text-[#E8EDE5] sm:text-sm"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {lang === 'th' ? f.labelTh : f.label}
                </li>
              )
            })}
          </ul>

          <a
            href="#contact"
            onClick={onClose}
            className="btn-interactive mt-8 block w-full rounded-full bg-[#2D5016] py-4 text-center text-base font-bold text-white shadow-[0_8px_32px_rgba(45,80,22,0.45)] hover:bg-[#234012] sm:py-4.5 sm:text-lg"
          >
            {t('pricing.selectPackage')}
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function PricingTiersSection() {
  const { t } = useLanguage()
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null)
  const reduceMotion = useReducedMotion()
  useBodyScrollLock(Boolean(selectedTier))

  const close = useCallback(() => setSelectedTier(null), [])

  useEffect(() => {
    if (!selectedTier) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedTier, close])

  return (
    <section id="pricing" className="bg-[#F8F5F0] px-5 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-12 text-center sm:mb-16"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={reduceMotion ? { duration: 0 } : SPEED_RAMP_TWEEN}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2D5016]">
            Pricing
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#1A1A1A] sm:text-4xl md:text-5xl">
            {t('pricing.heading')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#6B7280] sm:text-lg">
            {t('pricing.subheading')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-5">
          {PRICING_TIERS.map((tier, index) => (
            <TierGridCard
              key={tier.id}
              tier={tier}
              index={index}
              onSelect={setSelectedTier}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-[#2D5016]/15 bg-white p-6 text-center shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#2D5016]">
            Client payment
          </p>
          <h3 className="mt-2 text-xl font-bold text-[#1A1A1A]">{t('pricing.paySquareHeading')}</h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-[#6B7280]">
            {t('pricing.paySquareBody')}
          </p>
          <PaymentLinkButtons className="mt-6" />
          <PaymentQrGrid />
        </div>

        <p className="mt-10 text-center text-sm text-[#6B7280]">
          Production photography &amp; video add-ons on Ultimate only.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {selectedTier && (
          <TierExpandedPanel
            key={selectedTier.id}
            tier={selectedTier}
            onClose={close}
            reduceMotion={reduceMotion}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
