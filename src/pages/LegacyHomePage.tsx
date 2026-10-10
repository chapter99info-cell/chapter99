import { useEffect } from 'react'
import { setSeo } from '../lib/seo'
import SiteHomePage from '../site/HomePage'

export default function LegacyHomePage() {
  useEffect(() => {
    setSeo({
      title: 'Chapter99 — หน้าเดิม',
      description: 'หน้าโฮมเพจเดิม เก็บไว้ดูย้อนหลัง ไม่ใช้เป็นหน้าแรก',
      path: '/legacy',
      robots: 'noindex,nofollow',
    })
  }, [])
  return <SiteHomePage />
}
