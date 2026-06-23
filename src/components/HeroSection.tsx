import { useEffect, useState } from 'react'
import LazyViewportVideo from './LazyViewportVideo'
import { useMouseScrubVideo } from '../hooks/useMouseScrubVideo'
import { useTypewriter } from '../hooks/useTypewriter'

const VIDEO_URL =
  'https://euiwkvozrhnbxttfuchh.supabase.co/storage/v1/object/public/Chapter%2099%20web/VDO/hf_20260623_011229_0975c984-b9e4-4913-af12-a588218640e1.mp4'

const TYPEWRITER_TEXT =
  'Glad you stopped in. Good taste tends to find us. Now, what are we building?'

const WHITE_PILLS = [
  { label: 'นัด Demo ฟรี', href: '#contact' },
  { label: 'ดูผลงาน', href: '#portfolio' },
  { label: 'ทัก Facebook', href: 'https://m.me/61586534972406', external: true },
  { label: 'ดู Pricing', href: '#pricing' },
] as const

const EMAIL = 'chapter99solutions@gmail.com'

const brandItems = [
  {
    label: 'F&B Photography',
    style: { fontFamily: 'Georgia, serif', fontWeight: 700, letterSpacing: '-0.02em', fontSize: '14px' },
  },
  {
    label: 'PWA Systems',
    style: {
      fontFamily: 'Arial, sans-serif',
      fontWeight: 900,
      letterSpacing: '0.08em',
      fontSize: '12px',
      textTransform: 'uppercase' as const,
    },
  },
  {
    label: 'AI Powered',
    style: {
      fontFamily: '"Trebuchet MS", sans-serif',
      fontWeight: 600,
      letterSpacing: '0.01em',
      fontSize: '14px',
      fontStyle: 'italic' as const,
    },
  },
  {
    label: 'POS & Booking',
    style: {
      fontFamily: '"Courier New", monospace',
      fontWeight: 700,
      letterSpacing: '0.12em',
      fontSize: '12px',
      textTransform: 'uppercase' as const,
    },
  },
  {
    label: 'QR Menu',
    style: { fontFamily: 'Palatino, serif', fontWeight: 400, letterSpacing: '-0.01em', fontSize: '15px' },
  },
  {
    label: 'GST Compliant',
    style: { fontFamily: 'Impact, sans-serif', fontWeight: 400, letterSpacing: '0.04em', fontSize: '13px' },
  },
  {
    label: 'Thai Business Agency',
    style: { fontFamily: 'Verdana, sans-serif', fontWeight: 700, letterSpacing: '-0.03em', fontSize: '12px' },
  },
]

function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="1" y="1" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

function BrandMarquee() {
  const items = [...brandItems, ...brandItems]

  return (
    <div className="mt-10 w-full max-w-lg overflow-hidden md:mt-16">
      <div className="marquee-track">
        {items.map((item, index) => (
          <span
            key={`${item.label}-${index}`}
            className="mx-8 shrink-0 whitespace-nowrap text-white/50"
            style={item.style}
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function HeroSection() {
  const videoRef = useMouseScrubVideo()
  const { displayed, done } = useTypewriter(TYPEWRITER_TEXT)
  const [pillsVisible, setPillsVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setPillsVisible(true), 400)
    return () => clearTimeout(timer)
  }, [])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <section className="flex flex-1 overflow-hidden px-5 pb-6 pt-20 sm:px-6">
      <div
        className="relative w-full overflow-hidden rounded-3xl"
        style={{ height: 'calc(100vh - 96px)' }}
      >
        <LazyViewportVideo
          ref={videoRef}
          className="absolute inset-0 z-0 h-full w-full object-cover"
          style={{ objectPosition: '70% center' }}
          src={VIDEO_URL}
          muted
          playsInline
        />

        <div className="absolute inset-0 z-[1] bg-black/45" />

        <div
          className="relative z-10 flex h-full flex-col justify-end overflow-hidden px-5 pb-10 pt-24 sm:px-8 sm:pb-12 md:justify-center md:px-10 md:pb-0 md:pt-28"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <div className="max-w-xl">
            <p
              className="pointer-events-none mb-5 select-none sm:mb-6"
              style={{
                fontSize: 'clamp(18px, 4vw, 26px)',
                lineHeight: 1.3,
                fontWeight: 400,
                color: '#fff',
                filter: 'blur(4px)',
              }}
            >
              Hey there, meet Chapter99,
              <br />
              Thai Business Digital Agency · Sydney
            </p>

            <p
              className="mb-5 min-h-[54px] text-white sm:mb-6"
              style={{
                fontSize: 'clamp(18px, 4vw, 26px)',
                lineHeight: 1.35,
                fontWeight: 400,
              }}
            >
              {displayed}
              {!done && (
                <span className="cursor-blink ml-[2px] inline-block h-[1.1em] w-[2px] translate-y-[2px] bg-white align-middle" />
              )}
            </p>

            <div
              className="flex flex-wrap gap-y-1 transition-all duration-[400ms] ease-out"
              style={{
                opacity: pillsVisible ? 1 : 0,
                transform: pillsVisible ? 'translateY(0)' : 'translateY(8px)',
              }}
            >
              {WHITE_PILLS.map((pill) => (
                <a
                  key={pill.label}
                  href={pill.href}
                  {...('external' in pill && pill.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="btn-interactive mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center whitespace-nowrap rounded-full border border-black/10 bg-white px-4 py-[0.3em] text-[13px] text-black hover:bg-black hover:text-white sm:px-5 sm:text-[15px]"
                >
                  {pill.label}
                </a>
              ))}

              <button
                type="button"
                onClick={copyEmail}
                className="btn-interactive mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white bg-transparent px-4 py-[0.3em] text-[13px] text-white hover:bg-white hover:text-black sm:gap-3 sm:px-5 sm:text-[15px]"
              >
                <span>
                  Reach us:{' '}
                  <span className="underline underline-offset-1">{EMAIL}</span>
                </span>
                <CopyIcon />
                {copied && <span className="sr-only">Copied</span>}
              </button>
            </div>

            <p className="mt-4 text-xs text-white/40 md:mt-6">
              เลื่อนเมาส์ซ้าย–ขวาเพื่อสำรวจวิดีโอ
            </p>
          </div>

          <BrandMarquee />
        </div>
      </div>
    </section>
  )
}
