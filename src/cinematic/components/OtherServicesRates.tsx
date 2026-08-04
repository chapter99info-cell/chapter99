import { otherFaq } from '../data/faq';
import { otherCopy, otherTiers } from '../data/pricing';
import { useFadeUp } from '../hooks/useFadeUp';
import { useTranslation } from '../i18n/LanguageContext';
import { FaqAccordion } from './FaqAccordion';
import { PricingCard } from './PricingCard';

export function OtherServicesRates() {
  const { t } = useTranslation();
  const headRef = useFadeUp(0);
  const gridRef = useFadeUp(1);
  const noteRef = useFadeUp(2);

  return (
    <section id="other-rates">
      <div className="wrap">
        <div ref={headRef} className="rates-head fadeup">
          <span className="about-label">{otherCopy.label}</span>
          <h2>{t(otherCopy.heading)}</h2>
          <p>{t(otherCopy.sub)}</p>
        </div>

        <div ref={gridRef} className="price-grid two fadeup">
          {otherTiers.map((tier) => (
            <PricingCard key={tier.id} tier={tier} />
          ))}
        </div>

        <p ref={noteRef} className="rate-note fadeup">
          {t(otherCopy.note)}
        </p>

        <FaqAccordion section={otherFaq} />
      </div>
    </section>
  );
}
