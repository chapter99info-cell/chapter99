import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  BACKEND_MODULES,
  RATE_META,
  activeQuoteScope,
  calculateQuote,
  mergeQuoteRates,
  professionLabel,
  professionOptionsForKind,
  resolveProjectKind,
  scopeFromClient,
  toQuoteDraft,
} from '../lib/quoteCalc'
import { money } from '../lib/money'
import { usePhotoStore } from '../store/StoreContext'
import type { QuoteCalcScope, QuoteProfession, QuoteProjectKind, QuoteRate } from '../types'
import { ClientSelect, PageTitle } from './ui'

export default function QuoteCalculatorPage() {
  const { isOwner, clients, data, patchClient, saveQuoteRates } = usePhotoStore()
  const [params] = useSearchParams()
  const [clientId, setClientId] = useState(params.get('client') || clients[0]?.id || '')
  const client = clients.find((c) => c.id === clientId) ?? clients[0]
  const [scope, setScope] = useState<QuoteCalcScope>(() => scopeFromClient(client))
  const [rates, setRates] = useState<QuoteRate[]>(() => mergeQuoteRates(data.quoteRates))
  const [saved, setSaved] = useState('')
  const [ratesOpen, setRatesOpen] = useState(false)

  useEffect(() => {
    setRates(mergeQuoteRates(data.quoteRates))
  }, [data.quoteRates])

  useEffect(() => {
    if (!client) return
    setScope(scopeFromClient(client))
  }, [client?.id])

  const projectKind = resolveProjectKind(scope)
  const result = useMemo(() => calculateQuote(activeQuoteScope(scope), rates), [scope, rates])
  const subtypeOptions = professionOptionsForKind(projectKind, scope.profession)
  const showPhoto = projectKind !== 'website'
  const showWeb = projectKind !== 'photography'

  if (!isOwner) return <p>หน้านี้สำหรับเจ้าของเท่านั้น</p>
  if (!client) return <p>ยังไม่มีลูกค้า — เพิ่มลูกค้าก่อนแล้วค่อยคำนวณใบเสนอราคา</p>

  function patchScope(p: Partial<QuoteCalcScope>) {
    setScope((s) => ({ ...s, ...p }))
    setSaved('')
  }

  function setProjectKind(kind: QuoteProjectKind) {
    patchScope({ projectKind: kind })
  }

  async function saveDraft() {
    const draft = toQuoteDraft(scope, rates)
    const expiry =
      client.quote.expiryISO ||
      (() => {
        const d = new Date()
        d.setDate(d.getDate() + 14)
        return d.toISOString().slice(0, 10)
      })()
    await patchClient(client.id, {
      customPrice: draft.setupIntro,
      quote: {
        ...client.quote,
        expiryISO: expiry,
        issued: true,
        calculator: draft,
      },
    })
    setSaved('บันทึกเป็นใบเสนอราคาฉบับร่างแล้ว — เปิดหน้าใบเสนอราคาได้เลย')
  }

  return (
    <>
      <PageTitle sub="ใส่สโคปจริง แล้วได้ราคาเริ่มต้นต่ำ (×0.7) คู่กับราคาเต็มเป็นจุดอ้างอิง — ไม่ใช้แพ็ก 3 ขั้น">
        ตัวคำนวณใบเสนอราคา
      </PageTitle>

      <div className="card">
        <div className="field">
          <label>ประเภทงาน / Project type</label>
          <div className="kind-toggle" role="group" aria-label="ประเภทงาน">
            <button
              type="button"
              className={projectKind === 'photography' ? 'on' : ''}
              onClick={() => setProjectKind('photography')}
            >
              งานถ่ายภาพ
            </button>
            <button type="button" className={projectKind === 'website' ? 'on' : ''} onClick={() => setProjectKind('website')}>
              งานเว็บไซต์
            </button>
            <button
              type="button"
              className={`kind-toggle-all ${projectKind === 'combined' ? 'on' : ''}`}
              onClick={() => setProjectKind('combined')}
            >
              ถ่ายภาพ + เว็บไซต์
            </button>
          </div>
        </div>
        <div className="grid2">
          <div className="field">
            <label>ผูกกับลูกค้า</label>
            <ClientSelect
              clients={clients}
              value={client.id}
              onChange={(id) => {
                setClientId(id)
                setSaved('')
              }}
            />
          </div>
          <div className="field">
            <label>
              {projectKind === 'photography'
                ? 'ประเภทงานถ่ายภาพ'
                : projectKind === 'website'
                  ? 'ประเภทธุรกิจ'
                  : 'อาชีพ / ประเภทธุรกิจ'}
            </label>
            <select
              value={scope.profession}
              onChange={(e) => patchScope({ profession: e.target.value as QuoteProfession })}
            >
              {subtypeOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {scope.profession === 'other' && (
          <div className="field">
            <label>ระบุประเภทธุรกิจ</label>
            <input
              value={scope.professionOther}
              onChange={(e) => patchScope({ professionOther: e.target.value })}
              placeholder="เช่น ร้านกาแฟ, คลินิก"
            />
          </div>
        )}
      </div>

      {showPhoto && (
        <div className="card">
          <h3>สโคปถ่ายภาพ</h3>
          <div className="grid2">
            <div className="field">
              <label>ชั่วโมงที่ต้องถ่าย ({scope.photoHours} ชม.)</label>
              <input
                type="range"
                min={0}
                max={12}
                step={0.5}
                value={scope.photoHours}
                onChange={(e) => patchScope({ photoHours: Number(e.target.value) })}
              />
              <input
                type="number"
                min={0}
                step={0.5}
                value={scope.photoHours}
                onChange={(e) => patchScope({ photoHours: Number(e.target.value) })}
              />
            </div>
            <div className="field">
              <label>จำนวนภาพส่งมอบ ({scope.photoCount} ภาพ) — บันทึกในสโคป ไม่คิดราคาเพิ่ม</label>
              <input
                type="range"
                min={0}
                max={300}
                step={5}
                value={scope.photoCount}
                onChange={(e) => patchScope({ photoCount: Number(e.target.value) })}
              />
              <input
                type="number"
                min={0}
                value={scope.photoCount}
                onChange={(e) => patchScope({ photoCount: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>
      )}

      {showWeb && (
        <>
          <div className="card">
            <h3>สโคปเว็บไซต์</h3>
            <div className="field">
              <label>จำนวนหน้า ({scope.webPages})</label>
              <input
                type="range"
                min={0}
                max={12}
                step={1}
                value={scope.webPages}
                onChange={(e) => patchScope({ webPages: Number(e.target.value) })}
              />
            </div>
            <label className="addon">
              <input
                type="checkbox"
                checked={scope.webBooking}
                onChange={(e) => patchScope({ webBooking: e.target.checked })}
              />
              <span>ต้องการฟอร์มจองคิว</span>
            </label>
            <label className="addon">
              <input
                type="checkbox"
                checked={scope.webGallery}
                onChange={(e) => patchScope({ webGallery: e.target.checked })}
              />
              <span>ต้องการแกลเลอรี</span>
            </label>
            <label className="addon">
              <input
                type="checkbox"
                checked={scope.webBilingual}
                onChange={(e) => patchScope({ webBilingual: e.target.checked })}
              />
              <span>ต้องการสองภาษา (ไทย+อังกฤษ)</span>
            </label>
          </div>

          <div className="card">
            <h3>สโคประบบหลังบ้าน (รายเดือน)</h3>
            {BACKEND_MODULES.map((m) => {
              const on = scope.modules.includes(m.id)
              const rate = rates.find((r) => r.id === m.rateId)?.amount ?? 15
              return (
                <label key={m.id} className="addon">
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={(e) => {
                      const modules = e.target.checked
                        ? [...scope.modules, m.id]
                        : scope.modules.filter((id) => id !== m.id)
                      patchScope({ modules })
                    }}
                  />
                  <span>
                    {m.label} — {money(rate)}/เดือน
                  </span>
                </label>
              )
            })}
          </div>
        </>
      )}

      <div className="card">
        <h3>ผลลัพธ์สำหรับ {client.name}</h3>
        <p className="muted">
          {projectKind === 'photography' ? 'งานถ่ายภาพ' : 'งานเว็บไซต์'} · {professionLabel(scope)}
        </p>
        <div className="calc-pair">
          <div className="calc-lead">
            <div className="label">ราคาเริ่มต้นแนะนำ</div>
            <div className="value">{money(result.setupIntro)}</div>
            {result.monthlyIntro > 0 && <div className="muted">+ {money(result.monthlyIntro)}/เดือน</div>}
            <div className="muted">ราคานำคุยครั้งแรก (สโคป × {result.factor})</div>
          </div>
          <div className="calc-anchor">
            <div className="label">ราคาเต็มตามสโคป</div>
            <div className="value">{money(result.setupFull)}</div>
            {result.monthlyFull > 0 && <div className="muted">+ {money(result.monthlyFull)}/เดือน</div>}
            <div className="muted">จุดอ้างอิง — ไม่ใช่ตัวเลขที่เปิดคุย</div>
          </div>
        </div>
        {result.lines.length > 0 && (
          <table style={{ marginTop: 16 }}>
            <thead>
              <tr>
                <th>รายการ</th>
                <th>ยอด</th>
              </tr>
            </thead>
            <tbody>
              {result.lines.map((l) => (
                <tr key={l.label}>
                  <td>
                    {l.label}
                    {l.kind === 'monthly' ? ' /เดือน' : ''}
                  </td>
                  <td className="mono">{money(l.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {showWeb && result.laterModules.length > 0 && (
          <div style={{ marginTop: 18 }}>
            <h3>สิ่งที่เพิ่มได้ทีหลัง</h3>
            <ul className="later-list">
              {result.laterModules.map((m) => (
                <li key={m.id}>
                  {m.label} — {money(m.amount)}/เดือน
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="row" style={{ marginTop: 16 }}>
          <button className="btn" type="button" onClick={() => void saveDraft()}>
            บันทึกเป็นฉบับร่างของลูกค้านี้
          </button>
          <Link className="btn ghost sm" to={`/pm/quote?client=${client.id}`}>
            เปิดใบเสนอราคา
          </Link>
        </div>
        {saved && <p className="muted" style={{ marginTop: 10 }}>{saved}</p>}
      </div>

      <div className="card">
        <button className="btn ghost sm" type="button" onClick={() => setRatesOpen((v) => !v)}>
          {ratesOpen ? 'ซ่อนเรทราคา' : 'แก้เรทราคา (ตั้งค่า)'}
        </button>
        {ratesOpen && (
          <div style={{ marginTop: 16 }}>
            <p className="muted">บันทึกลงตารางตั้งค่า — ใบเสนอราคาที่เซฟแล้วใช้เรท ณ วันนั้น ไม่ถูกแก้ย้อนหลัง</p>
            {RATE_META.map((m) => {
              const row = rates.find((r) => r.id === m.id)
              return (
                <div key={m.id} className="grid2" style={{ alignItems: 'end' }}>
                  <div className="field">
                    <label>
                      {m.label} ({m.unit})
                    </label>
                    <input
                      type="number"
                      step={m.id === 'intro_factor' ? 0.05 : 1}
                      value={row?.amount ?? 0}
                      onChange={(e) =>
                        setRates(rates.map((r) => (r.id === m.id ? { ...r, amount: Number(e.target.value) } : r)))
                      }
                    />
                  </div>
                </div>
              )
            })}
            <button
              className="btn sm"
              type="button"
              onClick={() =>
                saveQuoteRates(rates).then(() => setSaved('บันทึกเรทราคาแล้ว — ใช้กับงานคำนวณใหม่ทันที'))
              }
            >
              บันทึกเรท
            </button>
          </div>
        )}
      </div>
    </>
  )
}
