import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { AmsClient, StaffProfile } from '../../../types/ams'
import {
  createClient,
  createProject,
  listClients,
  listStaff,
} from '../../../lib/ams/service'
import { brandColor } from '../../../lib/useBrand'

export default function AmsProjectNew() {
  const navigate = useNavigate()
  const [clients, setClients] = useState<AmsClient[]>([])
  const [staff, setStaff] = useState<StaffProfile[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showQuickClient, setShowQuickClient] = useState(false)
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const primary = brandColor('primary')
  const muted = brandColor('textMuted')

  useEffect(() => {
    void (async () => {
      try {
        const [c, s] = await Promise.all([listClients(), listStaff()])
        setClients(c)
        setStaff(s)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load form data')
      }
    })()
  }, [])

  async function addClientQuick() {
    setBusy(true)
    setError(null)
    try {
      const c = await createClient({
        contact_name: clientName,
        email: clientEmail || null,
      })
      setClients((prev) => [...prev, c].sort((a, b) => a.contact_name.localeCompare(b.contact_name)))
      setShowQuickClient(false)
      setClientName('')
      setClientEmail('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create client')
    } finally {
      setBusy(false)
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    try {
      const project = await createProject({
        title: String(fd.get('title') || ''),
        service_type: String(fd.get('service_type') || 'photography'),
        client_id: String(fd.get('client_id') || ''),
        staff_id: String(fd.get('staff_id') || '') || null,
        deadline: String(fd.get('deadline') || '') || null,
        brief: String(fd.get('brief') || '') || null,
        deliver_on_deposit: fd.get('deliver_on_deposit') === 'on',
        deposit_amount_cents: Math.round(Number(fd.get('deposit_amount') || 0) * 100) || 0,
        total_amount_cents: fd.get('total_amount')
          ? Math.round(Number(fd.get('total_amount')) * 100)
          : null,
      })
      navigate(`/admin/ams/projects/${project.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed')
    } finally {
      setBusy(false)
    }
  }

  const fieldClass = 'mt-1 w-full rounded-lg border px-3 py-2.5 text-sm'
  const fieldStyle = { borderColor: brandColor('border') }

  return (
    <div className="mx-auto max-w-xl">
      <Link to="/admin/ams" className="text-sm font-semibold" style={{ color: primary }}>
        ← AMS dashboard
      </Link>
      <h1 className="mt-4 font-serif text-2xl font-bold" style={{ color: primary }}>
        New AMS project
      </h1>
      <p className="mt-1 text-sm" style={{ color: muted }}>
        Creates a public_token tracking link automatically.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block text-sm">
          Project title
          <input name="title" required className={fieldClass} style={fieldStyle} />
        </label>
        <label className="block text-sm">
          Service type
          <select
            name="service_type"
            defaultValue="photography"
            className={fieldClass}
            style={fieldStyle}
          >
            <option value="photography">Photography</option>
            <option value="videography">Videography</option>
            <option value="editing">Editing</option>
            <option value="real_estate">Real estate</option>
            <option value="wedding">Wedding</option>
            <option value="event">Event</option>
            <option value="corporate">Corporate</option>
            <option value="other">Other</option>
          </select>
        </label>
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="client_id" className="text-sm">
              Client
            </label>
            <button
              type="button"
              className="text-xs font-semibold"
              style={{ color: primary }}
              onClick={() => setShowQuickClient((v) => !v)}
            >
              {showQuickClient ? 'Cancel' : '+ Quick client'}
            </button>
          </div>
          {showQuickClient ? (
            <div
              className="mt-2 space-y-2 rounded-lg border p-3"
              style={{ borderColor: brandColor('border') }}
            >
              <input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Contact name"
                className={fieldClass}
                style={fieldStyle}
              />
              <input
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="Email"
                type="email"
                className={fieldClass}
                style={fieldStyle}
              />
              <button
                type="button"
                disabled={busy || !clientName.trim()}
                onClick={() => void addClientQuick()}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-white"
                style={{ backgroundColor: primary }}
              >
                Save client
              </button>
            </div>
          ) : null}
          <select
            id="client_id"
            name="client_id"
            required
            defaultValue=""
            className={fieldClass}
            style={fieldStyle}
          >
            <option value="" disabled>
              Select client
            </option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.business_name ? `${c.business_name} — ` : ''}
                {c.contact_name}
              </option>
            ))}
          </select>
        </div>
        <label className="block text-sm">
          Assign staff
          <select name="staff_id" defaultValue="" className={fieldClass} style={fieldStyle}>
            <option value="">Unassigned</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.full_name} ({s.role})
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Deadline
          <input name="deadline" type="date" className={fieldClass} style={fieldStyle} />
        </label>
        <label className="block text-sm">
          Brief (optional)
          <input name="brief" className={fieldClass} style={fieldStyle} />
        </label>
        <label className="block text-sm">
          Total amount (AUD)
          <input
            name="total_amount"
            type="number"
            min="0"
            step="0.01"
            className={fieldClass}
            style={fieldStyle}
          />
        </label>
        <label className="block text-sm">
          Deposit amount (AUD)
          <input
            name="deposit_amount"
            type="number"
            min="0"
            step="0.01"
            defaultValue="0"
            className={fieldClass}
            style={fieldStyle}
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input name="deliver_on_deposit" type="checkbox" />
          Deliver on deposit (requires deposit &gt; 0)
        </label>

        {error ? (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl py-3 font-semibold text-white"
          style={{ backgroundColor: primary }}
        >
          {busy ? 'Creating…' : 'Create project'}
        </button>
      </form>
    </div>
  )
}
