import { useCallback, useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import PaymentLinksPanel from './PaymentLinksPanel'
import { brandColor } from '../../lib/useBrand'
import { fetchBillingRecords, fetchProjects, upsertBillingForProject } from '../../lib/agencyService'
import type { Billing, Project } from '../../types/agency'

function formatAud(n: number): string {
  return n.toFixed(2)
}

function exportAtoCsv(rows: Billing[]) {
  const header = 'Date,Client,Total,GST\n'
  const lines = rows.map((r) => {
    const date = r.paymentReceivedDate ?? ''
    const client = (r.client?.businessName ?? r.project?.client?.businessName ?? '').replace(/,/g, ' ')
    const total = formatAud(r.totalAmountAud)
    const gst = formatAud(r.gstAmountAud)
    return `${date},${client},${total},${gst}`
  })
  const blob = new Blob([header + lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `chapter99-ato-export-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function FinancialExport() {
  const [billing, setBilling] = useState<Billing[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError('')
    try {
      const [b, p] = await Promise.all([fetchBillingRecords(), fetchProjects()])
      setBilling(b)
      setProjects(p)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load billing')
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function handleUpdate(
    projectId: string,
    field: 'totalAmountAud' | 'paymentReceivedDate',
    value: string
  ) {
    setSaving(projectId)
    try {
      const existing = billing.find((b) => b.projectId === projectId)
      const total =
        field === 'totalAmountAud' ? parseFloat(value) || 0 : (existing?.totalAmountAud ?? 0)
      const patch =
        field === 'totalAmountAud'
          ? { totalAmountAud: total, gstAmountAud: Math.round(total * 0.1 * 100) / 100 }
          : { paymentReceivedDate: value || null }
      await upsertBillingForProject(projectId, patch)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setSaving(null)
    }
  }

  const projectRows = projects.map((p) => {
    const bill = billing.find((b) => b.projectId === p.id)
    return { project: p, billing: bill }
  })

  const primary = brandColor('primary')
  const muted = brandColor('textMuted')

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: brandColor('text') }}>
            Financial &amp; ATO Export
          </h2>
          <p className="mt-2 text-base" style={{ color: muted }}>
            GST at 10% — Australian financial year uses payment_received_date (July–June).
          </p>
        </div>
        <button
          type="button"
          onClick={() => exportAtoCsv(billing)}
          disabled={billing.length === 0}
          className="flex items-center gap-2 rounded-lg px-5 py-3 text-base font-bold text-white disabled:opacity-50"
          style={{ backgroundColor: primary }}
        >
          <Download className="h-5 w-5" />
          Export for ATO
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

      <PaymentLinksPanel />

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-base">
          <thead>
            <tr className="border-b-2" style={{ borderColor: brandColor('border') }}>
              <th className="py-3 pr-4 font-bold">Client / Project</th>
              <th className="py-3 pr-4 font-bold">total_amount_aud</th>
              <th className="py-3 pr-4 font-bold">gst_amount_aud (10%)</th>
              <th className="py-3 font-bold">payment_received_date</th>
            </tr>
          </thead>
          <tbody>
            {projectRows.map(({ project, billing: bill }) => (
              <tr key={project.id} className="border-b" style={{ borderColor: brandColor('border') }}>
                <td className="py-4 pr-4">
                  <p className="font-semibold">{project.client?.businessName}</p>
                  <p className="text-sm" style={{ color: muted }}>
                    {project.status}
                  </p>
                </td>
                <td className="py-4 pr-4">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={bill?.totalAmountAud ?? 0}
                    onBlur={(e) => void handleUpdate(project.id, 'totalAmountAud', e.target.value)}
                    className="w-32 rounded-lg border-2 px-3 py-2"
                    style={{ borderColor: brandColor('border') }}
                    disabled={saving === project.id}
                  />
                </td>
                <td className="py-4 pr-4 font-mono">
                  {formatAud(bill?.gstAmountAud ?? (bill?.totalAmountAud ?? 0) * 0.1)}
                </td>
                <td className="py-4">
                  <input
                    type="date"
                    defaultValue={bill?.paymentReceivedDate?.slice(0, 10) ?? ''}
                    onBlur={(e) => void handleUpdate(project.id, 'paymentReceivedDate', e.target.value)}
                    className="rounded-lg border-2 px-3 py-2"
                    style={{ borderColor: brandColor('border') }}
                    disabled={saving === project.id}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
