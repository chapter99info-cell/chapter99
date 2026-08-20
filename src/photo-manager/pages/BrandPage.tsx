import { useEffect, useState } from 'react'
import { defaultBrandLogos, fileToLogoDataUrl, PM_MEDIA_BUCKET } from '../lib/brand'
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
  const [busyType, setBusyType] = useState<string | null>(null)
  const [health, setHealth] = useState('')

  useEffect(() => {
    setRows(mergeRows(data.brandLogos))
  }, [data.brandLogos])

  useEffect(() => {
    const sample = mergeRows(data.brandLogos)[0]?.logo_url
    if (!sample || sample.startsWith('data:')) {
      setHealth(sample?.startsWith('data:') ? 'โลโก้ฝังในฐานข้อมูลแล้ว — เอกสารจะแสดงรูปนี้' : '')
      return
    }
    const img = new Image()
    img.onload = () => setHealth('')
    img.onerror = () =>
      setHealth(
        'URL ในตารางโหลดรูปไม่ได้ (บัคเก็ตยังไม่ public หรือไฟล์ photos/wedding.png ยังไม่อยู่) — อัปโหลดไฟล์ด้านล่างแล้วกดบันทึก',
      )
    img.src = sample
  }, [data.brandLogos])

  useEffect(() => {
    if (!isPmSupabaseConfigured) {
      setListNote('โหมด local — อัปโหลดไฟล์ได้ ระบบจะฝังรูปในฐานข้อมูล')
      return
    }
    let cancelled = false
    void (async () => {
      try {
        const listed = await listBucketImages()
        if (cancelled) return
        setFiles(listed)
        if (!listed.length) {
          setListNote('ไม่พบไฟล์ในบัคเก็ต (หรือยังอ่านไม่ได้) — อัปโหลดไฟล์ด้านล่างได้เลย')
        }
      } catch {
        if (!cancelled) setListNote('อ่านรายการไฟล์ไม่ได้ — อัปโหลดไฟล์ด้านล่างได้')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  async function onUpload(type: string, file: File | undefined) {
    if (!file) return
    setBusyType(type)
    setSaved('')
    try {
      const dataUrl = await fileToLogoDataUrl(file)
      let nextUrl = dataUrl
      if (isPmSupabaseConfigured) {
        const ext = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '') || 'png'
        const path = `photos/${type}-logo.${ext}`
        const { error } = await pmClient().storage.from(PM_MEDIA_BUCKET).upload(path, file, {
          upsert: true,
          contentType: file.type || 'image/png',
        })
        if (error) {
          setListNote(`อัปโหลดเข้าบัคเก็ตไม่ได้ (${error.message}) — ฝังรูปในฐานข้อมูลแทน เพื่อให้เอกสารแสดงโลโก้ได้`)
        } else {
          nextUrl = publicUrlFor(path)
          const probe = await new Promise<boolean>((resolve) => {
            const img = new Image()
            img.onload = () => resolve(true)
            img.onerror = () => resolve(false)
            img.src = nextUrl
          })
          if (!probe) nextUrl = dataUrl
        }
      }
      setRows((cur) => cur.map((r) => (r.type === type ? { ...r, logo_url: nextUrl } : r)))
    } catch (err) {
      setListNote(err instanceof Error ? err.message : 'อัปโหลดโลโก้ไม่สำเร็จ')
    } finally {
      setBusyType(null)
    }
  }

  if (!isOwner) return <p>หน้านี้สำหรับเจ้าของเท่านั้น</p>

  return (
    <>
      <PageTitle sub="อัปโหลดโลโก้แล้วบันทึก — ใบเสนอราคา / สัญญา / ใบแจ้งหนี้จะใช้รูปนี้">โลโก้เอกสาร / Brand</PageTitle>
      <div className="card">
        <p className="muted">
          ถ้าบัคเก็ต Photos media ยังไม่ public ระบบจะฝังรูปในฐานข้อมูลให้อัตโนมัติ เพื่อให้เอกสารแสดงโลโก้ได้ทันที
        </p>
        {health && <p className="muted">{health}</p>}
        {rows.map((row) => (
          <div key={row.type} className="field">
            <label>{TYPE_LABEL[row.type] ?? row.type}</label>
            <input
              value={row.logo_url.startsWith('data:') ? '' : row.logo_url}
              placeholder={row.logo_url.startsWith('data:') ? 'รูปฝังในฐานข้อมูลแล้ว — อัปโหลดใหม่หรือวาง URL' : 'วาง public URL หรืออัปโหลดไฟล์'}
              onChange={(e) =>
                setRows(rows.map((r) => (r.type === row.type ? { ...r, logo_url: e.target.value } : r)))
              }
            />
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              style={{ marginTop: 8 }}
              disabled={busyType === row.type}
              onChange={(e) => void onUpload(row.type, e.target.files?.[0])}
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
        <div className="row">
          <button
            className="btn ghost sm"
            type="button"
            onClick={() => {
              const src = rows.find((r) => r.logo_url)?.logo_url
              if (!src) return
              setRows(rows.map((r) => ({ ...r, logo_url: src })))
            }}
          >
            ใช้โลโก้แถวแรกกับทุกประเภท
          </button>
          <button
            className="btn"
            onClick={() =>
              saveBrandLogos(rows).then(() => setSaved('บันทึกแล้ว — ใบแจ้งหนี้ / ใบเสนอราคา / สัญญาใช้โลโก้นี้'))
            }
          >
            บันทึกโลโก้
          </button>
        </div>
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
