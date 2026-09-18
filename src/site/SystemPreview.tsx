import { useTranslation } from '../cinematic/i18n/LanguageContext';

export type PreviewKind = 'shop' | 'restaurant' | 'beauty' | 'cleaning' | 'photo';

const copy: Record<PreviewKind, { brand: { th: string; en: string }; rows: { time: string; name: { th: string; en: string }; status: { th: string; en: string } }[] }> = {
  shop: {
    brand: { th: 'ธุรกิจตัวอย่าง · นวด', en: 'Sample shop · Massage' },
    rows: [
      { time: '10:00', name: { th: 'นวดไทย 60 นาที', en: 'Thai massage 60 min' }, status: { th: 'ยืนยันแล้ว', en: 'Confirmed' } },
      { time: '12:30', name: { th: 'ออยล์ 90 นาที', en: 'Oil massage 90 min' }, status: { th: 'ยืนยันแล้ว', en: 'Confirmed' } },
      { time: '15:00', name: { th: 'นวดผ่อนคลาย', en: 'Relaxation' }, status: { th: 'รอตรวจ', en: 'Pending' } },
    ],
  },
  restaurant: {
    brand: { th: 'ธุรกิจตัวอย่าง · ร้านอาหาร', en: 'Sample shop · Restaurant' },
    rows: [
      { time: '11:30', name: { th: 'จองโต๊ะ 4 ที่', en: 'Table for 4' }, status: { th: 'ยืนยันแล้ว', en: 'Confirmed' } },
      { time: '12:00', name: { th: 'สั่งกลับบ้าน', en: 'Takeaway' }, status: { th: 'กำลังทำ', en: 'In kitchen' } },
      { time: '18:30', name: { th: 'จองโต๊ะ 2 ที่', en: 'Table for 2' }, status: { th: 'รอตรวจ', en: 'Pending' } },
    ],
  },
  beauty: {
    brand: { th: 'ธุรกิจตัวอย่าง · ความงาม', en: 'Sample shop · Beauty' },
    rows: [
      { time: '10:00', name: { th: 'ต่อขนตาคลาสสิก', en: 'Classic lashes' }, status: { th: 'ยืนยันแล้ว', en: 'Confirmed' } },
      { time: '13:00', name: { th: 'เติมขนตา', en: 'Lash refill' }, status: { th: 'ยืนยันแล้ว', en: 'Confirmed' } },
      { time: '16:00', name: { th: 'ไฮบริดเซ็ต', en: 'Hybrid set' }, status: { th: 'รอตรวจ', en: 'Pending' } },
    ],
  },
  cleaning: {
    brand: { th: 'ธุรกิจตัวอย่าง · ทำความสะอาด', en: 'Sample shop · Cleaning' },
    rows: [
      { time: '08:30', name: { th: 'บ้าน 3 ห้องนอน', en: '3-bedroom home' }, status: { th: 'ยืนยันแล้ว', en: 'Confirmed' } },
      { time: '11:00', name: { th: 'ออฟฟิศชั้น 2', en: 'Office floor 2' }, status: { th: 'กำลังไป', en: 'En route' } },
      { time: '14:00', name: { th: 'ประเมินขอบเขตงาน', en: 'Scope visit' }, status: { th: 'รอตรวจ', en: 'Pending' } },
    ],
  },
  photo: {
    brand: { th: 'ธุรกิจตัวอย่าง · ภาพถ่าย', en: 'Sample shop · Photography' },
    rows: [
      { time: '09:30', name: { th: 'ถ่ายเมนูร้าน', en: 'Menu photography' }, status: { th: 'ยืนยันแล้ว', en: 'Confirmed' } },
      { time: '13:00', name: { th: 'ถ่ายบรรยากาศร้าน', en: 'Venue shoot' }, status: { th: 'ยืนยันแล้ว', en: 'Confirmed' } },
      { time: '16:00', name: { th: 'คัดภาพส่งลูกค้า', en: 'Client selects' }, status: { th: 'รอตรวจ', en: 'Pending' } },
    ],
  },
};

export function SystemPreview({ kind = 'shop' }: { kind?: PreviewKind }) {
  const { t } = useTranslation();
  const data = copy[kind];

  return (
    <aside className="sys-preview" aria-label={t({ th: 'ตัวอย่างหน้าจอ', en: 'Illustrative preview' })}>
      <p className="sys-badge">{t({ th: 'ตัวอย่างหน้าจอ · ตัวเลขสมมติ', en: 'Illustrative preview · sample numbers' })}</p>
      <div className="sys-card">
        <div className="sys-side">
          <strong>Chapter99</strong>
          <span>{t(data.brand)}</span>
          <ul>
            <li className="is-on">{t({ th: 'ภาพรวมงาน', en: 'Overview' })}</li>
            <li>{t({ th: 'คิววันนี้', en: "Today's queue" })}</li>
            <li>{t({ th: 'ลูกค้า', en: 'Customers' })}</li>
          </ul>
        </div>
        <div className="sys-main">
          <header>
            <h3>{t({ th: 'คิววันนี้', en: "Today's queue" })}</h3>
            <p>{t({ th: 'ไม่ใช่ระบบหลังบ้านที่เชื่อมอยู่', en: 'Not a live connected backend.' })}</p>
          </header>
          <div className="sys-kpis">
            <div>
              <small>{t({ th: 'นัดวันนี้', en: "Today's jobs" })}</small>
              <b>12</b>
            </div>
            <div>
              <small>{t({ th: 'ยืนยันแล้ว', en: 'Confirmed' })}</small>
              <b>8</b>
            </div>
            <div>
              <small>{t({ th: 'รอตรวจ', en: 'Pending' })}</small>
              <b>3</b>
            </div>
          </div>
          <ul className="sys-rows">
            {data.rows.map((row) => (
              <li key={row.time}>
                <span>{row.time}</span>
                <strong>{t(row.name)}</strong>
                <em>{t(row.status)}</em>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
