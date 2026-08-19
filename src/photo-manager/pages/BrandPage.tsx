import { useEffect, useState } from 'react'
import { defaultBrandLogos, PM_MEDIA_BUCKET } from '../lib/brand'
import { isPmSupabaseConfigured, pmClient } from '../store/adapters/supabase'
import { usePhotoStore } from '../store/StoreContext'
import type { BrandLogo } from '../types'
import { PageTitle } from './ui'

const TYPE_LABEL: Record<string, string> = {
  default: 'ค่าเริ่มต้น / Default (เมื่อประเภทงานไม่มีแถวของตัวเอง)',
  wedding: 'Wedding',
  engagement: 'Engagement',
  portrait: 'Portrait',
  family: 'Family',
}

const SKIP = /chapter99_st\.png/i

function publicUrlFor(path: string): string {
  const { data } = pmClient().storage.from(PM_MEDIA_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export default function BrandPage() {
  const { isOwner, data, saveBrandLogos } = usePhotoStore()
  const [rows, setRows] = useState<BrandLogo[]>(() => mergeRows(data.brandLogos))
  const [files, setFiles] = useState<{ path: string; url: string }[]>([])
  const [listNote, setListNote] = useState('')
  const [saved, setSaved] = useState('')

  useEffect(() => {
    setRows(mergeRows(data.brandLogos))
  }, [data.brandLogos])

  useEffect(() => {
    if (!isPmSupabaseConfigured) {
      setListNote('โหมด local — ใส่ URL เต็มได้ แต่ยังไม่ดึงรายการจากบัคเก็ต')
      return
    }
    let cancelled = false
    void (async () => {
      try {
        const listed = await listBucketImages()
        if (cancelled) return
        setFiles(listed)
        if (!listed.length) {
          setListNote('ไม่พบไฟล์ในบัคเก็ต — วาง public URL ในช่องด้านบนได้เช่นกัน')
        }
      } catch {
        if (!cancelled) setListNote('อ่านรายการไฟล์ไม่ได้ — วาง public URL ในช่องด้านบนได้')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (!isOwner) return <p>หน้านี้สำหรับเจ้าของเท่านั้น</p>

  return (
    <>
      <PageTitle sub="จับคู่โลโก้ตามประเภทงาน — เปลี่ยน URL ได้โดยไม่ต้องรัน migration ใหม่">โลโก้เอกสาร / Brand</PageTitle>
      <div className="card">
        <p className="muted">
          ตอนนี้ทุกประเภทยังใช้ <code>photos/wedding.png</code> ในบัคเก็ต Photos media
          ไม่ใช้ Chapter99_st.png (ธุรกิจอื่น)
        </p>
        {rows.map((row) => (
          <div key={row.type} className="field">
            <label>{TYPE_LABEL[row.type] ?? row.type}</label>
            <input
              value={row.logo_url}
              onChange={(e) =>
                setRows(rows.map((r) => (r.type === row.type ? { ...r, logo_url: e.target.value } : r)))
              }
            />
            {row.logo_url ? (
              <img src={row.logo_url} alt="" className="pm-doc-logo sm" style={{ marginTop: 8 }} />
            ) : null}
            {files.length > 0 && (
              <select
                style={{ marginTop: 8 }}
                value=""
                onChange={(e) => {
                  const url = e.target.value
                  if (!url) return
                  setRows(rows.map((r) => (r.type === row.type ? { ...r, logo_url: url } : r)))
                }}
              >
                <option value="">เลือกไฟล์จากบัคเก็ต…</option>
                {files.map((f) => (
                  <option key={f.path} value={f.url}>
                    {f.path}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
        {listNote && <p className="muted">{listNote}</p>}
        <button
          className="btn"
          onClick={() =>
            saveBrandLogos(rows).then(() => setSaved('บันทึกแล้ว — ใบแจ้งหนี้ / ใบเสนอราคา / สัญญาใบใหม่ใช้โลโก้นี้'))
          }
        >
          บันทึกโลโก้
        </button>
        {saved && <p className="muted" style={{ marginTop: 10 }}>{saved}</p>}
      </div>
    </>
  )
}

function mergeRows(existing: BrandLogo[] | undefined): BrandLogo[] {
  const defaults = defaultBrandLogos()
  return defaults.map((d) => existing?.find((r) => r.type === d.type) ?? d)
}

async function listBucketImages(): Promise<{ path: string; url: string }[]> {
  const sb = pmClient()
  const out: { path: string; url: string }[] = []
  for (const folder of ['photos', '']) {
    const { data, error } = await sb.storage.from(PM_MEDIA_BUCKET).list(folder || undefined, { limit: 100 })
    if (error) throw error
    for (const item of data ?? []) {
      if (!item.name || SKIP.test(item.name)) continue
      if (!item.metadata && !item.name.includes('.')) continue
      const path = folder ? `${folder}/${item.name}` : item.name
      if (SKIP.test(path)) continue
      out.push({ path, url: publicUrlFor(path) })
    }
  }
  return out
}
