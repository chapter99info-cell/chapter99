const VIDEO_URL =
  'https://euiwkvozrhnbxttfuchh.supabase.co/storage/v1/object/public/Chapter%2099%20web/VDO/Chapter99_Food__Media_httpss.mj.runApezOPLNaAc_food_phot.mp4'

export default function WhySection() {
  return (
    <section className="bg-[#F5F5F5] px-5 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto grid max-w-[88rem] grid-cols-1 items-start gap-8 md:grid-cols-2">
        <div className="md:pr-12">
          <p className="mb-2 text-sm uppercase tracking-[0.1em] text-black/50">ทำไมต้อง Chapter99</p>
          <h2 className="mb-6 text-4xl font-semibold leading-none tracking-[-0.04em] text-black sm:text-5xl md:text-6xl">
            One stop
            <br />
            solution.
          </h2>
          <p className="max-w-sm text-base leading-relaxed text-black/60">
            ช่างภาพ F&B 10+ ปี + AI Developer + เข้าใจธุรกิจไทยในออส — combination ที่หาไม่ได้ในตลาด
            เจ้าของร้านไม่ต้องรู้โค้ด ไม่ต้องรอ IT ระบบดูแลตัวเองได้
          </p>
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-3xl bg-[#1A1A1A] sm:min-h-[560px] md:min-h-[680px]">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={VIDEO_URL}
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </div>
    </section>
  )
}
