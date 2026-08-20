import { parsePrepTips, resolvedPrepTips } from '../lib/prepTips'
import type { Client } from '../types'

export function PrepTipsCard({ client }: { client: Client }) {
  const raw = resolvedPrepTips(client)
  const sections = parsePrepTips(raw)
  if (!sections.length) return null
  return (
    <aside className="prep-tips">
      <h4>📸 เคล็ดลับเตรียมตัวจากทีมงาน</h4>
      <p className="prep-tips-lead">แนะนำจากประสบการณ์ถ่ายจริง — อ่านเล่นได้ ไม่ต้องท่อง</p>
      {sections.map((s) => (
        <div key={s.heading || s.items[0]} className="prep-tips-block">
          {s.heading ? <div className="prep-tips-h">{s.heading}</div> : null}
          {s.items.length > 0 && (
            <ul>
              {s.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </aside>
  )
}
