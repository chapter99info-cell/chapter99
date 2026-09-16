import { Camera, ClipboardCheck, FileCheck, Globe, HeartHandshake, Languages, Store, Users } from 'lucide-react'
import { useState } from 'react'

const items = [
  { id: 'th', label: 'คุยภาษาไทย', Icon: Languages },
  { id: 'shop', label: 'เริ่มจากวิธีทำงานของร้าน', Icon: Store },
  { id: 'preview', label: 'ตรวจตัวอย่างก่อนเปิดใช้', Icon: ClipboardCheck },
  { id: 'scope', label: 'ตกลงขอบเขตดูแลให้ชัด', Icon: FileCheck },
  { id: 'photo', label: 'ภาพที่เล่าเรื่องร้าน', Icon: Camera },
  { id: 'web', label: 'เว็บที่ลูกค้ากดง่าย', Icon: Globe },
  { id: 'team', label: 'งานหน้าร้านที่ทีมเข้าใจ', Icon: Users },
  { id: 'care', label: 'ดูแลต่อเมื่อพร้อม', Icon: HeartHandshake },
] as const

export function PromiseDock() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="promise-dock">
      <ul className="promise-dock-bar">
        {items.map((item) => {
          const Icon = item.Icon
          const hot = open === item.id
          return (
            <li key={item.id}>
              <button
                type="button"
                className={hot ? 'is-hot' : undefined}
                aria-describedby={`promise-${item.id}`}
                onMouseEnter={() => setOpen(item.id)}
                onMouseLeave={() => setOpen(null)}
                onFocus={() => setOpen(item.id)}
                onBlur={() => setOpen(null)}
              >
                <Icon strokeWidth={1.6} aria-hidden="true" />
                <span id={`promise-${item.id}`}>{item.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
