import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../cinematic/i18n/LanguageContext';
import { PackAnimatedPricing } from '../cinematic/components/PackAnimatedPricing';
import { siteMedia } from './media';
import { SiteLayout } from './SiteLayout';
import { ShopGlowGrid } from './ShopGlowGrid';
import { StageRing } from './StageRing';
import { SystemPreview } from './SystemPreview';
import './homepage-v2.css';

const AUDIT_MAIL =
  'mailto:chapter99solutions@gmail.com?subject=Chapter99%20Business%20Audit';

const stages = [
  {
    n: '01',
    pct: 0,
    color: '#64748b',
    kicker: { th: 'LOOK · ภาพลักษณ์', en: 'Look' },
    title: { th: 'สะท้อนตัวตนของคุณ', en: 'Feel like you.' },
    body: {
      th: 'ภาพถ่ายและภาพลักษณ์ที่ตั้งใจออกแบบ ให้ลูกค้าเห็นผู้คน ความใส่ใจ และเอกลักษณ์ของธุรกิจ',
      en: 'Photography and a considered visual identity that show the people, care and character behind your business.',
    },
  },
  {
    n: '02',
    pct: 25,
    color: '#22c55e',
    kicker: { th: 'BE FOUND · ให้ลูกค้าค้นเจอ', en: 'Be found' },
    title: { th: 'เป็นตัวเลือกที่เข้าใจง่าย', en: 'Be the clear choice.' },
    body: {
      th: 'เว็บไซต์ที่เป็นมิตร พร้อมข้อมูลร้านที่ชัดเจน ช่วยให้ลูกค้าค้นเจอและเข้าใจว่าคุณให้บริการอะไร',
      en: 'A welcoming website and clear local information, so customers can find you and understand what you offer.',
    },
  },
  {
    n: '03',
    pct: 50,
    color: '#14b8a6',
    kicker: { th: 'GET BOOKED · รับการจอง', en: 'Get booked' },
    title: { th: 'จองได้อย่างสบายใจ', en: 'Make the next step easy.' },
    body: {
      th: 'เลือกบริการง่าย จองสะดวก และยืนยันนัดหมายชัดเจน ให้ลูกค้ารู้สึกว่าได้รับการดูแลตั้งแต่ต้น',
      en: 'Simple service choices, appointment booking and clear confirmations that make customers feel looked after.',
    },
  },
  {
    n: '04',
    pct: 75,
    color: '#22c55e',
    kicker: { th: 'GET PAID · รับชำระเงิน', en: 'Get paid' },
    title: { th: 'ติดตามน้อยลง ชัดเจนขึ้น', en: 'Less chasing. More clarity.' },
    body: {
      th: 'ออกแบบขั้นตอนชำระเงิน รวมถึงมัดจำ ใบเสร็จ และการตรวจสอบยอด ให้เหมาะกับวิธีทำงานและขอบเขตที่ตกลงกัน',
      en: 'A considered payment journey, with deposits, receipts and reconciliation scoped to how your business works.',
    },
  },
  {
    n: '05',
    pct: 80,
    color: '#f59e0b',
    kicker: { th: 'RUN · บริหารงาน', en: 'Run' },
    title: { th: 'งานประจำวันเบาลง', en: 'A calmer working day.' },
    body: {
      th: 'มีขั้นตอนร่วมกัน หน้าที่ชัดเจน และเครื่องมือที่ใช้ได้จริง ให้ทีมเดินงานต่อได้โดยไม่ต้องรอคุณทุกเรื่อง',
      en: 'Shared routines, clear responsibilities and useful tools that help the team work without everything going through you.',
    },
  },
  {
    n: '06',
    pct: 100,
    color: '#ef4444',
    kicker: { th: 'GROW · เติบโต', en: 'Grow' },
    title: { th: 'พร้อมสำหรับก้าวต่อไป', en: 'Ready for your next chapter.' },
    body: {
      th: 'ต่อยอดสิ่งที่ได้ผล ด้วยกระบวนการที่ทำซ้ำได้ ระบบอัตโนมัติที่เหมาะสม และภาพที่ชัดขึ้นว่าควรพัฒนาจุดไหน',
      en: 'Build on what works with repeatable processes, considered automation and a clearer view of what to improve.',
    },
  },
] as const;

function AuditDialog({
  open,
  onClose,
  plan,
  titleId,
}: {
  open: boolean;
  onClose: () => void;
  plan: string | null;
  titleId: string;
}) {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const ignoreShowRef = useRef(false);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open) {
      if (!el.open && !ignoreShowRef.current) {
        const active = document.activeElement;
        triggerRef.current = active instanceof HTMLElement ? active : null;
        el.showModal();
        const closeBtn = el.querySelector<HTMLButtonElement>('button[data-dialog-close]');
        closeBtn?.focus();
      }
      ignoreShowRef.current = false;
      return;
    }
    if (el.open) el.close();
    const prev = triggerRef.current;
    triggerRef.current = null;
    if (prev && document.contains(prev)) {
      window.requestAnimationFrame(() => prev.focus());
    }
  }, [open]);

  const requestClose = () => {
    ignoreShowRef.current = true;
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className="v2-dialog"
      aria-labelledby={titleId}
      aria-modal="true"
      onCancel={() => {
        requestClose();
      }}
      onClose={() => {
        if (open) requestClose();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) requestClose();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          requestClose();
        }
      }}
    >
      <button
        type="button"
        className="v2-btn secondary"
        data-dialog-close
        onClick={requestClose}
        aria-label={t({ th: 'ปิด', en: 'Close' })}
      >
        ×
      </button>
      <p className="v2-eyebrow">{t({ th: 'Business Audit · เส้นทางที่มีอยู่', en: 'Business Audit · Existing path' })}</p>
      <h2 id={titleId}>
        {t({
          th: 'ยังไม่มีหน้าจอง Audit แยก',
          en: 'There is no dedicated audit booking page.',
        })}
      </h2>
      <p>
        {plan
          ? t({
              th: `สนใจ ${plan}? ขอบเขตจริงอยู่ที่แค็ตตาล็อกบนหน้าแพ็กเกจ ช่องทางติดต่อที่ใช้ได้คืออีเมล chapter99solutions@gmail.com`,
              en: `Interested in ${plan}? Scope lives on the pricing catalog. The working contact path is email to chapter99solutions@gmail.com.`,
            })
          : t({
              th: 'แอปนี้ยังไม่มีปฏิทินจอง และยังไม่มีแชทหรือ WhatsApp ที่รับงาน ช่องทางที่ใช้ได้คืออีเมล chapter99solutions@gmail.com',
              en: 'This app has no booking calendar, live chat or WhatsApp inbox. The working path is email to chapter99solutions@gmail.com.',
            })}
      </p>
      <p className="v2-warn">
        {t({
          th: 'กล่องนี้เป็นคำอธิบายสถานะ ไม่ส่งฟอร์มและไม่จองนัดให้อัตโนมัติ',
          en: 'This dialog explains the current path. It does not submit a form or book an appointment.',
        })}
      </p>
      <div className="v2-dialog-actions">
        <a className="v2-btn primary" href={AUDIT_MAIL}>
          {t({ th: 'ส่งอีเมล Business Audit', en: 'Email a Business Audit' })}
        </a>
        <Link className="v2-btn secondary" to="/contact" onClick={requestClose}>
          {t({ th: 'ไปหน้าติดต่อ', en: 'Go to contact' })}
        </Link>
        <Link className="v2-btn secondary" to="/pricing#audit" onClick={requestClose}>
          {t({ th: 'ดู Audit บนหน้าแพ็กเกจ', en: 'Audit on pricing' })}
        </Link>
      </div>
    </dialog>
  );
}

function HomeInner() {
  const { t } = useTranslation();
  const [auditOpen, setAuditOpen] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);
  const titleId = useId();

  useEffect(() => {
    document.title = t({
      th: 'Chapter99 — ก้าวต่อไปของธุรกิจ ที่เชื่อมกันอย่างตั้งใจ',
      en: 'Chapter99 — Your next chapter, beautifully connected.',
    });
  }, [t]);

  const openAudit = (next: string | null = null) => {
    setPlan(next);
    setAuditOpen(true);
  };

  return (
    <main className="home-v2" id="top">
      <p className="v2-notice">
        {t({
          th: 'เพื่อธุรกิจของคนไทยในออสเตรเลีย · อุ่นใจในทุกก้าวของธุรกิจ',
          en: 'Made for Thai-owned businesses in Australia · Peace of mind at every step',
        })}
      </p>

      <section className="v2-hero">
        <div className="v2-wrap">
          <div className="v2-hero-grid">
            <div>
              <p className="v2-eyebrow">
                {t({
                  th: 'พาร์ตเนอร์วางรากฐานดิจิทัลให้ธุรกิจของคุณ',
                  en: 'Your digital business infrastructure partner',
                })}
              </p>
              <h1>
                {t({
                  th: 'ทำให้ธุรกิจของคุณโดดเด่นออนไลน์',
                  en: 'Bring Your Business',
                })}
                <br />
                <em>{t({ th: 'พร้อมระบบที่ช่วยให้ทำงานง่ายขึ้น', en: 'to Life Online.' })}</em>
              </h1>
              <p className="v2-intro">
                {t({
                  th: 'จากภาพลักษณ์ที่ลูกค้าเห็น ไปจนถึงงานที่ร้านทำทุกวัน — ภาพถ่าย เว็บไซต์ การค้นพบ การจอง การชำระเงิน และงานประจำวัน เชื่อมกันอย่างเข้าใจเจ้าของร้าน',
                  en: 'From the way your business looks, to the way it works. Photography, website, discovery, bookings, payments and daily work — in language shop owners use.',
                })}
              </p>
              <div className="v2-actions">
                <Link className="v2-btn primary" to="/business-toolkit">
                  {t({ th: 'ชุดเครื่องมือธุรกิจฟรี', en: 'Free Business Toolkit' })}
                </Link>
                <button type="button" className="v2-btn secondary" onClick={() => openAudit()}>
                  {t({ th: 'ดูแนวทางประเมินธุรกิจ', en: 'Explore a Business Audit' })}
                </button>
              </div>
              <p className="v2-note">
                {t({
                  th: 'เริ่มจากความเข้าใจ ค่อย ๆ เติบโตในจังหวะของคุณ',
                  en: 'Start with clarity. Build at your pace.',
                })}
              </p>
            </div>
            <div className="v2-hero-visual">
              <figure className="v2-hero-photo">
                <img
                  src={siteMedia.hero}
                  alt={t({
                    th: 'ภาพแนวคิดบรรยากาศร้านนวดอบอุ่น',
                    en: 'Concept photo of a warm massage studio',
                  })}
                />
                <figcaption>
                  {t({
                    th: 'ภาพแนวคิดเพื่อสื่อโทนร้าน ไม่ใช่หลักฐานลูกค้าจริง',
                    en: 'Concept photography for tone — not a proven client case.',
                  })}
                </figcaption>
              </figure>
              <figure className="v2-hero-photo">
                <video src={siteMedia.shopVideo} autoPlay muted loop playsInline preload="metadata" />
                <figcaption>
                  {t({
                    th: 'คลิปแนวคิดจากคลัง Chapter99 web 2026 ไม่ใช่ผลงานร้านลูกค้า',
                    en: 'Concept clip from Chapter99 web 2026 storage — not a client case.',
                  })}
                </figcaption>
              </figure>
              <SystemPreview kind="shop" />
            </div>
          </div>
        </div>
      </section>

      <section className="v2-section v2-journey" id="journey">
        <div className="v2-wrap">
          <div className="v2-head">
            <div>
              <p className="v2-eyebrow">
                {t({ th: '01 / จากความประทับใจแรก สู่งานประจำวัน', en: '01 / From first impression to everyday operation' })}
              </p>
              <h2>
                {t({
                  th: 'ทุกส่วนทำงานได้ดีขึ้น เมื่อเชื่อมถึงกัน',
                  en: 'Every part works better when it works together.',
                })}
              </h2>
            </div>
            <p>
              {t({
                th: 'ภาพถ่ายที่ดีช่วยให้ลูกค้าสนใจ เว็บไซต์ที่ชัดเจนสร้างความมั่นใจ และระบบที่เหมาะสมช่วยให้คุณรับช่วงต่อเป็นงานที่จัดการได้จริง',
                en: 'A great photo starts a conversation. A clear website builds confidence. The right systems help turn that confidence into a business you can run.',
              })}
            </p>
          </div>
          <div className="v2-stages">
            {stages.map((stage) => (
              <article className="v2-stage" key={stage.n}>
                <StageRing value={stage.pct} color={stage.color} />
                <p className="stage-pct">{stage.pct}%</p>
                <p className="v2-eyebrow">{t(stage.kicker)}</p>
                <h3>{t(stage.title)}</h3>
                <p>{t(stage.body)}</p>
              </article>
            ))}
          </div>
          <div className="v2-foot">
            <span>LOOK → BE FOUND → GET BOOKED → GET PAID → RUN → GROW</span>
            <span>{t({ th: 'เส้นทางเดียวกัน แต่เริ่มให้เหมาะกับธุรกิจของคุณ', en: 'One journey. A practical starting point for every business.' })}</span>
          </div>
        </div>
      </section>

      <section className="v2-section">
        <div className="v2-wrap v2-story">
          <div className="v2-photo">
            <img
              src={siteMedia.massage}
              alt={t({
                th: 'ภาพแนวคิดนวดไทยบนเสื่อ ไม่ใช่ภาพร้านลูกค้า',
                en: 'Concept Thai massage photo — not a client shop.',
              })}
            />
            <span className="v2-photo-label">
              {t({ th: 'ภาพแนวคิดจากคลังงาน · ไม่ใช่ร้านลูกค้า', en: 'Concept from the Chapter99 library — not a client shop' })}
            </span>
            <div className="v2-photo-copy">
              <strong>
                {t({
                  th: 'คุณใส่ใจอยู่แล้ว ให้ลูกค้าได้เห็นความตั้งใจนั้น',
                  en: 'The care is already there. Let people see it.',
                })}
              </strong>
            </div>
          </div>
          <div>
            <p className="v2-eyebrow">
              {t({ th: 'อบอุ่นแบบไทย เป็นมืออาชีพในบริบทออสเตรเลีย', en: 'Thai warmth. Australian professionalism.' })}
            </p>
            <h2>
              {t({
                th: 'ทุกธุรกิจมีเรื่องราว เราช่วยให้เรื่องราวของคุณชัดขึ้น',
                en: 'Your business has a story. We help it show.',
              })}
            </h2>
            <p>
              {t({
                th: 'คุณใส่ใจทั้งสถานที่ บริการ และลูกค้า ตัวตนบนโลกออนไลน์ก็ควรถ่ายทอดความรู้สึกเดียวกัน',
                en: 'You have put care into your space, your service and your customers. Your online presence should carry that same feeling.',
              })}
            </p>
            <p>
              {t({
                th: 'Chapter99 วางภาพถ่ายและระบบธุรกิจไว้ในแผนเดียวกัน เพื่อให้ความประทับใจแรกพาลูกค้าไปสู่ขั้นตอนถัดไปได้จริง',
                en: 'Chapter99 brings photography and business systems into the same conversation — so a beautiful first impression leads somewhere useful.',
              })}
            </p>
            <a className="v2-btn secondary" href="#solutions">
              {t({ th: 'ค้นหาจุดเริ่มต้นของคุณ', en: 'Find your starting point' })}
            </a>
          </div>
        </div>
      </section>

      <section className="v2-section v2-trust" id="care">
        <div className="v2-wrap">
          <div className="v2-head">
            <div>
              <p className="v2-eyebrow">
                {t({ th: '02 / รากฐานเบื้องหลังประสบการณ์ที่ดี', en: '02 / The foundations behind the experience' })}
              </p>
              <h2>{t({ th: 'ความมั่นใจ เริ่มจากระบบหลังบ้าน', en: 'Confidence is built behind the scenes.' })}</h2>
            </div>
            <p>
              {t({
                th: 'รากฐานที่ดีต้องชัดเจนด้วยว่า ใครมีสิทธิ์เข้าถึง ใครเป็นเจ้าของบัญชี และจะรับมืออย่างไรเมื่อเกิดปัญหา',
                en: 'Good infrastructure is also about who has access, who owns the accounts and what happens when something goes wrong.',
              })}
            </p>
          </div>
          <div className="v2-trust-grid">
            <article className="v2-trust-card">
              <p className="v2-eyebrow">{t({ th: 'STAY SAFE · ดูแลความปลอดภัย', en: 'Stay safe' })}</p>
              <h3>{t({ th: 'ดูแลธุรกิจ ใส่ใจข้อมูลของทุกคน', en: 'Care for the business. Protect the people.' })}</h3>
              <p>
                {t({
                  th: 'กำหนดสิทธิ์พนักงาน แยกข้อมูลของแต่ละธุรกิจ วางแผนเก็บและลบข้อมูลลูกค้า ตรวจขั้นตอนชำระเงิน และตกลงวิธีรับมือเมื่อเกิดเหตุ',
                  en: 'Define staff access, keep each business’s data separate and plan how customer information is retained or deleted.',
                })}
              </p>
            </article>
            <article className="v2-trust-card">
              <p className="v2-eyebrow">{t({ th: 'STAY IN CONTROL · คงสิทธิ์ควบคุม', en: 'Stay in control' })}</p>
              <h3>{t({ th: 'บัญชีของคุณ คุณต้องเข้าถึงและตัดสินใจได้', en: 'Your accounts. Your next move.' })}</h3>
              <p>
                {t({
                  th: 'ระบุเจ้าของบัญชี สิทธิ์ผู้ดูแล และหน้าที่ส่งมอบให้ชัด บันทึกบริการภายนอกที่ระบบต้องใช้งาน และกำหนดผู้รับผิดชอบตรวจงานที่ใช้ AI ช่วย',
                  en: 'Make account ownership, administrator access and handover responsibilities clear.',
                })}
              </p>
            </article>
            <article className="v2-trust-card">
              <p className="v2-eyebrow">{t({ th: 'KEEP RUNNING · เดินหน้าต่อได้', en: 'Keep running' })}</p>
              <h3>{t({ th: 'มีแผนรองรับวันที่ไม่เป็นไปตามแผน', en: 'A plan for the days that do not go to plan.' })}</h3>
              <p>
                {t({
                  th: 'ตกลงวิธีตรวจการสำรองและกู้คืนข้อมูล ขั้นตอนสำรองที่ทำได้จริง และช่องทางช่วยเหลือ',
                  en: 'Agree backup and recovery checks, practical fallback steps and a clear support path.',
                })}
              </p>
            </article>
          </div>
          <div className="v2-trust-bottom">
            <span>
              {t({
                th: 'วางเรื่องความปลอดภัย ความเป็นเจ้าของ และความต่อเนื่องไว้ในขอบเขตงานตั้งแต่วันแรก',
                en: 'Security, ownership and continuity belong in the scope from day one.',
              })}
            </span>
            <span>
              {t({
                th: 'มาตรการและข้อตกลงการดูแลต้องตกลงและตรวจสอบเป็นรายโครงการ',
                en: 'Controls and support commitments are agreed and verified per project.',
              })}
            </span>
          </div>
        </div>
      </section>

      <section className="v2-section" id="packages">
        <div className="v2-wrap">
          <div className="v2-head">
            <div>
              <p className="v2-eyebrow">{t({ th: '03 / เริ่มจากจุดที่ธุรกิจอยู่', en: '03 / Start where you are' })}</p>
              <h2>
                {t({
                  th: 'รากฐานที่เหมาะวันนี้ พร้อมต่อยอดในวันข้างหน้า',
                  en: 'The right foundation. Room for what comes next.',
                })}
              </h2>
            </div>
            <p>
              {t({
                th: 'START, GROW และ SCALE ช่วยจัดทิศทางงานให้ชัด ราคาและรายการส่งมอบอยู่ที่หน้าแพ็กเกจ ไม่ประกาศในหน้าแรก',
                en: 'START, GROW and SCALE give the work a clear shape. Prices and inclusions stay on the pricing page — not on this homepage.',
              })}
            </p>
          </div>
          <PackAnimatedPricing heading={t({ th: 'START · GROW · SCALE', en: 'START · GROW · SCALE' })} />
          <p className="v2-scope">
            {t({
              th: 'แนวทางเหล่านี้บอกจุดเน้นของงาน ไม่ใช่รายการรับประกัน ค่าเริ่มต้น ค่า Square และค่าดูแลต่อเนื่องแยกตามหน้าแพ็กเกจ',
              en: 'These pathways describe focus areas, not guaranteed inclusions. Setup, Square and ongoing care are itemised on the pricing page.',
            })}
          </p>
        </div>
      </section>

      <section className="v2-section v2-glow-band" id="solutions">
        <div className="v2-wrap">
          <p className="v2-eyebrow">{t({ th: 'เลือกตามประเภทธุรกิจ', en: 'Choose your kind of shop' })}</p>
          <h2>{t({ th: 'แนวทางเดียวกัน ปรับให้เข้ากับงานร้าน', en: 'One path, told in your shop’s language.' })}</h2>
          <ShopGlowGrid />
        </div>
      </section>

      <section className="v2-section v2-toolkit" id="toolkit">
        <div className="v2-wrap v2-toolkit-grid">
          <div>
            <p className="v2-eyebrow">
              {t({ th: '04 / ก้าวแรกที่ใช้ได้จริง เริ่มได้ฟรี', en: '04 / A useful first step. Freely available.' })}
            </p>
            <h2>
              {t({
                th: 'ก่อนเพิ่มระบบใหม่ ลองทบทวนสิ่งที่คุณมีอยู่',
                en: 'Before you build more, see what you already have.',
              })}
            </h2>
            <p>
              {t({
                th: 'ชุดเครื่องมือธุรกิจฟรีที่มีอยู่แล้วในแอป คือเครื่องมือจริงสำหรับเจ้าของร้าน ไม่ใช่แบบเช็กตัวอย่างในม็อกอัป',
                en: 'The live Free Business Toolkit is the existing shop tools in this app — not the prototype checklist from the mockup.',
              })}
            </p>
          </div>
          <div className="v2-tool-card">
            <h3>{t({ th: 'เปิดเครื่องมือที่มีอยู่', en: 'Open the live toolkit' })}</h3>
            <ul>
              <li>{t({ th: 'ลิงก์และ QR รีวิว', en: 'Review link and QR' })}</li>
              <li>{t({ th: 'คิด GST และราคาตามนาที', en: 'GST and duration pricing' })}</li>
              <li>{t({ th: 'คิว ลูกค้า และแบบฟอร์ม', en: 'Queue, guests and forms' })}</li>
            </ul>
            <Link className="v2-btn primary" to="/business-toolkit">
              {t({ th: 'ไป /business-toolkit', en: 'Go to /business-toolkit' })}
            </Link>
            <p className="v2-note">
              {t({
                th: 'ไม่มีการส่งข้อมูลจากหน้าแรกไปยังเครื่องมือนี้โดยอัตโนมัติ',
                en: 'This homepage does not auto-submit readiness answers into the toolkit.',
              })}
            </p>
          </div>
        </div>
      </section>

      <section className="v2-section" id="audit">
        <div className="v2-wrap">
          <p className="v2-eyebrow">Business Audit</p>
          <h2>
            {t({
              th: 'คุยเพื่อประเมินขอบเขต ไม่ใช่จองนัดอัตโนมัติ',
              en: 'A conversation to scope the work — not an automatic booking.',
            })}
          </h2>
          <p>
            {t({
              th: 'Audit ที่มีอยู่คือส่งอีเมลถึง chapter99solutions@gmail.com ไม่มีคะแนนอัตโนมัติ และยังไม่มีปฏิทินจอง',
              en: 'The current Audit path is email to chapter99solutions@gmail.com. There is no auto score and no booking calendar.',
            })}
          </p>
          <div className="v2-actions">
            <button type="button" className="v2-btn primary" onClick={() => openAudit()}>
              {t({ th: 'ดูแนวทางประเมินธุรกิจ', en: 'Explore a Business Audit' })}
            </button>
            <Link className="v2-btn secondary" to="/pricing#audit">
              {t({ th: 'ดู Audit บนหน้าแพ็กเกจ', en: 'Audit on pricing' })}
            </Link>
          </div>
        </div>
      </section>

      <section className="v2-section" id="how">
        <div className="v2-wrap">
          <div className="v2-head">
            <div>
              <p className="v2-eyebrow">{t({ th: 'วิธีทำงาน', en: 'How it works' })}</p>
              <h2>{t({ th: 'เข้าใจก่อน แล้วค่อยเชื่อมระบบ', en: 'First, understand. Then, connect.' })}</h2>
            </div>
          </div>
          <div className="v2-process">
            <article>
              <span className="num">01</span>
              <h3>{t({ th: 'เริ่มได้ฟรี', en: 'Start free' })}</h3>
              <p>{t({ th: 'ใช้ชุดเครื่องมือทบทวนจุดเริ่มต้น', en: 'Use the toolkit to see your starting point.' })}</p>
            </article>
            <article>
              <span className="num">02</span>
              <h3>{t({ th: 'ประเมินร่วมกัน', en: 'Look together' })}</h3>
              <p>{t({ th: 'คุยขอบเขตผ่านอีเมล Audit หรือหน้าติดต่อ', en: 'Scope the work through the existing Audit email or contact page.' })}</p>
            </article>
            <article>
              <span className="num">03</span>
              <h3>{t({ th: 'ลงมืออย่างมีทิศทาง', en: 'Build with purpose' })}</h3>
              <p>{t({ th: 'ตกลงขอบเขตและรักษาระบบที่ทำงานได้ดี', en: 'Agree the scope and keep what already works.' })}</p>
            </article>
            <article>
              <span className="num">04</span>
              <h3>{t({ th: 'ส่งมอบอย่างใส่ใจ', en: 'Hand over with care' })}</h3>
              <p>{t({ th: 'บันทึกสิทธิ์ ขั้นตอน และแนวทางดูแลต่อ', en: 'Document access, routines and ongoing support.' })}</p>
            </article>
          </div>
          <div className="v2-scale">
            <strong>{t({ th: 'ทำซ้ำได้ ส่งต่องานเป็น', en: 'Built to repeat. Not to depend.' })}</strong>
            <p>
              {t({
                th: 'เป้าออกแบบคือรองรับ 100 ร้านผ่านคู่มือ แม่แบบ ระบบอัตโนมัติ และงานที่คนตรวจ นี่คือทิศทาง ไม่ใช่จำนวนลูกค้าที่พิสูจน์แล้ว',
                en: 'The operating design target is 100 shops through procedures, templates, automation and reviewed assistance. It is a direction — not a proven customer count.',
              })}
            </p>
          </div>
        </div>
      </section>

      <section className="v2-section" id="faq" aria-labelledby="faq-title">
        <div className="v2-wrap v2-faq">
          <div>
            <p className="v2-eyebrow">{t({ th: 'รู้ให้ชัดก่อนเริ่ม', en: 'Know this before you start' })}</p>
            <h2 id="faq-title">{t({ th: 'คำถามที่พบบ่อย คำตอบที่ชัดเจน', en: 'Good questions. Straight answers.' })}</h2>
          </div>
          <div>
            <details>
              <summary>{t({ th: 'Chapter99 ทำอะไรให้ร้าน?', en: 'What does Chapter99 actually do for a shop?' })}</summary>
              <p>
                {t({
                  th: 'เราเป็นพาร์ตเนอร์วางรากฐานดิจิทัลให้ธุรกิจไทยในออสเตรเลีย — ภาพถ่าย เว็บไซต์ การค้นพบบน Google ขั้นตอนจอง การชำระเงิน และงานประจำวันที่ทีมร้านใช้ร่วมกัน ไม่ขายซอฟต์แวร์ให้ติดตั้งเอง และไม่ได้แทนเจ้าของในการบริการลูกค้า',
                  en: 'We are a digital infrastructure partner for Thai businesses in Australia: photography, website, Google discovery, booking steps, payments and daily shop work. We do not sell a self-install product, and we do not replace the owner in serving customers.',
                })}
              </p>
            </details>
            <details>
              <summary>{t({ th: 'ต้องเปลี่ยนระบบเดิมทั้งหมดไหม?', en: 'Do I need to replace everything I already use?' })}</summary>
              <p>
                {t({
                  th: 'ไม่จำเป็น ถ้า Facebook, Square หรือวิธีจองที่ใช้วันนี้ยังทำงานได้ เราเก็บไว้แล้วต่อเฉพาะส่วนที่ตกลงใน START, GROW หรือ SCALE ไม่รื้อร้านทั้งระบบถ้ายังไม่ได้ขอบเขตนั้น',
                  en: 'No. If Facebook, Square or your current booking method still works, we keep it and only add what is in the agreed START, GROW or SCALE scope. We do not rip out the whole shop unless that work is scoped.',
                })}
              </p>
            </details>
            <details>
              <summary>{t({ th: 'คิดราคาโครงการอย่างไร?', en: 'How is a project priced?' })}</summary>
              <p>
                {t({
                  th: 'ราคาและรายการส่งมอบอยู่ที่หน้าแพ็กเกจ ตามแค็ตตาล็อกสินค้า ไม่มีราคาตายตัวในหน้าแรก START, GROW และ SCALE บอกทิศทางงาน ค่า Square ค่าถ่ายภาพเพิ่ม และหลายสาขาคิดแยก หากต้องการตัวเลขที่ตรงร้าน ให้ส่งอีเมล chapter99solutions@gmail.com',
                  en: 'Prices and inclusions live on the pricing page from the Product Catalog. This homepage does not set a fixed package price. START, GROW and SCALE describe the shape of the work. Square, extra photography and extra locations are itemised separately. For a number that matches your shop, email chapter99solutions@gmail.com.',
                })}
              </p>
            </details>
            <details>
              <summary>{t({ th: 'ใครเป็นผู้ควบคุมบัญชีธุรกิจ?', en: 'Who controls the business accounts?' })}</summary>
              <p>
                {t({
                  th: 'เจ้าของร้าน บัญชี Google, Square, โดเมน และระบบจองควรอยู่ในชื่อร้าน Chapter99 ช่วยในขอบเขตที่ตกลง ไม่ถือบัญชีแทนถาวร สิทธิ์พนักงานและการส่งมอบต้องเขียนไว้ในงาน',
                  en: 'The shop owner. Google, Square, domain and booking logins should stay in the shop’s name. Chapter99 helps inside the agreed scope and does not keep those accounts as the owner. Staff access and handover are written into the work.',
                })}
              </p>
            </details>
            <details>
              <summary>{t({ th: 'ชุดเครื่องมือธุรกิจฟรีส่งข้อมูลลูกค้าออกไปไหม?', en: 'Does the free toolkit send customer data away?' })}</summary>
              <p>
                {t({
                  th: 'ไม่ ชุดเครื่องมือเป็นสมุดงานบนเครื่องคุณ ใช้จดคิว ข้อความ และแม่แบบเอกสาร ไม่ส่ง SMS อัตโนมัติ ไม่เก็บเบอร์ลูกค้าบนคลาวด์ และยังไม่ใช่ระบบจองออนไลน์ที่รับเงิน',
                  en: 'No. The toolkit is a shop workbook on your device for queue notes, messages and templates. It does not send SMS for you, does not store customer numbers in the cloud, and is not a live booking or payment system.',
                })}
              </p>
            </details>
            <details>
              <summary>{t({ th: 'หลังเปิดใช้งานแล้วดูแลอย่างไร?', en: 'What happens after launch?' })}</summary>
              <p>
                {t({
                  th: 'การดูแลต่อเนื่องคิดเป็นรายโครงการ ไม่สัญญาซัพพอร์ตทุกชั่วโมงถ้ายังไม่ได้ซื้อ งานแก้หลังส่งมอบคุยขอบเขตใหม่ ช่องทางติดต่อที่ใช้ได้คืออีเมล chapter99solutions@gmail.com ไม่มีปฏิทินจองและไม่มีแชทสด',
                  en: 'Ongoing care is agreed per project. There is no 24-hour support promise unless that is purchased. Work after handover is re-scoped. The working contact path is email to chapter99solutions@gmail.com — no booking calendar and no live chat.',
                })}
              </p>
            </details>
          </div>
        </div>
      </section>

      <section className="v2-close">
        <p className="v2-eyebrow">{t({ th: 'ถ่ายทอดตัวตนธุรกิจของคุณสู่โลกออนไลน์', en: 'Bring your business to life online.' })}</p>
        <h2>{t({ th: 'ก้าวต่อไปของธุรกิจ เริ่มจากภาพที่ชัดขึ้น', en: 'Your next chapter starts with a clearer picture.' })}</h2>
        <div className="v2-actions">
          <Link className="v2-btn light" to="/business-toolkit">
            {t({ th: 'เปิดชุดเครื่องมือธุรกิจฟรี', en: 'Open the Free Business Toolkit' })}
          </Link>
          <button type="button" className="v2-btn secondary" onClick={() => openAudit()}>
            {t({ th: 'ดูแนวทางประเมินธุรกิจ', en: 'Explore a Business Audit' })}
          </button>
        </div>
        <p className="v2-note">
          <a href={AUDIT_MAIL}>chapter99solutions@gmail.com</a>
        </p>
      </section>

      <AuditDialog open={auditOpen} onClose={() => setAuditOpen(false)} plan={plan} titleId={titleId} />
    </main>
  );
}

export default function HomePage() {
  return (
    <SiteLayout>
      <HomeInner />
    </SiteLayout>
  );
}
