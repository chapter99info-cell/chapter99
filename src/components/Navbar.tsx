import { LogoMark } from './Logo'
import { useLanguage } from '../i18n/LanguageContext'

export default function Navbar() {
  const { lang, toggleLang, t } = useLanguage()

  const navLinks = [
    { label: t('nav.services'), href: '#services' },
    { label: t('nav.portfolio'), href: '#portfolio' },
    { label: t('nav.pricing'), href: '#pricing' },
    { label: t('nav.contact'), href: '#contact' },
  ]

  return (
    <header className="absolute left-0 right-0 top-0 z-20 px-5 py-4 sm:px-6 sm:py-5">
      <div className="flex items-center justify-between">
        <a href="#" className="btn-interactive-subtle flex items-center gap-3 text-black">
          <LogoMark />
          <span
            className="text-2xl font-semibold tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Chapter99
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="btn-interactive-subtle text-base font-medium text-gray-600 hover:text-black"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleLang}
            aria-label="Switch language / เปลี่ยนภาษา"
            className="btn-interactive-subtle flex items-center rounded-full border border-black/15 bg-white/70 p-0.5 text-xs font-semibold text-black"
          >
            <span
              className={`rounded-full px-2.5 py-1 transition-colors ${
                lang === 'th' ? 'bg-black text-white' : 'text-gray-500'
              }`}
            >
              TH
            </span>
            <span
              className={`rounded-full px-2.5 py-1 transition-colors ${
                lang === 'en' ? 'bg-black text-white' : 'text-gray-500'
              }`}
            >
              EN
            </span>
          </button>

          <a
            href="#contact"
            className="btn-interactive rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 sm:px-6"
          >
            {t('nav.getDemo')}
          </a>
        </div>
      </div>
    </header>
  )
}
