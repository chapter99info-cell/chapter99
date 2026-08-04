import { heroCopy } from '../data/nav';
import { useFadeUp } from '../hooks/useFadeUp';
import { useTranslation } from '../i18n/LanguageContext';

export function Hero() {
  const { t } = useTranslation();
  const descRef = useFadeUp<HTMLParagraphElement>(0);
  const ctaRef = useFadeUp<HTMLAnchorElement>(1);

  return (
    <section className="hero-outer" id="top">
      <div className="hero-inner">
        <video
          className="hero-video"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_024928_1efd0b0d-6c02-45a8-8847-1030900c4f63.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        <div className="noise-overlay" />
        <div className="hero-grad" />
        <div className="hero-content">
          <div className="hero-grid">
            <div className="hero-h1-col">
              <h1 className="hero-h1">
                Chapter99<span className="star">*</span>
              </h1>
            </div>
            <div className="hero-side-col">
              <p ref={descRef} className="hero-desc fadeup">
                {t(heroCopy.desc)}
              </p>
              <a ref={ctaRef} className="cta-pill fadeup" href="#photo">
                <span>{t(heroCopy.cta)}</span>
                <span className="arrow">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#E1E0CC"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
