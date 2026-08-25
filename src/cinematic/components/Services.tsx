import { useFadeUp } from '../hooks/useFadeUp';
import { useTranslation } from '../i18n/LanguageContext';

const Check = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const Arrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export function Services() {
  const { t } = useTranslation();
  const headRef = useFadeUp(0);
  const c0 = useFadeUp(1);
  const c1 = useFadeUp(2);
  const c2 = useFadeUp(3);
  const c3 = useFadeUp(4);

  return (
    <section id="services">
      <div className="bg-noise" />
      <div className="wrap" style={{ position: 'relative' }}>
        <div ref={headRef} className="feat-head fadeup">
          <span className="l1">
            {t({
              th: 'ครบวงจรตั้งแต่ภาพนิ่งจนถึงระบบหลังบ้าน',
              en: 'Everything from photography to your back office',
            })}
          </span>
          <span className="l2">
            {t({
              th: 'ทำเอง ดูแลเอง ไม่ต้องรอโรงพิมพ์อีกต่อไป',
              en: 'Do it yourself, manage it yourself — no more waiting on a print shop',
            })}
          </span>
        </div>

        <div className="feat-grid">
          <div ref={c0} id="photo" className="feat-card media fadeup">
            <video
              autoPlay
              loop
              muted
              playsInline
              src="https://euiwkvozrhnbxttfuchh.supabase.co/storage/v1/object/public/Chapter%2099%20web/VDO/ipad.mp4"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 0,
              }}
            />
            <div style={{ position: 'relative', zIndex: 1 }}>
            <span
              style={{
                fontFamily: "'Sarabun'",
                fontSize: 11,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                color: 'rgba(225,224,204,.55)',
                marginBottom: 8,
                display: 'block',
              }}
            >
              {t({
                th: 'ครบวงจร ไม่ต้องพึ่งหลายเจ้า',
                en: 'End-to-end, no need for multiple vendors',
              })}
            </span>
            <p>
              {t({
                th: 'จากไอเดีย สู่ภาพถ่าย สู่เว็บที่ใช้งานได้จริง',
                en: 'From idea to photography to a website that actually works',
              })}
            </p>
            <p
              style={{
                fontFamily: "'Sarabun'",
                fontSize: 12.5,
                color: 'rgba(225,224,204,.55)',
                marginTop: 6,
                fontWeight: 400,
              }}
            >
              {t({
                th: 'ไอเดีย → ช่างภาพ → สร้างเว็บ ทีมเดียวจบ ไม่ต้องประสานงานหลายเจ้า',
                en: 'Idea → photographer → website build. One team, start to finish — no juggling multiple vendors.',
              })}
            </p>
            <a className="feat-more" href="#photo-rates" style={{ marginTop: 10 }}>
              <span>
                {t({ th: 'ดูราคาช่างภาพ', en: 'View photography rates' })}
              </span>{' '}
              <Arrow />
            </a>
            </div>
          </div>

          <div ref={c1} id="web" className="feat-card solid fadeup">
            <span className="feat-num">01</span>
            <h3>{t({ th: 'เว็บ Front+Back', en: 'Web Front+Back' })}</h3>
            <ul className="feat-list">
              <li>
                <Check />
                <span>{t({ th: 'ระบบจองออนไลน์เรียลไทม์', en: 'Real-time online booking' })}</span>
              </li>
              <li>
                <Check />
                <span>
                  {t({
                    th: 'บันทึกยอดขายเป็นข้อมูล (Cash/Card/HICAPS)',
                    en: 'Records sales data (Cash/Card/HICAPS)',
                  })}
                </span>
              </li>
              <li>
                <Check />
                <span>
                  {t({ th: 'Staff/Owner PIN แยกสิทธิ์', en: 'Separate Staff/Owner PIN access' })}
                </span>
              </li>
              <li>
                <Check />
                <span>
                  {t({ th: 'Supabase Realtime ทุกจุด', en: 'Supabase Realtime everywhere' })}
                </span>
              </li>
            </ul>
            <a className="feat-more" href="#web-rates">
              <span>{t({ th: 'ดูราคา', en: 'View rates' })}</span> <Arrow />
            </a>
          </div>

          <div ref={c2} id="other" className="feat-card solid fadeup">
            <span className="feat-num">02</span>
            <h3>{t({ th: 'บริการอื่นๆ', en: 'Other Services' })}</h3>
            <ul className="feat-list">
              <li>
                <Check />
                <span>
                  {t({
                    th: 'QR Digital Menu แก้ราคาเอง',
                    en: 'QR Digital Menu — edit prices yourself',
                  })}
                </span>
              </li>
              <li>
                <Check />
                <span>{t({ th: 'AI Finder + Google SEO', en: 'AI Finder + Google SEO' })}</span>
              </li>
              <li>
                <Check />
                <span>
                  {t({ th: 'Google Maps + Review Link', en: 'Google Maps + Review Link' })}
                </span>
              </li>
            </ul>
            <a className="feat-more" href="#other-rates">
              <span>{t({ th: 'ดูราคา', en: 'View rates' })}</span> <Arrow />
            </a>
          </div>

          <div ref={c3} id="value-promise" className="feat-card solid fadeup">
            <span className="feat-num">03</span>
            <h3>{t({ th: 'ราคาไม่ผูกมัด', en: 'No lock-in pricing' })}</h3>
            <ul className="feat-list">
              <li>
                <Check />
                {t({
                  th: 'เลือกลายงานก่อน แล้วค่อยดูแพ็กเกจ 3–4 ใบ',
                  en: 'Pick a service line, then see 3–4 packages',
                })}
              </li>
              <li>
                <Check />
                {t({
                  th: 'ไม่มีสัญญาผูกมัดระยะยาว',
                  en: 'No long lock-in contracts',
                })}
              </li>
              <li>
                <Check />
                {t({
                  th: 'คุยงานก่อนเสมอสำหรับโปรดักชันใหญ่',
                  en: 'Large productions are quoted after a brief',
                })}
              </li>
            </ul>
            <a className="feat-more" href="#pricing">
              <span>{t({ th: 'ดูราคา', en: 'View rates' })}</span> <Arrow />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
