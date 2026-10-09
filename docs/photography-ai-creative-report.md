# Photography & AI Creative — รายงานขึ้น Production

## 1. Live URL + deploy
- หน้าบนมือถือ: https://chapter99info.com/photography
- โฮมเพจยังเป็น `/` → `/mockup/` ตาม vercel.json (ไม่ได้แก้)
- สถานะดีพลอย: ดูท้ายรายงานหลัง push

## 2. SHA
- ROLLBACK_SHA: `441320dfac145b2d47e42738afe71cea86cce416`
- Commit งานนี้: ใส่หลัง `git log -1`

## 3. ไฟล์ที่เปลี่ยน
- `src/pages/PhotographyPage.tsx` (reuse `/photography`)
- `src/styles/photo-v7.css`
- `src/data/photoPortfolio.ts`
- `src/components/photo-v7/CompareSlider.tsx`
- `src/cinematic/components/PackagesPricing.tsx` (ลิงก์เดียวบนแท็บภาพ)
- `public/portfolio/approved/manifest.json` + `README.md`
- `docs/screenshots/photography-{390,820,1440}.png`
- `tests/photography.spec.ts`, `playwright.config.ts`
- `package.json` / `package-lock.json` (`@playwright/test`)
- `.gitignore` (test-results)

## 4. สกรีนช็อต
- `docs/screenshots/photography-390.png`
- `docs/screenshots/photography-820.png`
- `docs/screenshots/photography-1440.png`

## 5. เทส
- `npm run build`: ผ่าน
- oxlint ไฟล์ใหม่: ผ่าน
- Playwright 390/820/1440: ไม่มีสกอร์ลแนวนอน, ปุ่ม `.btn` สูง ≥ 44px, ตัวอักษร ≥ 16px, ลิงก์ WhatsApp ถูก
- คีย์บอร์ด: Tab บนหน้า; สไลเดอร์ยังไม่โชว์เพราะไม่มีคู่ภาพที่อนุญาต
- Live smoke: ใส่หลังดีพลอย

## 6. SOP / ราคา
- Starter / Professional ไม่แตะ ✓
- Photography เริ่มต้น A$349 · ตามขอบเขตที่ตกลง ✓
- Reels Video เริ่มต้น A$349 · ตามขอบเขตที่ตกลง ✓
- AI Creative / Brand Kit / Poster Design = สอบถามราคา ✓
- ข้อความ Add-on ไม่บังคับ · ไม่รวมใน Starter / Professional ✓
- ไม่มีรีวิวปลอม / ไม่มีเลขสถิติ / ไม่รับประกันยอดขาย ✓
- ไม่เปิดหรือคอมมิต `anon key.txt` / `.env` ✓
- ไม่แก้ `/api` `/supabase` admin photo-manager vercel.json ✓

## 7. สิ่งที่เจ้าของยังต้องใส่
- ภาพที่ร้านอนุญาตใน `public/portfolio/approved/` + บรรทัดใน `manifest.json` (`permission.approved: true`)
- คู่ Before/After จริงพร้อม `sourceNote` และสิทธิ์ร้าน
- ไฟล์ `team.webp` ไม่เกี่ยวกับหน้านี้

## 8. การตัดสินใจตอนกลางคืน
- `npm ci` ล้ม (EPERM เพราะ Vite ล็อกไฟล์) → ใช้ `npm install` ที่มีอยู่แล้ว
- พอร์ตโฟลิโอว่างตามกฎ — ไม่ดึงรูปจากโฟลเดอร์อื่น
- ฮีโร่เป็นตัวอักษรกรมท่า/ทอง เพราะยังไม่มี REAL PHOTO ที่อนุญาต
- Before/After เป็นข้อความอย่างเดียว ไม่มีสไลเดอร์ว่าง
- ลิงก์ตัวอย่างเว็บ = `/v7#massage`
- ขึ้น `main` ตามคำสั่งเจ้าของคืนนี้ (ไม่ใช้ PR)
