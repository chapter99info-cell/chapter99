import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { brandColor } from '../../lib/useBrand'
import {
  fetchProjectById,
  getProjectByokKey,
  PACKAGE_TIER_OPTIONS,
  setProjectByokKey,
  updateProject,
  upsertBillingForProject,
} from '../../lib/agencyService'
import { canEnableAiAddon, tierLabel } from '../../lib/tierRules'
import type { PackageTier, Project } from '../../types/agency'

export default function ProjectSettings() {
  const { projectId } = useParams<{ projectId: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [packageTier, setPackageTier] = useState<PackageTier>('STARTER')
  const [aiAddonEnabled, setAiAddonEnabled] = useState(false)
  const [useByok, setUseByok] = useState(false)
  const [byokKey, setByokKey] = useState('')
  const [aiMonthlyFee, setAiMonthlyFee] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    if (!projectId) return
    setError('')
    const data = await fetchProjectById(projectId)
    if (!data) {
      setError('Project not found.')
      return
    }
    setProject(data)
    setPackageTier(data.packageTier)
    setAiAddonEnabled(data.aiAddonEnabled)
    setUseByok(data.byokKeyConfigured)
    if (data.byokKeyConfigured) {
      const key = await getProjectByokKey(projectId)
      setByokKey(key ?? '')
    } else {
      setByokKey('')
    }
  }, [projectId])

  useEffect(() => {
    void load().catch((err) => setError(err instanceof Error ? err.message : 'Load failed'))
  }, [load])

  const aiAllowed = canEnableAiAddon(packageTier)
  const primary = brandColor('primary')
  const muted = brandColor('textMuted')

  async function handleSave() {
    if (!projectId || !project) return
    setSaving(true)
    setError('')
    setMessage('')
    try {
      if (aiAddonEnabled && !aiAllowed) {
        throw new Error('AI add-on is only available on Ultimate Business.')
      }

      await updateProject(projectId, {
        packageTier,
        aiAddonEnabled: aiAllowed ? aiAddonEnabled : false,
      })

      if (aiAllowed && aiAddonEnabled) {
        if (useByok) {
          await setProjectByokKey(projectId, byokKey.trim() || null)
        } else {
          await setProjectByokKey(projectId, null)
          const fee = parseFloat(aiMonthlyFee)
          if (!fee || fee <= 0) {
            throw new Error(
              'Set ai_addon_monthly_fee_aud when the client uses the agency-managed AI key.'
            )
          }
          await upsertBillingForProject(
            projectId,
            { aiAddonMonthlyFeeAud: fee },
            packageTier
          )
        }
      } else {
        await setProjectByokKey(projectId, null)
        await upsertBillingForProject(projectId, { aiAddonMonthlyFeeAud: null }, packageTier)
      }

      setMessage('Settings saved.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (!projectId) {
    return <p className="text-red-700">Invalid project.</p>
  }

  return (
    <div>
      <Link
        to="/admin"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold"
        style={{ color: primary }}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      <h2 className="text-2xl font-bold" style={{ color: brandColor('text') }}>
        Project Settings
      </h2>
      <p className="mt-2 text-base" style={{ color: muted }}>
        {project?.client?.businessName ?? 'Loading…'} — package tier &amp; AI add-on
      </p>

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      {message && <p className="mt-4 text-sm font-semibold text-green-800">{message}</p>}

      <div className="mt-8 max-w-xl space-y-6 rounded-xl border-2 bg-white p-6" style={{ borderColor: brandColor('border') }}>
        <div>
          <label className="mb-2 block text-sm font-bold" htmlFor="package-tier">
            package_tier
          </label>
          <select
            id="package-tier"
            value={packageTier}
            onChange={(e) => {
              const next = e.target.value as PackageTier
              setPackageTier(next)
              if (!canEnableAiAddon(next)) {
                setAiAddonEnabled(false)
                setUseByok(false)
                setByokKey('')
              }
            }}
            className="w-full rounded-lg border-2 px-4 py-3 text-base"
            style={{ borderColor: brandColor('border') }}
          >
            {PACKAGE_TIER_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {tierLabel(t)}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="space-y-4" disabled={!aiAllowed}>
          <legend className="text-sm font-bold">
            AI Chatbot Add-on {aiAllowed ? '' : '(Ultimate only)'}
          </legend>
          <label className="flex items-center gap-3 text-base">
            <input
              type="checkbox"
              checked={aiAddonEnabled}
              disabled={!aiAllowed}
              onChange={(e) => setAiAddonEnabled(e.target.checked)}
              className="h-5 w-5"
            />
            ai_addon_enabled
          </label>

          {aiAllowed && aiAddonEnabled && (
            <>
              <label className="flex items-center gap-3 text-base">
                <input
                  type="checkbox"
                  checked={useByok}
                  onChange={(e) => setUseByok(e.target.checked)}
                  className="h-5 w-5"
                />
                Bring Your Own Key (BYOK)
              </label>

              {useByok ? (
                <div>
                  <label className="mb-2 block text-sm font-semibold" htmlFor="byok-key">
                    Client API key (stored encrypted — never on public routes)
                  </label>
                  <input
                    id="byok-key"
                    type="password"
                    value={byokKey}
                    onChange={(e) => setByokKey(e.target.value)}
                    placeholder="sk-… or Gemini key"
                    className="w-full rounded-lg border-2 px-4 py-3 font-mono text-sm"
                    style={{ borderColor: brandColor('border') }}
                    autoComplete="off"
                  />
                </div>
              ) : (
                <div>
                  <label className="mb-2 block text-sm font-semibold" htmlFor="ai-fee">
                    ai_addon_monthly_fee_aud (agency-managed key)
                  </label>
                  <input
                    id="ai-fee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={aiMonthlyFee}
                    onChange={(e) => setAiMonthlyFee(e.target.value)}
                    className="w-full rounded-lg border-2 px-4 py-3 text-base"
                    style={{ borderColor: brandColor('border') }}
                  />
                </div>
              )}
            </>
          )}
        </fieldset>

        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving || !project}
          className="flex items-center gap-2 rounded-lg px-5 py-3 text-base font-bold text-white disabled:opacity-50"
          style={{ backgroundColor: primary }}
        >
          <Save className="h-5 w-5" />
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </div>
    </div>
  )
}
