import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

mkdirSync("public/og", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(`<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Kanit:wght@600&display=swap" rel="stylesheet">
<style>
html,body{margin:0;width:1200px;height:630px;background:#0A0F1A;color:#FBF7EE;overflow:hidden}
.card{width:1200px;height:630px;display:flex;flex-direction:column;justify-content:center;padding:72px 80px;box-sizing:border-box;background:
  radial-gradient(circle at 85% 20%, rgba(232,181,74,.18), transparent 42%), #0A0F1A}
.kicker{font-family:Anton,Impact,sans-serif;letter-spacing:.16em;font-size:22px;color:#E8B54A;margin:0 0 18px}
h1{font-family:Kanit,sans-serif;font-weight:600;font-size:54px;line-height:1.3;letter-spacing:0;margin:0 0 16px;max-width:18ch}
p{font-family:Kanit,sans-serif;font-weight:500;font-size:22px;line-height:1.45;color:#E8B54A;margin:0}
</style>
</head>
<body>
<div class="card">
  <p class="kicker">CHAPTER99</p>
  <h1>งานหลังร้านน้อยลง มีเวลาดูแลลูกค้ามากขึ้น</h1>
  <p>เว็บไซต์ · จองคิว · เครื่องมือร้าน</p>
</div>
</body>
</html>`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: "public/og/chapter99-og.jpg", type: "jpeg", quality: 86 });
await browser.close();
console.log("wrote public/og/chapter99-og.jpg");
