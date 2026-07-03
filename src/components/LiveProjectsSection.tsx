import { motion } from 'framer-motion'
import { Sparkles, LayoutDashboard, Globe, ArrowUpRight } from 'lucide-react'

type Project = {
  title: string
  description: string
  url: string
  icon: typeof Sparkles
  gradient: string
  delay: number
}

const projects: Project[] = [
  {
    title: 'Princess Thai Massage',
    description: 'เว็บร้านนวดพร้อมระบบจองคิวและเมนูดิจิทัล ใช้งานจริงกับลูกค้าหน้าร้าน.',
    url: 'https://theprincessthaimassage.vercel.app/',
    icon: Sparkles,
    gradient: 'linear-gradient(137deg, #FF3D77 0%, #FFB1CE 45%, #FF9D3C 100%)',
    delay: 0.1,
  },
  {
    title: 'Chapter99 Admin',
    description: 'ระบบหลังบ้านจัดการร้าน คิวพนักงาน ใบเสร็จ และตั้งค่าหลายสาขาในที่เดียว.',
    url: 'https://chapter99thaimass-v20.vercel.app/?shop=mira',
    icon: LayoutDashboard,
    gradient: 'linear-gradient(137deg, #FFFFFF 0%, #7DD3FC 45%, #06B6D4 100%)',
    delay: 0.2,
  },
  {
    title: 'Mira Thai Massage',
    description: 'เว็บไซต์แบรนด์เต็มรูปแบบ พร้อมภาพและวิดีโอโปรดักชันจริง.',
    url: 'https://www.mirathaimassage.com.au/',
    icon: Globe,
    gradient: 'linear-gradient(137deg, #4361EE 0%, #E0AEFF 45%, #F72585 100%)',
    delay: 0.3,
  },
]

function FeatureCard({ title, description, url, icon: Icon, gradient, delay }: Project) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: 'easeOut', delay }}
      className="relative flex w-full max-w-[260px] flex-col items-start justify-start group mx-auto md:max-w-[300px]"
    >
      <a href={url} target="_blank" rel="noopener noreferrer" className="block w-full">
        <div
          className="pointer-events-none absolute h-[260px] w-full rounded-[40px] opacity-60 md:h-[300px]"
          style={{ background: gradient, filter: 'blur(45px)' }}
        />

        <div
          className="relative z-10 h-[260px] self-stretch overflow-hidden rounded-[40px] border-8 border-transparent md:h-[300px]"
          style={{
            background: `linear-gradient(#1A1A1C, #1A1A1C) padding-box, ${gradient} border-box`,
          }}
        >
          <div className="flex h-full w-full flex-col justify-between p-7">
            <div className="text-white/90">
              <Icon size={32} strokeWidth={2.5} />
            </div>

            <div>
              <h3 className="mb-3 text-xl font-medium tracking-tight text-white">{title}</h3>
              <p className="text-[14px] font-normal leading-[1.6] text-gray-400 selection:bg-white/20">
                {description}
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-[13px] font-medium text-white/70 transition-colors group-hover:text-white">
                ดูเว็บไซต์
                <ArrowUpRight size={14} strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  )
}

export default function LiveProjectsSection() {
  return (
    <section className="flex flex-col items-center justify-center bg-[#0A0A0B] p-6 font-sans md:p-12">
      <div className="mb-10 max-w-2xl text-center">
        <span className="mb-4 inline-block rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[13px] font-medium tracking-wide text-white/70">
          Live Projects
        </span>
        <h2 className="text-3xl font-light tracking-tight text-white md:text-4xl">
          เว็บไซต์ตัวอย่างที่เราทำจริง
        </h2>
      </div>

      <div className="grid w-full max-w-[936px] grid-cols-1 gap-10 md:grid-cols-3 md:gap-3 lg:gap-3">
        {projects.map((project) => (
          <FeatureCard key={project.title} {...project} />
        ))}
      </div>
    </section>
  )
}
