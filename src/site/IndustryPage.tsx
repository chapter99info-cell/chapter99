import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useTranslation } from '../cinematic/i18n/LanguageContext';
import { SiteLayout } from './SiteLayout';
import { siteContact } from './media';
import { RING_STEPS, StageRing } from './StageRing';
import { SystemPreview, type PreviewKind } from './SystemPreview';
import './homepage-v2.css';

type Copy = { th: string; en: string };

export type IndustryContent = {
  kind: PreviewKind;
  photo: string;
  photoAlt: Copy;
  photoNote: Copy;
  eyebrow: Copy;
  title: Copy;
  lead: Copy;
  steps: { title: Copy; body: Copy }[];
  extra?: ReactNode;
};

export function IndustryPage({ content }: { content: IndustryContent }) {
  return (
    <SiteLayout>
      <IndustryInner content={content} />
    </SiteLayout>
  );
}

function IndustryInner({ content }: { content: IndustryContent }) {
  const { t } = useTranslation();
  return (
    <main className="home-v2 industry-v2">
        <section className="v2-notice" role="note">
          {t({
            th: 'หน้าสื่อสารบริการ · ตัวอย่างหน้าจอด้านขวาไม่ใช่ระบบร้านที่เปิดใช้แล้ว',
            en: 'Service page · the screen on the right is an illustrative preview, not a live shop system.',
          })}
        </section>
        <section className="v2-hero">
          <div className="v2-wrap v2-hero-grid">
            <div>
              <p className="v2-kicker">{t(content.eyebrow)}</p>
              <h1>{t(content.title)}</h1>
              <p className="v2-lead">{t(content.lead)}</p>
              <div className="v2-actions">
                <Link className="v2-btn primary" to="/business-toolkit">
                  {t({ th: 'เริ่มใช้เครื่องมือธุรกิจฟรี', en: 'Start the free business toolkit' })}
                </Link>
                <a className="v2-btn secondary" href={siteContact.mail}>
                  {t({ th: 'คุยเรื่องธุรกิจของคุณ', en: 'Talk about your business' })}
                </a>
              </div>
            </div>
            <div className="v2-hero-visual">
              <figure className="v2-hero-photo">
                <img src={content.photo} alt={t(content.photoAlt)} />
                <figcaption>{t(content.photoNote)}</figcaption>
              </figure>
              <SystemPreview kind={content.kind} />
            </div>
          </div>
        </section>
        <section className="v2-section v2-ring-band">
          <div className="v2-wrap">
            <p className="v2-eyebrow">{t({ th: 'เส้นทางที่ช่วยร้าน', en: 'How we help this shop' })}</p>
            <h2>{t({ th: 'จากภาพลักษณ์ ไปจนถึงงานประจำวัน', en: 'From how you look, to how the day runs.' })}</h2>
            <div className="v2-stages">
              {content.steps.map((step, i) => {
                const ring = RING_STEPS[i] ?? RING_STEPS[RING_STEPS.length - 1];
                return (
                  <article className="v2-stage" key={step.title.en}>
                    <StageRing value={ring.pct} color={ring.color} />
                    <p className="stage-pct">{ring.pct}%</p>
                    <h3>{t(step.title)}</h3>
                    <p>{t(step.body)}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
        {content.extra}
        <section className="v2-close">
          <h2>{t({ th: 'เริ่มจากเครื่องมือฟรี หรือคุยขอบเขตงาน', en: 'Start with free tools, or talk through scope.' })}</h2>
          <div className="v2-actions">
            <Link className="v2-btn light" to="/business-toolkit">
              {t({ th: 'เปิดชุดเครื่องมือธุรกิจฟรี', en: 'Open the Free Business Toolkit' })}
            </Link>
            <a className="v2-btn secondary" href={siteContact.mail}>
              {t({ th: 'ส่งอีเมล', en: 'Email us' })}
            </a>
          </div>
        </section>
      </main>
  );
}
