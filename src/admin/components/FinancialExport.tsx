import { useCallback, useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { brandColor } from '../../lib/useBrand'
import { computeBillingTotal } from '../../lib/billingTotals'
import { canUseProductionAddons, tierLabel } from '../../lib/tierRules'
import { fetchBillingRecords, fetchProjects, upsertBillingForProject } from '../../lib/agencyService'
import type { Billing, Project } from '../../types/agency'

function formatAud(n: number): string {
  return n.toFixed(2)
}

function exportAtoCsv(rows: Billing[]) {
  const header =
    'Date,Client,Tier,Base_Package,Photography_Fee,Video_Fee,AI_Addon_Fee,Total,GST\n'
  const lines = rows.map((r) => {
    const date = r.paymentReceivedDate ?? ''
    const client = (r.client?.businessName ?? r.project?.client?.businessName ?? '').replace(
      /,/g,
      ' '
    )
    const tier = tierLabel(r.project?.packageTier ?? 'STARTER')
    const base = formatAud(r.basePackageAmountAud)
    const photo = formatAud(r.photographyFeeAud)
    const video = formatAud(r.videoFeeAud)
    const ai = formatAud(r.aiAddonMonthlyFeeAud ?? 0)
    const total = formatAud(r.totalAmountAud)
    const gst = formatAud(r.gstAmountAud)
    return `${date},${client},${tier},${base},${photo},${video},${ai},${total},${gst}`
  })
  const blob = new Blob([header + lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `chapter99-ato-export-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

type BillingField =
  | 'basePackageAmountAud'
  | 'photographyFeeAud'
  | 'videoFeeAud'
  | 'aiAddonMonthlyFeeAud'
  | 'paymentReceivedDate'

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

  async function handleUpdate(project: Project, field: BillingField, value: string) {
    setSaving(project.id)
    try {
      const existing = billing.find((b) => b.projectId === project.id)
      const tier = project.packageTier
      const lines = {
        basePackageAmountAud: existing?.basePackageAmountAud ?? 0,
        photographyFeeAud: existing?.photographyFeeAud ?? 0,
        videoFeeAud: existing?.videoFeeAud ?? 0,
        aiAddonMonthlyFeeAud: existing?.aiAddonMonthlyFeeAud ?? null,
      }

      if (field === 'paymentReceivedDate') {
        await upsertBillingForProject(project.id, { paymentReceivedDate: value || null }, tier)
      } else if (field === 'aiAddonMonthlyFeeAud') {
        lines.aiAddonMonthlyFeeAud = value === '' ? null : parseFloat(value) || 0
        const { totalAmountAud, gstAmountAud } = computeBillingTotal(lines, tier)
        await upsertBillingForProject(
          project.id,
          { ...lines, totalAmountAud, gstAmountAud },
          tier
        )
      } else {
        lines[field] = parseFloat(value) || 0
        const { totalAmountAud, gstAmountAud } = computeBillingTotal(lines, tier)
        await upsertBillingForProject(
          project.id,
          { ...lines, totalAmountAud, gstAmountAud },
          tier
        )
      }
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
            GST at 10% — production add-ons itemized for Ultimate tier only.
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

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b-2" style={{ borderColor: brandColor('border') }}>
              <th className="py-3 pr-3 font-bold">Client / Tier</th>
              <th className="py-3 pr-3 font-bold">base_package_amount_aud</th>
              <th className="py-3 pr-3 font-bold">photography_fee_aud</th>
              <th className="py-3 pr-3 font-bold">video_fee_aud</th>
              <th className="py-3 pr-3 font-bold">ai_addon_monthly_fee_aud</th>
              <th className="py-3 pr-3 font-bold">total_amount_aud</th>
              <th className="py-3 pr-3 font-bold">gst (10%)</th>
              <th className="py-3 font-bold">payment_received_date</th>
            </tr>
          </thead>
          <tbody>
            {projectRows.map(({ project, billing: bill }) => {
              const ultimateAddons = canUseProductionAddons(project.packageTier)
              const showAiFee = project.packageTier === 'ULTIMATE' && project.aiAddonEnabled
              return (
                <tr key={project.id} className="border-b" style={{ borderColor: brandColor('border') }}>
                  <td className="py-4 pr-3">
                    <p className="font-semibold">{project.client?.businessName}</p>
                    <p className="text-xs" style={{ color: muted }}>
                      {tierLabel(project.packageTier)}
                    </p>
                  </td>
                  <td className="py-4 pr-3">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={bill?.basePackageAmountAud ?? bill?.totalAmountAud ?? 0}
                      onBlur={(e) =>
                        void handleUpdate(project, 'basePackageAmountAud', e.target.value)
                      }
                      className="w-28 rounded-lg border-2 px-2 py-2"
                      style={{ borderColor: brandColor('border') }}
                      disabled={saving === project.id}
                    />
                  </td>
                  <td className="py-4 pr-3">
                    {ultimateAddons ? (
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        defaultValue={bill?.photographyFeeAud ?? 0}
                        onBlur={(e) =>
                          void handleUpdate(project, 'photographyFeeAud', e.target.value)
                        }
                        className="w-28 rounded-lg border-2 px-2 py-2"
                        style={{ borderColor: brandColor('border') }}
                        disabled={saving === project.id}
                      />
                    ) : (
                      <span style={{ color: muted }}>—</span>
                    )}
                  </td>
                  <td className="py-4 pr-3">
                    {ultimateAddons ? (
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        defaultValue={bill?.videoFeeAud ?? 0}
                        onBlur={(e) => void handleUpdate(project, 'videoFeeAud', e.target.value)}
                        className="w-28 rounded-lg border-2 px-2 py-2"
                        style={{ borderColor: brandColor('border') }}
                        disabled={saving === project.id}
                      />
                    ) : (
                      <span style={{ color: muted }}>—</span>
                    )}
                  </td>
                  <td className="py-4 pr-3">
                    {showAiFee ? (
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        defaultValue={bill?.aiAddonMonthlyFeeAud ?? ''}
                        onBlur={(e) =>
                          void handleUpdate(project, 'aiAddonMonthlyFeeAud', e.target.value)
                        }
                        className="w-28 rounded-lg border-2 px-2 py-2"
                        style={{ borderColor: brandColor('border') }}
                        disabled={saving === project.id}
                      />
                    ) : (
                      <span style={{ color: muted }}>—</span>
                    )}
                  </td>
                  <td className="py-4 pr-3 font-mono font-semibold">
                    {formatAud(bill?.totalAmountAud ?? 0)}
                  </td>
                  <td className="py-4 pr-3 font-mono">{formatAud(bill?.gstAmountAud ?? 0)}</td>
                  <td className="py-4">
                    <input
                      type="date"
                      defaultValue={bill?.paymentReceivedDate?.slice(0, 10) ?? ''}
                      onBlur={(e) =>
                        void handleUpdate(project, 'paymentReceivedDate', e.target.value)
                      }
                      className="rounded-lg border-2 px-2 py-2"
                      style={{ borderColor: brandColor('border') }}
                      disabled={saving === project.id}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
