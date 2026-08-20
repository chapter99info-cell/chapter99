import { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { contractText } from '../lib/contract'
import { BrandMark } from './BrandMark'
import { PrepTipsCard } from './PrepTipsCard'
import { usePhotoStore } from '../store/StoreContext'
import type { Client } from '../types'

export default function ConfirmPage() {
  const { token = '' } = useParams()
  const [params] = useSearchParams()
  const kind = params.get('k') === 'contract' ? 'contract' : 'brief'
  const { fetchConfirm, confirmByToken, data } = usePhotoStore()
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
    // fetchConfirm is stable enough per mount; token is the real dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const body = useMemo(() => {
    if (!client) return ''
    if (kind === 'contract') return contractText(client, data.packages, data.addons)
    return `สรุปงานวันถ่าย — ${client.name}

วันที่: ${client.date}
สถานที่: ${client.location}
ประเภทงาน: ${client.typeLabel}
พิธีเริ่ม: ${client.ceremonyTime} น.`
  }, [client, kind, data])

  if (missing) {
    return (
      <div className="login-wrap">
        <div className="card login-card">ไม่พบลิงก์นี้</div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="login-wrap">
        <div className="card login-card">กำลังเปิดหน้ายืนยัน…</div>
      </div>
    )
  }

  return (
    <div className="client-phone">
      <div className="cp-head">
        <BrandMark jobType={client.type} compact onDark />
        <small>{kind === 'contract' ? 'กรุณาตรวจสอบและยืนยันสัญญา' : 'กรุณายืนยันคิวงานถ่ายภาพ'}</small>
      </div>
      {done ? (
        <div className="cp-success" style={{ padding: 36, textAlign: 'center' }}>
          <div className="check">✓</div>
          <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 16 }}>ยืนยันเรียบร้อยแล้ว</div>
          <div className="muted">ขอบคุณค่ะ ทีมงาน Chapter99 จะติดต่อกลับหากมีอัปเดตเพิ่มเติม</div>
        </div>
      ) : (
        <>
          <div className="cp-body">{body}</div>
          <PrepTipsCard client={client} />
          <div className="cp-actions">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="พิมพ์ชื่อ-นามสกุลเพื่อยืนยัน" />
            <button
              className="cp-confirm-btn"
              onClick={async () => {
                if (!name.trim()) return
                await confirmByToken(token, kind)
                setDone(true)
              }}
            >
              ✓ ยืนยันรับทราบ
            </button>
          </div>
        </>
      )}
    </div>
  )
}
