import {
  AlertTriangle,
  CheckCircle2,
  Code2,
  FileText,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'

type RoleCard = {
  role: string
  title: string
  summary: string
  boundary: string
  icon: typeof FileText
}

type WorkflowStep = {
  step: string
  title: string
  description: string
}

type IdeaCard = {
  title: string
  description: string
}

const roleCards: RoleCard[] = [
  {
    role: 'Claude',
    title: 'The Brain',
    summary: 'แตก brief เป็น requirement, spec, checklist และเอกสารส่งต่อให้ทีมทำงานชัดเจน.',
    boundary: 'ไม่ implement โค้ดเองเมื่อ spec ต้องส่งต่อให้ Cursor.',
    icon: FileText,
  },
  {
    role: 'Gemini',
    title: 'The Creative',
    summary: 'วาง mood, tone, copywriting, prompt ภาพและวิดีโอให้ตรงกับธุรกิจลูกค้า.',
    boundary: 'ไม่ตัดสินใจ database, API หรือ architecture แทนฝ่ายเทคนิค.',
    icon: Sparkles,
  },
  {
    role: 'Cursor',
    title: 'The Builder',
    summary: 'เขียนโค้ดจริง, ทดสอบเบื้องต้น และเตรียมงานให้ CEO ตรวจแบบจับต้องได้.',
    boundary: 'ไม่ deploy production เองโดยไม่มี approval จากพี่แสน.',
    icon: Code2,
  },
  {
    role: 'Phee Saen',
    title: 'CEO & QA',
    summary: 'อนุมัติคุณภาพสุดท้าย, ถ่ายภาพ/วิดีโอจริง และตัดสินใจ human-in-the-loop 100%.',
    boundary: 'เป็น gate สุดท้ายก่อนส่งงานจริงให้ลูกค้า.',
    icon: Users,
  },
]

const workflowSteps: WorkflowStep[] = [
  {
    step: '01',
    title: 'Brief Intake',
    description: 'รับ brief ลูกค้าแล้วสรุปเป้าหมาย, ผู้ใช้หลัก, risk และ definition of done ให้สั้นชัด.',
  },
  {
    step: '02',
    title: 'Role Delegation',
    description: 'แยก logic/spec ไปสายเทคนิค และแยก content/UI idea ไปสาย creative ก่อนเริ่ม build.',
  },
  {
    step: '03',
    title: 'Build & Test',
    description: 'Cursor implement เฉพาะ scope ที่ชัดเจน พร้อมทดสอบจริงก่อนส่งกลับมาให้ตรวจ.',
  },
  {
    step: '04',
    title: 'CEO Approval',
    description: 'พี่แสนตรวจ code, content, design และ asset ทุกชิ้นก่อนใช้กับลูกค้าหรือ production.',
  },
]

const ideaCards: IdeaCard[] = [
  {
    title: 'Client Brief Form',
    description: 'ฟอร์มภาษาไทย/อังกฤษสำหรับเก็บ service, brand tone, asset, deadline และ approval contact ในที่เดียว.',
  },
  {
    title: 'QA Delivery Pack',
    description: 'Checklist ก่อนส่งงาน: mobile view, SEO, privacy, booking link, payment note และ rollback plan.',
  },
  {
    title: 'Asset Approval Board',
    description: 'บอร์ดรวมภาพ, video prompt, caption และสถานะ approve เพื่อไม่ให้ใช้ asset ที่ยังไม่ผ่านพี่แสน.',
  },
]

export default function AgencyWorkflowSection() {
  return (
    <section id="workflow" className="bg-white px-5 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-[88rem]">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-[0.95fr_1.05fr] md:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#E8A838]">
              AI Agency Workflow
            </p>
            <h2 className="max-w-xl text-4xl font-semibold leading-tight tracking-[-0.03em] text-[#1A1A1A] sm:text-5xl md:text-6xl">
              Ship fast.
              <br />
              Review first.
            </h2>
          </div>

          <div className="rounded-3xl bg-[#1A1A1A] p-6 text-white sm:p-8">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#E8A838] text-[#1A1A1A]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="text-xl leading-relaxed text-white/85 sm:text-2xl">
              ระบบทำงานเร็ว แต่ทุกงานต้องผ่าน human QA โดยพี่แสนก่อนส่งลูกค้าหรือ deploy จริง.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {roleCards.map(({ role, title, summary, boundary, icon: Icon }) => (
            <article key={role} className="rounded-2xl border border-black/10 bg-[#F5F5F5] p-6">
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1A1A1A] shadow-sm">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-black/40">{role}</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-[#1A1A1A]">{title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-black/60">{summary}</p>
              <div className="mt-6 rounded-xl border border-[#E8A838]/30 bg-[#E8A838]/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8A6517]">Boundary</p>
                <p className="mt-2 text-sm leading-relaxed text-black/70">{boundary}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl bg-[#1A1A1A] p-6 text-white sm:p-8">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-white/35">
                  Standard Process
                </p>
                <h3 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">From brief to review</h3>
              </div>
              <span className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/60">
                No production deploy without approval
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {workflowSteps.map((item) => (
                <div key={item.step} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="mb-4 text-sm font-semibold text-[#E8A838]">{item.step}</p>
                  <h4 className="text-xl font-semibold tracking-[-0.02em]">{item.title}</h4>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-black/10 bg-[#F5F5F5] p-6 sm:p-8">
            <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-[#1A1A1A] text-white">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="text-3xl font-semibold tracking-[-0.03em] text-[#1A1A1A]">Escalation rule</h3>
            <p className="mt-4 text-base leading-relaxed text-black/65">
              ถ้า spec ไม่ชัด, เสี่ยงแตะข้อมูลลูกค้ารายอื่น, หรือมี credential/API key เกี่ยวข้อง ทีมต้องหยุดและสรุปทางเลือกให้พี่แสนอนุมัติก่อน.
            </p>
            <ul className="mt-8 space-y-3">
              {['No cross-client data', 'No frontend credentials', 'No overwrite without backup'].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-medium text-black/70">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#E8A838]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <div className="mt-6 rounded-3xl bg-[#F5F5F5] p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8A838] text-[#1A1A1A]">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-black/40">Ideas to add next</p>
              <h3 className="text-2xl font-semibold tracking-[-0.02em] text-[#1A1A1A]">Ready for client ops</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {ideaCards.map((idea) => (
              <article key={idea.title} className="rounded-2xl bg-white p-5 shadow-sm">
                <h4 className="text-xl font-semibold tracking-[-0.02em] text-[#1A1A1A]">{idea.title}</h4>
                <p className="mt-3 text-sm leading-relaxed text-black/60">{idea.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
