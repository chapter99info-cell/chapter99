import { ArrowRight } from 'lucide-react'
import LazyViewportVideo from './LazyViewportVideo'

const VIDEO_URL =
  'https://euiwkvozrhnbxttfuchh.supabase.co/storage/v1/object/public/Chapter%2099%20web/VDO/VDOChap01.mp4'

const POSTER_URL =
  'https://euiwkvozrhnbxttfuchh.supabase.co/storage/v1/object/public/Chapter%2099%20web/chapter99-hero.jpg'

function handleVideoError(e: React.SyntheticEvent<HTMLVideoElement>) {
  const video = e.currentTarget
  video.style.display = 'none'
  const img = document.createElement('img')
  img.src = POSTER_URL
  img.className = video.className
  img.alt = 'Chapter99 F&B photography'
  video.parentNode?.insertBefore(img, video)
}

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
          <LazyViewportVideo
            priority
            className="absolute inset-0 h-full w-full object-cover"
            src={VIDEO_URL}
            autoPlay
            muted
            loop
            playsInline
            crossOrigin="anonymous"
            preload="auto"
            onError={handleVideoError}
          />

          <div className="absolute inset-0 bg-black/45" />

          <div className="relative z-10 flex h-full min-h-[420px] flex-col justify-end p-8 sm:min-h-[560px] sm:p-10 md:min-h-[680px] md:p-12">
            <h3 className="mb-4 text-3xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-4xl md:text-5xl">
              Charcoal &amp;
              <br />
              Saffron.
            </h3>
            <p className="mb-8 max-w-md text-base text-white/70">
              ออกแบบ digital presence ให้ธุรกิจไทยในออสดูน่าเชื่อถือ สะอาด และ professional —
              ในแบบที่เจ้าของร้านไว้วางใจได้
            </p>
            <a
              href="#portfolio"
              className="btn-interactive inline-flex items-center gap-3 text-base font-medium text-white hover:text-white/90"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition-transform duration-200 group-hover:translate-x-0.5">
                <ArrowRight className="h-4 w-4" />
              </span>
              ดูผลงาน
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
