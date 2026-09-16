import { Link } from 'react-router-dom'
import { CoverflowGallery } from '../components/CoverflowGallery'
import { HeroBookingDemo } from '../components/HeroBookingDemo'
import { HeroScene } from '../components/HeroScene'
import { HowTogether } from '../components/HowTogether'
import { MixBuilder } from '../components/MixBuilder'
import { PlansGrid } from '../components/PlansGrid'
import { PromiseDock } from '../components/PromiseDock'
import { ShopEscape } from '../components/ShopEscape'
import { SystemModel } from '../components/SystemModel'
import { TrustSummary } from '../components/TrustSummary'
import { homePriceNote } from '../data/pricing'

export function HomePage() {
  return (
    <>
      <section className="new-hero">
        <div className="new-hero-copy">
          <p className="eyebrow">YOUR BUSINESS. OUR NEXT CHAPTER.</p>
          <h1>
            คุณดูแลลูกค้า
            <br />
            เราดูแลร้าน
            <br />
            <em>ในโลกดิจิทัล</em>
          </h1>
          <p>
            ตั้งแต่ภาพร้านและเว็บไซต์ที่ลูกค้าอยากเปิดดู ถึงการจองและงานหน้าร้านที่ทีมเข้าใจตรงกัน
            ให้คุณมีเวลากลับไปทำสิ่งที่ถนัด
          </p>
          <div className="actions">
            <Link className="btn" to="/contact">
              เริ่มจากคุยเรื่องร้าน ↗
            </Link>
            <Link to="/demo/massage">ลองเดโมการทำงาน →</Link>
          </div>
          <div className="hero-signoff">
            PHOTOGRAPHY <b>＋</b> WEBSITE <b>＋</b> OWNER CARE
          </div>
        </div>
        <HeroScene>
          <img src="/images/concept-wellness.svg" alt="ภาพแนวคิดลูกประคบและผ้าขนหนู / ไม่ใช่ภาพร้านจริง" />
          <small>DEMO · ข้อมูลสาธิต ไม่ใช่ภาพร้านจริง</small>
          <div className="collage-sticker" aria-hidden="true">
            A new
            <br />
            <i>chapter.</i>
            <span>↗</span>
          </div>
          <HeroBookingDemo />
          <div className="floating-note">
            <span>↗</span>
            <p>
              หน้าร้านดูดี
              <br />
              <strong>หลังร้านทำงานง่าย</strong>
            </p>
          </div>
          <span className="hero-index">01 — THE NEXT CHAPTER</span>
        </HeroScene>
      </section>
      <CoverflowGallery />
      <PromiseDock />
      <SystemModel />
      <section id="industries" className="industries reveal">
        <div className="section-title">
          <div>
            <p className="eyebrow">02 / BUILT AROUND YOUR BUSINESS</p>
            <h2>
              หนึ่ง Chapter99
              <br />
              <em>เข้าใจงานของแต่ละร้าน</em>
            </h2>
          </div>
          <p>เริ่มจากร้านนวด แล้วต่อยอดตามรูปแบบธุรกิจ รายละเอียดและแพ็กเกจแยกตามประเภทร้าน</p>
        </div>
        <div className="industry-grid">
          <Link className="industry-main" to="/massage">
            <img src="/images/concept-wellness.svg" alt="ภาพแนวคิดสำหรับร้านนวด / ไม่ใช่ภาพร้านจริง" />
            <span className="industry-mark" aria-hidden="true">
              🪷
            </span>
            <div>
              <small>ตลาดหลัก / มีเดโมให้ลอง</small>
              <h3>นวด & สปา ↗</h3>
              <p>บริการ · จองคิว · เจ้าของ · พนักงาน</p>
            </div>
          </Link>
          <Link className="industry-food" to="/restaurants">
            <img src="/images/concept-restaurant.svg" alt="บอร์ดแนวคิดเว็บไซต์ร้านอาหาร / ไม่ใช่ภาพร้านจริง" />
            <span className="industry-mark" aria-hidden="true">
              🍽️
            </span>
            <div>
              <small>ตัวอย่างงานออกแบบ</small>
              <h3>ร้านอาหาร & คาเฟ่ ↗</h3>
              <p>ภาพอาหาร · เมนู · งานหน้าร้าน</p>
            </div>
          </Link>
          <div className="industry-future">
            <span className="star">✳</span>
            <small>แนวทางขยายในอนาคต</small>
            <h3>แล้วธุรกิจของคุณล่ะ?</h3>
            <p>Beauty · Cleaning · Trades — ไม่ใช่ผลิตภัณฑ์สำเร็จรูปพร้อมใช้</p>
            <Link to="/contact?kind=other">คุยงานเฉพาะธุรกิจ ↗</Link>
          </div>
        </div>
      </section>
      <section className="demo-callout reveal">
        <div>
          <p className="eyebrow">DON'T JUST IMAGINE IT. TRY IT.</p>
          <h2>
            ลองจองหนึ่งคิว แล้วดูว่างานเดินต่ออย่างไร
          </h2>
          <p>ลูกค้าส่งคำขอ → เจ้าของรับคิว → พนักงานเริ่มบริการ</p>
        </div>
        <div className="actions">
          <Link className="btn" to="/demo/massage">
            เปิดเดโมสามมุมมอง ↗
          </Link>
          <Link to="/business-toolkit">ลองเครื่องมือฟรีสำหรับเจ้าของร้าน →</Link>
        </div>
      </section>
      <HowTogether />
      <MixBuilder />
      <section id="plans" className="new-plans reveal">
        <div className="section-title">
          <div>
            <p className="eyebrow">04 / แพ็กเกจร้าน</p>
            <h2>
              เลือกแพ็กตามงานร้าน
              <br />
              <em>ตัวเลขนี้ยังเป็นตัวอย่าง</em>
            </h2>
          </div>
          <p>ใช้ดูว่าเริ่มจากหน้าร้านอย่างเดียว หรือมีคนช่วยดูแลต่อ ราคายืนยันในใบเสนอราคาหลังคุย ไม่ใช่ราคาขายบนหน้านี้</p>
        </div>
        <PlansGrid compact note={homePriceNote} />
      </section>
      <section className="photo-bridge reveal">
        <div>
          <p className="eyebrow">PHOTOGRAPHY BY CHAPTER99</p>
          <h2>
            ภาพร้านที่ใช่
            <br />
            <em>ต่อยอดเป็นเว็บที่เข้ากัน</em>
          </h2>
          <p>คุณเลือกถ่ายภาพอย่างเดียวได้ หรือให้เราวางภาพและเว็บไซต์ไปด้วยกัน</p>
        </div>
        <div className="photo-choices">
          <Link to="/photography">
            <span>01 / ภาพถ่ายอย่างเดียว</span>
            <strong>มีเว็บอยู่แล้ว อยากได้ภาพใหม่ ↗</strong>
          </Link>
          <Link to="/photography#photo-packages">
            <span>02 / ภาพถ่าย + เว็บไซต์</span>
            <strong>วางแผนวันถ่ายและหน้าเว็บพร้อมกัน ↗</strong>
          </Link>
          <small>ค่าถ่ายภาพและราคาแพ็กรวมรอยืนยัน จึงยังไม่แสดงยอดประหยัด</small>
        </div>
      </section>
      <section id="about" className="about-new reveal">
        <div>
          <p className="eyebrow">THE PEOPLE BEHIND YOUR NEXT CHAPTER</p>
          <h2>
            Chapter99
            <br />
            <em>เริ่มจากความเข้าใจร้าน</em>
          </h2>
        </div>
        <div>
          <p className="about-lead">
            ร้านที่เจ้าของตั้งใจทำ
            <br />
            ควรมีงานดิจิทัลที่ช่วยให้วันทำงานง่ายขึ้น
          </p>
          <p>
            เรานำงานภาพถ่าย เว็บไซต์ และการดูแลหน้าร้านมาวางแผนร่วมกัน เพื่อให้ธุรกิจไทยในออสเตรเลียมีหน้าร้านออนไลน์ที่เป็นตัวเอง
            และมีขั้นตอนที่ทีมใช้งานเข้าใจ ทิศทางต่อไปคือเครือข่ายคนทำงานสร้างสรรค์และดิจิทัล ที่ส่งมอบงานตามขอบเขตเดียวกัน
            โดยเริ่มจากงานที่ร้านต้องการจริง
          </p>
          <p>เว็บนี้ใช้แนะนำบริการและนัดคุย ไม่ใช่ระบบสมัครสมาชิก รับเงิน หรือเปิดร้านอัตโนมัติ</p>
          <p>Digital Shop Operating System คือคำอธิบายงานที่เราช่วยดูแลด้านดิจิทัลของร้าน ไม่ใช่ชื่อซอฟต์แวร์ที่ติดตั้งเอง</p>
          <Link to="/work">ดูตัวอย่างงานออกแบบ ↗</Link>
        </div>
      </section>
      <TrustSummary />
      <ShopEscape />
    </>
  )
}
