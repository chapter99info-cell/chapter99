import { useEffect, useState, type ReactNode } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { ADDONS, ALL_PACKAGES, TYPE_LABEL_EN } from '../data/catalog'
import { buildContract } from '../lib/contract'
import { formatClientDate } from '../lib/dates'
import { daySummaryText } from '../lib/timeline'
import { BrandMark } from './BrandMark'
import { PrepTipsCard } from './PrepTipsCard'
import { usePhotoStore } from '../store/StoreContext'
import type { Client } from '../types'

export default function ConfirmPage() {
  const { token = '' } = useParams()
  const [params] = useSearchParams()
  const kind = params.get('k') === 'contract' ? 'contract' : 'brief'
  const { fetchConfirm, confirmByToken } = usePhotoStore()
  const [client, setClient] = useState<Client | null>(null)
  const [name, setName] = useState('')
  const [done, setDone] = useState(false)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    let cancelled = false
    void fetchConfirm(token).then((c) => {
      if (cancelled) return
      if (!c) setMissing(true)
      else {
        setClient(c)
        setName(c.name)
      }
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  if (missing) {
    return (
      <div className="login-wrap">
        <div className="card login-card">ไม่พบลิงก์นี้ / Link not found</div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="login-wrap">
        <div className="card login-card">กำลังเปิดหน้ายืนยัน… / Opening…</div>
      </div>
    )
  }

  return (
    <div className={`client-phone${kind === 'contract' ? ' wide' : ''}`}>
      <div className="cp-head">
        <BrandMark jobType={client.type} compact onDark />
        <small>
          {kind === 'contract'
            ? 'กรุณาตรวจสอบและยืนยันสัญญา · Please review and confirm this contract'
            : 'กรุณายืนยันคิวงานถ่ายภาพ · Please confirm this shoot booking'}
        </small>
      </div>
      {done ? (
        <div className="cp-success" style={{ padding: 36, textAlign: 'center' }}>
          <div className="check">✓</div>
          <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 16 }}>ยืนยันเรียบร้อยแล้ว</div>
          <div className="muted">Confirmed — thank you. Chapter99 will be in touch if anything else is needed.</div>
        </div>
      ) : (
        <>
          {kind === 'contract' ? (
            <ContractConfirmBody client={client} />
          ) : (
            <BriefConfirmBody client={client} />
          )}
          {kind === 'brief' && <PrepTipsCard client={client} />}
          <div className="cp-actions">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="พิมพ์ชื่อเพื่อยืนยัน / Type your name to confirm"
            />
            <button
              className="cp-confirm-btn"
              onClick={async () => {
                if (!name.trim()) return
                await confirmByToken(token, kind)
                setDone(true)
              }}
            >
              ✓ ยืนยันรับทราบ · Confirm
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function BriefConfirmBody({ client }: { client: Client }) {
  const date = formatClientDate(client.dateISO)
  const typeEn = TYPE_LABEL_EN[client.type] ?? client.typeLabel
  const plan = daySummaryText(client)
  return (
    <div className="cp-brief">
      <h3>Shoot brief · สรุปงานวันถ่าย</h3>
      <dl>
        <div>
          <dt>Client</dt>
          <dd>{client.name}</dd>
        </div>
        <div>
          <dt>Date · วันที่</dt>
          <dd>{date}</dd>
        </div>
        <div>
          <dt>Location · สถานที่</dt>
          <dd>{client.location || '—'}</dd>
        </div>
        <div>
          <dt>Job type · ประเภทงาน</dt>
          <dd>
            {typeEn}
            {client.typeLabel !== typeEn ? ` · ${client.typeLabel}` : ''}
          </dd>
        </div>
        <div>
          <dt>Call time · เวลานัด</dt>
          <dd>{client.ceremonyTime ? `${client.ceremonyTime}` : '—'}</dd>
        </div>
      </dl>
      {plan ? (
        <div className="day-plan">
          <div className="day-plan-h">แผนวันถ่าย · Shoot day</div>
          <p>{plan}</p>
        </div>
      ) : null}
    </div>
  )
}

function ContractLine({ label, children }: { label: string; children: ReactNode }) {
  return (
    <p className="contract-row">
      <strong className="contract-lab">{label}</strong> {children}
    </p>
  )
}

function colonSplitLine(line: string) {
  const i = line.indexOf(':')
  if (i < 0) {
    return (
      <p key={line} className="contract-row">
        {line}
      </p>
    )
  }
  return (
    <p key={line} className="contract-row">
      <strong className="contract-lab">{line.slice(0, i + 1)}</strong>
      {line.slice(i + 1)}
    </p>
  )
}

function ContractConfirmBody({ client }: { client: Client }) {
  const { data } = usePhotoStore()
  const packages = data.packages.length ? data.packages : ALL_PACKAGES
  const addons = data.addons.length ? data.addons : ADDONS
  const c = buildContract(client, packages, addons, { clientFacing: true })
  return (
    <div className="cp-contract">
      <aside className="prep-tips contract-card">
        <h4>{c.title}</h4>
        <div className="prep-tips-block">
          <ContractLine label="CLIENT:">{c.clientName}</ContractLine>
          <ContractLine label="EVENT TYPE:">{c.eventType}</ContractLine>
          <ContractLine label="DATE:">{c.dateLabel}</ContractLine>
          <ContractLine label="LOCATION:">{c.location || '—'}</ContractLine>
          <ContractLine label="SERVICE:">{c.packageLine}</ContractLine>
        </div>
        <div className="prep-tips-block">
          <h3 className="contract-h">INVESTMENT</h3>
          {c.priceLines.map((line) => colonSplitLine(line))}
          <ContractLine label="Add-ons:">{c.addonLines.join('; ')}</ContractLine>
          <ContractLine label="Total fee (inc. GST 10%):">{c.totalFee}</ContractLine>
          <p className="contract-row contract-gst">
            <strong className="contract-lab">Subtotal (ex GST):</strong> {c.subtotal}
            {' · '}
            <strong className="contract-lab">GST 10%:</strong> {c.gst}
          </p>
          <ContractLine label="Non-refundable deposit (due on signing):">{c.deposit}</ContractLine>
          <ContractLine label="Balance remaining (due on or before event date):">{c.balance}</ContractLine>
        </div>
        <div className="prep-tips-block">
          <h3 className="contract-h">TERMS & CONDITIONS (summary of full agreement)</h3>
          <ol className="contract-terms">
            {c.terms.map((term) => (
              <li key={term.n}>
                {term.n}.{' '}
                <strong className="contract-lab">
                  {term.title} —
                </strong>{' '}
                <span>{term.body}</span>
              </li>
            ))}
          </ol>
        </div>
        <p className="contract-row">{c.closing}</p>
      </aside>
    </div>
  )
}
