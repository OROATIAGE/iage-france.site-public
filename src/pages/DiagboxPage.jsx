import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { texts } from '../content/texts'; // Assuming texts.js is in src/content
import { getEnhancedKitData } from '../utils/kitDataHelpers'; // Added for Gazon table
import DiagboxDomainNav from '../components/DiagboxDomainNav'; // Import the new Nav component

// Helper function to get texts for this page
const getPageText = (key, defaultValue = '') => {
  const fullKey = `diagbox.mainpage.${key}`;
  const keys = fullKey.split('.');
  let current = texts;
  try {
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        console.warn(`Text missing for ${fullKey}`);
        return defaultValue;
      }
    }
    return typeof current === 'string' ? current.replace(/\\n/g, '\n') : (current || defaultValue);
  } catch (e) {
    console.warn(`Error retrieving text for ${fullKey}:`, e);
    return defaultValue;
  }
};

// Data for the "Simple à utiliser" steps
const simpleSteps = [
  { key: 'simple_step_open', icon: '📦' }, // Placeholder icons
  { key: 'simple_step_sample', icon: '🧪' },
  { key: 'simple_step_scan', icon: '📱' },
  { key: 'simple_step_send', icon: '🚚' },
  { key: 'simple_step_results', icon: '📊' },
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
      { sectorKey: 'subdomain_hospital_hygiene', id: '02' },
      { sectorKey: 'subdomain_indoor_hygiene', id: '03' },
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
      { sectorKey: 'subdomain_golf_courses', id: '04_golf' }, // ID indicates it might share sector 04 page, but for Diagbox list, treat as distinct for now
      { sectorKey: 'subdomain_cemeteries', id: '04_cemetery' }, // Same as above
    ],
  },
];

// Helper to get domain/sector titles from texts.home.sectors
const getHomeSectorText = (key, defaultValue = '') => {
  return texts.home?.sectors?.[key] || defaultValue || key;
};

// Helper to get texts from texts.diagbox.gazon (for Gazon table)
const getDiagboxGazonText = (key, defaultValue = '') => {
  const keys = key.split('.');
  let current = texts.diagbox?.gazon;
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      return defaultValue;
    }
  }
  return typeof current === 'string' ? current.replace(/\\n/g, '\\n') : (current || defaultValue);
};

function DiagboxPage() {
  const [openSectorKey, setOpenSectorKey] = useState(null);

  const handleSectorToggle = (sectorKey) => {
    setOpenSectorKey(openSectorKey === sectorKey ? null : sectorKey);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-12 md:py-16"
    >
      {/* Page Title and Intro */}
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-secondary mb-4">
          {getPageText('title', 'Les DiagBox® IAGE')}
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 md:max-w-3xl lg:max-w-4xl mx-auto">
          {getPageText('intro', 'Découvrez nos solutions de diagnostic rapide et autonome.')}
        </p>
      </div>

      {/* Domain Navigation */}
      <DiagboxDomainNav domains={diagboxDomainData} />

      {/* Section 1: Simple à utiliser */}
      <section className="mb-16 md:mb-20 py-12 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="container">
          <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-center text-primary dark:text-white mb-10">
              {getPageText('simple_title', 'Un processus simple et rapide')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center">
              {simpleSteps.map((step, index) => (
                <div key={step.key} className="flex flex-col items-center p-4">
                  <div className="text-5xl mb-3 text-secondary">{step.icon}</div>
                  <p className="text-md font-medium text-gray-700 dark:text-gray-300">
                    {getPageText(step.key, `Étape ${index + 1}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Liste des diagbox */}
      <section className="mb-16 md:mb-20">
        <h2 className="text-3xl font-semibold text-center text-primary dark:text-white mb-10">
          {getPageText('list_title', 'Notre gamme de DiagBox® par domaine d\'activité')}
        </h2>
        
        <div className="space-y-12 md:max-w-3xl lg:max-w-4xl mx-auto">
          {diagboxDomainData.map((domain) => (
            <div key={domain.domainKey} id={domain.domainKey} className="py-8 px-4 md:px-0 scroll-mt-20 md:scroll-mt-24">
              <h3 className="text-2xl md:text-3xl font-bold text-left text-primary dark:text-secondary mb-2">
                {getHomeSectorText(domain.domainKey)}
              </h3>
              <div className="w-16 h-1.5 bg-secondary mb-6 rounded-full"></div>
              <div className="space-y-8 mx-auto">
                {domain.sectors.map((sector) => (
                  <div key={sector.sectorKey} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    {sector.sectorKey === 'subdomain_sports_turf' ? (
                      // Accordion for Gazons des stade
                      <>
                        <button 
                          onClick={() => handleSectorToggle(sector.sectorKey)}
                          className="w-full flex justify-between items-center text-left text-xl font-semibold text-primary dark:text-gray-200 mb-4 focus:outline-none"
                        >
                          <span>{getHomeSectorText(sector.sectorKey)}</span>
                          {openSectorKey === sector.sectorKey ? <FaChevronDown className="text-primary dark:text-gray-400" /> : <FaChevronRight className="text-primary dark:text-gray-400" />}
                        </button>
                        {openSectorKey === sector.sectorKey && (
                          <div className="overflow-x-auto">
                            <table className="min-w-full w-full divide-y divide-gray-200 dark:divide-gray-700 responsive-kit-table table-fixed">
                              <thead className="bg-gray-50 dark:bg-gray-700 hidden md:table-header-group">
                                <tr>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/12">Réf.</th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-3/12">Désignation</th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-2/12">Type</th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-5/12">Cibles</th>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/12">Prix HT</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 flex flex-col md:table-row-group md:divide-y">
                                {priceListForGazon.map((kitRef) => {
                                  const kitData = getEnhancedKitData(kitRef, null, kitRefToSectionIdMapForGazon);
                                  return (
                                    <tr key={kitRef} className="block md:table-row border-b last:border-b-0 md:border-none dark:border-gray-700 p-4 md:p-0">
                                      <td data-label="Réf." className="block md:table-cell md:px-4 md:py-3 md:whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 responsive-cell w-1/12">
                                        {kitData.kitRef}
                                      </td>
                                      <td data-label="Désignation" className="block md:table-cell md:px-4 md:py-3 text-sm text-gray-600 dark:text-gray-300 responsive-cell w-3/12">
                                        {kitData.designation}
                                      </td>
                                      <td data-label="Type" className="block md:table-cell md:px-4 md:py-3 text-sm text-gray-500 dark:text-gray-400 responsive-cell w-2/12">
                                        {kitData.typeDeKit}
                                      </td>
                                      <td data-label="Cibles" className="block md:table-cell md:px-4 md:py-3 text-sm text-gray-600 dark:text-gray-300 responsive-cell w-5/12">
                                        {kitData.ciblesEffectives}
                                      </td>
                                      <td data-label="Prix HT" className="block md:table-cell md:px-4 md:py-3 md:whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 md:text-right responsive-cell w-1/12">
                                        {kitData.prixIndicatifHT}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                            {priceListForGazon.some(ref => getEnhancedKitData(ref, null, kitRefToSectionIdMapForGazon).hasPythiumNote) && (
                              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 italic">
                                {priceListForGazon.find(ref => getEnhancedKitData(ref, null, kitRefToSectionIdMapForGazon).hasPythiumNote)?.pythiumNoteText}
                              </p>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      // Static display for other sectors
                      <>
                        <h4 className="text-xl font-semibold text-primary dark:text-gray-200 mb-4">
                          {getHomeSectorText(sector.sectorKey)}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {getPageText('kits_coming_soon', 'Les kits DiagBox® pour ce secteur seront bientôt disponibles. Contactez-nous pour en savoir plus.')}
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

    </motion.div>
  );
}

export default DiagboxPage; 