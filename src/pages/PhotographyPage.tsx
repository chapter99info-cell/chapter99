import { CoverflowGallery, photoSlides } from '../components/CoverflowGallery'
import { PhotoPackages } from '../components/PhotoPackages'

export function PhotographyPage() {
  return (
    <>
      <CoverflowGallery slides={photoSlides} initialActive={2} showCta={false} />
      <section className="restaurant-hero">
        <p className="eyebrow">PHOTOGRAPHY BY CHAPTER99</p>
        <h1>
          ให้ภาพเล่าเสน่ห์
          <br />
          <em>ที่คุณตั้งใจใส่ไว้ในร้าน</em>
        </h1>
        <p className="lead">
          ถ่ายภาพอย่างเดียวก็ได้
          <br />
          หรือให้เรานำภาพไปต่อเป็นเว็บไซต์ของร้าน
        </p>
      </section>
      <PhotoPackages />
      <section className="cta">
        <h2>เลือกแพ็กเกจระบบของร้าน</h2>
        <p>หน้านี้อธิบายงานภาพ START / GROW / SCALE อยู่ที่ Packages & Pricing</p>
        <a className="btn" href="/pricing#pack-photo">
          ดู Packages & Pricing ↗
        </a>
      </section>
    </>
  )
}
