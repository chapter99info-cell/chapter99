import { Link } from 'react-router-dom';
import { useTranslation } from '../cinematic/i18n/LanguageContext';
import { siteMedia } from './media';

const shops = [
  {
    to: '/massage',
    glow: 'orange',
    photo: siteMedia.hero,
    title: { th: 'ร้านนวด', en: 'Massage' },
    body: {
      th: 'ภาพร้าน จองคิว ยืนยันนัด และงานประจำวันที่ทีมเห็นตรงกัน',
      en: 'Shop look, booking, confirmation and a queue the team can share.',
    },
  },
  {
    to: '/restaurants',
    glow: 'pink',
    photo: siteMedia.restaurant,
    title: { th: 'ร้านอาหาร', en: 'Restaurants' },
    body: {
      th: 'เมนู ภาพอาหาร การค้นพบร้าน และขั้นตอนรับเงินตามขอบเขตที่ตกลง',
      en: 'Menu, food photos, discovery and payment steps within the agreed scope.',
    },
  },
  {
    to: '/beauty',
    glow: 'cyan',
    photo: siteMedia.booking,
    title: { th: 'ความงาม', en: 'Beauty' },
    body: {
      th: 'ผลงาน การจอง และข้อความก่อน/หลังบริการ โดยไม่กล่าวว่าระบบร้านพร้อมใช้แล้ว',
      en: 'Work photos, booking and before/after messages — not a live salon platform.',
    },
  },
  {
    to: '/cleaning',
    glow: 'green',
    photo: siteMedia.system,
    title: { th: 'ทำความสะอาด', en: 'Cleaning' },
    body: {
      th: 'สอบถามขอบเขต นัดหมาย และแม่แบบใบเสนอราคาใน Toolkit',
      en: 'Scoping, appointments and quote templates in the Toolkit.',
    },
  },
  {
    to: '/photography',
    glow: 'blue',
    photo: siteMedia.photography,
    title: { th: 'ภาพถ่าย', en: 'Photography' },
    body: {
      th: 'งานภาพของ Chapter99 ไปใช้บนเว็บและเส้นทางลูกค้า ไม่ใช่แอปจ้างช่างภาพ',
      en: 'Chapter99 photography used on the site and customer path — not a photographer app.',
    },
  },
] as const;

export function ShopGlowGrid() {
  const { t } = useTranslation();
  return (
    <div className="v2-glow-grid">
      {shops.map((item) => (
        <Link key={item.to} className="glow-card" data-glow={item.glow} to={item.to}>
          <span className="glow-slab" aria-hidden="true" />
          <img className="glow-thumb" src={item.photo} alt="" />
          <span className="glow-face">
            <strong>{t(item.title)}</strong>
            <p>{t(item.body)}</p>
            <span className="glow-btn">{t({ th: 'ดูแนวทาง', en: 'Read more' })}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
