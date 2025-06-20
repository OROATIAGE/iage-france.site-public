import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { texts } from '../content/texts';
import { FaLeaf, FaVial, FaPaperPlane } from 'react-icons/fa'; // Exemple d'icônes
import DiagboxGazonNav from '../components/DiagboxGazonNav';
import { useLanguage } from '../context/LanguageContext';

// Structure de données pour les kits (pour faciliter l'itération)
const kitTypes = [
  {
    type: 'lingette',
    kits: ['PF000011', 'PF000013', 'PF000015']
  },
  {
    type: 'dechet',
    kits: ['PF000016', 'PF000018', 'PF000019', 'PF000020']
  },
  {
    type: 'sympto',
    kits: ['PF000033', 'PF000035']
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
  'PF000011', 'PF000013', 'PF000015', 'PF000016', 'PF000018', 'PF000019',
  'PF000020', 'PF000033', 'PF000035', 'PF000047', 'PF000048', 'PF000049',
  'PF000050'
];

// Data for the "Simple à utiliser" steps
const simpleSteps = [
  { key: "process.step1", icon: "/assets/icons/DIAGBOX.svg", alt: "Ouvrir le kit" },
  { key: "process.step2", icon: "/assets/icons/prélèvement (gazon).svg", alt: "Prélever l'échantillon" },
  { key: "process.step3", icon: "/assets/icons/enregistrement.svg", alt: "Scanner le QR code" },
  { key: "process.step4", icon: "/assets/icons/envoi.svg", alt: "Envoyer au laboratoire" },
  { key: "process.step5", icon: "/assets/icons/Résultats.svg", alt: "Obtenir les résultats" }
];

export function DiagboxGazonPage() {
  const { language } = useLanguage();

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

  // Créer le mapping Ref -> ID de section
  const kitRefToSectionIdMap = {};
  kitTypes.forEach(typeInfo => {
    typeInfo.kits.forEach(kitRef => {
      kitRefToSectionIdMap[kitRef] = typeInfo.type;
    });
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-12 md:py-16"
    >
      <DiagboxGazonNav />

      {/* --- Hero Section --- */}
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-secondary mb-4">
          {getText('diagbox.gazon.title')}
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {getText('diagbox.gazon.subtitle')}
        </p>
      </div>

      {/* --- Process Section --- */}
      <section className="mb-12 md:mb-16 bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-sm">
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-8">
          {getText('diagbox.gazon.process.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 text-center">
          {simpleSteps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <img src={step.icon} alt={step.alt} className="w-12 h-12 mb-3" />
              <p className="text-gray-600 dark:text-gray-400">{getText(`diagbox.gazon.${step.key}`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- General Info Sections --- */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 md:mb-16">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-3 text-primary dark:text-secondary">{getText('diagbox.gazon.ideal_for.title')}</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">{getText('diagbox.gazon.ideal_for.text')}</p>
        </div>
         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-primary dark:text-secondary">{getText('diagbox.gazon.kit_content.title')}</h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{getText('diagbox.gazon.kit_content.text')}</p>
        </div>
      </section>

      {/* --- Table of Contents Section (New Position) --- */}
      <section id="toc" className="mb-12 md:mb-16 scroll-mt-20 md:scroll-mt-24">
        <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-4">
            {getText('diagbox.gazon.toc.title')} 
        </h3>
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {kitTypes.map((kitTypeInfo) => (
                <a 
                    key={kitTypeInfo.type}
                    href={`#${kitTypeInfo.type}`} 
                    className="px-4 py-2 bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-secondary-light text-sm font-medium rounded-full hover:bg-secondary/20 dark:hover:bg-secondary/30 transition-colors"
                >
                    {getText(`diagbox.gazon.toc.${kitTypeInfo.type}_link`)} 
                </a>
            ))}
            {/* Ajouter le lien vers les prix */}
             <a 
                href="#prices" 
                className="px-4 py-2 bg-accent/10 dark:bg-accent/20 text-accent dark:text-orange-300 text-sm font-medium rounded-full hover:bg-accent/20 dark:hover:bg-accent/30 transition-colors"
            >
                {getText(`diagbox.gazon.toc.prices_link`)} 
            </a>
        </div>
      </section>

      {/* --- Detailed Kit Sections --- */}
      <div className="space-y-12 md:space-y-16">
        {kitTypes.map((kitTypeInfo) => (
          <section key={kitTypeInfo.type} id={kitTypeInfo.type} className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg scroll-mt-20 md:scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary dark:text-secondary mb-4 border-b pb-2 dark:border-gray-600">
              {getText(`${kitTypeInfo.type}.catchphrase`)}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed whitespace-pre-line">
              {getText(`${kitTypeInfo.type}.description`)}
            </p>
            <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">{getText(`${kitTypeInfo.type}.why_use.title`)}</h4>
            <ul className="list-disc list-inside mb-6 text-gray-700 dark:text-gray-300 space-y-1">
              {/* Check if points exist before rendering */} 
              {getText(`${kitTypeInfo.type}.why_use.point1`) && <li>{getText(`${kitTypeInfo.type}.why_use.point1`)}</li>}
              {getText(`${kitTypeInfo.type}.why_use.point2`) && <li>{getText(`${kitTypeInfo.type}.why_use.point2`)}</li>}
              {getText(`${kitTypeInfo.type}.why_use.point3`) && <li>{getText(`${kitTypeInfo.type}.why_use.point3`)}</li>}
            </ul>
            
            <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">{getText(`${kitTypeInfo.type}.kits.title`)}</h4>
            {/* Responsive Table Container */}
            <div className="overflow-x-auto md:overflow-visible">
              {/* Add data labels using CSS ::before on mobile */}
              <table className="min-w-full w-full divide-y divide-gray-200 dark:divide-gray-700 md:border dark:border-gray-600 responsive-kit-table">
                <thead className="bg-gray-50 dark:bg-gray-700 hidden md:table-header-group"> {/* Hide header on mobile */} 
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Référence</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Désignation</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Organismes Ciblés</th>
                  </tr>
                </thead>
                {/* Make tbody the main flex container on mobile */}
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 flex flex-col md:table-row-group md:divide-y">
                  {kitTypeInfo.kits.map((kitRef) => (
                    // Each row becomes a card on mobile
                    <tr key={kitRef} className="block md:table-row border-b last:border-b-0 md:border-none dark:border-gray-700 p-4 md:p-0">
                      {/* Each cell becomes a block with label on mobile */} 
                      <td 
                        data-label="Référence" 
                        className="block md:table-cell md:px-4 md:py-3 md:whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 responsive-cell"
                      >
                        {kitRef}
                      </td>
                      <td 
                        data-label="Désignation" 
                        className="block md:table-cell md:px-4 md:py-3 md:whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 responsive-cell"
                      >
                        {getText(`kits.${kitRef}.name`)}
                      </td>
                      <td 
                        data-label="Organismes Ciblés" 
                        className="block md:table-cell md:px-4 md:py-3 text-sm text-gray-600 dark:text-gray-300 responsive-cell"
                      >
                        {getText(`kits.${kitRef}.targets`)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
             </div>
             {/* Pythium Note - Check if any kit in this section needs it */} 
             {(kitTypeInfo.kits.some(ref => getText(`kits.${ref}.targets`, '').includes('Pythium Blight*'))) &&
                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 italic">{getText('diagbox.gazon.pythium_note')}</p>
             }
             {/* Liens en bas de section */}
            <div className="mt-6 flex justify-between items-center">
              <a href="#prices" className="text-sm text-accent hover:text-accent/80 dark:text-orange-300 dark:hover:text-orange-200 transition-colors font-medium">
                {getText('diagbox.gazon.link_to_prices')}
              </a>
            </div>
          </section>
        ))}
      </div>

      {/* --- Price List Section --- */}
      <section id="prices" className="mt-12 md:mt-16 pt-10 border-t border-gray-200 dark:border-gray-700 scroll-mt-[140px]">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-8">
            {getText('diagbox.gazon.prices.title')}
          </h2>
          {/* Responsive Table Container */}
          <div className="overflow-x-auto md:overflow-visible">
            {/* Add responsive classes and data labels */}
            <table className="min-w-full w-full divide-y divide-gray-200 dark:divide-gray-700 md:border dark:border-gray-600 shadow-sm md:rounded-lg responsive-kit-table">
              {/* Hide header on mobile */}
              <thead className="bg-gray-50 dark:bg-gray-700 hidden md:table-header-group">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Référence</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Désignation</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {getText('diagbox.gazon.prices.type_header')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Prix Indicatif HT</th>
                </tr>
              </thead>
              {/* Make tbody flex container on mobile */}
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 flex flex-col md:table-row-group md:divide-y">
                {priceList.map((kitRef) => {
                  const typeId = kitRefToSectionIdMap[kitRef] ?? '';
                  const typeText = getText(`types.${typeId}`) || typeId; // Get type name or fallback to id
                  return (
                    // Each row becomes a card on mobile
                    <tr key={kitRef} className="block md:table-row border-b last:border-b-0 md:border-none dark:border-gray-700 p-4 md:p-0">
                      {/* Cells become blocks with labels */}
                      <td 
                        data-label="Référence"
                        className="block md:table-cell md:px-6 md:py-4 md:whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 responsive-cell"
                      >
                        {kitRef}
                      </td>
                      <td 
                        data-label="Désignation"
                        className="block md:table-cell md:px-6 md:py-4 md:whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 responsive-cell"
                      >
                        <a 
                          href={`#${typeId}`}
                          className="text-primary dark:text-secondary hover:underline transition-colors"
                        >
                          {getText(`kits.${kitRef}.name`)}
                        </a>
                      </td>
                      <td 
                        data-label={getText('diagbox.gazon.prices.type_header', 'Type')}
                        className="block md:table-cell md:px-6 md:py-4 md:whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 responsive-cell"
                      >
                        <a href={`#${typeId}`} className="hover:underline hover:text-primary dark:hover:text-secondary transition-colors">
                           {typeText}
                        </a>
                      </td>
                      <td 
                        data-label="Prix Indicatif HT"
                        className="block md:table-cell md:px-6 md:py-4 md:whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 md:text-right responsive-cell"
                      >
                        {getText(`prices.${kitRef}`)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
      </section>

      {/* --- Final CTA Section --- */}
      <section className="mt-12 md:mt-16 text-center">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            {getText('diagbox.gazon.cta.text')}
          </p>
          <Link to="/contact" className="btn-primary">
            {getText('diagbox.gazon.cta.button')}
          </Link>
      </section>

      {/* Back to Domains Button */}
      <div className="max-w-4xl mx-auto px-4 text-center mt-16 mb-12">
        <Link to="/sectors" className="inline-block bg-[#52c6dd] dark:bg-blue-700 py-3 px-6 rounded-lg text-white hover:text-white/90 dark:text-white dark:hover:text-white/90 font-medium">
          {getText('sectors.common.back_button')}
        </Link>
      </div>

    </motion.div>
  );
} 