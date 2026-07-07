import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import ServicesSection from './components/ServicesSection'
import ClientsMarquee from './components/ClientsMarquee'
import LiveProjectsSection from './components/LiveProjectsSection'
import WhySection from './components/WhySection'
import V4WellnessPricing from './components/V4WellnessPricing'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <div className="flex h-screen flex-col overflow-hidden">
        <Navbar />
        <HeroSection />
      </div>
      <ServicesSection />
      <ClientsMarquee />
      <LiveProjectsSection />
      <WhySection />
      <V4WellnessPricing />
      <ContactSection />
      <Footer />
    </>
  )
}

export default App
