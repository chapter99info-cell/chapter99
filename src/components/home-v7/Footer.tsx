import { Mail, Phone } from 'lucide-react'
import { company } from '../../data/proof'
import { BrandGlyph, PressIcon } from './PressIcon'
import { WA } from './Hero'

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="fgrid">
          <div>
            <a className="logo" href="#top">
              <img src="/mockup/media/web/logo.webp" alt="" width={40} height={40} />
              CHAPTER99
            </a>
            <p style={{ marginTop: 12, color: '#d5d8e0' }}>
              ระบบออนไลน์สำหรับธุรกิจไทยในออสเตรเลีย
              <br />
              Sydney, NSW
            </p>
            <p>ABN {company.abn ?? '81 951 461 769'}</p>
          </div>
          <div>
            <h4>ธุรกิจ</h4>
            <a href="/massage">ร้านนวด</a>
            <a href="/restaurants">ร้านอาหาร / คาเฟ่</a>
            <a href="/beauty">ความงาม</a>
            <a href="/cleaning">ทำความสะอาด</a>
          </div>
          <div>
            <h4>บริการ</h4>
            <a href="/pricing">แพ็กเกจ</a>
            <a href="/business-toolkit">เครื่องมือฟรี</a>
            <a href="#shops">ตัวอย่างร้าน</a>
            <a href="/about">เกี่ยวกับเรา</a>
          </div>
          <div className="fcontact">
            <h4>ติดต่อเรา</h4>
            <a href="tel:+61452044382">
              <PressIcon icon={Phone} label="โทร" />
              0452 044 382
            </a>
            <a href={WA}>
              <BrandGlyph name="whatsapp" />
              WhatsApp
            </a>
            <a href="mailto:chapter99solutions@gmail.com">
              <PressIcon icon={Mail} label="อีเมล" />
              chapter99solutions@gmail.com
            </a>
            <a href="https://m.me/61586534972406" target="_blank" rel="noopener noreferrer">
              <BrandGlyph name="facebook" />
              Inbox Facebook
            </a>
          </div>
        </div>
        <div className="fbar">
          <span>© 2026 Chapter99</span>
          <span>
            <a href="/legal/privacy">Privacy Policy</a>
            <a href="/legal/terms">Terms</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
