import { LogoMark } from './Logo'

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
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

        <a
          href="#contact"
          className="btn-interactive rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 sm:px-6"
        >
          Get Demo
        </a>
      </div>
    </header>
  )
}
