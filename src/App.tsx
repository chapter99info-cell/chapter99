import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { LegalDocPage } from './pages/LegalDocPage'
import { LegalHubPage } from './pages/LegalHubPage'
import { DemoMassagePage } from './pages/DemoMassagePage'
import { BeautyPage } from './pages/BeautyPage'
import { CleaningPage } from './pages/CleaningPage'
import { MassagePage } from './pages/MassagePage'
import { PhotographyPage } from './pages/PhotographyPage'
import { V7IconsTestPage } from './pages/V7IconsTestPage'
import { RestaurantsPage } from './pages/RestaurantsPage'
import { WorkPage } from './pages/WorkPage'
import { BusinessToolkitPage } from './pages/BusinessToolkitPage'
import { PricingPage } from './pages/pricing/PricingPage'
import { NotFoundPage } from './pages/NotFoundPage'
import './site/theme-navy.css' // ธีมกรมท่า — ต้องอยู่หลัง import หน้าอื่น ๆ

const HomeV7 = lazy(() => import('./pages/HomeV7'))
const LegacyHomePage = lazy(() => import('./pages/LegacyHomePage'))

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={null}>
            <HomeV7 />
          </Suspense>
        }
      />
      <Route path="/v7" element={<Navigate to="/" replace />} />
      <Route path="/v7/icons-test" element={<V7IconsTestPage />} />
      <Route
        path="/legacy"
        element={
          <Suspense fallback={null}>
            <LegacyHomePage />
          </Suspense>
        }
      />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/business-toolkit" element={<BusinessToolkitPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/massage" element={<MassagePage />} />
      <Route path="/restaurants" element={<RestaurantsPage />} />
      <Route path="/photography" element={<PhotographyPage />} />
      <Route path="/beauty" element={<BeautyPage />} />
      <Route path="/cleaning" element={<CleaningPage />} />
      <Route path="/work" element={<WorkPage />} />
      <Route path="/legal" element={<LegalHubPage />} />
      <Route path="/legal/:slug" element={<LegalDocPage />} />
      <Route path="/demo/massage" element={<DemoMassagePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
