import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CATS, TOOLS, type ToolCat } from '../../lib/toolkit/catalog'
import { ToolkitShell } from '../../components/toolkit/ToolkitShell'
import { useTranslation } from '../../cinematic/i18n/LanguageContext'

export function ToolkitHubPage() {
  return (
    <ToolkitShell title={{ th: 'เครื่องมือธุรกิจฟรี', en: 'Free Business Toolkit' }} opened="toolkit">
      <ToolkitHubInner />
    </ToolkitShell>
  )
}

function ToolkitHubInner() {
  const { t } = useTranslation()
  const [filter, setFilter] = useState<'All' | ToolCat>('All')
  const list = TOOLS.filter((x) => filter === 'All' || x.cat === filter)
  return (
    <>
      <p className="hp-eyebrow" style={{ letterSpacing: '0.2em', fontSize: 12, color: '#5f6b63' }}>
        Chapter99
      </p>
      <h1 style={{ margin: '10px 0' }}>{t({ th: 'เครื่องมือธุรกิจฟรี', en: 'Free Business Toolkit' })}</h1>
      <p style={{ fontFamily: 'Georgia, serif', fontSize: 22, margin: '0 0 6px' }}>
        {t({ th: 'เครื่องมือง่าย ๆ ช่วยให้บริหารธุรกิจดีขึ้น', en: 'Simple tools to help run your business better.' })}
      </p>
      <p className="tk-muted" style={{ margin: '0 0 28px' }}>
        {t({
          th: 'เครื่องมือใช้งานจริง สร้างมาสำหรับเจ้าของธุรกิจไทยในออสเตรเลีย — ไม่ต้องสมัครสมาชิก',
          en: 'Practical tools built for Thai business owners in Australia. No account needed.',
        })}
      </p>
      <div className="tk-filters" role="group" aria-label={t({ th: 'กรองเครื่องมือ', en: 'Filter tools' })}>
        {CATS.map((c) => (
          <button
            key={c.id}
            type="button"
            className="tk-chip"
            aria-pressed={filter === c.id}
            onClick={() => setFilter(c.id)}
          >
            {t({ th: c.th, en: c.en })}
          </button>
        ))}
      </div>
      <div className="tk-cards">
        {list.map((tool) => (
          <Link key={tool.id} className="tk-card" to={tool.href}>
            <div className="ic" aria-hidden="true">
              {tool.icon}
            </div>
            <span className="cat">{t({ th: CATS.find((c) => c.id === tool.cat)?.th ?? tool.cat, en: tool.cat })}</span>
            <h3>{t(tool.name)}</h3>
            <p>{t(tool.desc)}</p>
            <span className="go">{t({ th: 'เปิดเครื่องมือ', en: 'Open tool' })} →</span>
          </Link>
        ))}
      </div>
    </>
  )
}
