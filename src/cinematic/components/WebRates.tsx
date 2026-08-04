import { webFaq } from '../data/faq';
import { webCopy, webTiers } from '../data/pricing';
import { useFadeUp } from '../hooks/useFadeUp';
import { useTranslation } from '../i18n/LanguageContext';
import { FaqAccordion } from './FaqAccordion';
import { PricingCard } from './PricingCard';

export function WebRates() {
  const { t } = useTranslation();
  const headRef = useFadeUp(0);
  const gridRef = useFadeUp(1);
  const note1 = useFadeUp(2);
  const note2 = useFadeUp(3);

  return (
    <section id="web-rates">
      <div className="wrap">
        <div ref={headRef} className="rates-head fadeup">
          <span className="about-label">{webCopy.label}</span>
          <h2>{t(webCopy.heading)}</h2>
          <p>{t(webCopy.sub)}</p>
        </div>

        <div ref={gridRef} className="price-grid fadeup">
          {webTiers.map((tier) => (
            <PricingCard key={tier.id} tier={tier} />
          ))}
        </div>

        <p ref={note1} className="rate-note fadeup">
          {t(webCopy.aiNote)}
        </p>
        <p
          ref={note2}
          className="rate-note fadeup"
          dangerouslySetInnerHTML={{ __html: t(webCopy.moneyNote) }}
        />

        <FaqAccordion section={webFaq} />
      </div>
    </section>
  );
}
