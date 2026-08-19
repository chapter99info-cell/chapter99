import { useState } from 'react'
import { money } from '../lib/money'
import { usePhotoStore } from '../store/StoreContext'
import type { Addon, CatalogPackage } from '../types'
import { PageTitle } from './ui'

export default function PackagesPage() {
  const { isOwner, data, saveCatalog } = usePhotoStore()
  const [packages, setPackages] = useState<CatalogPackage[]>(data.packages)
  const [addons, setAddons] = useState<Addon[]>(data.addons)
  const [saved, setSaved] = useState('')

  if (!isOwner) return <p>หน้านี้สำหรับเจ้าของเท่านั้น</p>

  return (
    <>
      <PageTitle sub="แก้ราคาแล้วบันทึกลงฐานข้อมูล — ใบเสนอราคา / สัญญา / ใบแจ้งหนี้ใบใหม่ใช้ราคานี้">ราคาแพ็กเกจ</PageTitle>
      <div className="card">
        <h3>งานแต่ง / Engagement</h3>
        {packages.map((p, i) => (
          <div key={p.id} className="grid3">
            <div className="field">
              <label>{p.id}</label>
              <input
                value={p.name}
                onChange={(e) => setPackages(packages.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x)))}
              />
            </div>
            <div className="field">
              <label>ราคา AUD (inc GST)</label>
              <input
                type="number"
                value={p.price}
                onChange={(e) =>
                  setPackages(packages.map((x, idx) => (idx === i ? { ...x, price: Number(e.target.value) } : x)))
                }
              />
            </div>
            <div className="field">
              <label>ชั่วโมง</label>
              <input
                type="number"
                value={p.hours}
                onChange={(e) =>
                  setPackages(packages.map((x, idx) => (idx === i ? { ...x, hours: Number(e.target.value) } : x)))
                }
              />
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <h3>Add-ons</h3>
        {addons.map((a, i) => (
          <div key={a.id} className="grid2">
            <div className="field">
              <label>{a.id}</label>
              <input
                value={a.name}
                onChange={(e) => setAddons(addons.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x)))}
              />
            </div>
            <div className="field">
              <label>ราคา AUD (inc GST) — ตอนนี้ {money(a.price)}</label>
              <input
                type="number"
                value={a.price}
                onChange={(e) => setAddons(addons.map((x, idx) => (idx === i ? { ...x, price: Number(e.target.value) } : x)))}
              />
            </div>
          </div>
        ))}
        <button
          className="btn"
          onClick={() =>
            saveCatalog(packages, addons).then(() => setSaved('บันทึกลงฐานข้อมูลแล้ว — ใช้กับเอกสารใบใหม่ทันที'))
          }
        >
          บันทึกราคา
        </button>
        {saved && <p className="muted">{saved}</p>}
      </div>
    </>
  )
}
