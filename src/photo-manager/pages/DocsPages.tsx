import { useState } from 'react'
import { contractText } from '../lib/contract'
import { invoiceTotals, money } from '../lib/money'
import { usePhotoStore } from '../store/StoreContext'
import type { Client, PaymentMethod } from '../types'
import { BrandMark } from './BrandMark'
import { ClientSelect, PageTitle } from './ui'

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
        <label>Add-ons (บวกบนราคาฐานเสมอ)</label>
        {data.addons.map((a) => (
          <label key={a.id} className="addon">
            <input
              type="checkbox"
              checked={client.addonIds.includes(a.id)}
              onChange={(e) => {
                const ids = e.target.checked
                  ? [...client.addonIds, a.id]
                  : client.addonIds.filter((id) => id !== a.id)
                onPatch({ addonIds: ids })
              }}
            />
            <span>
              {a.name} — {money(a.price)}
              {a.suggestsExpense && isOwner && (
                <span className="muted">
                  {' '}
                  · รายได้ลูกค้า {money(a.price)} ไม่ใช่ต้นทุนจ้าง (~{money(a.suggestsExpense.typicalAmount)})
                </span>
              )}
            </span>
          </label>
        ))}
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
  const link = `${window.location.origin}/pm/confirm/${client.confirmToken}?k=contract`

  return (
    <>
      <PageTitle sub="เลือกลูกค้าและแพ็กเกจ ระบบร่างสัญญาให้อัตโนมัติ (เนื้อหาอิงจากสัญญาจริง)">ร่างสัญญางานถ่ายภาพ</PageTitle>
      <div className="card">
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
      <div className="card">
        <h3>ตัวอย่างสัญญา</h3>
        <div style={{ marginBottom: 12 }}>
          <BrandMark jobType={client.type} />
        </div>
        <div className="doc-preview">{text}</div>
        <div className="row" style={{ marginTop: 14 }}>
          <div className="muted">ลงนามโดย Chapter99 Photography (Saen)</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn ghost sm" onClick={() => navigator.clipboard.writeText(text)}>
              คัดลอกข้อความ
            </button>
            <button className="btn sm" onClick={() => window.print()}>
              พิมพ์ / PDF
            </button>
          </div>
        </div>
        <div className="link-box">
          <span>🔗</span>
          <span className="url">{link}</span>
          <a className="btn ghost sm" href={link} target="_blank" rel="noreferrer">
            เปิดหน้าที่ลูกค้าเห็น
          </a>
          <span className={`confirm-status ${client.contractConfirmed ? 'confirmed' : 'waiting'}`}>
            {client.contractConfirmed ? '✓ ลูกค้ายืนยันแล้ว' : '● รอลูกค้ายืนยัน'}
          </span>
        </div>
      </div>
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
  return (
    <>
      <div className="inv-head">
        <div>
          <BrandMark jobType={client.type} />
          <div className="tagline">chapter99studio.mypixieset.com · ABN on request · AUD</div>
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
              <td>{a.name}</td>
              <td>1</td>
              <td>{money(a.price / 1.1)}</td>
              <td>{money(a.price / 1.1)}</td>
            </tr>
          ))}
          <tr>
            <td>Online gallery</td>
            <td>Included</td>
            <td>Included</td>
            <td>Included</td>
          </tr>
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
          {kind === 'invoice' && (
            <tr className="inv-total-row">
              <td colSpan={3}>Total to pay</td>
              <td>{money(t.totalToPay)}</td>
            </tr>
          )}
          {kind === 'quote' && (
            <tr className="inv-total-row">
              <td colSpan={3}>Quoted total (inc. GST)</td>
              <td>{money(t.gstInclusive)}</td>
            </tr>
          )}
        </tbody>
      </table>
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
      <PageTitle sub="รวม GST 10% อัตโนมัติ · ค่าธรรมเนียมวิธีจ่ายแสดงเป็นบรรทัดแยก">ใบแจ้งหนี้</PageTitle>
      <div className="card">
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
        <div className="banner">
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
      <div className="card">
        <DocPreview client={client} kind="invoice" />
        <div className="row" style={{ marginTop: 14 }}>
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
          <div className="muted">
            บันทึกจ่ายแล้ว {client.payment.paidAt} · {client.payment.method} · {client.payment.reference || '—'}
          </div>
        )}
      </div>
    </>
  )
}

export function QuotePage() {
  const { clients, patchClient } = usePhotoStore()
  const [id, setId] = useState(clients[0]?.id ?? '')
  const client = clients.find((c) => c.id === id) ?? clients[0]
  const defaultExpiry = (() => {
    const d = new Date()
    d.setDate(d.getDate() + 14)
    return d.toISOString().slice(0, 10)
  })()
  if (!client) return <p>ยังไม่มีลูกค้า</p>

  return (
    <>
      <PageTitle sub="ใบเสนอราคาก่อนจอง — ไม่มีผลผูกพัน มีวันหมดอายุ">ใบเสนอราคา</PageTitle>
      <div className="card">
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
        <PriceControls client={client} onPatch={(p) => patchClient(client.id, p)} />
        <GstLines client={client} />
      </div>
      <div className="card">
        <DocPreview client={client} kind="quote" />
        <div className="row" style={{ marginTop: 14 }}>
          <div className="muted">ลูกค้ายังไม่ต้องชำระ — ใช้ส่งเปรียบเทียบก่อนเซ็นสัญญา</div>
          <button className="btn sm" onClick={() => window.print()}>
            พิมพ์ / PDF
          </button>
        </div>
      </div>
    </>
  )
}
