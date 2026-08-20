import { useEffect } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { Portfolio } from './components/Portfolio';
import { Gallery } from './components/Gallery';
import { PricingHub } from './components/PricingHub';
import { AIBridge } from './components/AIBridge';
import { Approach } from './components/Approach';
import { Footer } from './components/Footer';
import './styles/mockup.css';

/**
 * Prisma-cinematic homepage ported from chapter99-mockup-prisma-cinematic.html.
 * Uses its own bilingual LanguageProvider (object-based t()) so it does not
 * conflict with the site-wide key-based LanguageProvider in Root.tsx.
 */
export default function CinematicHome() {
  useEffect(() => {
    document.body.classList.add('cinematic-page');
    return () => {
      document.body.classList.remove('cinematic-page');
    };
  }, []);

  return (
    <LanguageProvider>
      <div className="cinematic-home">
        <Nav />
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Gallery />
        <PricingHub />
        <AIBridge />
        <Approach />
        <Footer />
      </div>
    </LanguageProvider>
  );
}
