import { useEffect, useState } from 'react'
import { BeforeAfter } from '../components/home-v7/BeforeAfter'
import { DemoModal } from '../components/home-v7/DemoModal'
import { FinalCta } from '../components/home-v7/FinalCta'
import { Footer } from '../components/home-v7/Footer'
import { Hero } from '../components/home-v7/Hero'
import { HowSteps } from '../components/home-v7/HowSteps'
import { MassageDemo } from '../components/home-v7/MassageDemo'
import { MeetTeam } from '../components/home-v7/MeetTeam'
import { OtherShops } from '../components/home-v7/OtherShops'
import { Pricing } from '../components/home-v7/Pricing'
import { StickyContact } from '../components/home-v7/StickyContact'
import { TrustFaq } from '../components/home-v7/TrustFaq'
import '../styles/home-v7.css'

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Anton&family=Kanit:wght@600;700&family=IBM+Plex+Sans+Thai:wght@400;600&display=swap'
const HAND_HREF = 'https://fonts.googleapis.com/css2?family=Charmonman:wght@700&display=swap'

export default function HomeV7() {
  const [demoSrc, setDemoSrc] = useState<string | null>(null)

  useEffect(() => {
    const links: HTMLLinkElement[] = []
    const add = (rel: string, href: string, extra?: Partial<HTMLLinkElement> & { media?: string }) => {
      const el = document.createElement('link')
      el.rel = rel
      el.href = href
      if (extra?.as) el.as = extra.as
      if (extra?.fetchPriority) el.setAttribute('fetchpriority', extra.fetchPriority)
      if (extra?.media) el.media = extra.media
      document.head.appendChild(el)
      links.push(el)
    }
    add('preload', '/mockup/media/web/cta-spa.webp', { as: 'image', fetchPriority: 'high' })
    add('preconnect', 'https://fonts.googleapis.com')
    add('preconnect', 'https://fonts.gstatic.com')
    add('stylesheet', FONT_HREF)
    add('stylesheet', HAND_HREF, { media: '(min-width:1001px)' })

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const els = document.querySelectorAll('.home-v7 .rv')
    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('in'))
      return () => links.forEach((l) => l.remove())
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )
    els.forEach((e) => io.observe(e))
    return () => {
      io.disconnect()
      links.forEach((l) => l.remove())
    }
  }, [])

  return (
    <div className="home-v7">
      <Hero onOpenDemo={setDemoSrc} />
      <BeforeAfter />
      <MassageDemo onOpenDemo={setDemoSrc} />
      <OtherShops />
      <HowSteps />
      <MeetTeam />
      <Pricing />
      <TrustFaq />
      <FinalCta />
      <Footer />
      <StickyContact />
      <DemoModal src={demoSrc} onClose={() => setDemoSrc(null)} onChange={setDemoSrc} />
    </div>
  )
}
