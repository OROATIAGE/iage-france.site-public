import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { texts } from '../content/texts';
import { FaLeaf, FaVial, FaPaperPlane } from 'react-icons/fa'; // Exemple d'icônes

// Helper function pour récupérer les textes (suppose une structure texts.diagbox.gazon...)
const getText = (key, defaultValue = '') => {
  const keys = key.split('.');
  let current = texts.diagbox?.gazon;
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      // console.warn(`Texte manquant pour diagbox.gazon.${key}`);
      return defaultValue;
    }
  }
  // Gérer les retours à la ligne pour les descriptions, etc.
  if (typeof current === 'string') {
    return current.replace(/\\n/g, '\n'); 
  }
  return current;
};

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

function DiagboxGazonPage() {

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
      {/* --- Hero Section --- */}
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-secondary mb-4">
          {getText('title')}
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {getText('subtitle')}
        </p>
      </div>

      {/* --- Process Section --- */}
      <section className="mb-12 md:mb-16 bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-sm">
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-8">
          {getText('process.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Step 1 */}
          <div className="flex flex-col items-center">
            <FaLeaf className="text-4xl text-secondary mb-3" />
            <h3 className="text-lg font-semibold mb-2 dark:text-white">{getText('process.step1.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{getText('process.step1.text')}</p>
          </div>
          {/* Step 2 */}
          <div className="flex flex-col items-center">
            <FaVial className="text-4xl text-secondary mb-3" /> {/* Placeholder icon */} 
            <h3 className="text-lg font-semibold mb-2 dark:text-white">{getText('process.step2.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{getText('process.step2.text')}</p>
          </div>
          {/* Step 3 */}
          <div className="flex flex-col items-center">
            <FaPaperPlane className="text-4xl text-secondary mb-3" />
            <h3 className="text-lg font-semibold mb-2 dark:text-white">{getText('process.step3.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{getText('process.step3.text')}</p>
          </div>
        </div>
      </section>

      {/* --- Table of Contents Section --- */}
      <section id="toc" className="mb-12 md:mb-16 scroll-mt-20 md:scroll-mt-24">
        <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-4">
            {getText('toc.title')} 
        </h3>
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {kitTypes.map((kitTypeInfo) => (
                <a 
                    key={kitTypeInfo.type}
                    href={`#${kitTypeInfo.type}`} 
                    className="px-4 py-2 bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-secondary-light text-sm font-medium rounded-full hover:bg-secondary/20 dark:hover:bg-secondary/30 transition-colors"
                >
                    {getText(`toc.${kitTypeInfo.type}_link`)} 
                </a>
            ))}
            {/* Ajouter le lien vers les prix */}
             <a 
                href="#prices" 
                className="px-4 py-2 bg-accent/10 dark:bg-accent/20 text-accent dark:text-orange-300 text-sm font-medium rounded-full hover:bg-accent/20 dark:hover:bg-accent/30 transition-colors"
            >
                {getText(`toc.prices_link`)} 
            </a>
        </div>
        <div className="mt-6 text-right">
          <a href="#toc" className="text-sm text-secondary hover:text-secondary-dark dark:text-secondary-light dark:hover:text-secondary transition-colors">
            {getText('toc.back_link')}
          </a>
        </div>
      </section>

      {/* --- General Info Sections --- */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 md:mb-16">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-primary dark:text-secondary">{getText('ideal_for.title')}</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">{getText('ideal_for.text')}</p>
        </div>
         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-primary dark:text-secondary">{getText('kit_content.title')}</h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{getText('kit_content.text')}</p>
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
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border dark:border-gray-600">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Référence</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Désignation</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Organismes Ciblés</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {kitTypeInfo.kits.map((kitRef) => (
                    <tr key={kitRef}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{kitRef}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{getText(`kits.${kitRef}.name`)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{getText(`kits.${kitRef}.targets`)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
             </div>
             {/* Pythium Note - Check if any kit in this section needs it */} 
             {(kitTypeInfo.kits.some(ref => getText(`kits.${ref}.targets`, '').includes('Pythium Blight*'))) &&
                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 italic">{getText('pythium_note')}</p>
             }
             {/* Liens en bas de section */}
            <div className="mt-6 flex justify-between items-center">
              <a href="#prices" className="text-sm text-accent hover:text-accent/80 dark:text-orange-300 dark:hover:text-orange-200 transition-colors font-medium">
                {getText('link_to_prices')}
              </a>
              <a href="#toc" className="text-sm text-secondary hover:text-secondary-dark dark:text-secondary-light dark:hover:text-secondary transition-colors">
                {getText('toc.back_link')}
              </a>
            </div>
          </section>
        ))}
      </div>

      {/* --- Price List Section --- */}
      <section id="prices" className="mt-12 md:mt-16 pt-10 border-t border-gray-200 dark:border-gray-700 scroll-mt-20 md:scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-8">
            {getText('prices.title')}
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full w-full divide-y divide-gray-200 dark:divide-gray-700 border dark:border-gray-600 shadow-sm rounded-lg">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Référence</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Désignation</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Prix Indicatif HT</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {priceList.map((kitRef) => (
                  <tr key={kitRef}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{kitRef}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      <a href={`#${kitRefToSectionIdMap[kitRef] ?? ''}`} className="hover:underline hover:text-primary dark:hover:text-secondary transition-colors">
                         {getText(`kits.${kitRef}.name`)}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 text-right">{getText(`prices.${kitRef}`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </section>

      {/* --- Final CTA Section --- */}
      <section className="mt-12 md:mt-16 text-center">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            {getText('cta.text')}
          </p>
          <Link to="/contact" className="btn-primary">
            {getText('cta.button')}
          </Link>
      </section>

    </motion.div>
  );
}

export default DiagboxGazonPage; 