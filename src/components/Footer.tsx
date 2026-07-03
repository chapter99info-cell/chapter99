import { useEffect, useRef } from 'react'

const FOOTER_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260503_104800_bc43ae09-f494-43e3-97d7-2f8c1692cfd7.mp4'

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
]

const COMPANY_LINKS = [
  { label: 'About Chapter99', href: '#' },
  { label: 'Get a Quote', href: '#contact' },
  { label: 'Terms and Condition', href: '#' },
  { label: 'Privacy Policy', href: '#' },
]

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function LineIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.6 5.82c-1.14-1.08-1.7-2.65-1.79-4.17-1.3 0-2.6-.01-3.91.01.02 4.02-.01 8.05-.02 12.07-.01 1.79.03 3.57-.07 5.36-.01.39-.22.73-.41 1.06-.58.95-1.65 1.6-2.77 1.61-1.68.15-3.26-1.23-3.5-2.87-.01-.54-.07-1.1.14-1.61.25-.71.73-1.34 1.36-1.75.87-.6 2.03-.69 3.02-.37 0-1.48.06-2.96.04-4.44-2.17-.41-4.49.28-6.15 1.72-1.46 1.24-2.4 3.06-2.58 4.96-.02.49-.01.99.01 1.49.21 2.34 1.63 4.52 3.65 5.71 1.22.72 2.65 1.11 4.08 1.03 2.33-.04 4.6-1.29 5.91-3.21.81-1.15 1.27-2.54 1.35-3.94.03-2.91.01-5.83.02-8.75.54.33 1.07.68 1.65.94 1.32.64 2.79.95 4.25 1V6.31c-1.56-.17-3.17-.67-4.31-1.78z" />
    </svg>
  )
}

const SOCIAL_ICONS = [
  { label: 'Facebook', Icon: FacebookIcon },
  { label: 'Instagram', Icon: InstagramIcon },
  { label: 'LINE', Icon: LineIcon },
  { label: 'TikTok', Icon: TikTokIcon },
]

export default function Footer() {
  const watermarkTextRef = useRef<SVGTextElement>(null)
  const watermarkSvgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    function fitWatermark() {
      const svg = watermarkSvgRef.current
      const text = watermarkTextRef.current
      if (!svg || !text) return
      try {
        const bbox = text.getBBox()
        svg.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`)
      } catch {
        // ignore — text not yet measurable
      }
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fitWatermark)
    } else {
      window.addEventListener('load', fitWatermark)
    }
    window.addEventListener('resize', fitWatermark)
    return () => window.removeEventListener('resize', fitWatermark)
  }, [])

  function handleSendEmail() {
    const input = document.getElementById('footerSubscribeEmail') as HTMLInputElement | null
    const senderEmail = input ? input.value.trim() : ''
    const subject = encodeURIComponent('Inquiry from Chapter99 website')
    const body = encodeURIComponent(
      senderEmail ? `Hi Chapter99,\n\nMy email: ${senderEmail}\n\n` : 'Hi Chapter99,\n\n'
    )
    window.location.href = `mailto:chapter99solutions@gmail.com?subject=${subject}&body=${body}`
  }

  return (
    <>
      <style>{`
        .footer-wrapper {
          max-width: 1150px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 16px;
          align-items: stretch;
        }
        .footer-left {
          position: relative;
          min-height: 340px;
          border-radius: 28px;
          padding: 32px;
          overflow: hidden;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
          background: #111111;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .footer-left-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
          pointer-events: none;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          position: relative;
          z-index: 1;
        }
        .footer-logo-mark {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.15);
          border: 1.5px solid rgba(255, 255, 255, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.02em;
        }
        .footer-logo-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.02em;
        }
        .footer-tagline-container {
          margin-top: auto;
          margin-bottom: 28px;
          position: relative;
          z-index: 1;
        }
        .footer-tagline {
          font-size: 19px;
          font-weight: 400;
          color: #ffffff;
          line-height: 1.45;
        }
        .footer-tagline span {
          color: rgba(255, 255, 255, 0.65);
        }
        .footer-social-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          position: relative;
          z-index: 1;
        }
        .footer-social-label {
          font-family: 'Caveat', cursive;
          font-size: 17px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: 0.3px;
        }
        .footer-social-icons {
          display: flex;
          gap: 7px;
        }
        .social-icon {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: #0e1014;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35), 0 2px 6px rgba(0, 0, 0, 0.2);
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .social-icon svg {
          width: 15px;
          height: 15px;
          fill: #ffffff;
        }
        .social-icon:hover {
          background: #000000;
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45), 0 4px 10px rgba(0, 0, 0, 0.3);
        }
        .footer-right {
          background: #f0f1f5;
          border-radius: 28px;
          padding: 40px;
          overflow: visible;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }
        .footer-lucky-graphic {
          position: absolute;
          top: -36px;
          right: 40px;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
        }
        .lucky-cube {
          width: 96px;
          height: 96px;
          border-radius: 22px;
          transform: rotate(-10deg);
          background: linear-gradient(135deg, #3d3d3d 0%, #161616 55%, #000000 100%);
          box-shadow:
            inset 3px 3px 8px rgba(255, 255, 255, 0.18),
            inset -3px -3px 12px rgba(0, 0, 0, 0.4),
            8px 14px 28px rgba(0, 0, 0, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .lucky-cube-mark {
          font-family: 'DM Sans', sans-serif;
          font-size: 42px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.04em;
          transform: rotate(10deg);
          text-shadow: 0 3px 6px rgba(0, 0, 0, 0.25);
          line-height: 1;
        }
        .lucky-text-row {
          display: flex;
          gap: 6px;
          align-items: center;
          transform: rotate(-4deg);
          margin-top: 4px;
        }
        .lucky-arrow {
          width: 22px;
          height: 22px;
          color: #c9a227;
        }
        .lucky-arrow path {
          stroke: currentColor;
          fill: none;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .lucky-text {
          font-family: 'Caveat', cursive;
          font-size: 20px;
          font-weight: 600;
          color: #c9a227;
          white-space: nowrap;
        }
        .footer-right-top {
          padding-top: 8px;
        }
        .footer-nav-cols {
          display: flex;
          gap: 72px;
        }
        .footer-col-title {
          font-family: 'Caveat', cursive;
          font-size: 24px;
          font-weight: 600;
          font-style: italic;
          color: #9ca3af;
          margin-bottom: 18px;
        }
        .footer-col a {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 14px;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-col a:hover {
          color: #c9a227;
        }
        .footer-bottom {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-top: 48px;
        }
        .footer-copyright {
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px;
          font-weight: 500;
          color: #9ca3af;
        }
        .footer-cta-mini {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .footer-cta-mini h4 {
          font-size: 15px;
          font-weight: 400;
          color: #6b7280;
          line-height: 1.45;
        }
        .footer-cta-mini h4 strong {
          display: block;
          font-size: 19px;
          font-weight: 700;
          color: #111827;
        }
        .footer-subscribe-row {
          display: flex;
          width: 310px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 5px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
        }
        .footer-subscribe-row input {
          flex: 1;
          padding: 11px 14px;
          background: transparent;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          color: #111827;
          outline: none;
        }
        .footer-subscribe-row input::placeholder {
          color: #9ca3af;
        }
        .footer-subscribe-row button {
          padding: 11px 22px;
          background: #111214;
          color: #ffffff;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.28), 0 2px 8px rgba(0, 0, 0, 0.15);
          transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
        }
        .footer-subscribe-row button:hover {
          background: #000000;
          box-shadow: 0 10px 26px rgba(0, 0, 0, 0.38), 0 4px 10px rgba(0, 0, 0, 0.2);
          transform: translateY(-1px);
        }
        .footer-watermark {
          max-width: 1150px;
          margin: -60px auto 0;
          pointer-events: none;
          user-select: none;
          position: relative;
          z-index: 0;
          line-height: 0;
        }
        .footer-watermark svg {
          display: block;
          width: 100%;
          height: auto;
          overflow: visible;
        }
        .footer-watermark text {
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          letter-spacing: -0.03em;
          fill: rgba(0, 0, 0, 0.04);
        }
        @media (max-width: 860px) {
          .footer-wrapper {
            grid-template-columns: 1fr;
          }
          .footer-left {
            min-height: auto;
            gap: 40px;
          }
        }
        @media (max-width: 560px) {
          .footer-right {
            padding: 24px;
          }
          .footer-nav-cols {
            gap: 40px;
          }
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            gap: 24px;
          }
          .footer-subscribe-row {
            width: 100%;
          }
          .footer-lucky-graphic {
            right: 12px;
            top: -28px;
          }
          .lucky-cube {
            width: 72px;
            height: 72px;
          }
          .lucky-cube-mark {
            font-size: 31px;
          }
        }
      `}</style>

      <section className="footer-section" style={{ background: '#ffffff', padding: '48px 24px' }}>
        <div className="footer-wrapper">
          <div className="footer-left">
            <video className="footer-left-video" autoPlay muted loop playsInline preload="auto">
              <source src={FOOTER_VIDEO} type="video/mp4" />
            </video>

            <div className="footer-logo">
              <div className="footer-logo-mark">C</div>
              <span className="footer-logo-name">Chapter99</span>
            </div>

            <div className="footer-tagline-container">
              <p className="footer-tagline">
                Smarter digital presence,
                <br />
                <span>powered by AI.</span>
              </p>
            </div>

            <div className="footer-social-row">
              <span className="footer-social-label">Stay in touch!</span>
              <div className="footer-social-icons">
                {SOCIAL_ICONS.map(({ label, Icon }) => (
                  <div key={label} className="social-icon" title={label}>
                    <Icon />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="footer-right">
            <div className="footer-lucky-graphic">
              <div className="lucky-cube">
                <span className="lucky-cube-mark">C</span>
              </div>
              <div className="lucky-text-row">
                <svg className="lucky-arrow" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 20 C 6 14, 10 9, 18 5" />
                  <path d="M18 5 L 12 5" />
                  <path d="M18 5 L 18 11" />
                </svg>
                <span className="lucky-text">Feeling lucky?</span>
              </div>
            </div>

            <div className="footer-right-top">
              <div className="footer-nav-cols">
                <div className="footer-col">
                  <p className="footer-col-title">Navigation</p>
                  {NAV_LINKS.map((link) => (
                    <a key={link.href} href={link.href}>
                      {link.label}
                    </a>
                  ))}
                </div>
                <div className="footer-col">
                  <p className="footer-col-title">Company</p>
                  {COMPANY_LINKS.map((link) => (
                    <a key={link.label} href={link.href}>
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <p className="footer-copyright">© 2026 Chapter99. All rights reserved.</p>

              <div className="footer-cta-mini">
                <h4>
                  มีคำถาม?
                  <br />
                  <strong>ทักอีเมลหาเราได้เลย.</strong>
                </h4>
                <div className="footer-subscribe-row">
                  <input type="email" id="footerSubscribeEmail" placeholder="Enter your email address" />
                  <button type="button" onClick={handleSendEmail}>
                    ส่งอีเมล
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-watermark" aria-hidden="true">
          <svg
            ref={watermarkSvgRef}
            viewBox="62 95 876 175"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text ref={watermarkTextRef} x="500" y="240" textAnchor="middle" fontSize="320">
              Chapter99
            </text>
          </svg>
        </div>
      </section>
    </>
  )
}
