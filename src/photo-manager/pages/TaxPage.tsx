import { useMemo, useState } from 'react'
import { EXPENSE_PRESETS } from '../data/catalog'
import { addDaysISO, categoryTotals, expenseOverlapsYear, FREQ_LABEL, monthExpenseTotal, occurrencesInYear, yearExpenseTotal } from '../lib/expenses'
import { gstSplit, incomeReceipt, invoiceTotals, money } from '../lib/money'
import { usePhotoStore } from '../store/StoreContext'
import type { Expense, ExpenseFrequency } from '../types'
import { PageTitle } from './ui'

function BarLine({ months }: { months: { label: string; income: number; expense: number }[] }) {
  const max = Math.max(1, ...months.flatMap((m) => [m.income, m.expense]))
  return (
    <svg viewBox="0 0 640 220" width="100%" height="220" role="img" aria-label="Monthly income vs expenses">
      {months.map((m, i) => {
        const x = 20 + i * 52
        const ih = (m.income / max) * 160
        const eh = (m.expense / max) * 160
        return (
          <g key={m.label}>
            <rect x={x} y={180 - ih} width="16" height={ih} fill="#4f7a68" />
            <rect x={x + 18} y={180 - eh} width="16" height={eh} fill="#b5563c" />
            <text x={x + 16} y={198} fontSize="9" textAnchor="middle" fill="#8a8577">
              {m.label}
            </text>
          </g>
        )
      })}
      <polyline
        fill="none"
        stroke="#6f8fc2"
        strokeWidth="2"
        points={months.map((m, i) => `${28 + i * 52},${180 - (m.income / max) * 160}`).join(' ')}
      />
    </svg>
  )
}

function Donut({ parts }: { parts: { label: string; value: number }[] }) {
  const total = parts.reduce((s, p) => s + p.value, 0) || 1
  let acc = 0
  const colors = ['#4f7a68', '#6f8fc2', '#c9a227', '#b5563c', '#375a4c', '#8a8577', '#2f6b46', '#5a78ab']
  const arcs = parts.map((p, i) => {
    const start = acc / total
    acc += p.value
    const end = acc / total
    const a0 = start * Math.PI * 2 - Math.PI / 2
    const a1 = end * Math.PI * 2 - Math.PI / 2
    const large = end - start > 0.5 ? 1 : 0
    const r = 70
    const x0 = 90 + r * Math.cos(a0)
    const y0 = 90 + r * Math.sin(a0)
    const x1 = 90 + r * Math.cos(a1)
    const y1 = 90 + r * Math.sin(a1)
    return { d: `M90,90 L${x0},${y0} A${r},${r} 0 ${large} 1 ${x1},${y1} Z`, color: colors[i % colors.length], label: p.label, value: p.value }
  })
  return (
    <div className="row" style={{ alignItems: 'flex-start' }}>
      <svg viewBox="0 0 180 180" width="180" height="180">
        {arcs.map((a) => (
          <path key={a.label} d={a.d} fill={a.color} />
        ))}
        <circle cx="90" cy="90" r="38" fill="#faf8f2" />
      </svg>
      <div>
        {arcs.map((a) => (
          <div key={a.label} className="muted">
            <span style={{ color: a.color }}>●</span> {a.label} {money(a.value)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TaxPage() {
  const { isOwner, clients, expenses, data, addExpense, updateExpense, deleteExpense } = usePhotoStore()
  const thisYear = new Date().getFullYear()
  const [year, setYear] = useState(thisYear)
  const [preset, setPreset] = useState('')
  const [draft, setDraft] = useState({
    dateISO: new Date().toISOString().slice(0, 10),
    category: '',
    description: '',
    amount: '',
    frequency: 'once' as ExpenseFrequency,
  })

  const byCat = useMemo(() => categoryTotals(expenses, year), [expenses, year])

  if (!isOwner) {
    return <p>หน้านี้สำหรับเจ้าของเท่านั้น</p>
  }

  const yearClients = clients.filter((c) => new Date(c.dateISO).getFullYear() === year)
  const yearExpenses = expenses.filter((e) => expenseOverlapsYear(e, year))
  const income = yearClients.reduce((s, c) => {
    const t = invoiceTotals(c, data.packages, data.addons)
    if (c.status === 'paid') return s + t.gstInclusive
    return s + c.deposit
  }, 0)
  const gstOnIncome = gstSplit(income).gst
  const expenseSum = yearExpenseTotal(expenses, year)
  const net = income - expenseSum

  const months = Array.from({ length: 12 }, (_, i) => {
    const label = new Date(year, i, 1).toLocaleString('en-AU', { month: 'short' })
    const mi = yearClients.reduce((s, c) => {
      const d = new Date(c.dateISO)
      if (d.getMonth() !== i) return s
      const t = invoiceTotals(c, data.packages, data.addons)
      return s + (c.status === 'paid' ? t.gstInclusive : c.deposit)
    }, 0)
    return { label, income: mi, expense: monthExpenseTotal(expenses, year, i) }
  })

  function csv() {
    const lines = [
      'type,date,name,category,amount_inc_gst_aud,gst_aud,ex_gst_aud,status',
      ...yearClients.map((c) => {
        const t = invoiceTotals(c, data.packages, data.addons)
        const rec = incomeReceipt(c, data.packages, data.addons)
        return `income,${c.dateISO},"${c.name.replace(/"/g, '""')}",job,${t.gstInclusive.toFixed(2)},${t.gst.toFixed(2)},${t.subtotal.toFixed(2)},${rec}`
      }),
      ...yearExpenses.flatMap((e) =>
        occurrencesInYear(e, year).map((o) => {
          const split = gstSplit(o.amount)
          const freq = e.frequency && e.frequency !== 'once' ? ` (${e.frequency})` : ''
          return `expense,${o.dateISO},"${e.description.replace(/"/g, '""')}${freq}",${e.category},${o.amount.toFixed(2)},${split.gst.toFixed(2)},${split.subtotal.toFixed(2)},`
        }),
      ),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `chapter99-tax-${year}.csv`
    a.click()
  }

  return (
    <>
      <PageTitle sub="สรุปรายรับ-รายจ่าย AUD สำหรับนักบัญชี — ไม่ใช่คำแนะนำทางภาษี">สรุปภาษีประจำปี</PageTitle>
      <div className="banner">
        ตัวเลขนี้เป็นข้อมูลอ้างอิงทั่วไปตามหมวด ATO เท่านั้น ไม่ใช่คำแนะนำทางภาษี กรุณาส่ง CSV ให้นักบัญชี และตรวจที่{' '}
        <a href="https://www.ato.gov.au" target="_blank" rel="noreferrer">
          ato.gov.au
        </a>{' '}
        ก่อนยื่นจริง
      </div>
      <div className="field" style={{ maxWidth: 200 }}>
        <label>ปีปฏิทิน</label>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
          {[thisYear - 1, thisYear, thisYear + 1].map((y) => (
            <option key={y} value={y}>
              {y} (พ.ศ. {y + 543})
            </option>
          ))}
        </select>
      </div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="label">รายรับ</div>
          <div className="value">{money(income)}</div>
        </div>
        <div className="stat-card">
          <div className="label">GST ในรายรับ</div>
          <div className="value blue">{money(gstOnIncome)}</div>
        </div>
        <div className="stat-card">
          <div className="label">รายจ่าย</div>
          <div className="value rust">{money(expenseSum)}</div>
        </div>
        <div className="stat-card">
          <div className="label">กำไรสุทธิโดยประมาณ</div>
          <div className="value">{money(net)}</div>
        </div>
      </div>
      <div className="card">
        <h3>รายรับ vs รายจ่ายรายเดือน</h3>
        {months.some((m) => m.income || m.expense) ? (
          <BarLine months={months} />
        ) : (
          <div className="chart-fallback">ยังไม่มีข้อมูลปีนี้สำหรับกราฟ</div>
        )}
        <div className="chart-fallback muted">
          แท่งเขียว = รายรับ · แท่งแดง = รายจ่าย · เส้นน้ำเงิน = รายรับ — รายเดือนคิดทุกเดือนตั้งแต่เริ่มจนหยุด /
          รายปีคิดในเดือนที่ครบรอบวันเริ่ม
        </div>
      </div>
      <div className="card">
        <h3>รายจ่ายตามหมวด</h3>
        {byCat.length ? <Donut parts={byCat} /> : <div className="chart-fallback">ยังไม่มีรายจ่ายในปีนี้</div>}
      </div>
      <div className="card">
        <div className="row">
          <h3>ตารางรายรับ</h3>
          <button className="btn ghost sm" onClick={csv}>
            ส่งออก CSV
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>ลูกค้า</th>
              <th>วันงาน</th>
              <th>ยอด</th>
              <th>สถานะเงิน</th>
            </tr>
          </thead>
          <tbody>
            {yearClients.map((c) => {
              const t = invoiceTotals(c, data.packages, data.addons)
              const rec = incomeReceipt(c, data.packages, data.addons)
              const label = rec === 'full' ? 'received in full' : rec === 'deposit_only' ? 'partial deposit only' : 'not yet received'
              return (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.date}</td>
                  <td className="mono">{money(t.gstInclusive)}</td>
                  <td>{label}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="card">
        <h3>รายจ่าย (กด preset แล้วใส่ยอดอย่างเดียว)</h3>
        <div className="field">
          <label>Quick add</label>
          <select
            value={preset}
            onChange={(e) => {
              const p = EXPENSE_PRESETS.find((x) => x.category === e.target.value)
              setPreset(e.target.value)
              if (p) setDraft((d) => ({ ...d, category: p.category, description: p.description, amount: '' }))
            }}
          >
            <option value="">— เลือกหมวด —</option>
            {EXPENSE_PRESETS.map((p) => (
              <option key={p.category} value={p.category}>
                {p.category}
              </option>
            ))}
          </select>
        </div>
        <div className="grid3">
          <div className="field">
            <label>วันที่เริ่ม / วันจ่าย</label>
            <input type="date" value={draft.dateISO} onChange={(e) => setDraft({ ...draft, dateISO: e.target.value })} />
          </div>
          <div className="field">
            <label>ความถี่</label>
            <select
              value={draft.frequency}
              onChange={(e) => setDraft({ ...draft, frequency: e.target.value as ExpenseFrequency })}
            >
              <option value="once">ครั้งเดียว</option>
              <option value="monthly">รายเดือน</option>
              <option value="yearly">รายปี</option>
            </select>
          </div>
          <div className="field">
            <label>ยอด AUD</label>
            <input value={draft.amount} onChange={(e) => setDraft({ ...draft, amount: e.target.value })} />
          </div>
        </div>
        <div className="grid2">
          <div className="field">
            <label>หมวด</label>
            <input value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} />
          </div>
          <div className="field">
            <label>รายละเอียด</label>
            <input value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </div>
        </div>
        <p className="muted">
          รายเดือน / รายปี บันทึกครั้งเดียว — สรุปภาษีเดือนถัดไปจะนับให้อัตโนมัติจนกว่าจะกดหยุด
        </p>
        <button
          className="btn sm"
          onClick={() => {
            if (!draft.amount) return
            void addExpense({
              dateISO: draft.dateISO,
              category: draft.category || 'Other',
              description: draft.description,
              amount: Number(draft.amount),
              linkedClientId: null,
              frequency: draft.frequency,
              endedISO: null,
            })
            setDraft({ ...draft, amount: '' })
          }}
        >
          เพิ่มรายจ่าย
        </button>
        <table style={{ marginTop: 16 }}>
          <thead>
            <tr>
              <th>เริ่ม</th>
              <th>ความถี่</th>
              <th>หมวด</th>
              <th>รายละเอียด</th>
              <th>ยอด</th>
              <th>หยุดตั้งแต่</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {yearExpenses.map((e) => (
              <ExpenseRow key={e.id} e={e} onUpdate={updateExpense} onDelete={deleteExpense} onAdd={addExpense} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function ExpenseRow({
  e,
  onUpdate,
  onDelete,
  onAdd,
}: {
  e: Expense
  onUpdate: (e: Expense) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onAdd: (e: Omit<Expense, 'id'>) => Promise<void>
}) {
  const today = new Date().toISOString().slice(0, 10)
  const recurring = (e.frequency ?? 'once') !== 'once'
  return (
    <tr>
      <td>
        <input type="date" value={e.dateISO} onChange={(ev) => void onUpdate({ ...e, dateISO: ev.target.value })} />
      </td>
      <td>
        {recurring ? <span className="rec-badge">🔁 {FREQ_LABEL[e.frequency ?? 'once']}</span> : FREQ_LABEL.once}
      </td>
      <td>{e.category}</td>
      <td>{e.description}</td>
      <td>
        <input
          type="number"
          className="mono"
          style={{ width: 96 }}
          defaultValue={e.amount}
          onBlur={(ev) => {
            const amount = Number(ev.target.value)
            if (!Number.isFinite(amount) || amount === e.amount) return
            if (!recurring || e.dateISO >= today) {
              void onUpdate({ ...e, amount })
              return
            }
            const cut = addDaysISO(today, -1)
            void onUpdate({ ...e, endedISO: cut < e.dateISO ? e.dateISO : cut }).then(() =>
              onAdd({
                dateISO: today,
                category: e.category,
                description: e.description,
                amount,
                linkedClientId: e.linkedClientId,
                frequency: e.frequency,
                endedISO: null,
              }),
            )
          }}
        />
      </td>
      <td>
        {recurring ? (
          <input
            type="date"
            value={e.endedISO ?? ''}
            onChange={(ev) => void onUpdate({ ...e, endedISO: ev.target.value || null })}
          />
        ) : (
          '—'
        )}
      </td>
      <td>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {recurring && !e.endedISO && (
            <button className="btn ghost sm" type="button" onClick={() => void onUpdate({ ...e, endedISO: today })}>
              หยุดวันนี้
            </button>
          )}
          <button className="btn ghost sm" type="button" onClick={() => void onDelete(e.id)}>
            ลบ
          </button>
        </div>
      </td>
    </tr>
  )
}
