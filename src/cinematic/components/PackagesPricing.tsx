import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  businessPacks,
  hashToPack,
  queryToPack,
  squarePack,
  type PricePackId,
} from '../data/industryPacks';
import {
  PACKAGE_SCOPE_PRICE,
  businessStages,
  industries,
  journeySteps,
  packageTiers,
  packagesCopy,
  priceArchitecture,
  squareFees,
  squareHardware,
  squarePlans,
  squareSetup,
} from '../data/packages';
import { useTranslation } from '../i18n/LanguageContext';
import { CalendarClock, Globe, Layers, MapPin, Sparkles, type LucideIcon } from 'lucide-react';
import { siteIcons, siteMedia } from '../../site/media';
import { PackAnimatedPricing } from './PackAnimatedPricing';
import { PricePackTabs } from '../../site/PricePackBar';

const AUDIT_MAIL =
  'mailto:chapter99solutions@gmail.com?subject=Chapter99%20Business%20Audit';

const stageVisuals: Record<
  string,
  {
    pack: string;
    photo: string;
    links: { href: string; label: { th: string; en: string }; Icon: LucideIcon }[];
  }
> = {
  STARTER: {
    pack: 'START',
    photo: siteMedia.hero,
    links: [
      { href: '/business-toolkit', label: { th: 'เครื่องมือฟรี', en: 'Free toolkit' }, Icon: Globe },
      { href: '/pricing#packages', label: { th: 'START', en: 'START' }, Icon: Layers },
    ],
  },
  GROWING: {
    pack: 'GROW',
    photo: siteMedia.booking,
    links: [
      { href: '/pricing#packages', label: { th: 'GROW', en: 'GROW' }, Icon: CalendarClock },
      { href: '/pricing#square-setup', label: { th: 'Square', en: 'Square' }, Icon: Sparkles },
    ],
  },
  ESTABLISHED: {
    pack: 'SCALE',
    photo: siteMedia.massage,
    links: [
      { href: '/pricing#packages', label: { th: 'SCALE', en: 'SCALE' }, Icon: Layers },
      { href: '/contact', label: { th: 'คุยงาน', en: 'Talk' }, Icon: Sparkles },
    ],
  },
  'MULTI-LOCATION': {
    pack: 'SCALE',
    photo: siteMedia.restaurant,
    links: [
      { href: '/restaurants', label: { th: 'ร้านอาหาร', en: 'Restaurants' }, Icon: MapPin },
      { href: '/pricing#packages', label: { th: 'SCALE', en: 'SCALE' }, Icon: Layers },
    ],
  },
  ADVANCED: {
    pack: 'SCALE',
    photo: siteMedia.photography,
    links: [
      { href: '/pricing#audit', label: { th: 'Audit', en: 'Audit' }, Icon: Sparkles },
      { href: '/photography', label: { th: 'ภาพถ่าย', en: 'Photos' }, Icon: Globe },
    ],
  },
};

export function PackagesPricing() {
  const { t } = useTranslation();
  const location = useLocation();
  const fromHash = hashToPack(location.hash);
  const fromQuery = queryToPack(location.search);
  const initial =
    fromHash && fromHash !== 'square'
      ? fromHash
      : fromQuery && fromQuery !== 'square'
        ? fromQuery
        : 'massage';
  const [pack, setPack] = useState<PricePackId>(initial);
  const selected = businessPacks.find((item) => item.id === pack) ?? businessPacks[0];

  useEffect(() => {
    const apply = () => {
      const next =
        hashToPack(window.location.hash) ??
        queryToPack(window.location.search) ??
        hashToPack(location.hash) ??
        queryToPack(location.search);
      if (next && next !== 'square') setPack(next);
    };
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, [location.hash, location.search]);

  return (
    <main className="pkg-page">
      <div className="wrap">
        <div className="pkg-hero">
          <div>
            <span className="about-label">{t(packagesCopy.eyebrow)}</span>
            <h1>{t(packagesCopy.heading)}</h1>
            <p className="lead">{t(packagesCopy.lead)}</p>
            <p className="copy">{t(packagesCopy.copy)}</p>
            <div className="pkg-cta-row">
              <a className="cta-pill" href={AUDIT_MAIL}>
                <span>{t(packagesCopy.auditCta)}</span>
              </a>
              <a className="price-btn secondary" href="#packages">
                {t({ th: 'ดูแพ็กเกจ & ราคา', en: 'View packages & pricing' })}
              </a>
            </div>
          </div>
          <aside className="pkg-summary">
            <div className="mini">THREE BUSINESS SYSTEM LEVELS</div>
            <h3>{packagesCopy.summaryTitle}</h3>
            {packageTiers.map((tier) => (
              <div key={tier.id} className="pkg-summary-line">
                <span>
                  {tier.id === 'start'
                    ? 'START · Presence'
                    : tier.id === 'grow'
                      ? 'GROW · Operations'
                      : 'SCALE · Infrastructure'}
                </span>
                <b className="pkg-scope-mini">{t(PACKAGE_SCOPE_PRICE)}</b>
              </div>
            ))}
            <p className="badge-note">{t(packagesCopy.summaryNote)}</p>
          </aside>
        </div>

        <section id="journey" className="pkg-section">
          <div className="rates-head">
            <span className="about-label">{t(packagesCopy.journeyKicker)}</span>
            <h2>{t(packagesCopy.journeyTitle)}</h2>
          </div>
          <div className="journey-grid">
            {journeySteps.map((step) => (
              <article key={step.key} className="industry-card">
                <div className="num">{step.title.en}</div>
                <p>{t(step.body)}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="packages" className="pkg-section">
          <div className="rates-head">
            <span className="about-label">{t(packagesCopy.sectionKicker)}</span>
            <h2>{t(packagesCopy.sectionTitle)}</h2>
            <p>{t(packagesCopy.sectionSub)}</p>
          </div>
          <PackAnimatedPricing />
          <p className="rate-note">{t(packagesCopy.priceNote)}</p>
        </section>

        <section id="square-setup" className="pkg-section">
          <div className="rates-head">
            <span className="about-label">{t(squareSetup.tag)}</span>
            <h2>{t(squareSetup.title)}</h2>
            <p>{t(squareSetup.subtitle)}</p>
          </div>
          <div className="price-grid price-grid-one">
            <PackAnimatedPricing packId="square" tiers={squarePack.tiers} />
          </div>
          <p className="rate-note square-fee-note">{t(squareSetup.note)}</p>
          <SquareCosts />
        </section>

        <section id="price-packs" className="pkg-section">
          <div className="rates-head">
            <span className="about-label">{t(selected.kicker)}</span>
            <h2>{t(selected.heading)}</h2>
            <p>{t(selected.sub)}</p>
          </div>
          <div className="pack-dock-page">
            <PricePackTabs lightId="page" />
          </div>
          <PackAnimatedPricing key={pack} packId={pack} tiers={selected.tiers} />
          <p className="rate-note">{t(selected.note)}</p>
        </section>

        <section id="stages" className="pkg-section">
          <div className="rates-head">
            <span className="about-label">
              {t({ th: 'ขั้นของธุรกิจ', en: 'Business stage' })}
            </span>
            <h2>
              {t({
                th: 'เริ่มจากจุดที่ร้านอยู่ แล้วขยายกับ Chapter99',
                en: 'Start where you are. Grow with Chapter99.',
              })}
            </h2>
            <p>
              {t({
                th: 'ลูกค้าย้ายขั้นได้เมื่อธุรกิจเปลี่ยน ไม่ได้ล็อกไว้ที่แพ็กเกจเดียว',
                en: 'The customer can move between stages as the business changes.',
              })}
            </p>
          </div>
          <div className="stage-board">
            {businessStages.map((item) => {
              const visual = stageVisuals[item.stage];
              return (
                <article key={item.stage} className="stage-overlap">
                  <figure>
                    <img
                      src={visual?.photo ?? siteMedia.hero}
                      alt={t({
                        th: 'ภาพแนวคิดประกอบขั้นธุรกิจ',
                        en: 'Concept photo for this business stage',
                      })}
                    />
                    <figcaption>
                      {t({
                        th: 'ภาพแนวคิด ไม่ใช่ภาพลูกค้าหรือทีมที่รับรองผล',
                        en: 'Concept photo — not a client or staff endorsement.',
                      })}
                    </figcaption>
                  </figure>
                  <div className="stage-overlap-copy">
                    <h3>{item.stage}</h3>
                    <p className="stage-overlap-role">
                      {visual?.pack ?? 'Chapter99'} ·{' '}
                      {t({ th: 'ย้ายขั้นได้เมื่อร้านเปลี่ยน', en: 'Move stage as the shop changes' })}
                    </p>
                    <p>{t(item.body)}</p>
                    <div className="stage-overlap-links">
                      {(visual?.links ?? []).map((link) => (
                        <Link
                          key={link.href}
                          to={link.href}
                          className="stage-overlap-icon"
                          aria-label={t(link.label)}
                        >
                          <link.Icon size={18} strokeWidth={1.8} />
                        </Link>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="industries" className="pkg-section">
          <div className="rates-head">
            <span className="about-label">{t(packagesCopy.industriesKicker)}</span>
            <h2>{t(packagesCopy.industriesTitle)}</h2>
            <p>{t(packagesCopy.industriesSub)}</p>
          </div>
          <div className="industries">
            {industries.map((item) => {
              const icon =
                item.href.includes('massage')
                  ? siteIcons.profile
                  : item.href.includes('restaurant')
                    ? siteIcons.soup
                    : siteIcons.monitor;
              return (
              <article key={item.num} className="industry-card">
                <img className="industry-mark" src={icon} alt="" />
                <div className="num">{item.num}</div>
                <h3>{t(item.title)}</h3>
                <p>{t(item.body)}</p>
                {item.href.includes('restaurant') ? (
                  <div className="food-icons">
                    <img src={siteIcons.chili} alt="" />
                    <img src={siteIcons.chicken} alt="" />
                    <img src={siteIcons.beef} alt="" />
                    <img src={siteIcons.pork} alt="" />
                    <img src={siteIcons.vegetable} alt="" />
                    <img src={siteIcons.noGluten} alt="" />
                  </div>
                ) : null}
                <Link className="price-btn secondary" to={item.href}>
                  {t(item.cta)}
                </Link>
              </article>
              );
            })}
          </div>
        </section>

        <section id="included" className="pkg-section">
          <div className="rates-head">
            <span className="about-label">{t(packagesCopy.howKicker)}</span>
            <h2>{t(packagesCopy.howTitle)}</h2>
            <p>{t(packagesCopy.howSub)}</p>
          </div>
          <div className="flow terms-cols" style={{ marginTop: 28 }}>
            {priceArchitecture.map((item) => (
              <div key={item.title.en} className="flowbox industry-card">
                <h4>{t(item.title)}</h4>
                <p>{t(item.body)}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="audit" className="pkg-audit">
          <span className="about-label">{t(packagesCopy.auditKicker)}</span>
          <h2>{t(packagesCopy.auditTitle)}</h2>
          <p>{t(packagesCopy.auditBody)}</p>
          <div className="pkg-cta-row">
            <a className="cta-pill" href={AUDIT_MAIL}>
              <span>{t(packagesCopy.auditCta)}</span>
            </a>
            <Link className="price-btn secondary" to="/">
              {t(packagesCopy.homeCta)}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function SquareCosts() {
  const { t } = useTranslation();

  return (
    <div className="square-addon" style={{ marginTop: 28 }}>
      <h4 className="square-subhead">
        {t({ th: 'SQUARE COSTS', en: 'SQUARE COSTS' })}
      </h4>
      <div className="square-tables">
        <table className="square-table">
          <caption>{t({ th: 'แผนซอฟต์แวร์', en: 'Software plans' })}</caption>
          <thead>
            <tr>
              <th>{t({ th: 'แผน', en: 'Plan' })}</th>
              <th>{t({ th: 'รายเดือน', en: 'Monthly' })}</th>
              <th>{t({ th: 'รับชำระเงิน', en: 'Processing' })}</th>
            </tr>
          </thead>
          <tbody>
            {squarePlans.map((row) => (
              <tr key={row.plan}>
                <td>{row.plan}</td>
                <td>{t(row.monthly)}</td>
                <td>{t(row.processing)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <table className="square-table">
          <caption>{t({ th: 'ค่าธรรมเนียมรับชำระ', en: 'Processing fees' })}</caption>
          <thead>
            <tr>
              <th>{t({ th: 'ประเภท', en: 'Type' })}</th>
              <th>{t({ th: 'อัตรา', en: 'Rate' })}</th>
            </tr>
          </thead>
          <tbody>
            {squareFees.map((row) => (
              <tr key={row.value + row.label.en}>
                <td>{t(row.label)}</td>
                <td>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <table className="square-table">
          <caption>
            {t({ th: 'ฮาร์ดแวร์ (อาจเปลี่ยนได้)', en: 'Hardware (can change)' })}
          </caption>
          <thead>
            <tr>
              <th>{t({ th: 'รายการ', en: 'Item' })}</th>
              <th>{t({ th: 'ราคาอ้างอิง', en: 'Reference price' })}</th>
            </tr>
          </thead>
          <tbody>
            {squareHardware.map((row) => (
              <tr key={row.item}>
                <td>{row.item}</td>
                <td>{row.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="rate-note">{t(squareSetup.surcharge)}</p>
      <p className="rate-note">{t(squareSetup.checked)}</p>
      <div className="pkg-cta-row">
        {squareSetup.sources.map((source) => (
          <a
            key={source.href}
            className="price-btn secondary"
            href={source.href}
            target="_blank"
            rel="noreferrer"
          >
            {source.label}
          </a>
        ))}
      </div>
    </div>
  );
}
