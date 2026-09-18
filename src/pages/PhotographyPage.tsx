import { CoverflowGallery, photoSlides } from '../components/CoverflowGallery'
import { PhotoPackages } from '../components/PhotoPackages'
import { IndustryPage } from '../site/IndustryPage'
import { siteMedia } from '../site/media'

export function PhotographyPage() {
  return (
    <IndustryPage
      content={{
        kind: 'photo',
        photo: siteMedia.photography,
        photoAlt: { th: 'ผลงานภาพถ่ายธุรกิจ', en: 'Business photography work' },
        photoNote: { th: 'ภาพแนวคิดจากคลัง Chapter99 web 2026 ไม่ใช่ผลงานร้านลูกค้า', en: 'Concept photo from Chapter99 web 2026 storage — not a client case.' },
        eyebrow: { th: 'ภาพถ่ายโดย Chapter99', en: 'Photography by Chapter99' },
        title: { th: 'ให้ภาพเล่าเสน่ห์ที่คุณตั้งใจใส่ไว้ในร้าน', en: 'Let photos carry the care in your shop.' },
        lead: {
          th: 'ภาพถ่ายคือจุดต่างของ Chapter99 นำไปใช้บนเว็บ เนื้อหา และประสบการณ์ลูกค้า ไม่ใช่แพลตฟอร์มจัดการช่างภาพใหม่',
          en: 'Photography is a core Chapter99 difference — used on the website, in content, and in the customer journey. This is not a photographer-management platform.',
        },
        steps: [
          { title: { th: 'ถ่ายให้ตรงธุรกิจ', en: 'Shoot for the shop' }, body: { th: 'คน อาหาร ห้อง และรายละเอียดที่ใช้ขายได้จริง', en: 'People, food, rooms and details that can actually be used.' } },
          { title: { th: 'ใช้บนเว็บ', en: 'Use on the website' }, body: { th: 'จัดภาพให้หน้าแรกและหน้าบริการอ่านง่าย', en: 'Place photos so service pages stay readable.' } },
          { title: { th: 'เนื้อหาและการจอง', en: 'Content and booking' }, body: { th: 'ภาพช่วยให้ลูกค้าเข้าใจบริการก่อนกดจอง', en: 'Photos help customers understand the service before they book.' } },
          { title: { th: 'ไม่สร้างระบบช่างภาพใหม่', en: 'No new photo platform' }, body: { th: 'งานนี้คือถ่ายและนำไปใช้ ไม่ใช่แอปจัดการช่างภาพ', en: 'This work is photography and use — not a photographer ops app.' } },
        ],
        extra: (
          <>
            <CoverflowGallery slides={photoSlides} initialActive={2} showCta={false} />
            <PhotoPackages />
          </>
        ),
      }}
    />
  )
}
