import { photographyFaq } from '../data/faq';
import { photographyCopy, photographyTiers } from '../data/pricing';
import { useFadeUp } from '../hooks/useFadeUp';
import { useTranslation } from '../i18n/LanguageContext';
import { FaqAccordion } from './FaqAccordion';
import { PricingCard } from './PricingCard';
import { ProductionRateCard } from './ProductionRateCard';

export function PhotographyRates() {
  const { t } = useTranslation();
  const headRef = useFadeUp(0);
  const gridRef = useFadeUp(1);
  const noteRef = useFadeUp(2);

  return (
    <section id="photo-rates">
      <div className="wrap">
        <div ref={headRef} className="rates-head fadeup">
          <span className="about-label">{photographyCopy.label}</span>
          <h2>{t(photographyCopy.heading)}</h2>
          <p>{t(photographyCopy.sub)}</p>
        </div>

        <div ref={gridRef} className="price-grid fadeup">
          {photographyTiers.map((tier) => (
            <PricingCard key={tier.id} tier={tier} />
          ))}
        </div>

        <ProductionRateCard />

        <p ref={noteRef} className="rate-note fadeup">
          {t(photographyCopy.aiNote)}
        </p>

        <FaqAccordion section={photographyFaq} />
      </div>
    </section>
  );
}
