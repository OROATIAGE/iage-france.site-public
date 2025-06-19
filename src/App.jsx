import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import { AnimatePresence } from 'framer-motion' // Mettre en commentaire temporairement
import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Sectors from './pages/Sectors'
import About from './pages/About'
import SectorPage from './pages/SectorPage'
import ScrollToTop from './components/ScrollToTop'
import { DiagboxGazonPage } from './pages/DiagboxGazonPage'
// Import new pages
import PrivacyPolicy from './pages/PrivacyPolicy' 
import LegalNotice from './pages/LegalNotice'
import DiagboxPage from './pages/DiagboxPage'
import Sector09Page from './pages/Sector09Page'
import Sector10Page from './pages/Sector10Page'
import Sector12Page from './pages/Sector12Page'
import Sector13Page from './pages/Sector13Page'
import PressPage from './pages/PressPage'
import TestimonialsPage from './pages/TestimonialsPage'
import EventsPage from './pages/EventsPage'
import DocumentsPage from './pages/DocumentsPage'

function App() {
  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900">
            <Navbar />
          </div>
          <main className="flex-grow pt-16 relative">
            {/* <AnimatePresence mode="wait"> Mettre en commentaire temporairement */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/:lang" element={<Home />} />
                <Route path="/:lang/about" element={<About />} />
                <Route path="/:lang/services" element={<Services />} />
                <Route path="/:lang/services/diagbox/04" element={<DiagboxGazonPage />} />
                <Route path="/:lang/sectors" element={<Sectors />} />
                <Route path="/:lang/sectors/:sectorId" element={<SectorPage />} />
                <Route path="/:lang/sectors/09" element={<Sector09Page />} />
                <Route path="/:lang/sectors/10" element={<Sector10Page />} />
                <Route path="/:lang/sectors/12" element={<Sector12Page />} />
                <Route path="/:lang/sectors/13" element={<Sector13Page />} />
                <Route path="/:lang/contact" element={<Contact />} />
                <Route path="/:lang/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/:lang/legal-notice" element={<LegalNotice />} />
                <Route path="/:lang/diagbox" element={<DiagboxPage />} />
                <Route path="/:lang/press" element={<PressPage />} />
                <Route path="/:lang/testimonials" element={<TestimonialsPage />} />
                <Route path="/:lang/events" element={<EventsPage />} />
                <Route path="/:lang/documents" element={<DocumentsPage />} />
                {/* Routes sans langue pour la rétrocompatibilité */}
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/diagbox/04" element={<DiagboxGazonPage />} />
                <Route path="/sectors" element={<Sectors />} />
                <Route path="/sectors/:sectorId" element={<SectorPage />} />
                <Route path="/sectors/09" element={<Sector09Page />} />
                <Route path="/sectors/10" element={<Sector10Page />} />
                <Route path="/sectors/12" element={<Sector12Page />} />
                <Route path="/sectors/13" element={<Sector13Page />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/legal-notice" element={<LegalNotice />} />
                <Route path="/diagbox" element={<DiagboxPage />} />
                <Route path="/press" element={<PressPage />} />
                <Route path="/testimonials" element={<TestimonialsPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/documents" element={<DocumentsPage />} />
              </Routes>
            {/* </AnimatePresence> Mettre en commentaire temporairement */}
          </main>
          <Footer />
          <ScrollToTop />
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App 