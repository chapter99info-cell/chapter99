import { ArrowRight } from 'lucide-react'

export default function ServicesSection() {
  return (
    <section id="services" className="bg-[#F5F5F5] px-5 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-[88rem]">
        <div className="mb-16 grid grid-cols-1 items-start gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-8 text-4xl font-semibold leading-tight tracking-[-0.03em] text-black sm:text-5xl md:text-6xl">
              What We
              <br />
              Do.
            </h2>
            <a
              href="#portfolio"
              className="btn-interactive inline-flex items-center gap-3 rounded-full bg-black py-2 pl-6 pr-2 text-base font-semibold text-white hover:bg-gray-800 sm:pl-8"
            >
              ดูผลงาน
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black">
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>
          </div>

          <p className="text-xl leading-relaxed text-black/70 sm:text-2xl md:text-3xl">
            Chapter99 คือทีม Digital Agency ที่เข้าใจธุรกิจไทยในออสเตรเลียจริงๆ เราสร้างระบบที่ทำงานให้คุณ
            ตั้งแต่ภาพถ่าย F&B ไปจนถึง PWA Booking System และ POS ครบวงจร
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <article className="card-hover flex min-h-72 flex-col justify-between rounded-2xl bg-[#1A1A1A] p-6 sm:min-h-80 sm:p-8 lg:col-span-2">
            <h3 className="text-2xl font-semibold tracking-[-0.02em] text-white">F&B Photography</h3>
            <p className="max-w-xs text-base text-white/60">
              ภาพถ่ายอาหารและสปาระดับมืออาชีพ ดึงดูดลูกค้าฝรั่งได้จริง — AI Gen ที่เหลือ match style
              ไม่ต้องทำอาหารพิเศษ
            </p>
          </article>

          <article className="card-hover flex min-h-72 flex-col justify-between rounded-2xl bg-[#E8A838] p-6 sm:min-h-80 sm:p-8">
            <h3 className="text-2xl font-semibold text-[#1A1A1A]">
              PWA Booking
              <br />
              &amp; POS System
            </h3>
            <p className="text-base text-[#1A1A1A]/70">
              ระบบจองออนไลน์ + POS + HICAPS Health Fund + GST Invoice พร้อมใช้ใน 7 วัน
            </p>
          </article>

          <article className="card-hover flex min-h-72 flex-col justify-between rounded-2xl bg-[#F0EDE6] p-6 sm:min-h-80 sm:p-8">
            <h3 className="text-2xl font-semibold text-black">
              Digital Menu
              <br />
              QR System
            </h3>
            <p className="text-base text-black/60">
              QR scan บนโต๊ะ เมนูขึ้น browser ทันที อัพเดทราคาได้เองผ่าน Google Sheet
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
