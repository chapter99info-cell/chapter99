import { useFadeUp } from '../hooks/useFadeUp';
import { useTranslation } from '../i18n/LanguageContext';

export function AIBridge() {
  const { t } = useTranslation();
  const rowRef = useFadeUp(0);
  const copyRef = useFadeUp(1);

  return (
    <section id="ai-bridge">
      <div className="bridge-glow" />
      <div className="wrap">
        <div ref={rowRef} className="bridge-row fadeup">
          <div
            className="bridge-node"
            dangerouslySetInnerHTML={{
              __html: t({
                th: 'ช่างภาพจริง<span>ยังไม่ถึงคิวถ่าย</span>',
                en: 'Real photographer<span>not booked yet</span>',
              }),
            }}
          />
          <div className="bridge-arrow">→</div>
          <div
            className="bridge-node"
            style={{ borderColor: '#3a3327', background: '#151109' }}
            dangerouslySetInnerHTML={{
              __html: t({
                th: 'AI Photo/Video<span>เปิดร้านได้ก่อน</span>',
                en: 'AI Photo/Video<span>launch sooner</span>',
              }),
            }}
          />
        </div>
        <div ref={copyRef} className="bridge-copy fadeup">
          <p>
            {t({
              th: 'ระหว่างรอคิวถ่ายจริง เราใส่ภาพและวิดีโอที่สร้างด้วย AI ให้ตรงสไตล์ร้าน เพื่อให้เว็บและเมนูพร้อมเปิดใช้งานได้ทันที พอถ่ายจริงเสร็จเมื่อไหร่ ระบบจะสลับเป็นภาพจริงให้อัตโนมัติ ไม่ต้องแจ้งซ้ำ',
              en: 'While you wait for your real photo shoot, we place AI-generated photos and videos that match your shop\'s style, so your website and menu can launch right away. The moment the real shoot is done, the system swaps in the real photos automatically — no need to ask.',
            })}
          </p>
          <p className="note">
            {t({
              th: 'ใช้สำหรับคอนเทนต์โปรโมทและกราฟิกทั่วไปเท่านั้น (โพสต์โปรโมชั่น ป้ายราคา คำคม) ไม่ใช้สร้างภาพจำลองอาหาร หน้าร้าน หรือพนักงานจริงของร้าน — ป้องกันไม่ให้ลูกค้าปลายทางเข้าใจผิดว่าเป็นภาพถ่ายจริง',
              en: "Used only for promotional content and general graphics (promo posts, price signs, quote cards) — never AI-generated food, storefront, or staff photos, so end customers are never misled into thinking it's a real photo.",
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
