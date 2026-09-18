import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../cinematic/i18n/LanguageContext';
import { siteContact, siteMedia } from './media';
import { SiteLayout } from './SiteLayout';
import { ShopGlowGrid } from './ShopGlowGrid';
import { SystemPreview } from './SystemPreview';
import './homepage-v2.css';

const AUDIT_MAIL =
  'mailto:chapter99solutions@gmail.com?subject=Chapter99%20Business%20Audit';

const stages = [
  {
    key: 'LOOK',
    title: { th: 'LOOK · ภาพลักษณ์', en: 'LOOK' },
    body: {
      th: 'ภาพและเนื้อหาที่สะท้อนร้านจริง',
      en: 'Photos and copy that look like your real shop.',
    },
  },
  {
    key: 'FOUND',
    title: { th: 'BE FOUND · ค้นเจอ', en: 'BE FOUND' },
    body: {
      th: 'เว็บไซต์และข้อมูลร้านที่ลูกค้าหาเจอ',
      en: 'A website and shop details people can find.',
    },
  },
  {
    key: 'BOOKED',
    title: { th: 'GET BOOKED · จอง', en: 'GET BOOKED' },
    body: {
      th: 'เลือกบริการและช่องทางจองที่ตกลงในขอบเขต',
      en: 'Choose a service and book through the agreed path.',
    },
  },
  {
    key: 'PAID',
    title: { th: 'GET PAID · ชำระเงิน', en: 'GET PAID' },
    body: {
      th: 'ขั้นตอนจ่ายเงินและใบเสร็จตามที่ร้านใช้',
      en: 'Payment and receipt steps as the shop actually works.',
    },
  },
  {
    key: 'RUN',
    title: { th: 'RUN · งานร้าน', en: 'RUN' },
    body: {
      th: 'คิว เอกสาร และงานที่ทีมทำต่อได้',
      en: 'Queue, documents and work the team can continue.',
    },
  },
  {
    key: 'GROW',
    title: { th: 'GROW · เติบโต', en: 'GROW' },
    body: {
      th: 'รีวิว เนื้อหา และการดูแลตามข้อตกลง',
      en: 'Reviews, content and care inside the agreed plan.',
    },
  },
] as const;

const phonePath = [
  { th: 'ค้นเจอร้าน', en: 'Find the shop' },
  { th: 'ดูบริการ', en: 'View services' },
  { th: 'เลือกช่องทางจอง', en: 'Choose how to book' },
  { th: 'ชำระเงินตามขั้นตอน', en: 'Pay as set up' },
  { th: 'รับการยืนยัน', en: 'Get confirmation' },
] as const;

const readinessTopics = [
  { th: 'ข้อมูลร้านและ Google', en: 'Shop details and Google' },
  { th: 'ภาพถ่ายและรายละเอียดบริการ', en: 'Photos and service details' },
  { th: 'ช่องทางจอง', en: 'How customers book' },
  { th: 'ขั้นตอนชำระเงิน', en: 'Payment steps' },
  { th: 'เจ้าของบัญชีและสิทธิ์เข้าถึง', en: 'Account owners and access' },
  { th: 'งานที่ยังต้องทำซ้ำทุกวัน', en: 'Work still repeated every day' },
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
      th: 'Chapter99 — ธุรกิจดูดีออนไลน์ ทำงานง่ายขึ้น',
      en: 'Chapter99 — Look professional online and work more easily',
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
          th: 'Digital Business Infrastructure Partner · ธุรกิจไทยในออสเตรเลีย',
          en: 'Digital Business Infrastructure Partner · Thai businesses in Australia',
        })}
      </p>

      <section className="v2-hero">
        <div className="v2-wrap">
          <div className="v2-hero-grid v2-hero-split">
            <div>
              <p className="v2-eyebrow">
                {t({
                  th: 'ช่วยให้ธุรกิจดูดีออนไลน์ เชื่อมระบบที่จำเป็น และส่งต่อให้เจ้าของกับทีมควบคุมต่อได้',
                  en: 'Look professional online, connect the systems you need, then hand control to the owner and team.',
                })}
              </p>
              <h1>
                {t({
                  th: 'ธุรกิจดูดีออนไลน์',
                  en: 'Look professional online.',
                })}
                <br />
                {t({ th: 'ทำงานง่ายขึ้น', en: 'Work more easily.' })}
                <br />
                <em>{t({ th: 'เติบโตในแบบของคุณ', en: 'Grow in your own way.' })}</em>
              </h1>
              <p className="v2-intro">
                {t({
                  th: 'Chapter99 ช่วยเชื่อมภาพถ่าย เว็บไซต์ การค้นเจอ การจอง และกระบวนการชำระเงิน พร้อมเครื่องมือและการส่งต่อให้คุณกับทีมดูแลต่อได้',
                  en: 'Chapter99 helps connect photography, website, discovery, booking and payment steps — with tools and a handover so you and the team can keep running them.',
                })}
              </p>
              <div className="v2-actions">
                <Link className="v2-btn primary" to="/business-toolkit">
                  {t({ th: 'เริ่มใช้เครื่องมือธุรกิจฟรี', en: 'Start the free business toolkit' })}
                </Link>
                <button type="button" className="v2-btn secondary" onClick={() => openAudit()}>
                  {t({ th: 'คุยเรื่องประเมินธุรกิจ', en: 'Talk through a Business Audit' })}
                </button>
              </div>
              <p className="v2-note">
                {t({
                  th: 'เริ่มจากเครื่องมือฟรี แล้วค่อยเลือกความช่วยเหลือที่เหมาะกับร้าน',
                  en: 'Start with the free toolkit, then choose help that fits the shop.',
                })}
              </p>
            </div>
            <div className="v2-hero-visual v2-hero-people">
              <figure className="v2-hero-photo">
                <img
                  src={siteMedia.hero}
                  alt={t({
                    th: 'ภาพแนวคิดบรรยากาศร้านและงานบริการ ไม่ใช่ภาพลูกค้าที่รับรองแล้ว',
                    en: 'Concept photo of a service business — not a verified client case',
                  })}
                />
                <figcaption>
                  {t({
                    th: 'ภาพแนวคิดจากคลัง Chapter99 · ไม่ใช่หลักฐานลูกค้าจริง',
                    en: 'Concept photo from the Chapter99 library — not a proven client case.',
                  })}
                </figcaption>
              </figure>
              <div className="v2-hero-phone">
                <SystemPreview kind="shop" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="v2-section" id="journey">
        <div className="v2-wrap">
          <div className="v2-head">
            <div>
              <p className="v2-eyebrow">{t({ th: 'เส้นทางลูกค้า', en: 'Customer path' })}</p>
              <h2>
                {t({
                  th: 'ตั้งแต่ลูกค้าเห็นร้าน จนถึงวันที่กลับมาอีก',
                  en: 'From the first look at the shop to the day they come back.',
                })}
              </h2>
            </div>
            <p>
              {t({
                th: 'ให้ลูกค้าทำรายการบนมือถือได้สะดวก และเลือกติดต่อร้านเมื่อจำเป็น',
                en: 'Let customers complete steps on their phone, and contact the shop when they need to.',
              })}
            </p>
          </div>
          <div className="v2-stages v2-stages-light">
            {stages.map((stage) => (
              <article className="v2-stage" key={stage.key}>
                <p className="v2-eyebrow">{stage.key}</p>
                <h3>{t(stage.title)}</h3>
                <p>{t(stage.body)}</p>
              </article>
            ))}
          </div>
          <ol className="v2-phone-path">
            {phonePath.map((step) => (
              <li key={step.en}>{t(step)}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="v2-section v2-toolkit" id="toolkit">
        <div className="v2-wrap v2-toolkit-grid">
          <div>
            <p className="v2-eyebrow">{t({ th: 'ใช้งานได้แล้ว', en: 'Available now' })}</p>
            <h2>
              {t({
                th: 'เริ่มจากเครื่องมือที่ช่วยงานวันนี้',
                en: 'Start with tools that help today’s work.',
              })}
            </h2>
            <p>
              {t({
                th: 'ชุดเครื่องมือฟรีทำงานบนเครื่องคุณ ไม่ส่ง SMS แทนร้าน และยังไม่ใช่ระบบจองออนไลน์ที่รับเงิน',
                en: 'The free toolkit runs on your device. It does not send SMS for the shop and is not a live booking or payment system.',
              })}
            </p>
          </div>
          <div className="v2-tool-card">
            <h3>{t({ th: 'ตัวอย่างจากเครื่องมือที่มีอยู่', en: 'From the live toolkit' })}</h3>
            <ul>
              <li>{t({ th: 'จัดคิววันนี้', en: 'Today’s queue' })}</li>
              <li>{t({ th: 'เตรียมข้อความถึงลูกค้า แล้วคัดลอกไปส่งเอง', en: 'Draft a customer message, then copy and send it yourself' })}</li>
              <li>{t({ th: 'เอกสารและเทมเพลต', en: 'Documents and templates' })}</li>
            </ul>
            <Link className="v2-btn primary" to="/business-toolkit">
              {t({ th: 'เปิดเครื่องมือฟรีทั้งหมด', en: 'Open the full free toolkit' })}
            </Link>
          </div>
        </div>
      </section>

      <section className="v2-section v2-community" id="community">
        <div className="v2-wrap v2-community-grid">
          <div>
            <p className="v2-eyebrow">{t({ th: 'ช่องทางเสริม · ไม่แทนเครื่องมือฟรี', en: 'Extra channel · not a replacement for the toolkit' })}</p>
            <h2>
              {t({
                th: 'เชื่อมคนไทยกับธุรกิจและบริการใกล้ตัว',
                en: 'Connect Thai people with nearby businesses and services.',
              })}
            </h2>
            <p>
              {t({
                th: 'พื้นที่แลกเปลี่ยนประสบการณ์ แนะนำธุรกิจ และแบ่งปันเครื่องมือสำหรับคนไทยในซิดนีย์ ตามกติกาของกลุ่ม',
                en: 'A place to share experience, recommend businesses and pass on useful tools for Thai people in Sydney — under the group’s own rules.',
              })}
            </p>
            <p className="v2-note">
              {t({
                th: 'Chapter99 ร่วมดูแลพื้นที่ชุมชนนี้ และมีบริการช่วยจัดภาพลักษณ์ เว็บไซต์ และกระบวนการทำงานสำหรับเจ้าของธุรกิจ การเข้ากลุ่มไม่จำเป็นต้องซื้อบริการ คำว่า Verified เป็นชื่อกลุ่ม ไม่ใช่การรับรองสมาชิกหรือบริการทุกราย',
                en: 'Chapter99 helps look after this community space, and also helps owners with look, website and working processes. Joining the group does not require buying a service. “Verified” is the group name — not a Chapter99 certification of every member or service.',
              })}
            </p>
            <div className="v2-actions">
              <a className="v2-btn primary" href={siteContact.communityHref} target="_blank" rel="noreferrer">
                {t({ th: 'เยี่ยมชมกลุ่มบน Facebook', en: 'Visit the Facebook group' })}
              </a>
              <Link className="v2-btn secondary" to="/business-toolkit">
                {t({ th: 'ใช้เครื่องมือธุรกิจฟรี', en: 'Use the free business toolkit' })}
              </Link>
            </div>
          </div>
          <article className="v2-community-card">
            <p className="v2-eyebrow">Facebook group</p>
            <h3>{t(siteContact.communityName)}</h3>
            <p className="v2-note">
              {t({
                th: 'เข้ากลุ่มหรือใช้เครื่องมือฟรีได้โดยไม่ต้องซื้อบริการ',
                en: 'Join the group or use the free toolkit without buying a service.',
              })}
            </p>
          </article>
        </div>
      </section>

      <section className="v2-section" id="why">
        <div className="v2-wrap">
          <p className="v2-eyebrow">{t({ th: 'ทำไมจึงเลือก Chapter99', en: 'Why Chapter99' })}</p>
          <h2>
            {t({
              th: 'ช่วยลงมือจัดระบบ ไม่จบที่ให้เครื่องมือ',
              en: 'We help set the system up — not only hand over a tool.',
            })}
          </h2>
          <div className="v2-process">
            <article>
              <h3>{t({ th: 'ทำให้ตัวตนธุรกิจชัด', en: 'Make the shop identity clear' })}</h3>
              <p>{t({ th: 'ด้วยภาพและเนื้อหาที่สะท้อนงานจริง', en: 'With photos and copy that match the real work.' })}</p>
            </article>
            <article>
              <h3>{t({ th: 'เลือกและลงมือจัดระบบตามงานจริง', en: 'Choose and set up systems that match the work' })}</h3>
              <p>{t({ th: 'เว็บไซต์ Google และขั้นตอนจอง/ชำระเงินตามขอบเขต', en: 'Website, Google and booking/payment steps inside the agreed scope.' })}</p>
            </article>
            <article>
              <h3>{t({ th: 'ความเป็นเจ้าของบัญชีชัดเจน', en: 'Account ownership is written down' })}</h3>
              <p>{t({ th: 'ระบุเจ้าของ สิทธิ์เข้าถึง และวิธีส่งต่อ', en: 'Owner, access and handover are named.' })}</p>
            </article>
            <article>
              <h3>{t({ th: 'มีแนวทางดูแลเมื่อระบบบางส่วนมีปัญหา', en: 'A care path when something fails' })}</h3>
              <p>{t({ th: 'คู่มือ การฝึกทีม และขอบเขต care ตามข้อตกลง ไม่รับประกัน uptime ทั้งวัน', en: 'Guides, team training and care inside the agreed plan — not a 24/7 uptime promise.' })}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="v2-section" id="implement">
        <div className="v2-wrap">
          <div className="v2-head">
            <div>
              <p className="v2-eyebrow">{t({ th: 'ติดต่อเพื่อกำหนดขอบเขต', en: 'Contact to set scope' })}</p>
              <h2>{t({ th: 'จากสิ่งที่ต้องทำ สู่สิ่งที่เริ่มใช้งานได้', en: 'From the work that is needed to something you can start using.' })}</h2>
            </div>
            <p>
              {t({
                th: 'การถ่ายภาพและทำเนื้อหาอาจดำเนินร่วมกับการสร้างเว็บไซต์ ไม่จำเป็นต้องรอให้ติดตั้งระบบเสร็จ',
                en: 'Photography and content can run alongside the website work. They do not have to wait until every system is installed.',
              })}
            </p>
          </div>
          <div className="v2-process">
            <article>
              <span className="num">01</span>
              <h3>{t({ th: 'วางและเชื่อมระบบ', en: 'Plan and connect systems' })}</h3>
              <p>{t({ th: 'เว็บไซต์ Google และขั้นตอนจอง/ชำระเงินตามขอบเขต', en: 'Website, Google and booking/payment steps as scoped.' })}</p>
            </article>
            <article>
              <span className="num">02</span>
              <h3>{t({ th: 'ทำให้ธุรกิจมีตัวตน', en: 'Give the business a face' })}</h3>
              <p>{t({ th: 'ภาพถ่าย เนื้อหา และรายละเอียดบริการ', en: 'Photography, copy and service details.' })}</p>
            </article>
            <article>
              <span className="num">03</span>
              <h3>{t({ th: 'ส่งต่อและดูแล', en: 'Hand over and care' })}</h3>
              <p>{t({ th: 'บัญชี คู่มือ การฝึกทีม และ care ตามข้อตกลง', en: 'Accounts, a guide, team training and care as agreed.' })}</p>
            </article>
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
          <div className="v2-plans">
            <article className="v2-plan">
              <p className="v2-eyebrow">START</p>
              <h3>{t({ th: 'สร้างพื้นฐานออนไลน์', en: 'Build the online foundation' })}</h3>
              <p>{t({ th: 'Presence — ให้ร้านดูเป็นมืออาชีพและติดต่อได้', en: 'Presence — look professional and stay contactable.' })}</p>
            </article>
            <article className="v2-plan featured">
              <p className="v2-eyebrow">GROW</p>
              <h3>{t({ th: 'เชื่อมกระบวนการและลดงานซ้ำ', en: 'Connect the work and cut repeat tasks' })}</h3>
              <p>{t({ th: 'Operations — จอง จ่าย และงานร้านตามขอบเขต', en: 'Operations — booking, payment and shop work as scoped.' })}</p>
            </article>
            <article className="v2-plan">
              <p className="v2-eyebrow">SCALE</p>
              <h3>{t({ th: 'ทำงานให้เป็นมาตรฐานและส่งต่อได้', en: 'Make the work standard and hand it on' })}</h3>
              <p>{t({ th: 'Infrastructure — ทีม สาขา และการดูแลตามข้อตกลง', en: 'Infrastructure — team, locations and care as agreed.' })}</p>
            </article>
          </div>
          <Link className="v2-btn secondary" to="/pricing#packages">
            {t({ th: 'ดูแพ็กเกจและขอบเขตบนหน้า Pricing', en: 'See packages and scope on Pricing' })}
          </Link>
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

      <section className="v2-section" id="audit">
        <div className="v2-wrap">
          <p className="v2-eyebrow">{t({ th: 'แนวคิดสำหรับคุย Audit · ยังไม่มีรายงานอัตโนมัติ', en: 'Topics for an Audit talk · no auto report' })}</p>
          <h2>
            {t({
              th: 'ยังไม่แน่ใจว่าควรเริ่มตรงไหน?',
              en: 'Not sure where to start?',
            })}
          </h2>
          <p>
            {t({
              th: 'หัวข้อด้านล่างใช้ทบทวนก่อนคุย ไม่มีคะแนน และไม่จองนัดให้อัตโนมัติ ช่องทางที่มีคืออีเมล',
              en: 'Use these topics before you talk. There is no score and no automatic booking. The working path is email.',
            })}
          </p>
          <ul className="v2-ready-list">
            {readinessTopics.map((item) => (
              <li key={item.en}>{t(item)}</li>
            ))}
          </ul>
          <div className="v2-actions">
            <button type="button" className="v2-btn primary" onClick={() => openAudit()}>
              {t({ th: 'คุยเรื่องประเมินธุรกิจ', en: 'Talk through a Business Audit' })}
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
              <h3>{t({ th: 'ชุมชนหรือเครื่องมือฟรี', en: 'Community or free toolkit' })}</h3>
              <p>{t({ th: 'เข้ากลุ่มหรือใช้เครื่องมือได้โดยไม่ต้องซื้อ', en: 'Join the group or use the toolkit without buying.' })}</p>
            </article>
            <article>
              <span className="num">02</span>
              <h3>{t({ th: 'หัวข้อ Readiness + Audit', en: 'Readiness topics + Audit' })}</h3>
              <p>{t({ th: 'ทบทวนหัวข้อแล้วคุยขอบเขตทางอีเมล', en: 'Review the topics, then email to set scope.' })}</p>
            </article>
            <article>
              <span className="num">03</span>
              <h3>{t({ th: 'Implementation + ภาพ/เนื้อหา', en: 'Implementation + photos/content' })}</h3>
              <p>{t({ th: 'ลงมือตามขอบเขต ภาพทำคู่กับเว็บได้', en: 'Build to scope. Photos can run with the website.' })}</p>
            </article>
            <article>
              <span className="num">04</span>
              <h3>{t({ th: 'Monthly Care', en: 'Monthly Care' })}</h3>
              <p>{t({ th: 'ดูแลตามข้อตกลง ไม่สัญญาซัพพอร์ตไม่จำกัด', en: 'Care as agreed — not unlimited support.' })}</p>
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
        <p className="v2-eyebrow">{t({ th: 'เริ่มจากหนึ่งเรื่องที่ทำให้ธุรกิจง่ายขึ้น', en: 'Start with one thing that makes the shop easier.' })}</p>
        <h2>{t({ th: 'เครื่องมือฟรีก่อน แล้วค่อยคุยขอบเขต', en: 'Free tools first. Scope the work when you are ready.' })}</h2>
        <div className="v2-actions">
          <Link className="v2-btn light" to="/business-toolkit">
            {t({ th: 'เริ่มใช้เครื่องมือธุรกิจฟรี', en: 'Start the free business toolkit' })}
          </Link>
          <button type="button" className="v2-btn secondary" onClick={() => openAudit()}>
            {t({ th: 'คุยเรื่องประเมินธุรกิจ', en: 'Talk through a Business Audit' })}
          </button>
          <a className="v2-btn secondary" href={siteContact.communityHref} target="_blank" rel="noreferrer">
            {t({ th: 'เยี่ยมชมกลุ่มบน Facebook', en: 'Visit the Facebook group' })}
          </a>
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
