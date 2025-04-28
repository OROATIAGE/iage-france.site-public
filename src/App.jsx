import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import { AnimatePresence } from 'framer-motion' // Mettre en commentaire temporairement
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Sectors from './pages/Sectors'
import About from './pages/About'
import SectorPage from './pages/SectorPage'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16">
          {/* <AnimatePresence mode="wait"> Mettre en commentaire temporairement */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/sectors" element={<Sectors />} />
              <Route path="/sectors/:sectorId" element={<SectorPage />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          {/* </AnimatePresence> Mettre en commentaire temporairement */}
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App 