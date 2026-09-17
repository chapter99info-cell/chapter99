import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { LegalDocPage } from './pages/LegalDocPage'
import { LegalHubPage } from './pages/LegalHubPage'
import { DemoMassagePage } from './pages/DemoMassagePage'
import { MassagePage } from './pages/MassagePage'
import { PhotographyPage } from './pages/PhotographyPage'
import { RestaurantsPage } from './pages/RestaurantsPage'
import { WorkPage } from './pages/WorkPage'
import { BusinessToolkitPage } from './pages/BusinessToolkitPage'
import SiteHomePage from './site/HomePage'
import { SitePricingPage } from './pages/SitePricingPage'
import { NotFoundPage } from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SiteHomePage />} />
      <Route path="/pricing" element={<SitePricingPage />} />
      <Route element={<Layout />}>
        <Route path="/massage" element={<MassagePage />} />
        <Route path="/restaurants" element={<RestaurantsPage />} />
        <Route path="/photography" element={<PhotographyPage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/legal" element={<LegalHubPage />} />
        <Route path="/legal/:slug" element={<LegalDocPage />} />
        <Route path="/demo/massage" element={<DemoMassagePage />} />
        <Route path="/business-toolkit" element={<BusinessToolkitPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
