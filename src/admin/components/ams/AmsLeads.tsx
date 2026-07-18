import { FormEvent, useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { AmsLead, LeadStatus } from '../../../types/ams'
import { LEAD_STATUS_LABELS, LEAD_STATUSES } from '../../../types/ams'
import { createLead, listLeads, updateLeadStatus } from '../../../lib/ams/service'
import { brandColor } from '../../../lib/useBrand'

export default function AmsLeads() {
  const [leads, setLeads] = useState<AmsLead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const primary = brandColor('primary')
  const muted = brandColor('textMuted')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setLeads(await listLeads())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load leads')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    try {
      await createLead({
        name: String(fd.get('name') || ''),
        source: String(fd.get('source') || 'facebook'),
        fb_profile_url: String(fd.get('fb_profile_url') || '') || null,
        contact_note: String(fd.get('contact_note') || '') || null,
      })
      e.currentTarget.reset()
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed')
    } finally {
      setBusy(false)
    }
  }

  async function onStatus(id: string, status: LeadStatus) {
    setBusy(true)
    setError(null)
    try {
      await updateLeadStatus(id, status)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed')
    } finally {
      setBusy(false)
    }
  }

  const fieldClass = 'mt-1 w-full rounded-lg border px-3 py-2.5 text-sm'
  const fieldStyle = { borderColor: brandColor('border') }

  return (
    <div>
      <Link to="/admin/ams" className="text-sm font-semibold" style={{ color: primary }}>
        ← AMS dashboard
      </Link>
      <h1 className="mt-4 font-serif text-2xl font-bold" style={{ color: primary }}>
        Leads
      </h1>
      <p className="mt-1 text-sm" style={{ color: muted }}>
        Manual Facebook / other lead intake — no Messenger sync yet
      </p>

      <form
        onSubmit={onCreate}
        className="mt-6 grid gap-3 rounded-2xl border bg-white p-5 sm:grid-cols-2"
        style={{ borderColor: brandColor('border') }}
      >
        <label className="text-sm sm:col-span-2">
          Name
          <input name="name" required className={fieldClass} style={fieldStyle} />
        </label>
        <label className="text-sm">
          Source
          <select name="source" defaultValue="facebook" className={fieldClass} style={fieldStyle}>
            <option value="facebook">Facebook</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className="text-sm">
          Profile link
          <input
            name="fb_profile_url"
            type="url"
            placeholder="https://facebook.com/..."
            className={fieldClass}
            style={fieldStyle}
          />
        </label>
        <label className="text-sm sm:col-span-2">
          Contact note
          <input name="contact_note" className={fieldClass} style={fieldStyle} />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg py-2.5 text-sm font-semibold text-white sm:col-span-2"
          style={{ backgroundColor: primary }}
        >
          Add lead
        </button>
      </form>

      {error ? (
        <p className="mt-4 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <ul
        className="mt-8 divide-y rounded-2xl border bg-white"
        style={{ borderColor: brandColor('border') }}
      >
        {loading ? (
          <li className="px-4 py-8 text-center text-sm" style={{ color: muted }}>
            Loading…
          </li>
        ) : leads.length === 0 ? (
          <li className="px-4 py-8 text-center text-sm" style={{ color: muted }}>
            No leads yet.
          </li>
        ) : (
          leads.map((lead) => (
            <li key={lead.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{lead.name}</p>
                <p className="text-xs" style={{ color: muted }}>
                  {lead.source}
                  {lead.fb_profile_url ? (
                    <>
                      {' · '}
                      <a
                        href={lead.fb_profile_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                        style={{ color: primary }}
                      >
                        profile
                      </a>
                    </>
                  ) : null}
                </p>
                {lead.contact_note ? (
                  <p className="mt-1 text-sm" style={{ color: muted }}>
                    {lead.contact_note}
                  </p>
                ) : null}
              </div>
              <label className="text-xs">
                Status
                <select
                  value={lead.status}
                  disabled={busy}
                  onChange={(e) => void onStatus(lead.id, e.target.value as LeadStatus)}
                  className="mt-1 block rounded-lg border px-2 py-1.5 text-sm"
                  style={{ borderColor: brandColor('border') }}
                >
                  {LEAD_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {LEAD_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </label>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
