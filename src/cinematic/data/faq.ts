import type { Bilingual } from '../i18n/types';

export type FaqItem = {
  id: string;
  cat: string;
  question: Bilingual;
  answers: Bilingual[];
};

export type FaqTab = {
  cat: string;
  label: Bilingual;
};

export type FaqSection = {
  tabs: FaqTab[];
  items: FaqItem[];
};

export const photographyFaq: FaqSection = {
  tabs: [
    {
      cat: 'booking',
      label: { th: 'การจอง &amp; ระยะเวลา', en: 'Booking &amp; Timeline' },
    },
    {
      cat: 'other',
      label: { th: 'เงื่อนไขอื่นๆ', en: 'Other Terms' },
    },
  ],
  items: [
    {
      id: 'photo-booking',
      cat: 'booking',
      question: { th: 'การจอง &amp; ชำระเงิน', en: 'Booking &amp; Payment' },
      answers: [
        {
          th: 'มัดจำ 50% ก่อนเริ่มถ่ายงาน ส่วนที่เหลือชำระภายใน 3 วันหลังส่งมอบไฟล์',
          en: '50% deposit before the shoot starts, remainder due within 3 days of file delivery',
        },
        {
          th: 'ยกเลิกงานหลังเริ่มดำเนินการแล้ว ขอสงวนสิทธิ์ไม่คืนเงินมัดจำ',
          en: 'Cancelling after work has started forfeits the deposit',
        },
        {
          th: 'งานถ่ายภาพทุกครั้งต้องมีใบเสนอราคายืนยันขอบเขตงาน (วันที่ สถานที่ ระยะเวลา ราคา) ก่อนเริ่มงานเสมอ แม้ลูกค้าจะเป็นผู้ใช้บริการเว็บ Front+Back หรือบริการอื่นของ Chapter99 อยู่แล้วก็ตาม เพราะเป็นการจ้างงานคนละส่วนกัน ไม่มีการรวมสิทธิ์การถ่ายภาพไว้ในแพ็กบริการรายเดือนใดๆ',
          en: 'Every photography job needs a confirmed quote (date, location, duration, price) before work starts — even if the client already uses Chapter99 Web Front+Back or another service. These are separate engagements. No monthly package includes photography.',
        },
      ],
    },
    {
      id: 'photo-delivery',
      cat: 'booking',
      question: { th: 'ระยะเวลาส่งงาน', en: 'Delivery Time' },
      answers: [
        {
          th: 'ไฟล์ตัวอย่าง (Preview) — ภายใน 2 วันทำการ',
          en: 'Preview files — within 2 business days',
        },
        {
          th: 'ไฟล์ฉบับสมบูรณ์ — ภายใน 5-7 วันทำการ',
          en: 'Final files — within 5-7 business days',
        },
      ],
    },
    {
      id: 'photo-revisions',
      cat: 'booking',
      question: { th: 'การแก้ไขงาน', en: 'Revisions' },
      answers: [
        {
          th: 'แก้ไขได้สูงสุด 1 รอบ ภายใต้ขอบเขตงานเดิม',
          en: 'Up to 1 revision round, within the original scope',
        },
        {
          th: 'เกินกว่านั้นคิดค่าใช้จ่ายเพิ่มเติมตามอัตราที่ตกลง',
          en: 'Beyond that, additional charges apply at the agreed rate',
        },
      ],
    },
    {
      id: 'photo-travel',
      cat: 'other',
      question: { th: 'ค่าเดินทาง', en: 'Travel' },
      answers: [
        {
          th: 'ฟรีในรัศมี 20 กม. จากซิดนีย์ซิตี้',
          en: 'Free within 20km of Sydney CBD',
        },
        {
          th: 'นอกรัศมี คิดตามระยะทางจริง แจ้งราคาก่อนยืนยันงาน',
          en: 'Beyond that, charged by actual distance, quoted before confirming',
        },
      ],
    },
    {
      id: 'photo-rights',
      cat: 'other',
      question: { th: 'ลิขสิทธิ์การใช้งาน', en: 'Usage Rights' },
      answers: [
        {
          th: 'ลูกค้าใช้เชิงพาณิชย์ได้เต็มที่สำหรับธุรกิจของตนเอง',
          en: 'Full commercial use for your own business',
        },
        {
          th: 'Chapter99 สงวนสิทธิ์นำผลงานไปเผยแพร่เป็นพอร์ตโฟลิโอ เว้นแต่ตกลงเป็นความลับ',
          en: 'Chapter99 reserves the right to feature work in our portfolio unless agreed confidential',
        },
      ],
    },
    {
      id: 'photo-monthly',
      cat: 'other',
      question: {
        th: 'แพ็กเกจรายเดือน &amp; บริการเสริม',
        en: 'Monthly Plan &amp; Add-ons',
      },
      answers: [
        {
          th: 'ไม่มีสัญญาผูกมัด 12 เดือน แจ้งยกเลิกล่วงหน้า 30 วัน',
          en: 'No 12-month lock-in, cancel with 30 days notice',
        },
        {
          th: 'ชั่วโมงเพิ่ม A$120/ชม. · Rush Delivery +A$90 · เพิ่ม Location +A$150',
          en: 'Extra hour A$120/hr · Rush Delivery +A$90 · Extra location +A$150',
        },
      ],
    },
  ],
};

export const webFaq: FaqSection = {
  tabs: [
    {
      cat: 'scope',
      label: { th: 'งานและขอบเขต', en: 'Scope &amp; Timeline' },
    },
    {
      cat: 'system',
      label: { th: 'ระบบและสัญญา', en: 'System &amp; Contract' },
    },
  ],
  items: [
    {
      id: 'web-time',
      cat: 'scope',
      question: { th: 'ระยะเวลาพัฒนา', en: 'Development Time' },
      answers: [
        { th: 'Starter — 3-5 วันทำการ', en: 'Starter — 3-5 business days' },
        {
          th: 'Professional — 7-10 วันทำการ',
          en: 'Professional — 7-10 business days',
        },
        {
          th: 'Ultimate — 10-14 วันทำการ',
          en: 'Ultimate — 10-14 business days',
        },
      ],
    },
    {
      id: 'web-revisions',
      cat: 'scope',
      question: {
        th: 'การแก้ไข &amp; ขอบเขตงาน',
        en: 'Revisions &amp; Scope',
      },
      answers: [
        {
          th: 'แก้ไขได้ 2 รอบ ในขอบเขตที่ตกลง เกินกว่านั้นคิดเพิ่มตามอัตราต่อชั่วโมง',
          en: '2 revision rounds within agreed scope, beyond that billed hourly',
        },
        {
          th: 'ไม่รวม: ฟีเจอร์นอกสเปก, สกุลเงินอื่นนอก AUD, การเชื่อมต่อ third-party ที่ไม่ได้ระบุไว้',
          en: 'Excludes: out-of-spec features, non-AUD currencies, unspecified third-party integrations',
        },
        {
          th: 'ขอบเขตงานของแพ็กเว็บ Front+Back ครอบคลุมเฉพาะระบบเว็บไซต์ ระบบจอง และระบบหลังบ้าน ตามที่ระบุในแพ็กที่เลือกเท่านั้น ไม่รวมงานถ่ายภาพ วิดีโอ หรือคอนเทนต์สร้างสรรค์อื่นใด หากต้องการภาพถ่ายจริงประกอบเว็บไซต์ สามารถจองคิวถ่ายภาพแยกได้ที่หน้า \'ราคาช่างภาพ\'',
          en: 'Web Front+Back covers only the website, booking, and back-office systems listed in the chosen plan — not photography, video, or other creative content. For real photos on the site, book a shoot separately from the photography rates page.',
        },
      ],
    },
    {
      id: 'web-hosting',
      cat: 'system',
      question: { th: 'Hosting &amp; ข้อมูล', en: 'Hosting &amp; Data' },
      answers: [
        {
          th: 'รวม Hosting ปีแรกในแพ็ก ปีถัดไปคิดตามจริง (Vercel/Supabase) — โดเมนเป็นของร้านเอง',
          en: 'First year hosting included (Vercel/Supabase), billed at cost after — domain is owned by the shop',
        },
        {
          th: 'ข้อมูลลูกค้า/ยอดขาย Export CSV ได้ทุกเมื่อ ไม่ผูกติดกับ Chapter99',
          en: 'Customer/sales data can be exported to CSV anytime, not locked to Chapter99',
        },
      ],
    },
    {
      id: 'web-payment',
      cat: 'system',
      question: { th: 'ขอบเขตการรับเงิน', en: 'Payment Scope' },
      answers: [
        {
          th: 'เราไม่ยุ่งเกี่ยวกับเงินทุกขั้นตอน — ไม่รับ ไม่โอน ไม่เก็บเงินแทนร้าน',
          en: "We never touch money at any step — we don't receive, transfer, or hold it for the shop",
        },
        {
          th: 'ร้านรับเงินเองผ่านเครื่องรูดบัตร/HICAPS terminal ที่มีอยู่แล้ว เราแค่บันทึกตัวเลขไว้ออกรายงาน',
          en: 'The shop collects payment via their own card terminal/HICAPS — we just log the numbers for reporting',
        },
        {
          th: 'งานถ่ายภาพและวิดีโอไม่รวมอยู่ในค่าบริการเว็บ Front+Back หรือบริการอื่นๆ ไม่ว่าแพ็กใดทั้งสิ้น ค่าบริการรายเดือนของระบบเว็บ Front+Back ครอบคลุมเฉพาะระบบ (เว็บไซต์ ระบบจอง ระบบหลังบ้าน และฟีเจอร์ที่ระบุไว้ในแพ็กนั้นๆ) เท่านั้น งานถ่ายภาพหรือวิดีโอทุกครั้ง — ไม่ว่าลูกค้าจะเป็นสมาชิกแพ็กเว็บ/หลังบ้านอยู่แล้วหรือไม่ — ถือเป็นการจ้างงานแยกต่างหาก คิดราคาตามอัตราที่ระบุไว้ในหน้า \'ราคาช่างภาพ\' และต้องมีใบเสนอราคายืนยันก่อนเริ่มงานทุกครั้ง',
          en: 'Photography and video are not included in Web Front+Back or any other service package. The monthly Web Front+Back fee covers the system only (website, booking, back office, and features listed in that plan). Every photography or video job — whether or not the client already subscribes to a web/back-office plan — is a separate engagement, billed at the photography rates page, and requires a confirmed quote before work starts.',
        },
      ],
    },
    {
      id: 'web-contract',
      cat: 'system',
      question: { th: 'เงื่อนไขสัญญา', en: 'Contract Terms' },
      answers: [
        {
          th: 'ไม่มีสัญญาผูกมัด 12 เดือน ยกเลิกหรือเปลี่ยนแพ็กได้ แจ้งล่วงหน้า 30 วัน',
          en: 'No 12-month lock-in — cancel or change plans with 30 days notice',
        },
      ],
    },
  ],
};

export const otherFaq: FaqSection = {
  tabs: [{ cat: 'all', label: { th: 'ทั่วไป', en: 'General' } }],
  items: [
    {
      id: 'other-pay',
      cat: 'all',
      question: { th: 'การชำระเงิน', en: 'Payment' },
      answers: [
        {
          th: 'งานตั้งค่าครั้งเดียว ชำระเต็มจำนวนก่อนเริ่มงาน',
          en: 'One-time setup, paid in full before starting',
        },
        {
          th: 'บริการรายเดือน เรียกเก็บล่วงหน้าทุกรอบบิล',
          en: 'Monthly service, billed in advance each cycle',
        },
      ],
    },
    {
      id: 'other-setup',
      cat: 'all',
      question: { th: 'ระยะเวลาติดตั้ง', en: 'Setup Time' },
      answers: [
        {
          th: 'QR Menu / Maps / Review Link — ภายใน 2-3 วันทำการ',
          en: 'QR Menu / Maps / Review Link — within 2-3 business days',
        },
        {
          th: 'Digital Signage — ภายใน 5-7 วันทำการ (ขึ้นกับอุปกรณ์หน้าร้าน)',
          en: 'Digital Signage — within 5-7 business days (depends on in-store equipment)',
        },
      ],
    },
    {
      id: 'other-monthly',
      cat: 'all',
      question: { th: 'เงื่อนไขบริการรายเดือน', en: 'Monthly Terms' },
      answers: [
        {
          th: 'ไม่มีสัญญาผูกมัด 12 เดือน แจ้งยกเลิกล่วงหน้า 30 วัน',
          en: 'No 12-month lock-in, cancel with 30 days notice',
        },
        {
          th: 'ลูกค้าจัดหาอุปกรณ์ (จอ/แท็บเล็ต) เอง — Chapter99 ไม่ขายฮาร์ดแวร์',
          en: "Customer supplies their own hardware (screen/tablet) — Chapter99 doesn't sell hardware",
        },
        {
          th: 'งานถ่ายภาพและวิดีโอไม่รวมอยู่ในค่าบริการเว็บ Front+Back หรือบริการอื่นๆ ไม่ว่าแพ็กใดทั้งสิ้น ค่าบริการรายเดือนของระบบเว็บ Front+Back ครอบคลุมเฉพาะระบบ (เว็บไซต์ ระบบจอง ระบบหลังบ้าน และฟีเจอร์ที่ระบุไว้ในแพ็กนั้นๆ) เท่านั้น งานถ่ายภาพหรือวิดีโอทุกครั้ง — ไม่ว่าลูกค้าจะเป็นสมาชิกแพ็กเว็บ/หลังบ้านอยู่แล้วหรือไม่ — ถือเป็นการจ้างงานแยกต่างหาก คิดราคาตามอัตราที่ระบุไว้ในหน้า \'ราคาช่างภาพ\' และต้องมีใบเสนอราคายืนยันก่อนเริ่มงานทุกครั้ง',
          en: 'Photography and video are not included in Web Front+Back or any other service package. The monthly Web Front+Back fee covers the system only (website, booking, back office, and features listed in that plan). Every photography or video job — whether or not the client already subscribes to a web/back-office plan — is a separate engagement, billed at the photography rates page, and requires a confirmed quote before work starts.',
        },
      ],
    },
  ],
};
