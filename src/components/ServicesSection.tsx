import { ArrowRight } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

type ServiceCard = {
  title: string
  titleLines?: [string, string]
  descriptionKey: 'services.card1.desc' | 'services.card2.desc' | 'services.card3.desc'
  ctaLabelKey: 'services.card1.cta' | 'services.card2.cta' | 'services.card3.cta'
  ctaHref: string
  featured?: boolean
  badge?: string
}

const services: ServiceCard[] = [
  {
    title: 'F&B Photography',
    descriptionKey: 'services.card1.desc',
    ctaLabelKey: 'services.card1.cta',
    ctaHref: '#portfolio',
    featured: true,
    badge: 'Featured',
  },
  {
    titleLines: ['PWA Booking', '& POS System'],
    title: 'PWA Booking & POS System',
    descriptionKey: 'services.card2.desc',
    ctaLabelKey: 'services.card2.cta',
    ctaHref: '#pricing',
  },
  {
    titleLines: ['Digital Menu', 'QR System'],
    title: 'Digital Menu QR System',
    descriptionKey: 'services.card3.desc',
    ctaLabelKey: 'services.card3.cta',
    ctaHref: '#contact',
  },
]

function ServiceCardBlock({ card, wide }: { card: ServiceCard; wide?: boolean }) {
  const { t } = useLanguage()
  return (
    <article
      className={`service-card flex min-h-72 flex-col justify-between rounded-2xl border-2 border-[#1A1A1A]/10 bg-white p-6 shadow-sm sm:min-h-80 sm:p-8 ${
        wide ? 'lg:col-span-2' : ''
      }`}
    >
      <div>
        {card.badge && (
          <span className="mb-4 inline-block rounded-full bg-[#2D5016] px-3 py-1 text-sm font-bold uppercase tracking-wide text-white">
            {card.badge}
          </span>
        )}
        <h3 className="text-2xl font-semibold tracking-[-0.02em] text-[#1A1A1A]">
          {card.titleLines ? (
            <>
              {card.titleLines[0]}
              <br />
              {card.titleLines[1]}
            </>
          ) : (
            card.title
          )}
        </h3>
        <p className="mt-4 max-w-md text-base leading-relaxed text-[#1A1A1A]/75">{t(card.descriptionKey)}</p>
      </div>

      <a
        href={card.ctaHref}
        className="btn-interactive mt-6 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border-2 border-[#1A1A1A] bg-[#1A1A1A] px-5 py-3 text-base font-semibold text-white active:scale-[0.98] sm:w-auto sm:justify-start"
      >
        {t(card.ctaLabelKey)}
        <ArrowRight className="h-5 w-5 shrink-0" aria-hidden />
      </a>
    </article>
  )
}

export default function ServicesSection() {
  const { t } = useLanguage()
  return (
    <section id="services" className="bg-[#F5F5F5] px-5 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-[88rem]">
        <div className="mb-16 grid grid-cols-1 items-start gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-8 text-4xl font-semibold leading-tight tracking-[-0.03em] text-black sm:text-5xl md:text-6xl">
              {t('services.headingLine1')}
              <br />
              {t('services.headingLine2')}
            </h2>
            <a
              href="#portfolio"
              className="btn-interactive inline-flex min-h-[48px] items-center gap-3 rounded-full bg-black py-2 pl-6 pr-2 text-base font-semibold text-white hover:bg-gray-800 active:scale-[0.98] sm:pl-8"
            >
              {t('services.viewPortfolio')}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black">
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>
          </div>

          <p className="text-xl leading-relaxed text-black/70 sm:text-2xl md:text-3xl">
            {t('services.intro')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <ServiceCardBlock card={services[0]} wide />
          <ServiceCardBlock card={services[1]} />
          <ServiceCardBlock card={services[2]} />
        </div>
      </div>
    </section>
  )
}
