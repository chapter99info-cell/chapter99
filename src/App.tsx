import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import ServicesSection from './components/ServicesSection'
import ClientsMarquee from './components/ClientsMarquee'
import WhySection from './components/WhySection'
import V4RestaurantPricing from './components/V4RestaurantPricing'
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
      <WhySection />
      <V4RestaurantPricing />
      <V4WellnessPricing />
      <ContactSection />
      <Footer />
    </>
  )
}

export default App
