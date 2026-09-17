import { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { siteIcons, siteMedia } from './media';
import { useTranslation } from '../cinematic/i18n/LanguageContext';
import { CopySnippet } from './SiteUx';

const DEMO = 'https://www.chapter99info.tech/?shop=mira';
const MIRA = 'https://www.mirathaimassage.com.au/';
const PRINCESS = 'https://theprincessthaimassage.vercel.app/';

const INTAKE_TH = `แบบฟอร์มลูกค้าใหม่ — ร้านนวด
ชื่อ: ________________
โทร: ________________
บริการที่ต้องการ: ผ่อนคลาย / รีมีเดียล / น้ำมัน / คู่
ระยะเวลา: 30 / 60 / 90 นาที
แรงกดที่ถนัด: เบา / กลาง / แรง
บริเวณที่ปวดหรือไม่ต้องการให้กด: ________________
แพ้สาร/น้ำมัน: ________________
ตั้งครรภ์: ใช่ / ไม่ใช่
ใช้ HICAPS / กองทุนสุขภาพ: ใช่ / ไม่ใช่
ลายเซ็น + วันที่: ________________`;

const INTAKE_EN = `New client intake — massage shop
Name: ________________
Phone: ________________
Service: relaxation / remedial / oil / couple
Duration: 30 / 60 / 90 min
Preferred pressure: light / medium / firm
Areas to avoid or focus: ________________
Allergies (oils/lotions): ________________
Pregnant: yes / no
Using HICAPS / health fund: yes / no
Signature + date: ________________`;

export function MassageToolkit() {
  const { t, lang } = useTranslation();
  const [shop, setShop] = useState('Mira Thai Massage Altona');
  const [qr, setQr] = useState('');
  const [incGst, setIncGst] = useState('90');
  const [min60, setMin60] = useState('90');
  const [copied, setCopied] = useState('');

  const reviewUrl = useMemo(() => {
    const q = encodeURIComponent(`${shop.trim()} Google reviews`);
    return `https://www.google.com/search?q=${q}`;
  }, [shop]);

  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(reviewUrl, { margin: 1, width: 220 }).then((url) => {
      if (alive) setQr(url);
    });
    return () => {
      alive = false;
    };
  }, [reviewUrl]);

  const inc = Number.parseFloat(incGst) || 0;
  const ex = inc / 1.1;
  const gst = inc - ex;
  const base = Number.parseFloat(min60) || 0;

  async function copyText(key: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    window.setTimeout(() => setCopied(''), 1600);
  }

  return (
    <section className="section toolkit" id="toolkit">
      <div className="container">
        <div className="center">
          <div className="kicker">Free Massage Shop Toolkit</div>
          <h2>{t({ th: 'เครื่องมือร้านนวดที่ใช้ได้จริง', en: 'Tools massage shops can use today' })}</h2>
          <p className="lead" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            {t({
              th: 'ใช้บนมือถือได้เลย ไม่ต้องสมัคร — ลิงก์รีวิว คิด GST ราคาตามนาที และแบบฟอร์มลูกค้าใหม่',
              en: 'Use on your phone now, no signup — review link, GST, duration pricing, and a new-client form.',
            })}
          </p>
        </div>

        <div className="tool-live">
          <a className="tool-live-card" href={DEMO} target="_blank" rel="noreferrer">
            <img src={siteMedia.demo} alt="" />
            <span>{t({ th: 'จองคิว + หลังบ้านตัวอย่าง', en: 'Live booking + owner view' })}</span>
          </a>
          <a className="tool-live-card" href={MIRA} target="_blank" rel="noreferrer">
            <img src={siteMedia.massage} alt="" />
            <strong>Mira Thai Massage</strong>
            <span>{t({ th: 'เว็บร้านนวดจริง Altona', en: 'Live Altona shop site' })}</span>
          </a>
          <a className="tool-live-card" href={PRINCESS} target="_blank" rel="noreferrer">
            <img src={siteMedia.booking} alt="" />
            <strong>Princess Thai Massage</strong>
            <span>{t({ th: 'เว็บจองคิวร้านนวด', en: 'Live booking website' })}</span>
          </a>
        </div>

        <div className="tool-grid">
          <article className="tool-card">
            <h3>
              <img className="tool-ico" src={siteIcons.search} alt="" />
              {t({ th: 'ลิงก์ + QR รีวิว Google', en: 'Google review link + QR' })}
            </h3>
            <label>
              {t({ th: 'ชื่อร้าน + ชานเมือง', en: 'Shop name + suburb' })}
              <input value={shop} onChange={(e) => setShop(e.target.value)} />
            </label>
            <a className="btn primary" href={reviewUrl} target="_blank" rel="noreferrer">
              {t({ th: 'เปิดลิงก์รีวิว', en: 'Open review search' })}
            </a>
            <button type="button" className="btn secondary" onClick={() => copyText('review', reviewUrl)}>
              {copied === 'review' ? t({ th: 'คัดลอกแล้ว', en: 'Copied' }) : t({ th: 'คัดลอกลิงก์', en: 'Copy link' })}
            </button>
            {qr ? <img className="tool-qr" src={qr} alt="" /> : null}
            <p className="tool-note">
              {t({
                th: 'เปิดแล้วเลือกโปรไฟล์ Google Business ของร้าน เพื่อให้ลูกค้ากดรีวิว',
                en: 'Then open your Google Business Profile so the customer can leave a review.',
              })}
            </p>
          </article>

          <article className="tool-card">
            <h3>
              <img className="tool-ico" src={siteIcons.settings} alt="" />
              {t({ th: 'คิด GST 10%', en: 'GST 10% helper' })}
            </h3>
            <label>
              {t({ th: 'ราคาที่ลูกค้าจ่าย (รวม GST)', en: 'Price the customer pays (inc GST)' })}
              <input inputMode="decimal" value={incGst} onChange={(e) => setIncGst(e.target.value)} />
            </label>
            <p className="tool-math">
              {t({ th: 'ก่อน GST', en: 'Ex GST' })}: A${ex.toFixed(2)}
            </p>
            <p className="tool-math">GST: A${gst.toFixed(2)}</p>
            <p className="tool-note">
              {t({
                th: 'ตัวเลขอ้างอิงทั่วไป ออสเตรเลีย 10% — ไม่ใช่คำแนะนำทางภาษี',
                en: 'General 10% Australia reference only — not tax advice.',
              })}
            </p>
          </article>

          <article className="tool-card">
            <h3>
              <img className="tool-ico" src={siteIcons.menu} alt="" />
              {t({ th: 'ราคา 30 / 60 / 90 นาที', en: '30 / 60 / 90 min prices' })}
            </h3>
            <label>
              {t({ th: 'ราคา 60 นาที', en: '60-minute price' })}
              <input inputMode="decimal" value={min60} onChange={(e) => setMin60(e.target.value)} />
            </label>
            <p className="tool-math">30 min ≈ A${(base * 0.6).toFixed(0)}</p>
            <p className="tool-math">60 min = A${base.toFixed(0)}</p>
            <p className="tool-math">90 min ≈ A${(base * 1.4).toFixed(0)}</p>
            <p className="tool-note">
              {t({
                th: 'สูตรคร่าวๆ ที่ร้านนวดใช้ตั้งเมนู ไม่ใช่ราคาบังคับ',
                en: 'A common menu-planning ratio, not a required price.',
              })}
            </p>
          </article>

          <article className="tool-card">
            <h3>
              <img className="tool-ico" src={siteIcons.profile} alt="" />
              {t({ th: 'แบบฟอร์มลูกค้าใหม่', en: 'New-client intake' })}
            </h3>
            <CopySnippet text={lang === 'en' ? INTAKE_EN : INTAKE_TH}>
              {lang === 'en' ? INTAKE_EN : INTAKE_TH}
            </CopySnippet>
          </article>
        </div>
      </div>
    </section>
  );
}
