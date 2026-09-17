import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../cinematic/i18n/LanguageContext';
import { MassageToolkit } from './MassageToolkit';
import { siteContact, siteIcons, siteMedia } from './media';
import { FaqSection, NewsletterCard } from './SiteUx';
import { SiteLayout } from './SiteLayout';

const AUDIT_MAIL =
  'mailto:chapter99solutions@gmail.com?subject=Chapter99%20Business%20Audit';
const DEMO = 'https://www.chapter99info.tech/?shop=mira';

function HomeInner() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'Chapter99 — Bring Your Business to Life Online';
  }, []);

  return (
    <main id="top">
      <section className="hero">
        <div className="container heroGrid">
          <div>
            <span className="eyebrow">
              {t({
                th: 'Digital Business Infrastructure Partner',
                en: 'Digital Business Infrastructure Partner',
              })}
            </span>
            <h1>
              Bring Your Business <span className="blue">to Life Online.</span>
            </h1>
            <div className="heroLead">
              {t({
                th: 'จากภาพลักษณ์ของร้าน ไปถึงวิธีที่ร้านทำงาน',
                en: 'From the way your business looks, to the way it works.',
              })}
            </div>
            <p className="heroCopy">
              {t({
                th: 'Chapter99 ช่วยธุรกิจสร้างบ้านออนไลน์และระบบที่ใช้ได้จริง — จากภาพและวิดีโอ ไปถึงเว็บไซต์ การจอง การชำระเงิน ข้อมูลลูกค้า และการดูแลต่อเนื่อง',
                en: 'Chapter99 helps businesses build a professional digital presence and practical systems — from photography and video to website, booking, payments, customer management and ongoing care.',
              })}
            </p>
            <div className="actions">
              <a className="btn primary" href="#toolkit">
                {t({
                  th: 'Start with the Free Business Toolkit →',
                  en: 'Start with the Free Business Toolkit →',
                })}
              </a>
              <a className="btn secondary" href={AUDIT_MAIL}>
                {t({ th: 'Book a Business Audit', en: 'Book a Business Audit' })}
              </a>
            </div>
            <div className="trust">
              <span>Start free</span>
              <span>Quick setup</span>
              <span>Built for growth</span>
              <span>Ongoing care</span>
            </div>
            <div className="channel-row" aria-label="Contact channels">
              <a href={AUDIT_MAIL}><img src={siteIcons.gmail} alt="Email" /></a>
              <a href={siteContact.whatsapp} target="_blank" rel="noreferrer">
                <img src={siteIcons.whatsapp} alt="WhatsApp" />
              </a>
              <a href={siteContact.facebook} target="_blank" rel="noreferrer">
                <img src={siteIcons.chat} alt="Facebook" />
              </a>
              <span><img src={siteIcons.instagram} alt="" /></span>
              <span><img src={siteIcons.tiktok} alt="" /></span>
              <span><img src={siteIcons.youtube} alt="" /></span>
              <span><img src={siteIcons.smartphone} alt="" /></span>
            </div>
          </div>
          <div className="heroVisual">
            <div
              className="heroPhoto"
              style={{ backgroundImage: `url(${siteMedia.hero})` }}
            >
              <div className="demoCard">
                <h4>CHAPTER99 MASSAGE</h4>
                <p>Reference implementation · Demo Business</p>
                <div className="demoList">
                  <span>Online Booking</span>
                  <span>SMS Confirmations</span>
                  <span>Square Payments</span>
                  <span>Digital Receipts</span>
                  <span>Customer Records</span>
                  <span>Business Reports</span>
                </div>
                <a className="demoBtn" href={DEMO} target="_blank" rel="noreferrer">
                  Open Massage Demo ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="solutions">
        <div className="container center">
          <div className="kicker">One connected system</div>
          <h2>
            {t({
              th: 'ระบบเดียว หกผลลัพธ์ของธุรกิจ',
              en: 'One system. Six business outcomes.',
            })}
          </h2>
          <p className="lead">
            {t({
              th: 'Chapter99 เชื่อมชิ้นส่วนเข้าด้วยกัน ไม่ได้ขายงานดิจิทัลแยกชิ้น',
              en: 'Chapter99 connects the pieces instead of selling isolated digital tasks.',
            })}
          </p>
          <div className="system">
            <div className="systemItem">
              <div className="icon icon-glyph">
                <img src={siteIcons.monitor} alt="" />
              </div>
              <strong>LOOK</strong>
              <small>Photography · Video · Content</small>
            </div>
            <div className="systemItem">
              <div className="icon icon-glyph">
                <img src={siteIcons.search} alt="" />
              </div>
              <strong>BE FOUND</strong>
              <small>Website · Google · Presence</small>
            </div>
            <div className="systemItem">
              <div className="icon icon-glyph">
                <img src={siteIcons.smartphone} alt="" />
              </div>
              <strong>GET BOOKED</strong>
              <small>Booking · Calendar · SMS</small>
            </div>
            <div className="systemItem">
              <div className="icon icon-glyph">
                <img src={siteIcons.settings} alt="" />
              </div>
              <strong>GET PAID</strong>
              <small>Payments · POS · Receipts</small>
            </div>
            <div className="systemItem">
              <div className="icon icon-glyph">
                <img src={siteIcons.profile} alt="" />
              </div>
              <strong>RUN</strong>
              <small>Customers · Staff · Reports</small>
            </div>
            <div className="systemItem">
              <div className="icon icon-glyph">
                <img src={siteIcons.tiktok} alt="" />
              </div>
              <strong>GROW</strong>
              <small>Content · Retention · Care</small>
            </div>
          </div>
          <p className="lead" style={{ marginTop: 28 }}>
            {t({
              th: 'คุณดูแลลูกค้า เราดูแลระบบหลังร้าน',
              en: 'You look after customers. We look after the back office.',
            })}
          </p>
          <p className="lead" style={{ maxWidth: 640, margin: '8px auto 0' }}>
            {t({
              th: 'เว็บคือหน้าประตู การจอง การชำระเงิน และงานประจำวันคือระบบหลังร้าน',
              en: 'The website is the front door. Booking, payment and daily operations are the back office.',
            })}
          </p>
          <div style={{ marginTop: 22 }}>
            <Link className="btn primary" to="/pricing">
              {t({ th: 'ดูแพ็กเกจ & ราคา', en: 'View packages & pricing' })}
            </Link>
          </div>
        </div>
      </section>

      <section className="section soft" id="how">
        <div className="container journey">
          <div>
            <div className="kicker">The customer journey</div>
            <h2>{t({ th: 'เราเชื่อมชิ้นส่วนให้ต่อกัน', en: 'We connect the pieces.' })}</h2>
            <p className="lead" style={{ marginLeft: 0 }}>
              {t({
                th: 'ตั้งแต่ลูกค้าหาเจอ จนถึงร้านเห็นผลลัพธ์',
                en: 'From the moment a customer finds you, to the moment you see the result.',
              })}
            </p>
            <div className="flow">
              <div className="flowStep">
                <div className="flowIcon">
                  <img src={siteIcons.search} alt="" />
                </div>
                <small>Finds You</small>
              </div>
              <div className="flowStep">
                <div className="flowIcon">
                  <img src={siteIcons.menu} alt="" />
                </div>
                <small>Views Services</small>
              </div>
              <div className="flowStep">
                <div className="flowIcon">
                  <img src={siteIcons.notification} alt="" />
                </div>
                <small>Books</small>
              </div>
              <div className="flowStep">
                <div className="flowIcon">
                  <img src={siteIcons.chat} alt="" />
                </div>
                <small>Confirms</small>
              </div>
              <div className="flowStep">
                <div className="flowIcon">
                  <img src={siteIcons.chat} alt="" />
                </div>
                <small>Owner Notified</small>
              </div>
              <div className="flowStep">
                <div className="flowIcon">
                  <img src={siteIcons.profile} alt="" />
                </div>
                <small>Service</small>
              </div>
              <div className="flowStep">
                <div className="flowIcon">
                  <img src={siteIcons.email} alt="" />
                </div>
                <small>Payment / Receipt</small>
              </div>
              <div className="flowStep">
                <div className="flowIcon">
                  <img src={siteIcons.address} alt="" />
                </div>
                <small>Customer Record</small>
              </div>
            </div>
          </div>
          <div className="workflowMock">
            <div className="browser">
              <i /><i /><i />
            </div>
            <div className="shopScreen">
              <div className="shopHead">
                <video
                  className="shopHead-video"
                  src={siteMedia.shopVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
                <strong>Book Your Relaxation</strong>
                <small>Chapter99 Massage · Online Booking</small>
              </div>
              <div className="serviceRow">
                <span>Thai Massage · 60 min</span>
                <span className="pill">Book Now</span>
              </div>
              <div className="serviceRow">
                <span>Aroma Oil Massage · 60 min</span>
                <span className="pill">Book Now</span>
              </div>
              <div className="serviceRow">
                <span>Foot Massage · 30 min</span>
                <span className="pill">Book Now</span>
              </div>
            </div>
            <div className="phone">
              <strong>Select Date & Time</strong>
              <div className="slot">10:00 AM</div>
              <div className="slot active">11:00 AM</div>
              <div className="slot">2:00 PM</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="stages">
        <div className="container center">
          <div className="kicker">Customer growth path</div>
          <h2>
            {t({
              th: 'เริ่มจากจุดที่ร้านอยู่ แล้วขยายกับ Chapter99',
              en: 'Start where you are. Grow with Chapter99.',
            })}
          </h2>
          <p className="lead">
            {t({
              th: 'ไม่ต้องมีทุกอย่างในวันแรก เริ่มจากปัญหาที่สำคัญตอนนี้',
              en: 'You do not need everything on day one. Start with the problem that matters now.',
            })}
          </p>
          <div className="stages">
            <div className="stage">
              <div className="emoji"><img src={siteIcons.search} alt="" /></div>
              <h3>STARTER</h3>
              <p>{t({ th: 'เพิ่งเริ่ม ต้องการฐานที่แข็ง', en: 'Just getting started. Need a strong foundation.' })}</p>
              <Link to="/pricing#packages">Start Simple →</Link>
            </div>
            <div className="stage">
              <div className="emoji"><img src={siteIcons.smartphone} alt="" /></div>
              <h3>GROWING</h3>
              <p>{t({ th: 'ลูกค้ามากขึ้น ต้องการระบบที่ดีกว่า', en: 'Getting more customers. Need better systems.' })}</p>
              <Link to="/pricing#packages">Build & Optimise →</Link>
            </div>
            <div className="stage">
              <div className="emoji"><img src={siteIcons.settings} alt="" /></div>
              <h3>ESTABLISHED</h3>
              <p>{t({ th: 'งานแน่น ต้องการรายงานและระบบ', en: 'Busy and complex. Need automation and reports.' })}</p>
              <Link to="/pricing#packages">Streamline & Scale →</Link>
            </div>
            <div className="stage">
              <div className="emoji"><img src={siteIcons.location} alt="" /></div>
              <h3>MULTI-LOCATION</h3>
              <p>{t({ th: 'หลายสาขา ต้องการควบคุมจากศูนย์กลาง', en: 'Multiple locations. Need centralized control.' })}</p>
              <Link to="/pricing">Manage at Scale →</Link>
            </div>
            <div className="stage">
              <div className="emoji"><img src={siteIcons.monitor} alt="" /></div>
              <h3>ADVANCED</h3>
              <p>{t({ th: 'งานลึก ต้องการข้อมูลที่ชัดขึ้น', en: 'Advanced operations. Need deeper insights.' })}</p>
              <Link to="/pricing">Lead Your Market →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section demoSection" id="demo">
        <div className="container demoGrid">
          <div className="demoText">
            <div className="kicker" style={{ color: '#72a1ff' }}>
              See the system
            </div>
            <h2>
              {t({
                th: 'ดูการทำงานก่อนตัดสินใจซื้อ',
                en: 'See how it works before you buy.',
              })}
            </h2>
            <p>
              {t({
                th: 'เส้นทางจริง: เว็บไซต์ → บริการ → จอง → ยืนยัน → มุมเจ้าของ → ชำระเงิน / ใบเสร็จ → ข้อมูลลูกค้า',
                en: 'Show the real customer flow: Website → Services → Booking → Confirmation → Owner view → Payment / Receipt → Customer record.',
              })}
            </p>
            <div className="actions">
              <a className="btn primary" href={DEMO} target="_blank" rel="noreferrer">
                Open Massage Demo ↗
              </a>
              <a className="btn secondary" href={AUDIT_MAIL}>
                Book a Business Audit
              </a>
            </div>
          </div>
          <div className="demoFlow">
            <div className="demoRow">
              <img className="demo-ico" src={siteIcons.search} alt="" />
              <div>
                <strong>Customer finds the business</strong>
                <small>Website / Google / online presence</small>
              </div>
            </div>
            <div className="demoRow">
              <img className="demo-ico" src={siteIcons.smartphone} alt="" />
              <div>
                <strong>Customer chooses a service and time</strong>
                <small>Booking + availability + confirmations</small>
              </div>
            </div>
            <div className="demoRow">
              <img className="demo-ico" src={siteIcons.chat} alt="" />
              <div>
                <strong>Owner receives the booking</strong>
                <small>iPad Shop Mode or Mobile SMS Mode</small>
              </div>
            </div>
            <div className="demoRow">
              <img className="demo-ico" src={siteIcons.settings} alt="" />
              <div>
                <strong>Service → payment → receipt</strong>
                <small>Payment provider / POS / receipt workflow</small>
              </div>
            </div>
            <div className="demoRow">
              <img className="demo-ico" src={siteIcons.profile} alt="" />
              <div>
                <strong>Customer record and reporting</strong>
                <small>Operational data becomes useful business information</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section soft" id="proof">
        <div className="container">
          <div className="center">
            <div className="kicker">Proof</div>
            <h2>
              {t({
                th: 'อย่าเชื่อคำโฆษณาอย่างเดียว ดูงานจริง',
                en: "Don't take our word for it. See the work.",
              })}
            </h2>
            <p className="lead">
              {t({
                th: 'ใช้ภาพหน้าจอจริง เวิร์กโฟลว์ และหลักฐานที่ตรวจได้เมื่อมีข้อมูล',
                en: 'Use real screenshots, workflows, before/after evidence and measured results as they become available.',
              })}
            </p>
          </div>
          <div className="proofGrid">
            <div className="proof">
              <div className="beforeAfter">
                <img src={siteMedia.massage} alt="Massage studio website" />
              </div>
              <div className="proofBody">
                <strong>Massage reference implementation</strong>
                <small>Live spa website layout from Chapter99 storage.</small>
              </div>
            </div>
            <div className="proof">
              <div className="beforeAfter">
                <img src={siteMedia.booking} alt="Massage booking website" />
              </div>
              <div className="proofBody">
                <strong>Booking workflow</strong>
                <small>Customer finds the shop, then books from the page.</small>
              </div>
            </div>
            <div className="proof">
              <div className="beforeAfter">
                <img src={siteMedia.restaurant} alt="Restaurant ordering app" />
              </div>
              <div className="proofBody">
                <strong>Restaurant operations</strong>
                <small>Menu, ordering and shop presence in one screen.</small>
              </div>
            </div>
          </div>
          <div className="proofNote">
            Do not publish invented testimonials, numbers, ROI or features. Replace these cards with verified evidence before launch.
          </div>
        </div>
      </section>

      <section className="audit" id="audit">
        <div className="container">
          <div className="auditBox">
            <div>
              <div className="kicker">Business Audit</div>
              <h2>{t({ th: 'มาดูร้านของคุณกัน', en: "Let's look at your business." })}</h2>
              <p>
                {t({
                  th: 'บอกเราว่าร้านทำงานอย่างไรวันนี้ อะไรเสียเวลา และอยากปรับอะไร Chapter99 จะแนะนำสิ่งที่ควรเริ่มก่อน',
                  en: 'Tell us how your business works today, what takes your time, and what you want to improve. Chapter99 can then recommend what matters first.',
                })}
              </p>
            </div>
            <div className="actions">
              <a className="btn primary" href={AUDIT_MAIL}>
                Book a Business Audit →
              </a>
              <a className="btn secondary" href="#toolkit">
                Start with Free Toolkit
              </a>
            </div>
          </div>
          <NewsletterCard />
        </div>
      </section>

      <FaqSection />
      <MassageToolkit />
    </main>
  );
}

export default function HomePage() {
  return (
    <SiteLayout>
      <HomeInner />
    </SiteLayout>
  );
}
