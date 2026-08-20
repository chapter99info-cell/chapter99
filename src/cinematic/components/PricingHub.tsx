import { useEffect, useState } from 'react';
import {
  photographyCopy,
  photographyTiers,
  pricingCategories,
  pricingTrust,
  type PricingCategoryId,
  webCopy,
  webTiers,
  otherCopy,
  otherTiers,
} from '../data/pricing';
import { photographyFaq, webFaq, otherFaq } from '../data/faq';
import { useFadeUp } from '../hooks/useFadeUp';
import { useTranslation } from '../i18n/LanguageContext';
import { FaqAccordion } from './FaqAccordion';
import { PricingCard } from './PricingCard';
import { ProductionRateCard } from './ProductionRateCard';

function hashToCategory(hash: string): PricingCategoryId | null {
  const id = hash.replace(/^#/, '');
  if (id === 'photo-rates') return 'photo';
  if (id === 'web-rates') return 'web';
  if (id === 'other-rates') return 'other';
  return null;
}

export function PricingHub() {
  const { t } = useTranslation();
  const headRef = useFadeUp(0);
  const pickerRef = useFadeUp(1);
  const [category, setCategory] = useState<PricingCategoryId | null>(null);

  useEffect(() => {
    const apply = () => setCategory((prev) => hashToCategory(window.location.hash) ?? prev);
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, []);

  function pick(id: PricingCategoryId) {
    setCategory(id);
    const hash = pricingCategories.find((c) => c.id === id)?.hash;
    if (hash) history.replaceState(null, '', `#${hash}`);
  }

  return (
    <section id="pricing" className="rates-hub">
      <span id="photo-rates" />
      <span id="web-rates" />
      <span id="other-rates" />
      <div className="wrap">
        <div ref={headRef} className="rates-head fadeup">
          <span className="about-label">{t(pricingTrust.label)}</span>
          <h2>{t(pricingTrust.heading)}</h2>
          <p className="rates-trust">{t(pricingTrust.body)}</p>
        </div>

        <div ref={pickerRef} className="cat-picker fadeup">
          {pricingCategories.map((cat) => {
            const selected = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className={`cat-card${selected ? ' selected' : ''}`}
                aria-pressed={selected}
                onClick={() => pick(cat.id)}
              >
                <span className="cat-card-media" aria-hidden>
                  <video
                    muted
                    loop
                    playsInline
                    autoPlay
                    preload="metadata"
                    src={cat.videoSrc}
                  />
                </span>
                <span className="cat-card-body">
                  <span className="cat-card-title">{t(cat.title)}</span>
                  <span className="cat-card-blurb">{t(cat.blurb)}</span>
                </span>
              </button>
            );
          })}
        </div>

        {category === 'photo' && (
          <div className="cat-panel">
            <div className="rates-head">
              <span className="about-label">{photographyCopy.label}</span>
              <h3>{t(photographyCopy.heading)}</h3>
              <p>{t(photographyCopy.sub)}</p>
            </div>
            <div className="price-grid">
              {photographyTiers.map((tier) => (
                <PricingCard key={tier.id} tier={tier} />
              ))}
            </div>
            <ProductionRateCard />
            <p className="rate-note">{t(photographyCopy.aiNote)}</p>
            <FaqAccordion section={photographyFaq} />
          </div>
        )}

        {category === 'web' && (
          <div className="cat-panel">
            <div className="rates-head">
              <span className="about-label">{webCopy.label}</span>
              <h3>{t(webCopy.heading)}</h3>
              <p>{t(webCopy.sub)}</p>
            </div>
            <div className="price-grid">
              {webTiers.map((tier) => (
                <PricingCard key={tier.id} tier={tier} />
              ))}
            </div>
            <p className="rate-note">{t(webCopy.aiNote)}</p>
            <p className="rate-note" dangerouslySetInnerHTML={{ __html: t(webCopy.moneyNote) }} />
            <FaqAccordion section={webFaq} />
          </div>
        )}

        {category === 'other' && (
          <div className="cat-panel">
            <div className="rates-head">
              <span className="about-label">{otherCopy.label}</span>
              <h3>{t(otherCopy.heading)}</h3>
              <p>{t(otherCopy.sub)}</p>
            </div>
            <div className="price-grid two">
              {otherTiers.map((tier) => (
                <PricingCard key={tier.id} tier={tier} />
              ))}
            </div>
            <p className="rate-note">{t(otherCopy.note)}</p>
            <FaqAccordion section={otherFaq} />
          </div>
        )}
      </div>
    </section>
  );
}
