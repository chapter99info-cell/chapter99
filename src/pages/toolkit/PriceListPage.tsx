import { useState } from 'react'
import { ConversionBridge } from '../../components/toolkit/ConversionBridge'
import { copyText, Crumb, ToolkitShell } from '../../components/toolkit/ToolkitShell'
import { track } from '../../lib/toolkit/analytics'
import { fmtPrice } from '../../lib/toolkit/messageBuilder'
import { useTranslation } from '../../cinematic/i18n/LanguageContext'

type Row = { name: string; price: string; dur: string; desc: string }

export function PriceListPage() {
  return (
    <ToolkitShell title={{ th: 'ตัวช่วยจัดรายการราคา', en: 'Price List Builder' }} opened="price-list">
      <PriceListInner />
    </ToolkitShell>
  )
}

function PriceListInner() {
  const { t } = useTranslation()
  const [biz, setBiz] = useState('')
  const [type, setType] = useState('')
  const [items, setItems] = useState<Row[]>([{ name: '', price: '', dur: '', desc: '' }])
  const [bridge, setBridge] = useState(false)
  const rows = items.filter((x) => x.name.trim())

  function update(i: number, key: keyof Row, value: string) {
    setItems((cur) => cur.map((row, n) => (n === i ? { ...row, [key]: value } : row)))
  }

  function textList() {
    let s = `${biz || 'Price List'}${type ? `\n${type}` : ''}\n${'—'.repeat(20)}\n`
    rows.forEach((x) => {
      s += `${x.name.trim()}${x.dur.trim() ? ` (${x.dur.trim()})` : ''}${fmtPrice(x.price) ? ` — ${fmtPrice(x.price)}` : ''}${x.desc.trim() ? `\n  ${x.desc.trim()}` : ''}\n`
    })
    return s.trim()
  }

  return (
    <>
      <Crumb />
      <h1>{t({ th: 'ตัวช่วยจัดรายการราคา', en: 'Price List Builder' })}</h1>
      <p className="tk-muted">
        {t({
          th: 'ใส่รายการและราคาของคุณ แล้วได้รายการราคาที่จัดรูปแบบสวยงาม — เครื่องมือนี้จัดรูปแบบเท่านั้น ไม่แนะนำว่าควรตั้งราคาเท่าไร',
          en: 'Enter your items and prices and get a clean, formatted price list. This tool only formats — it never suggests what to charge.',
        })}
      </p>
      <div className="tk-tool">
        <div className="tk-panel">
          <div className="tk-field">
            <label htmlFor="plBiz">{t({ th: 'ชื่อธุรกิจ', en: 'Business name' })}</label>
            <input id="plBiz" type="text" autoComplete="off" value={biz} onChange={(e) => setBiz(e.target.value)} />
          </div>
          <div className="tk-field">
            <label htmlFor="plType">{t({ th: 'ประเภทธุรกิจ', en: 'Business type' })}</label>
            <input id="plType" type="text" value={type} onChange={(e) => setType(e.target.value)} />
          </div>
          {items.map((it, i) => (
            <div className="tk-prow" key={i}>
              <div className="g">
                <div>
                  <label htmlFor={`pn${i}`}>{t({ th: 'ชื่อบริการ / สินค้า', en: 'Service / Product name' })}</label>
                  <input id={`pn${i}`} type="text" value={it.name} onChange={(e) => update(i, 'name', e.target.value)} />
                </div>
                <div>
                  <label htmlFor={`pp${i}`}>{t({ th: 'ราคา', en: 'Price' })}</label>
                  <input id={`pp${i}`} type="text" inputMode="decimal" value={it.price} onChange={(e) => update(i, 'price', e.target.value)} />
                </div>
                <div>
                  <label htmlFor={`pd${i}`}>{t({ th: 'ระยะเวลา', en: 'Duration' })}</label>
                  <input id={`pd${i}`} type="text" value={it.dur} onChange={(e) => update(i, 'dur', e.target.value)} />
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <label htmlFor={`pe${i}`}>{t({ th: 'รายละเอียด', en: 'Description' })}</label>
                <input id={`pe${i}`} type="text" value={it.desc} onChange={(e) => update(i, 'desc', e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', marginTop: 10 }}>
                <button type="button" className="tk-ib" aria-label="Move up" disabled={i === 0} onClick={() => setItems((c) => { const n = [...c]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; return n })}>↑</button>
                <button type="button" className="tk-ib" aria-label="Move down" disabled={i === items.length - 1} onClick={() => setItems((c) => { const n = [...c]; [n[i + 1], n[i]] = [n[i], n[i + 1]]; return n })}>↓</button>
                <button type="button" className="tk-ib" aria-label="Remove" disabled={items.length === 1} onClick={() => setItems((c) => c.filter((_, n) => n !== i))}>✕</button>
              </div>
            </div>
          ))}
          <button type="button" className="tk-btn" onClick={() => { setItems((c) => [...c, { name: '', price: '', dur: '', desc: '' }]); track('tool_opened', { tool: 'price-list', action: 'add_item' }) }}>
            + {t({ th: 'เพิ่มรายการ', en: 'Add Item' })}
          </button>
        </div>
        <div className="tk-panel">
          <h3>{t({ th: 'ตัวอย่างรายการราคา', en: 'Preview' })}</h3>
          <div id="plPrint" className="tk-pl">
            {!rows.length ? (
              <div className="tk-empty">{t({ th: 'เพิ่มรายการเพื่อดูตัวอย่าง', en: 'Add an item to see your price list.' })}</div>
            ) : (
              <>
                <h4>{biz || 'Price List'}</h4>
                <div className="sub">{type || 'Services & Prices'}</div>
                {rows.map((x) => (
                  <div className="it" key={x.name}>
                    <div className="n">
                      <b>{x.name}</b>
                      {x.dur.trim() ? <span> · {x.dur}</span> : null}
                      {x.desc.trim() ? <span style={{ display: 'block', color: '#5f6b63', fontSize: 13 }}>{x.desc}</span> : null}
                    </div>
                    <div className="p">{fmtPrice(x.price)}</div>
                  </div>
                ))}
                <div className="tk-muted" style={{ marginTop: 14, fontSize: 11.5 }}>Prices in AUD unless stated.</div>
              </>
            )}
          </div>
          <div className="tk-actions">
            <button
              type="button"
              className="tk-btn tk-btn-dark tk-btn-sm"
              onClick={() => {
                if (!rows.length) return
                copyText(textList(), 'price-list')
                track('tool_completed', { tool: 'price-list', items: rows.length })
                setBridge(true)
              }}
            >
              {t({ th: 'คัดลอก', en: 'Copy' })}
            </button>
            <button
              type="button"
              className="tk-btn tk-btn-sm"
              onClick={() => {
                if (!rows.length) return
                track('tool_completed', { tool: 'price-list', action: 'print' })
                window.print()
              }}
            >
              {t({ th: 'พิมพ์', en: 'Print' })}
            </button>
            <button type="button" className="tk-btn tk-btn-sm" disabled title="Later phase">
              {t({ th: 'ส่งออก PDF', en: 'PDF export' })} · soon
            </button>
          </div>
          {bridge ? <ConversionBridge tool="price-list" /> : null}
        </div>
      </div>
    </>
  )
}
