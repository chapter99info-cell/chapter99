import { useEffect, useRef } from 'react';
import {
  portfolioCopy,
  portfolioItems,
  portfolioMarquee,
} from '../data/portfolio';
import { useFadeUp } from '../hooks/useFadeUp';
import { useTranslation } from '../i18n/LanguageContext';

function PixelGrid() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container || container.childElementCount > 0) return;
    const cols = 6;
    const rows = 4;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const s = document.createElement('span');
        s.style.transitionDelay = `${((r + c) * 0.02).toFixed(2)}s`;
        container.appendChild(s);
      }
    }
  }, []);

  return <div ref={ref} className="proj-pixels" />;
}

export function Portfolio() {
  const { t } = useTranslation();
  const headRef = useFadeUp(0);
  const gridRef = useFadeUp(1);
  const footRef = useFadeUp(2);
  const names = [...portfolioMarquee, ...portfolioMarquee];

  return (
    <section id="portfolio">
      <div className="wrap">
        <div ref={headRef} className="pf-head fadeup">
          <span className="pf-badge">{t(portfolioCopy.badge)}</span>
          <h2 dangerouslySetInnerHTML={{ __html: t(portfolioCopy.heading) }} />
        </div>

        <div ref={gridRef} className="portfolio-grid fadeup">
          {portfolioItems.map((item) => (
            <div key={item.name} className="proj-card">
              <div className="proj-img" style={{ background: item.gradient }} />
              <PixelGrid />
              <span className="proj-plus">+</span>
              <div className="proj-plate">
                <div className="t">{item.name}</div>
                <div className="meta">
                  <span className="cat">{item.category}</span>
                  <span className="yr">{item.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div ref={footRef} className="portfolio-footer fadeup">
          <div className="pf-left">
            <span className="pf-plus">+</span>
            <p>{t(portfolioCopy.blurb)}</p>
            <a className="pf-cta" href="#contact">
              <span className="pf-cta-label">{t(portfolioCopy.cta)}</span>
              <span className="pf-cta-arrow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.75 6V15.75C18.75 15.949 18.671 16.14 18.53 16.28C18.39 16.421 18.199 16.5 18 16.5C17.801 16.5 17.61 16.421 17.47 16.28C17.329 16.14 17.25 15.949 17.25 15.75V7.81L6.53 18.53C6.39 18.671 6.199 18.75 6 18.75C5.801 18.75 5.61 18.671 5.47 18.53C5.329 18.39 5.25 18.199 5.25 18C5.25 17.801 5.329 17.61 5.47 17.47L16.19 6.75H8.25C8.051 6.75 7.86 6.671 7.72 6.53C7.579 6.39 7.5 6.199 7.5 6C7.5 5.801 7.579 5.61 7.72 5.47C7.86 5.329 8.051 5.25 8.25 5.25H18C18.199 5.25 18.39 5.329 18.53 5.47C18.671 5.61 18.75 5.801 18.75 6Z" />
                </svg>
              </span>
            </a>
          </div>
          <div className="pf-right">
            <div className="pf-marquee">
              <div className="pf-marquee-track">
                {names.map((name, i) => (
                  <span key={`${name}-${i}`}>{name}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
