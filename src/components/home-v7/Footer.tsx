import { Mail, MapPin, MessageSquareText, Phone } from 'lucide-react'
import { v7Copy } from '../../content/v7'
import { company } from '../../data/proof'
import { BrandGlyph, PressIcon } from './PressIcon'

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
            <p style={{ marginTop: 12, color: '#d5d8e0' }}>ระบบออนไลน์สำหรับธุรกิจไทยในออสเตรเลีย</p>
            <p className="floc">
              <PressIcon icon={MapPin} label="ที่ตั้ง" />
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
            <a href={v7Copy.contact.phoneHref}>
              <PressIcon icon={Phone} label="โทร" />
              {v7Copy.contact.phoneDisplay}
            </a>
            <a href={v7Copy.contact.sms}>
              <PressIcon icon={MessageSquareText} label="SMS" />
              {v7Copy.th.ctaSms}
            </a>
            <a href={v7Copy.contact.facebookInbox} target="_blank" rel="noopener noreferrer">
              <BrandGlyph />
              ทักแชท Facebook
            </a>
            <a href={`mailto:${v7Copy.contact.email}`}>
              <PressIcon icon={Mail} label="อีเมล" />
              {v7Copy.contact.email}
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
