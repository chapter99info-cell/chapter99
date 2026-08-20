import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { contractText } from '../lib/contract'
import { addonUnitPrice, gstSplit, invoiceTotals, money } from '../lib/money'
import { professionLabel, resultFromDraft } from '../lib/quoteCalc'
import { usePhotoStore } from '../store/StoreContext'
import type { Client, PaymentMethod } from '../types'
import { BrandMark } from './BrandMark'
import { ClientConfirmBar, ClientSelect, PageTitle } from './ui'
import { PM_ABN } from '../lib/brand'

export function PriceControls({
  client,
  onPatch,
  showSurcharge,
}: {
  client: Client
  onPatch: (p: Partial<Client>) => void
  showSurcharge?: boolean
}) {
  const { data, isOwner } = usePhotoStore()
  const t = invoiceTotals(client, data.packages, data.addons)
  const [customStr, setCustomStr] = useState(client.customPrice != null ? String(client.customPrice) : '')

  return (
    <>
      {isOwner && (
      <div className="field">
        <label>ราคาที่ต่อรอง (AUD inc GST) — ว่างไว้ = ใช้ราคาแพ็กเกจ</label>
        <input
          type="number"
          placeholder={`มาตรฐาน ${money(t.standardBase)}`}
          value={customStr}
          onChange={(e) => {
            setCustomStr(e.target.value)
            const n = e.target.value === '' ? null : Number(e.target.value)
            onPatch({ customPrice: n })
          }}
        />
        {client.customPrice != null && (
          <div className="muted" style={{ marginTop: 6 }}>
            ราคามาตรฐาน {money(t.standardBase)} · ส่วนต่าง {t.discountDelta < 0 ? 'ส่วนลด' : 'บวกเพิ่ม'}{' '}
            {money(Math.abs(t.discountDelta))}
          </div>
        )}
      </div>
      )}
      <div className="field">
        <label>Add-ons (บวกบนราคาฐานเสมอ — แก้ราคาได้ต่องาน รวม 0 = ของแถม)</label>
        {data.addons.map((a) => {
          const on = client.addonIds.includes(a.id)
          const charged = addonUnitPrice(client, a)
          return (
            <label key={a.id} className="addon">
              <input
                type="checkbox"
                checked={on}
                onChange={(e) => {
                  if (e.target.checked) {
                    onPatch({
                      addonIds: [...client.addonIds, a.id],
                      addonPrices: { ...(client.addonPrices ?? {}), [a.id]: addonUnitPrice(client, a) },
                    })
                    return
                  }
                  const { [a.id]: _, ...rest } = client.addonPrices ?? {}
                  onPatch({ addonIds: client.addonIds.filter((id) => id !== a.id), addonPrices: rest })
                }}
              />
              <span style={{ flex: 1 }}>
                {a.name}
                {a.suggestsExpense && isOwner && (
                  <span className="muted">
                    {' '}
                    · รายได้ลูกค้า ไม่ใช่ต้นทุนจ้าง (~{money(a.suggestsExpense.typicalAmount)})
                  </span>
                )}
                {on && charged === 0 && <span className="muted"> · ของแถม / Complimentary</span>}
              </span>
              {on && (
                <input
                  type="number"
                  min={0}
                  step={1}
                  className="addon-price"
                  value={charged}
                  onChange={(ev) => {
                    const n = Number(ev.target.value)
                    onPatch({
                      addonPrices: { ...(client.addonPrices ?? {}), [a.id]: Number.isFinite(n) ? n : 0 },
                    })
                  }}
                />
              )}
            </label>
          )
        })}
      </div>
      {showSurcharge && (
        <div className="field">
          <label>วิธีชำระ (คิดค่าธรรมเนียมบนยอดรวม GST)</label>
          <select
            value={client.payment.method}
            onChange={(e) => onPatch({ payment: { ...client.payment, method: e.target.value as PaymentMethod } })}
          >
            <option value="bank">Bank transfer / PayID (0%)</option>
            <option value="card">Credit / debit card (+2%)</option>
            <option value="afterpay">Afterpay (+5%)</option>
          </select>
        </div>
      )}
    </>
  )
}

export function GstLines({ client, surcharge }: { client: Client; surcharge?: boolean }) {
  const { data } = usePhotoStore()
  const t = invoiceTotals(client, data.packages, data.addons)
  return (
    <div className="muted" style={{ marginBottom: 10 }}>
      ฐาน {money(t.base)} + add-ons {money(t.addonsTotal)} = {money(t.gstInclusive)} (ex GST {money(t.subtotal)} · GST{' '}
      {money(t.gst)})
      {surcharge && t.surcharge > 0 ? ` · surcharge ${money(t.surcharge)} → จ่าย ${money(t.totalToPay)}` : ''}
    </div>
  )
}

export function ContractPage() {
  const { clients, data, patchClient } = usePhotoStore()
  const [id, setId] = useState(clients[0]?.id ?? '')
  const client = clients.find((c) => c.id === id) ?? clients[0]
  const pkgs = data.packages.filter((p) => p.kind === (client?.type === 'engagement' ? 'engagement' : 'wedding'))

  if (!client) return <p>ยังไม่มีลูกค้า</p>
  const text = contractText(client, data.packages, data.addons)

  return (
    <>
      <div className="no-print">
        <PageTitle sub="เลือกลูกค้าและแพ็กเกจ ระบบร่างสัญญาให้อัตโนมัติ (เนื้อหาอิงจากสัญญาจริง)">ร่างสัญญางานถ่ายภาพ</PageTitle>
      </div>
      <div className="card no-print">
        <div className="field">
          <label>เลือกลูกค้า</label>
          <ClientSelect clients={clients} value={client.id} onChange={setId} />
        </div>
        {client.type === 'wedding' || client.type === 'engagement' ? (
          <>
            <h3>เลือกแพ็กเกจ</h3>
            <div className="pkg-grid">
              {pkgs.map((p) => (
                <button
                  key={p.id}
                  className={`pkg-card ${p.id === client.packageId ? 'selected' : ''}`}
                  onClick={() => patchClient(client.id, { packageId: p.id })}
                >
                  <div className="pname">{p.name}</div>
                  <div className="pprice">{money(p.price)}</div>
                  <ul>
                    {p.blurb.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="muted">งานประเภทนี้ใช้ราคาคงที่ {money(client.fixedPrice ?? 0)}</div>
        )}
        <PriceControls client={client} onPatch={(p) => patchClient(client.id, p)} />
        <GstLines client={client} />
      </div>
      <div className="card print-sheet">
        <h3 className="no-print">ตัวอย่างสัญญา</h3>
        <div style={{ marginBottom: 12 }}>
          <BrandMark jobType={client.type} />
        </div>
        <div className="doc-preview">{text}</div>
        <div className="row no-print" style={{ marginTop: 14 }}>
          <div className="muted">ลงนามโดย Chapter99 Photography (Saen)</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn ghost sm" onClick={() => navigator.clipboard.writeText(text)}>
              คัดลอกข้อความ
            </button>
            <button className="btn ghost sm" onClick={() => window.print()}>
              พิมพ์ / PDF
            </button>
          </div>
        </div>
        <ClientConfirmBar
          client={client}
          kind="contract"
          onEnsureToken={(token) => patchClient(client.id, { confirmToken: token })}
        />
      </div>
    </>
  )
}

function QuoteCalcRows({ client }: { client: Client }) {
  const d = client.quote.calculator
  if (!d) return null
  const calc = resultFromDraft(d)
  const discount = Math.max(0, d.setupFull - d.setupIntro)
  return (
    <>
      <tr>
        <td colSpan={4}>
          สโคป: {professionLabel(d)}
          {d.photoCount ? ` · ส่งมอบ ${d.photoCount} ภาพ` : ''}
        </td>
      </tr>
      {calc.lines
        .filter((l) => l.kind === 'setup')
        .map((l) => {
          const ex = gstSplit(l.amount).subtotal
          return (
            <tr key={l.label}>
              <td>{l.label}</td>
              <td>1</td>
              <td>{money(ex)}</td>
              <td>{money(ex)}</td>
            </tr>
          )
        })}
      {discount > 0 && (
        <tr>
          <td>ราคาเริ่มต้นแนะนำ (ส่วนต่างจากราคาเต็ม)</td>
          <td>1</td>
          <td>{money(-gstSplit(discount).subtotal)}</td>
          <td>{money(-gstSplit(discount).subtotal)}</td>
        </tr>
      )}
    </>
  )
}

function DocPreview({ client, kind }: { client: Client; kind: 'invoice' | 'quote' }) {
  const { data } = usePhotoStore()
  const t = invoiceTotals(client, data.packages, data.addons)
  const pkg = data.packages.find((p) => p.id === client.packageId)
  const invNo =
    (kind === 'quote' ? 'QT' : 'INV') + client.date.replace(/\s/g, '').slice(0, 6) + client.id.slice(-2)
  const title = kind === 'quote' ? 'Quotation' : 'Invoice'
  const depositPaid = client.deposit > 0 ? client.deposit : 0
  const balanceDue = Math.max(0, t.totalToPay - depositPaid)
  const dueLabel = client.date ? `Balance due on/before ${client.date}` : 'Balance due'
  return (
    <>
      <div className="inv-head">
        <div>
          <BrandMark jobType={client.type} showAddress={false} />
          <div className="tagline">chapter99studio.mypixieset.com · {PM_ABN} · AUD</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="inv-num">{title}</div>
          <div className="muted">
            #{invNo}
            <br />
            {kind === 'quote' && client.quote.expiryISO ? `Expires ${client.quote.expiryISO}` : 'วันนี้'}
          </div>
        </div>
      </div>
      {kind === 'quote' && (
        <div className="banner">เอกสารใบเสนอราคานี้ไม่มีผลผูกพันทางกฎหมาย — ใช้ก่อนลูกค้าตัดสินใจจองเท่านั้น</div>
      )}
      <div className="muted" style={{ marginBottom: 14 }}>
        <strong style={{ color: 'var(--ink)' }}>Client:</strong> {client.name}
        <br />
        {client.typeLabel} · {client.date} · {client.location}
      </div>
      <table className="inv-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Unit Price (ex GST)</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {kind === 'quote' && client.quote.calculator ? (
            <QuoteCalcRows client={client} />
          ) : (
            <>
          <tr>
            <td>
              {pkg ? `${pkg.name} — ${client.typeLabel}` : `Photography session — ${client.typeLabel}`}
              {client.customPrice != null && (
                <div className="muted">
                  Standard {money(t.standardBase)} · negotiated {money(t.base)}
                </div>
              )}
            </td>
            <td>{pkg ? `${pkg.hours} hrs` : 'Session'}</td>
            <td>{money(t.base / 1.1)}</td>
            <td>{money(t.base / 1.1)}</td>
          </tr>
          {t.addons.map((a) => (
            <tr key={a.id}>
              <td>{a.price === 0 ? `${a.name} (ของแถม / Complimentary)` : a.name}</td>
              <td>{a.price === 0 ? 'Gift' : '1'}</td>
              <td>{a.price === 0 ? 'Complimentary' : money(a.price / 1.1)}</td>
              <td>{a.price === 0 ? 'Complimentary' : money(a.price / 1.1)}</td>
            </tr>
          ))}
          <tr>
            <td>Online gallery</td>
            <td>Included</td>
            <td>Included</td>
            <td>Included</td>
          </tr>
            </>
          )}
          <tr>
            <td colSpan={3}>Subtotal</td>
            <td>{money(t.subtotal)}</td>
          </tr>
          <tr>
            <td colSpan={3}>GST (10%)</td>
            <td>{money(t.gst)}</td>
          </tr>
          <tr>
            <td colSpan={3}>Total (inc. GST)</td>
            <td>{money(t.gstInclusive)}</td>
          </tr>
          {kind === 'invoice' && t.surcharge > 0 && (
            <tr>
              <td colSpan={3}>Payment surcharge ({Math.round(t.surchargeRate * 100)}%)</td>
              <td>{money(t.surcharge)}</td>
            </tr>
          )}
          {kind === 'invoice' && depositPaid > 0 && (
            <tr className="inv-deposit">
              <td colSpan={3}>Deposit paid</td>
              <td>{money(-depositPaid)}</td>
            </tr>
          )}
          {kind === 'invoice' && (
            <tr className="inv-total-row">
              <td colSpan={3}>{dueLabel}</td>
              <td>{money(balanceDue)}</td>
            </tr>
          )}
          {kind === 'quote' && (
            <tr className="inv-total-row">
              <td colSpan={3}>{client.quote.calculator ? 'ราคาเริ่มต้นแนะนำ (inc. GST)' : 'Quoted total (inc. GST)'}</td>
              <td>{money(t.gstInclusive)}</td>
            </tr>
          )}
        </tbody>
      </table>
      {kind === 'quote' && client.quote.calculator && (
        <div className="muted" style={{ marginTop: 12, lineHeight: 1.7 }}>
          ราคาเต็มตามสโคป (จุดอ้างอิง): {money(client.quote.calculator.setupFull)}
          {client.quote.calculator.monthlyIntro > 0 && (
            <>
              <br />
              หลังบ้านที่เลือก: {money(client.quote.calculator.monthlyIntro)}/เดือน (ราคาเต็ม{' '}
              {money(client.quote.calculator.monthlyFull)}/เดือน)
            </>
          )}
          {resultFromDraft(client.quote.calculator).laterModules.length > 0 && (
            <>
              <br />
              สิ่งที่เพิ่มได้ทีหลัง:{' '}
              {resultFromDraft(client.quote.calculator)
                .laterModules.map((m) => `${m.label} ${money(m.amount)}/เดือน`)
                .join(' · ')}
            </>
          )}
        </div>
      )}
      <div className="inv-footer">
        <div>
          <h4>Payment Details</h4>
          <div>
            Bank / PayID — details on the live invoice
            <br />
            Account Name: Chapter99 Photography
            <br />
            Card and Afterpay are reconciled by Saen in Square / Afterpay (no gateway in this app).
          </div>
        </div>
        <div>
          <h4>Contact Info</h4>
          <div>
            Chapter99 Photography (Saen)
            <br />
            Forestville, Sydney NSW 2087
            <br />
            E: chapter99info@gmail.com
          </div>
        </div>
      </div>
      {kind === 'invoice' && (
        <p className="inv-terms">
          มัดจำไม่สามารถขอคืนได้ · เงื่อนไขการให้บริการทั้งหมดเป็นไปตามสัญญาที่ลูกค้าลงนามไว้
        </p>
      )}
    </>
  )
}

export function InvoicePage() {
  const { clients, patchClient, markPaid, addExpense, isOwner } = usePhotoStore()
  const [id, setId] = useState(clients[0]?.id ?? '')
  const [ref, setRef] = useState('')
  const [expensePrompt, setExpensePrompt] = useState(false)
  const client = clients.find((c) => c.id === id) ?? clients[0]
  if (!client) return <p>ยังไม่มีลูกค้า</p>

  const freelanceOn = client.addonIds.includes('freelance-video')

  return (
    <>
      <div className="no-print">
        <PageTitle sub="รวม GST 10% อัตโนมัติ · ค่าธรรมเนียมวิธีจ่ายแสดงเป็นบรรทัดแยก">ใบแจ้งหนี้</PageTitle>
      </div>
      <div className="card no-print">
        <div className="field" style={{ maxWidth: 360 }}>
          <label>เลือกลูกค้า</label>
          <ClientSelect clients={clients} value={client.id} onChange={setId} />
        </div>
        <PriceControls
          client={client}
          showSurcharge
          onPatch={(p) => {
            void patchClient(client.id, p)
            if (p.addonIds?.includes('freelance-video') && !client.addonIds.includes('freelance-video')) {
              setExpensePrompt(true)
            }
          }}
        />
        <GstLines client={client} surcharge />
      </div>
      {isOwner && expensePrompt && freelanceOn && (
        <div className="banner no-print">
          Add-on นี้เป็นรายได้จากลูกค้า $800 — ต้นทุนจ้างฟรีแลนซ์โดยเฉลี่ย ~$400 ควรลงใน Tax Summary แยกต่างหาก
          <div className="row" style={{ marginTop: 10 }}>
            <button
              className="btn sm"
              onClick={async () => {
                await addExpense({
                  dateISO: new Date().toISOString().slice(0, 10),
                  category: 'Freelancer / contractor',
                  description: `Freelance videographer for ${client.name}`,
                  amount: 400,
                  linkedClientId: client.id,
                  frequency: 'once',
                  endedISO: null,
                })
                setExpensePrompt(false)
              }}
            >
              ลงรายจ่าย $400
            </button>
            <button className="btn ghost sm" onClick={() => setExpensePrompt(false)}>
              ข้าม
            </button>
          </div>
        </div>
      )}
      <div className="card print-sheet">
        <DocPreview client={client} kind="invoice" />
        <div className="row no-print" style={{ marginTop: 14 }}>
          <div className="muted">เลขที่ใบแจ้งหนี้ออกอัตโนมัติ · ไม่เชื่อม Square/Afterpay — กระทบยอดจริงที่ Square Reader ของเจ้าของ</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {isOwner && (
              <>
                <input
                  style={{ width: 160 }}
                  placeholder="เลขอ้างอิง"
                  value={ref}
                  onChange={(e) => setRef(e.target.value)}
                />
                <button className="btn sm" onClick={() => markPaid(client.id, client.payment.method, ref)}>
                  ทำเครื่องหมายว่าจ่ายแล้ว
                </button>
              </>
            )}
            <button className="btn ghost sm" onClick={() => window.print()}>
              พิมพ์ / PDF
            </button>
          </div>
        </div>
        {client.payment.paidAt && (
          <div className="muted no-print">
            บันทึกจ่ายแล้ว {client.payment.paidAt} · {client.payment.method} · {client.payment.reference || '—'}
          </div>
        )}
      </div>
    </>
  )
}

export function QuotePage() {
  const { clients, patchClient } = usePhotoStore()
  const [params] = useSearchParams()
  const [id, setId] = useState(params.get('client') || clients[0]?.id || '')
  const client = clients.find((c) => c.id === id) ?? clients[0]
  const defaultExpiry = (() => {
    const d = new Date()
    d.setDate(d.getDate() + 14)
    return d.toISOString().slice(0, 10)
  })()
  if (!client) return <p>ยังไม่มีลูกค้า</p>

  return (
    <>
      <div className="no-print">
        <PageTitle sub="ใบเสนอราคาก่อนจอง — ไม่มีผลผูกพัน มีวันหมดอายุ">ใบเสนอราคา</PageTitle>
      </div>
      <div className="card no-print">
        <div className="grid2">
          <div className="field">
            <label>เลือกลูกค้า</label>
            <ClientSelect clients={clients} value={client.id} onChange={setId} />
          </div>
          <div className="field">
            <label>วันหมดอายุใบเสนอราคา</label>
            <input
              type="date"
              value={client.quote.expiryISO || defaultExpiry}
              onChange={(e) => patchClient(client.id, { quote: { ...client.quote, expiryISO: e.target.value, issued: true } })}
            />
          </div>
        </div>
        <div className="row" style={{ marginBottom: 12 }}>
          <Link className="btn ghost sm" to={`/pm/quote-calculator?client=${client.id}`}>
            ตัวคำนวณสโคป
          </Link>
          {client.quote.calculator && (
            <span className="muted">ใช้ราคาเริ่มต้นจากตัวคำนวณ {client.quote.calculator.savedAt}</span>
          )}
        </div>
        <PriceControls client={client} onPatch={(p) => patchClient(client.id, p)} />
        <GstLines client={client} />
      </div>
      <div className="card print-sheet">
        <DocPreview client={client} kind="quote" />
        <div className="row no-print" style={{ marginTop: 14 }}>
          <div className="muted">ลูกค้ายังไม่ต้องชำระ — ใช้ส่งเปรียบเทียบก่อนเซ็นสัญญา</div>
          <button className="btn sm" onClick={() => window.print()}>
            พิมพ์ / PDF
          </button>
        </div>
      </div>
    </>
  )
}
