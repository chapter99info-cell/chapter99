import { useEffect, useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { fetchAgencyInvoicesInRange } from '../../lib/clientJobsService'
import { formatAud } from '../../lib/agencyGst'
import { brandColor } from '../../lib/useBrand'
import {
  JOB_TYPE_LABELS,
  type AgencyInvoice,
  type ClientJobType,
} from '../../types/clientJobs'

type RangeMode = 'quarter' | 'fy'

function fyRange(endYear: number): { start: Date; end: Date; label: string } {
  const start = new Date(Date.UTC(endYear - 1, 6, 1, 0, 0, 0))
  const end = new Date(Date.UTC(endYear, 5, 30, 23, 59, 59))
  return { start, end, label: `FY ${endYear - 1}/${String(endYear).slice(2)}` }
}

function quarterRange(
  calendarYear: number,
  quarter: 1 | 2 | 3 | 4
): { start: Date; end: Date; label: string } {
  const map: Record<
    1 | 2 | 3 | 4,
    { startM: number; startY: number; endM: number; endY: number }
  > = {
    1: { startM: 6, startY: calendarYear - 1, endM: 8, endY: calendarYear - 1 },
    2: { startM: 9, startY: calendarYear - 1, endM: 11, endY: calendarYear - 1 },
    3: { startM: 0, startY: calendarYear, endM: 2, endY: calendarYear },
    4: { startM: 3, startY: calendarYear, endM: 5, endY: calendarYear },
  }
  const m = map[quarter]
  const start = new Date(Date.UTC(m.startY, m.startM, 1, 0, 0, 0))
  const endDay = new Date(Date.UTC(m.endY, m.endM + 1, 0)).getUTCDate()
  const end = new Date(Date.UTC(m.endY, m.endM, endDay, 23, 59, 59))
  return { start, end, label: `Q${quarter} (to Jun ${calendarYear})` }
}

function mapInvoice(row: Record<string, unknown>): AgencyInvoice {
  return {
    id: String(row.id),
    invoice_number: String(row.invoice_number),
    client_job_id: String(row.client_job_id),
    kind: row.kind as AgencyInvoice['kind'],
    client_name: String(row.client_name),
    client_email: (row.client_email as string | null) ?? null,
    job_type: row.job_type as ClientJobType,
    amount_ex_gst: Number(row.amount_ex_gst),
    gst: Number(row.gst),
    total: Number(row.total),
    issued_at: String(row.issued_at),
    email_sent: Boolean(row.email_sent),
    pdf_url: (row.pdf_url as string | null) ?? null,
    created_at: String(row.created_at),
  }
}

function toCsv(rows: AgencyInvoice[]): string {
  const header = ['date', 'client', 'amount_ex_gst', 'gst', 'total', 'category']
  const lines = [header.join(',')]
  for (const r of rows) {
    const date = r.issued_at.slice(0, 10)
    const client = `"${r.client_name.replace(/"/g, '""')}"`
    lines.push(
      [
        date,
        client,
        r.amount_ex_gst.toFixed(2),
        r.gst.toFixed(2),
        r.total.toFixed(2),
        r.job_type,
      ].join(',')
    )
  }
  return lines.join('\n')
}

export default function TaxSummaryPanel() {
  const now = new Date()
  const defaultFyEnd =
    now.getUTCMonth() >= 6 ? now.getUTCFullYear() + 1 : now.getUTCFullYear()
  const [mode, setMode] = useState<RangeMode>('fy')
  const [fyEnd, setFyEnd] = useState(defaultFyEnd)
  const [quarter, setQuarter] = useState<1 | 2 | 3 | 4>(1)
  const [basYear, setBasYear] = useState(defaultFyEnd)
  const [rows, setRows] = useState<AgencyInvoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const primary = brandColor('primary')
  const muted = brandColor('textMuted')
  const border = brandColor('border')

  const range = useMemo(
    () => (mode === 'fy' ? fyRange(fyEnd) : quarterRange(basYear, quarter)),
    [mode, fyEnd, basYear, quarter]
  )

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await fetchAgencyInvoicesInRange(
          range.start.toISOString(),
          range.end.toISOString()
        )
        if (!cancelled) {
          setRows(data.map((r) => mapInvoice(r as Record<string, unknown>)))
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load')
          setRows([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [range.start, range.end])

  const totals = useMemo(() => {
    const byType: Record<string, { ex: number; gst: number; total: number; count: number }> =
      {}
    let amountExGst = 0
    let gst = 0
    let total = 0
    for (const r of rows) {
      amountExGst += r.amount_ex_gst
      gst += r.gst
      total += r.total
      if (!byType[r.job_type]) byType[r.job_type] = { ex: 0, gst: 0, total: 0, count: 0 }
      byType[r.job_type].ex += r.amount_ex_gst
      byType[r.job_type].gst += r.gst
      byType[r.job_type].total += r.total
      byType[r.job_type].count += 1
    }
    return { amountExGst, gst, total, byType, count: rows.length }
  }, [rows])

  function exportCsv() {
    const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chapter99-tax-summary-${range.label.replace(/[^\w]+/g, '-')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: brandColor('text') }}>
            Tax Summary
          </h2>
          <p className="mt-2 text-base" style={{ color: muted }}>
            Raw invoice figures only — for your accountant. No tax advice or deduction suggestions.
          </p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          disabled={!rows.length}
          className="flex items-center gap-2 rounded-lg px-5 py-3 text-base font-bold text-white disabled:opacity-50"
          style={{ backgroundColor: primary }}
        >
          <Download className="h-5 w-5" />
          Export CSV
        </button>
      </div>

      <div
        className="mt-6 flex flex-wrap items-end gap-4 rounded-xl border bg-white p-4"
        style={{ borderColor: border }}
      >
        <label className="flex flex-col gap-1 text-sm font-semibold text-stone-600">
          Range
          <select
            className="rounded-lg border px-3 py-2"
            style={{ borderColor: border }}
            value={mode}
            onChange={(e) => setMode(e.target.value as RangeMode)}
          >
            <option value="fy">Financial year (1 Jul – 30 Jun)</option>
            <option value="quarter">BAS quarter</option>
          </select>
        </label>
        {mode === 'fy' ? (
          <label className="flex flex-col gap-1 text-sm font-semibold text-stone-600">
            FY ending 30 Jun
            <select
              className="rounded-lg border px-3 py-2"
              style={{ borderColor: border }}
              value={fyEnd}
              onChange={(e) => setFyEnd(Number(e.target.value))}
            >
              {[defaultFyEnd, defaultFyEnd - 1, defaultFyEnd - 2].map((y) => (
                <option key={y} value={y}>
                  {y - 1}/{String(y).slice(2)}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <>
            <label className="flex flex-col gap-1 text-sm font-semibold text-stone-600">
              BAS year (FY end)
              <select
                className="rounded-lg border px-3 py-2"
                style={{ borderColor: border }}
                value={basYear}
                onChange={(e) => setBasYear(Number(e.target.value))}
              >
                {[defaultFyEnd, defaultFyEnd - 1, defaultFyEnd - 2].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold text-stone-600">
              Quarter
              <select
                className="rounded-lg border px-3 py-2"
                style={{ borderColor: border }}
                value={quarter}
                onChange={(e) => setQuarter(Number(e.target.value) as 1 | 2 | 3 | 4)}
              >
                <option value={1}>Q1 Jul–Sep</option>
                <option value={2}>Q2 Oct–Dec</option>
                <option value={3}>Q3 Jan–Mar</option>
                <option value={4}>Q4 Apr–Jun</option>
              </select>
            </label>
          </>
        )}
        <p className="mb-2 text-sm font-bold" style={{ color: primary }}>
          {range.label}
        </p>
      </div>

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

      {loading ? (
        <p className="mt-6" style={{ color: muted }}>
          Loading…
        </p>
      ) : (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Revenue (ex GST)', formatAud(totals.amountExGst)],
              ['GST collected', formatAud(totals.gst)],
              ['Revenue (incl. GST)', formatAud(totals.total)],
              ['Invoices issued', String(totals.count)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border bg-white p-4"
                style={{ borderColor: border }}
              >
                <p className="text-xs uppercase tracking-wide" style={{ color: muted }}>
                  {label}
                </p>
                <p className="mt-1 text-xl font-bold">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 overflow-x-auto rounded-xl border bg-white p-4" style={{ borderColor: border }}>
            <h3 className="mb-3 text-base font-bold">By job type</h3>
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: border }}>
                  <th className="py-2 pr-3">Category</th>
                  <th className="py-2 pr-3">Count</th>
                  <th className="py-2 pr-3">Ex GST</th>
                  <th className="py-2 pr-3">GST</th>
                  <th className="py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {(Object.keys(JOB_TYPE_LABELS) as ClientJobType[]).map((type) => {
                  const row = totals.byType[type]
                  if (!row) return null
                  return (
                    <tr key={type} className="border-b border-stone-100">
                      <td className="py-2 pr-3">{JOB_TYPE_LABELS[type]}</td>
                      <td className="py-2 pr-3">{row.count}</td>
                      <td className="py-2 pr-3">{formatAud(row.ex)}</td>
                      <td className="py-2 pr-3">{formatAud(row.gst)}</td>
                      <td className="py-2">{formatAud(row.total)}</td>
                    </tr>
                  )
                })}
                {!Object.keys(totals.byType).length && (
                  <tr>
                    <td colSpan={5} className="py-3" style={{ color: muted }}>
                      No invoices in this range
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 overflow-x-auto rounded-xl border bg-white p-4" style={{ borderColor: border }}>
            <h3 className="mb-3 text-base font-bold">Transactions</h3>
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: border }}>
                  <th className="py-2 pr-3">Date</th>
                  <th className="py-2 pr-3">Client</th>
                  <th className="py-2 pr-3">Invoice</th>
                  <th className="py-2 pr-3">Category</th>
                  <th className="py-2 pr-3">Ex GST</th>
                  <th className="py-2 pr-3">GST</th>
                  <th className="py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-stone-100">
                    <td className="py-2 pr-3">{r.issued_at.slice(0, 10)}</td>
                    <td className="py-2 pr-3">{r.client_name}</td>
                    <td className="py-2 pr-3">{r.invoice_number}</td>
                    <td className="py-2 pr-3">{JOB_TYPE_LABELS[r.job_type]}</td>
                    <td className="py-2 pr-3">{formatAud(r.amount_ex_gst)}</td>
                    <td className="py-2 pr-3">{formatAud(r.gst)}</td>
                    <td className="py-2">{formatAud(r.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
