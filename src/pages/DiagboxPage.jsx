import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import { getTextByLanguage } from '../utils/textHelpers';
import { getEnhancedKitData } from '../utils/kitDataHelpers';
import DiagboxDomainNav from '../components/DiagboxDomainNav';
import DiagboxKitTable from '../components/DiagboxKitTable';

// Helper function to get texts for this page
const getPageText = (key, defaultValue = '') => {
  const { language } = useLanguage();
  return getTextByLanguage(`diagbox.${key}`, language, defaultValue);
};

// Data for the "Simple à utiliser" steps
const simpleSteps = [
  { key: "process.step1", icon: "/assets/icons/DIAGBOX.svg", alt: "Ouvrir le kit" },
  { key: "process.step2", icon: "/assets/icons/prélèvement (gazon).svg", alt: "Prélever l'échantillon" },
  { key: "process.step3", icon: "/assets/icons/enregistrement.svg", alt: "Scanner le QR code" },
  { key: "process.step4", icon: "/assets/icons/envoi.svg", alt: "Envoyer au laboratoire" },
  { key: "process.step5", icon: "/assets/icons/Résultats.svg", alt: "Obtenir les résultats" }
];

// --- Data for Diagbox List Section ---

// Data for Gazon Diagbox Table (copied from DiagboxGazonPage.jsx / SectorPage.jsx)
const kitTypesForGazon = [
  { type: 'lingette', kits: ['PF000011', 'PF000013', 'PF000015'] },
  { type: 'dechet', kits: ['PF000016', 'PF000018', 'PF000019', 'PF000020'] },
  { type: 'sympto', kits: ['PF000033', 'PF000035'] },
  { type: 'racine', kits: ['PF000048'] },
  { type: 'sol', kits: ['PF000047'] },
  { type: 'racine_gazon', kits: ['PF000049'] },
  { type: 'plaquage', kits: ['PF000050'] }
];

const priceListForGazon = [
  'PF000011', 'PF000013', 'PF000015', 'PF000016', 'PF000018', 'PF000019',
  'PF000020', 'PF000033', 'PF000035', 'PF000047', 'PF000048', 'PF000049',
  'PF000050'
];

const kitRefToSectionIdMapForGazon = {};
kitTypesForGazon.forEach(typeInfo => {
  typeInfo.kits.forEach(kitRef => {
    kitRefToSectionIdMapForGazon[kitRef] = typeInfo.type;
  });
});

// Structure for Domains and Sectors (adapted from Home.jsx's problemSolvingCategories)
const diagboxDomainData = [
  {
    domainKey: 'category_health_hygiene_title',
    sectors: [
      { sectorKey: 'subdomain_epidemiology', id: '01' },
      { sectorKey: 'subdomain_13', id: '13' },
    ],
  },
  {
    domainKey: 'category_hygiene_title',
    sectors: [
      { sectorKey: 'subdomain_hospital_hygiene', id: '02' },
      { sectorKey: 'subdomain_indoor_hygiene', id: '03' },
      { sectorKey: 'subdomain_11', id: '11' },
    ],
  },
  {
    domainKey: 'category_buildings_title',
    sectors: [
      { sectorKey: 'subdomain_12', id: '12' },
    ],
  },
  {
    domainKey: 'category_agriculture_livestock_title',
    sectors: [
      { sectorKey: 'subdomain_viticulture', id: '05' },
      { sectorKey: 'subdomain_arboriculture', id: '06' },
      { sectorKey: 'subdomain_poultry_farming', id: '08' },
      { sectorKey: 'subdomain_shellfish_farming', id: '07' },
    ],
  },
  {
    domainKey: 'category_industrial_fermentation_title',
    sectors: [
      { sectorKey: 'subdomain_winemaking', id: '05' },
      { sectorKey: 'subdomain_purification_systems', id: 'solutions/systemes-epuration' },
      { sectorKey: 'subdomain_methanizers', id: 'solutions/methaniseurs' },
    ],
  },
  {
    domainKey: 'category_turf_parks_title', // Domain: Gazons naturels et parc
    sectors: [
      { sectorKey: 'subdomain_sports_turf', id: '04' }, // Gazons des stade - Will show table
      { sectorKey: 'subdomain_golf_courses', id: '09' }, // Golf courses now point to sector 09
      { sectorKey: 'subdomain_cemeteries', id: '10' }, // Cemeteries now point to sector 10
    ],
  },
];

// Helper to get domain/sector titles from texts.home.sectors
const getHomeSectorText = (key, defaultValue = '') => {
  const { language } = useLanguage();
  return getTextByLanguage(`home.sectors.${key}`, language, defaultValue);
};

// Helper to get texts from texts.diagbox.gazon (for Gazon table)
const getDiagboxGazonText = (key, defaultValue = '') => {
  const { language } = useLanguage();
  return getTextByLanguage(`diagbox.gazon.${key}`, language, defaultValue);
};

function DiagboxPage() {
  const { language } = useLanguage();
  const [openSectorKey, setOpenSectorKey] = useState(null);
  const gazonSectionRef = useRef(null);

  useEffect(() => {
    if (!gazonSectionRef.current || !openSectorKey) return;

    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // Déclenche quand plus de 50% de l'élément est hors de vue
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && openSectorKey === 'subdomain_sports_turf') {
          setOpenSectorKey(null);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    observer.observe(gazonSectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, [openSectorKey]);

  const handleSectorToggle = (sectorKey) => {
    setOpenSectorKey(openSectorKey === sectorKey ? null : sectorKey);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* Page Title and Intro */}
        <div id="diagbox-intro" className="text-center mb-12 md:mb-16 pt-[140px] scroll-mt-[140px]">
          <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-secondary mb-4">
            {getTextByLanguage('diagbox.mainpage.title', language, 'Les DiagBox® IAGE')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300">
            {getTextByLanguage('diagbox.mainpage.intro', language, 'Découvrez nos solutions de diagnostic rapide et autonome.')}
          </p>
        </div>

        {/* Domain Navigation */}
        <DiagboxDomainNav domains={diagboxDomainData} />

        {/* Section 1: Simple à utiliser */}
        <section className="mb-16 md:mb-20 py-12 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="mx-auto">
            <h2 className="text-3xl font-semibold text-center text-primary dark:text-white mb-10">
              {getPageText('process.title', 'Un processus simple et rapide')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center">
              {simpleSteps.map((step, index) => (
                <div key={step.key} className="flex flex-col items-center p-4">
                  <div className="w-12 h-12 mb-3 text-primary dark:text-secondary">
                    <img src={step.icon} alt={step.alt} className="w-full h-full" />
                  </div>
                  <p className="text-md font-medium text-gray-700 dark:text-gray-300">
                    {getPageText(`${step.key}.text`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Liste des diagbox */}
        <section className="mb-16 md:mb-20">
          <h2 className="text-3xl font-semibold text-center text-primary dark:text-white mb-10">
            {getTextByLanguage('diagbox.mainpage.list_title', language, 'Notre gamme de DiagBox® par domaine d\'activité')}
          </h2>
          
          <div className="space-y-8">
            {diagboxDomainData.map((domain) => (
              <div key={domain.domainKey} id={domain.domainKey} className="py-4 mt-8 scroll-mt-[160px]">
                <h3 className="text-2xl md:text-3xl font-bold text-left text-primary dark:text-secondary mb-2">
                  {getTextByLanguage(`home.sectors.${domain.domainKey}`, language)}
                </h3>
                <div className="w-16 h-1.5 bg-secondary mb-6 rounded-full"></div>
                <div className="space-y-8">
                  {domain.sectors.map((sector) => (
                    <div 
                      key={sector.sectorKey} 
                      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
                      ref={sector.sectorKey === 'subdomain_sports_turf' ? gazonSectionRef : null}
                    >
                      {sector.sectorKey === 'subdomain_sports_turf' ? (
                        <>
                          <button 
                            onClick={() => handleSectorToggle(sector.sectorKey)}
                            className="w-full flex justify-between items-center text-left text-xl font-semibold text-primary dark:text-gray-200 mb-4 focus:outline-none"
                          >
                            <span>{getTextByLanguage(`home.sectors.${sector.sectorKey}`, language)}</span>
                            {openSectorKey === sector.sectorKey ? <FaChevronDown className="text-primary dark:text-gray-400" /> : <FaChevronRight className="text-primary dark:text-gray-400" />}
                          </button>
                          {openSectorKey === sector.sectorKey && (
                            <DiagboxKitTable 
                              kitList={priceListForGazon}
                              kitRefToSectionIdMap={kitRefToSectionIdMapForGazon}
                            />
                          )}
                        </>
                      ) : (
                        <>
                          <h4 className="text-xl font-semibold text-primary dark:text-gray-200 mb-4">
                            {getTextByLanguage(`home.sectors.${sector.sectorKey}`, language)}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            {getTextByLanguage('diagbox.coming_soon', language, 'Les kits DiagBox® pour ce secteur seront bientôt disponibles. Contactez-nous pour en savoir plus.')}
                          </p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Section CTA */}
      <div className="max-w-4xl mx-auto px-4 text-center -mt-4 mb-12">
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          {getTextByLanguage('diagbox.gazon.cta.text', language)}
        </p>
        <Link to="/contact" className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors">
          {getTextByLanguage('diagbox.gazon.cta.button', language)}
        </Link>
      </div>
    </motion.div>
  );
}

export default DiagboxPage; 