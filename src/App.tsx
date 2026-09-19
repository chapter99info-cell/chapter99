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
import { RestaurantsPage } from './pages/RestaurantsPage'
import { WorkPage } from './pages/WorkPage'
import SiteHomePage from './site/HomePage'
import { SolutionPage } from './pages/SolutionPage'
import { SitePricingPage } from './pages/SitePricingPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ToolkitHubPage } from './pages/toolkit/ToolkitHubPage'
import { EnglishMessagePage } from './pages/toolkit/EnglishMessagePage'
import { PriceListPage } from './pages/toolkit/PriceListPage'
import { ReviewReplyPage } from './pages/toolkit/ReviewReplyPage'
import { PosterStudioPage } from './pages/toolkit/PosterStudioPage'
import { BusinessCheckPage } from './pages/toolkit/BusinessCheckPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SiteHomePage />} />
      <Route path="/solutions/:slug" element={<SolutionPage />} />
      <Route path="/pricing" element={<SitePricingPage />} />
      <Route path="/toolkit" element={<ToolkitHubPage />} />
      <Route path="/toolkit/english-message" element={<EnglishMessagePage />} />
      <Route path="/toolkit/price-list" element={<PriceListPage />} />
      <Route path="/toolkit/review-reply" element={<ReviewReplyPage />} />
      <Route path="/toolkit/poster-studio" element={<PosterStudioPage />} />
      <Route path="/business-check" element={<BusinessCheckPage />} />
      <Route path="/business-toolkit" element={<Navigate to="/toolkit" replace />} />
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
