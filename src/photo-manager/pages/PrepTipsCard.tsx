import { useState } from 'react'
import { defaultPrepTipsEn, isDefaultPrepTips, parsePrepTips, resolvedPrepTips } from '../lib/prepTips'
import type { Client } from '../types'

function TipBlocks({ raw }: { raw: string }) {
  const sections = parsePrepTips(raw)
  if (!sections.length) return null
  return (
    <>
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
    </>
  )
}

export function PrepTipsCard({ client }: { client: Client }) {
  const [lang, setLang] = useState<'th' | 'en'>('th')
  const th = resolvedPrepTips(client)
  const en = defaultPrepTipsEn(client.type)
  const raw = lang === 'en' ? en : th
  const custom = !isDefaultPrepTips(client.prepTips, client.type)
  if (!parsePrepTips(th).length && !parsePrepTips(en).length) return null
  return (
    <aside className="prep-tips">
      <div className="prep-tips-top">
        <h4>{lang === 'en' ? 'Prep tips from the team' : '📸 เคล็ดลับเตรียมตัวจากทีมงาน'}</h4>
        <div className="prep-lang" role="group" aria-label="Language">
          <button type="button" className={lang === 'th' ? 'on' : ''} onClick={() => setLang('th')}>
            TH
          </button>
          <button type="button" className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>
            EN
          </button>
        </div>
      </div>
      <p className="prep-tips-lead">
        {lang === 'en'
          ? custom
            ? 'Standard English guidance — the Thai notes may include extras for this job.'
            : 'From real shoot days — a light read, nothing to memorise.'
          : 'แนะนำจากประสบการณ์ถ่ายจริง — อ่านเล่นได้ ไม่ต้องท่อง'}
      </p>
      <TipBlocks raw={raw} />
    </aside>
  )
}
