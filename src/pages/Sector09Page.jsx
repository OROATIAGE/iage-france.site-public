import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaAngleRight, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import { texts } from '../content/texts';
import TextWithBoldMarkdown from '../components/TextWithBoldMarkdown';
import GolfQnaAccordion from '../components/GolfQnaAccordion';

// Data for the "Simple à utiliser" steps - Réutilisation de la constante de DiagboxGazonPage
const simpleSteps = [
  { key: "process.step1", icon: "/assets/icons/DIAGBOX.svg", alt: "Ouvrir le kit" },
  { key: "process.step2", icon: "/assets/icons/prélèvement (gazon).svg", alt: "Prélever l'échantillon" },
  { key: "process.step3", icon: "/assets/icons/enregistrement.svg", alt: "Scanner le QR code" },
  { key: "process.step4", icon: "/assets/icons/envoi.svg", alt: "Envoyer au laboratoire" },
  { key: "process.step5", icon: "/assets/icons/Résultats.svg", alt: "Obtenir les résultats" }
];

// Structure de données pour les kits (pour faciliter l'itération)
const kitTypes = [
  {
    type: 'lingette',
    kits: ['PF000013', 'PF000015']
  },
  {
    type: 'dechet',
    kits: ['PF000016', 'PF000018', 'PF000019', 'PF000020']
  },
  {
    type: 'sympto',
    kits: ['PF000033', 'PF000035', 'PF000039']
  },
  {
    type: 'racine',
    kits: ['PF000048']
  },
  {
    type: 'sol',
    kits: ['PF000047']
  },
  {
    type: 'racine_gazon',
    kits: ['PF000049']
  },
  {
    type: 'plaquage',
    kits: ['PF000050']
  }
];

const priceList = [
  'PF000013', 'PF000015', 'PF000016', 'PF000018', 'PF000019',
  'PF000020', 'PF000033', 'PF000035', 'PF000039', 'PF000047', 'PF000048', 'PF000049',
  'PF000050'
];

// Créer le mapping Ref -> ID de section
const kitRefToSectionIdMap = {};
kitTypes.forEach(typeInfo => {
  typeInfo.kits.forEach(kitRef => {
    kitRefToSectionIdMap[kitRef] = typeInfo.type;
  });
});

function Sector09Page() {
  const { language } = useLanguage();
  const [isPriceTableOpen, setIsPriceTableOpen] = useState(false);
  
  // Helper function to get texts for this page
  const getText = (key, defaultValue = '') => {
    const keys = key.split('.');
    let current = texts[language];
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        console.warn(`Texte manquant pour la clé: ${key}`);
        return defaultValue;
      }
    }
    return current;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-12 md:py-16"
    >
      {/* --- Sector Intro Section --- */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 p-8 rounded-lg mb-6 shadow-sm md:max-w-3xl lg:max-w-4xl md:mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-primary dark:text-secondary mb-4">
          {getText('home.sectors.subdomain_golf_courses', 'Gazon des golfs')}
        </h1>
        <div className="text-lg md:text-xl text-primary dark:text-secondary">
          <div className="flex items-start">
            <FaAngleRight className="text-blue-300 dark:text-blue-400 text-2xl mt-1 mr-2 flex-shrink-0" />
            <div>
              {getText('sectors.page.09.intro', '').split('\n').map((line, index) => {
                if (line.trim().startsWith('-')) {
                  return (
                    <div key={index} className="ml-4 text-base md:text-lg mt-2">
                      <TextWithBoldMarkdown text={line} />
                    </div>
                  );
                }
                return (
                  <div key={index} className="mb-2">
                    <TextWithBoldMarkdown text={line} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* --- Questions & Answers Section --- */}
      <section className="mb-12 md:mb-16">
        <GolfQnaAccordion />
      </section>

      {/* --- Process Section --- */}
      <section className="mb-12 md:mb-16 bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-sm md:max-w-3xl lg:max-w-4xl md:mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-primary dark:text-secondary mb-8">
          {getText('diagbox.gazon.process.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 text-center text-primary dark:text-secondary">
          {simpleSteps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <img src={step.icon} alt={step.alt} className="w-12 h-12 mb-3" />
              <p>{getText(`diagbox.process.${step.key.split('.')[1]}.text`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- General Info Sections --- */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 md:mb-16 md:max-w-3xl lg:max-w-4xl md:mx-auto">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-3 text-primary dark:text-secondary">{getText('diagbox.gazon.ideal_for.title')}</h3>
          <p className="text-gray-700 dark:text-gray-300 text-sm">{getText('sectors.page.09.ideal_for.text')}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3 text-primary dark:text-secondary">{getText('diagbox.gazon.kit_content.title')}</h3>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{getText('diagbox.gazon.kit_content.text')}</p>
        </div>
      </section>

      {/* DiagBox Table */}
      <div className="mb-12 md:mb-16 md:max-w-3xl lg:max-w-4xl md:mx-auto">
        <div className="pt-10 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={() => setIsPriceTableOpen(!isPriceTableOpen)}
            className="w-full flex justify-between items-center text-left text-2xl md:text-3xl font-bold text-primary dark:text-secondary mb-8 focus:outline-none"
          >
            <span>{getText('diagbox.gazon.prices.title')}</span>
            {isPriceTableOpen ? <FaChevronDown className="text-primary dark:text-gray-400" /> : <FaChevronRight className="text-primary dark:text-gray-400" />}
          </button>
          {isPriceTableOpen && (
            <div className="bg-white dark:bg-gray-800 shadow-sm md:rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700 hidden md:table-header-group">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[12%]">Réf.</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[18%]">Désignation</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[12%]">Type de kit</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[48%]">Pathogènes ciblés</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[10%]">Prix indicatif HT</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 md:divide-y">
                    {kitTypes.map((kitTypeInfo) => (
                      kitTypeInfo.kits.map((kitRef) => (
                        <tr key={kitRef} className="flex flex-col md:table-row">
                          <td data-label="Réf." className="block md:table-cell px-4 py-2 md:py-3 text-sm font-medium text-gray-900 dark:text-gray-100 w-full md:w-[12%] before:content-[attr(data-label)] before:float-left md:before:content-none before:font-medium before:text-gray-700 dark:before:text-gray-300">
                            {kitRef}
                          </td>
                          <td data-label="Désignation" className="block md:table-cell px-4 py-2 md:py-3 text-sm text-gray-600 dark:text-gray-300 w-full md:w-[18%] before:content-[attr(data-label)] before:float-left md:before:content-none before:font-medium before:text-gray-700 dark:before:text-gray-300">
                            {getText(`diagbox.gazon.kits.${kitRef}.name`)}
                          </td>
                          <td data-label="Type de kit" className="block md:table-cell px-4 py-2 md:py-3 text-sm text-gray-600 dark:text-gray-300 w-full md:w-[12%] before:content-[attr(data-label)] before:float-left md:before:content-none before:font-medium before:text-gray-700 dark:before:text-gray-300">
                            {getText(`diagbox.gazon.types.${kitTypeInfo.type}`)}
                          </td>
                          <td data-label="Pathogènes ciblés" className="block md:table-cell px-4 py-2 md:py-3 text-sm text-gray-600 dark:text-gray-300 w-full md:w-[48%] before:content-[attr(data-label)] before:float-left md:before:content-none before:font-medium before:text-gray-700 dark:before:text-gray-300 whitespace-pre-line">
                            {getText(`diagbox.gazon.kits.${kitRef}.targets`)}
                          </td>
                          <td data-label="Prix indicatif HT" className="block md:table-cell px-4 py-2 md:py-3 text-sm text-gray-600 dark:text-gray-300 w-full md:w-[10%] before:content-[attr(data-label)] before:float-left md:before:content-none before:font-medium before:text-gray-700 dark:before:text-gray-300">
                            {getText(`diagbox.gazon.prices.${kitRef}`)}
                          </td>
                        </tr>
                      ))
                    ))}
                  </tbody>
                </table>
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <div className="mt-4 mb-4 text-sm text-gray-500 dark:text-gray-400 italic px-4">
                    {getText('diagbox.gazon.pythium_note')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- Services Section --- */}
      <section className="mb-12 md:mb-16 md:max-w-3xl lg:max-w-4xl md:mx-auto">
        {/* Section CTA */}
        <div className="max-w-4xl mx-auto px-4 text-center mt-8 mb-12">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            {getText('diagbox.gazon.cta.text')}
          </p>
          <Link to="/contact" className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors">
            {getText('diagbox.gazon.cta.button')}
          </Link>
        </div>

        {/* Analyses Catalogue */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-3 text-primary dark:text-secondary">
            {getText('sectors.page.09.catalog.title', '')}
          </h3>
          <p className="text-primary dark:text-secondary">
            {getText('sectors.page.09.catalog.description', '')}
          </p>
        </div>

        {/* Développement */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3 text-primary dark:text-secondary">
            {getText('sectors.page.09.development.title', '')}
          </h3>
          <p className="text-primary dark:text-secondary">
            {getText('sectors.page.09.development.description', '')}
          </p>
        </div>
      </section>

      {/* Back to Domains Button */}
      <div className="text-center mt-16 mb-12">
        <Link 
          to="/" 
          className="inline-block bg-[#52c6dd] dark:bg-blue-700 py-3 px-6 rounded-lg text-white hover:text-white/90 dark:text-white dark:hover:text-white/90 font-medium transition-colors"
        >
          {getText('sectors.common.back_button')}
        </Link>
      </div>
    </motion.div>
  );
}

export default Sector09Page; 