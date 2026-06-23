import { LogoMark } from './Logo'

export default function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-4 bg-[#111111] px-6 py-10">
      <div className="flex items-center gap-3">
        <LogoMark invert />
        <div>
          <p className="font-semibold text-white">Chapter99</p>
          <p className="text-sm text-white/40">Thai Business Agency · Sydney, NSW</p>
        </div>
      </div>

      <p className="text-sm text-white/30">© 2026 Chapter99. All rights reserved.</p>
    </footer>
  )
}
