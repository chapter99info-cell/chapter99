import { useState } from 'react';
import { useFadeUp } from '../hooks/useFadeUp';
import { useTranslation } from '../i18n/LanguageContext';

const glitches = [
  { left: '2%', top: '-3%', width: 20, height: 20 },
  { left: '12%', top: '-5%', width: 13, height: 9 },
  { left: '28%', top: '-2%', width: 9, height: 9 },
  { left: '82%', top: '22%', width: 7, height: 7 },
  { left: '-4%', top: '75%', width: 14, height: 11 },
  { left: '8%', top: '82%', width: 9, height: 9 },
  { left: '-2%', top: '88%', width: 16, height: 14 },
  { left: '56%', top: '82%', width: 11, height: 12 },
  { left: '70%', top: '90%', width: 9, height: 9 },
  { left: '42%', top: '94%', width: 7, height: 5 },
];

const labels = [
  {
    id: 'bcLine1',
    style: { left: '12.33%', top: '23.6%' },
    text: { th: 'ภาพถ่าย', en: 'Photography' },
  },
  {
    id: 'bcLine2',
    style: { left: '91.68%', top: '30.54%' },
    text: { th: 'เว็บไซต์', en: 'Websites' },
  },
  {
    id: 'bcLine3',
    style: { left: '34.27%', top: '93.24%' },
    text: { th: 'ระบบหลังบ้าน', en: 'Back Office' },
  },
] as const;

export function Approach() {
  const { t } = useTranslation();
  const headRef = useFadeUp(0);
  const rowRef = useFadeUp(1);
  const [activeLine, setActiveLine] = useState<string | null>(null);

  return (
    <section id="approach">
      <div className="ap-inner">
        <div ref={headRef} className="ap-head fadeup">
          <div className="lines">
            <div className="l1">
              {t({ th: 'แนวทางการทำงาน', en: 'Our comprehensive' })}
            </div>
            <div className="l2">
              {t({ th: 'แบบครบวงจรของเรา', en: 'approach' })}
            </div>
          </div>
          <span className="ap-plus">+</span>
        </div>

        <div ref={rowRef} className="ap-row fadeup">
          <div className="ap-left">
            <div className="ap-portrait">
              <img
                alt="Chapter99"
                src="https://euiwkvozrhnbxttfuchh.supabase.co/storage/v1/object/public/Chapter%2099%20web/Photos/Price%20package/chapter99_mix.jpg"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 6,
                }}
              />
              {glitches.map((g, i) => (
                <span
                  key={i}
                  className="ap-glitch"
                  style={{
                    left: g.left,
                    top: g.top,
                    width: g.width,
                    height: g.height,
                  }}
                />
              ))}
            </div>

            <div className="ap-quote">
              <span className="mark">&ldquo;</span>
              <p>
                {t({
                  th: 'เราเห็นแพทเทิร์นเดิมซ้ำๆ — ธุรกิจที่มีศักยภาพ แต่หลงทางอยู่ในขั้นตอนที่ยุ่งเหยิง ภาพลักษณ์กระจัดกระจาย และเว็บไซต์ที่ลูกค้าจำไม่ได้ Chapter99 เกิดขึ้นมาเพื่อรวมทุกอย่างให้เป็นเรื่องเดียวที่ชัดเจนและสอดคล้องกัน',
                  en: 'We kept seeing the same pattern — businesses with real potential, lost in messy processes, scattered visuals, and websites customers couldn\'t remember. Chapter99 exists to bring it all together into one clear, consistent story.',
                })}
              </p>
              <div className="who">
                <div className="name">
                  {t({ th: 'ทีม Chapter99', en: 'The Chapter99 Team' })}
                </div>
                <div className="title">Sydney, Australia</div>
              </div>
            </div>
          </div>

          <div className="brand-circle-outer">
            <div className="brand-circle-wrap">
              <svg viewBox="0 0 100 100" className="brand-circle-svg">
                <circle
                  cx="50"
                  cy="50"
                  r="30"
                  stroke="white"
                  strokeWidth="0.18"
                  opacity="0.45"
                  fill="none"
                />
                <line
                  id="bcLine1"
                  className={activeLine === 'bcLine1' ? 'hi' : undefined}
                  x1="50"
                  y1="50"
                  x2="20.52"
                  y2="29.34"
                  stroke="white"
                  strokeWidth="0.18"
                  opacity="0.45"
                />
                <line
                  id="bcLine2"
                  className={activeLine === 'bcLine2' ? 'hi' : undefined}
                  x1="50"
                  y1="50"
                  x2="82.6"
                  y2="34.8"
                  stroke="white"
                  strokeWidth="0.18"
                  opacity="0.45"
                />
                <line
                  id="bcLine3"
                  className={activeLine === 'bcLine3' ? 'hi' : undefined}
                  x1="50"
                  y1="50"
                  x2="37.7"
                  y2="83.84"
                  stroke="white"
                  strokeWidth="0.18"
                  opacity="0.45"
                />
              </svg>
              {labels.map((label) => (
                <span
                  key={label.id}
                  className={`brand-label${activeLine === label.id ? ' hi' : ''}`}
                  style={label.style}
                  onMouseEnter={() => setActiveLine(label.id)}
                  onMouseLeave={() => setActiveLine(null)}
                >
                  {t(label.text)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
