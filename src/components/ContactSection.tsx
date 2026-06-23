export default function ContactSection() {
  return (
    <section id="contact" className="bg-[#F5F5F5] px-5 py-24 text-center sm:px-6 sm:py-32">
      <h2 className="mb-6 text-4xl font-semibold leading-tight tracking-[-0.03em] text-black sm:text-5xl md:text-6xl">
        พร้อมยกระดับ
        <br />
        ธุรกิจของคุณ?
      </h2>
      <p className="mb-10 text-base text-black/60">
        Demo ฟรี 30 นาที · ไม่มีข้อผูกมัด · คุยภาษาไทยได้เลย
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <a
          href="https://m.me/61586534972406"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-interactive rounded-full bg-black px-6 py-3.5 font-semibold text-white hover:bg-gray-800 sm:px-8"
        >
          📘 ทักข้อความ Facebook
        </a>
        <a
          href="mailto:chapter99solutions@gmail.com"
          className="btn-interactive rounded-full border border-black px-6 py-3.5 font-medium text-black hover:bg-black hover:text-white sm:px-8"
        >
          ✉️ ส่ง Email
        </a>
      </div>
    </section>
  )
}
