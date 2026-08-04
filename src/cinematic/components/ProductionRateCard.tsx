import { useState } from 'react';
import { productionCopy } from '../data/pricing';
import { useFadeUp } from '../hooks/useFadeUp';
import { useTranslation } from '../i18n/LanguageContext';

export function ProductionRateCard() {
  const { t } = useTranslation();
  const cardRef = useFadeUp(0);
  const [crewOn, setCrewOn] = useState(false);

  return (
    <div ref={cardRef} id="studio-rate" className="studio-card fadeup">
      <div className="studio-noise" />
      <div className="studio-head">
        <span className="studio-eyebrow">
          Production · <span>{t(productionCopy.eyebrowLarge)}</span>
        </span>
        <h3 className="studio-title">
          Production
          <br />
          Rate
        </h3>
      </div>
      <div className="studio-panel">
        <div className="studio-callout">
          <div className="lbl">{t(productionCopy.calloutTitle)}</div>
          <div className="desc">{t(productionCopy.calloutDesc)}</div>
          <div className="studio-toggle-row">
            <span className="amt">+A$150</span>
            <button
              type="button"
              className={`toggle${crewOn ? ' on' : ''}`}
              aria-pressed={crewOn}
              onClick={() => setCrewOn((v) => !v)}
            />
          </div>
        </div>
        <div className="studio-mid">
          <div className="amt-line">{t(productionCopy.amountLine)}</div>
          <ul className="studio-checks">
            {productionCopy.checks.map((check) => (
              <li key={check.en}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{t(check)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="studio-right">
          <span className="studio-badge">{t(productionCopy.badge)}</span>
          <a className="studio-cta" href="#contact">
            <span>{t(productionCopy.cta)}</span>{' '}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
