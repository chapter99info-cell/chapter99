import { useFadeUp } from '../hooks/useFadeUp';
import { useTranslation } from '../i18n/LanguageContext';

const aboutCopy = {
  pill: { th: 'แนะนำ Chapter99', en: 'Introducing Chapter99' },
  heading: {
    th: 'ทีมที่วางกลยุทธ์ชัด ส่งมอบผลลัพธ์จริง<br class="dbr">ทั้งในโลกดิจิทัลและหน้าร้าน',
    en: "A team with a clear strategy, delivering real results<br class='dbr'>across digital and the storefront",
  },
  bodyMobile: {
    th: 'ผ่านการค้นคว้า ความคิดสร้างสรรค์ และการลงมือทำซ้ำ เราช่วยธุรกิจไทยในออสเตรเลียปลดล็อกศักยภาพดิจิทัลได้เต็มที่',
    en: 'Through research, creativity and iteration, we help Thai businesses in Australia unlock their full digital potential.',
  },
  bodyDesktop: {
    th: 'ผ่านการค้นคว้า ความคิดสร้างสรรค์<br>และการลงมือทำซ้ำ เราช่วยธุรกิจไทย<br>ในออสเตรเลียปลดล็อกศักยภาพดิจิทัลได้เต็มที่',
    en: 'Through research, creativity<br>and iteration, we help Thai businesses<br>in Australia unlock their full digital potential.',
  },
  roll: { th: 'รู้จัก Chapter99', en: 'Get to know Chapter99' },
} as const;

function RollButton({ label }: { label: string }) {
  return (
    <a className="roll-btn" href="#services">
      <span className="roll-text">
        <span className="roll-text-inner">
          <span>{label}</span>
          <span>{label}</span>
        </span>
      </span>
      <span className="roll-arrow">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </span>
    </a>
  );
}

export function About() {
  const { t } = useTranslation();
  const badgeRef = useFadeUp(0);
  const h2Ref = useFadeUp<HTMLHeadingElement>(1);
  const mobileRef = useFadeUp(2);
  const desktopRef = useFadeUp(3);
  const roll = t(aboutCopy.roll);

  return (
    <section id="about">
      <div className="about2-inner">
        <div ref={badgeRef} className="about2-badge-row fadeup">
          <span className="about2-num">1</span>
          <span className="about2-pill">{t(aboutCopy.pill)}</span>
        </div>
        <h2
          ref={h2Ref}
          className="about2-h2 fadeup"
          dangerouslySetInnerHTML={{ __html: t(aboutCopy.heading) }}
        />

        <div ref={mobileRef} className="about2-mobile fadeup">
          <p>{t(aboutCopy.bodyMobile)}</p>
          <RollButton label={roll} />
          <div className="imgs">
            <div className="about2-img r1" />
            <div className="about2-img r2" />
          </div>
        </div>

        <div ref={desktopRef} className="about2-desktop fadeup">
          <div className="col-left">
            <video
              className="about2-img r1"
              autoPlay
              loop
              muted
              playsInline
              src="https://euiwkvozrhnbxttfuchh.supabase.co/storage/v1/object/public/Chapter%2099%20web/VDO/hero_cover01.mp4"
              style={{ objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
            />
          </div>
          <div className="col-mid">
            <p dangerouslySetInnerHTML={{ __html: t(aboutCopy.bodyDesktop) }} />
            <RollButton label={roll} />
          </div>
          <div className="col-right">
            <video
              className="about2-img r3"
              autoPlay
              loop
              muted
              playsInline
              src="https://euiwkvozrhnbxttfuchh.supabase.co/storage/v1/object/public/Chapter%2099%20web/VDO/hf_20260605_050850_dc39cb41-a876-4895-aabb-af78fba0405e.mp4"
              style={{ objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
