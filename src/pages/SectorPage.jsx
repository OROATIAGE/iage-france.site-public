import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { texts } from '../content/texts'; // Import des textes centralisés
// Import necessary components and icons for the Gazons specific section
import DiagboxGazonNav from '../components/DiagboxGazonNav'; 
import { FaLeaf, FaVial, FaPaperPlane, FaChevronDown, FaChevronRight, FaAngleRight, FaChevronLeft } from 'react-icons/fa';
import GazonQnaAccordion from '../components/GazonQnaAccordion'; // Import the new component
import { getEnhancedKitData } from '../utils/kitDataHelpers'; // <-- IMPORT ADDED
import { useLanguage } from '../context/LanguageContext';
import TextWithBoldMarkdown from '../components/TextWithBoldMarkdown';

// Original getText helper for general sector page data
const getText = (key, defaultValue = '') => {
  const { language } = useLanguage();
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

// Specific getText helper for Diagbox Gazon content
const getDiagboxText = (key, defaultValue = '') => {
  const { language } = useLanguage();
  const keys = key.split('.');
  let current = texts[language]?.diagbox?.gazon;
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      return defaultValue;
    }
  }
  return current;
};

const getKitInfo = (kitRef) => {
  return {
    reference: kitRef,
    designation: getDiagboxText(`kits.${kitRef}.name`, ''),
    type: getDiagboxText(`types.${getKitType(kitRef)}`, ''),
    targets: getDiagboxText(`kits.${kitRef}.targets`, ''),
    price: getDiagboxText(`prices.${kitRef}`, '')
  };
};

const getKitType = (kitRef) => {
  // Mapping des références vers les types
  const typeMapping = {
    'PF000011': 'lingette',
    'PF000013': 'lingette',
    'PF000015': 'lingette',
    'PF000016': 'dechet',
    'PF000018': 'dechet',
    'PF000019': 'dechet',
    'PF000020': 'dechet',
    'PF000033': 'sympto',
    'PF000035': 'sympto',
    'PF000047': 'sol',
    'PF000048': 'racine',
    'PF000049': 'racine_gazon',
    'PF000050': 'plaquage'
  };
  return typeMapping[kitRef] || '';
};

// Data structures specifically for Diagbox Gazon section (copied from DiagboxGazonPage.jsx)
const kitTypes = [
  { type: 'lingette', kits: ['PF000011', 'PF000013', 'PF000015'] },
  { type: 'dechet', kits: ['PF000016', 'PF000018', 'PF000019', 'PF000020'] },
  { type: 'sympto', kits: ['PF000033', 'PF000035'] },
  { type: 'racine', kits: ['PF000048'] },
  { type: 'sol', kits: ['PF000047'] },
  { type: 'racine_gazon', kits: ['PF000049'] },
  { type: 'plaquage', kits: ['PF000050'] }
];
const priceList = [
  'PF000011', 'PF000013', 'PF000015', 'PF000016', 'PF000018', 'PF000019',
  'PF000020', 'PF000033', 'PF000035', 'PF000047', 'PF000048', 'PF000049',
  'PF000050'
];
// Mapping Ref -> ID for price list links
const kitRefToSectionIdMap = {};
kitTypes.forEach(typeInfo => {
  typeInfo.kits.forEach(kitRef => {
    kitRefToSectionIdMap[kitRef] = typeInfo.type;
  });
});

// Helper function to get fully resolved targets as a Set
const getFullyResolvedTargetsSet = (kitRefToResolve, textsObj, visitedKits = new Set()) => {
  const getDiagboxTextLocal = (key, defaultValue = '') => {
    const keys = key.split('.');
    let current = textsObj.diagbox?.gazon;
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else { return defaultValue; }
    }
    return (typeof current === 'string') ? current : defaultValue;
  };

  if (visitedKits.has(kitRefToResolve)) {
    console.warn(`Référence circulaire détectée pour ${kitRefToResolve}`);
    return new Set();
  }
  visitedKits.add(kitRefToResolve);

  const rawTargets = getDiagboxTextLocal(`kits.${kitRefToResolve}.targets`, '');
  const currentTargetsSet = new Set();

  const processTargetString = (targetStr, set) => {
    targetStr.split(/,\s*|\s*\+\s*/).forEach(part => {
      const trimmed = part.trim();
      if (trimmed && 
          !trimmed.toLowerCase().startsWith('idem pf') && 
          !trimmed.toLowerCase().startsWith('combine les cibles')) {
        set.add(trimmed);
      }
    });
  };

  if (rawTargets.toLowerCase().startsWith('combine les cibles des kits')) {
    const refPattern = /PF\d{6}/g;
    let match;
    while ((match = refPattern.exec(rawTargets)) !== null) {
      const combinedRef = match[0];
      const subTargets = getFullyResolvedTargetsSet(combinedRef, textsObj, new Set(visitedKits)); // Pass a copy for new branch of recursion
      subTargets.forEach(t => currentTargetsSet.add(t));
    }
  } else if (rawTargets.toLowerCase().startsWith('idem pf')) {
    const idemPattern = /^Idem (PF\d{6})\s*(?:[\s+]+\s*(.*))?$/i;
    const idemMatch = rawTargets.match(idemPattern);
    if (idemMatch) {
      const referencedKitRef = idemMatch[1];
      const additionalTargetsString = idemMatch[2] || '';
      
      const baseTargets = getFullyResolvedTargetsSet(referencedKitRef, textsObj, new Set(visitedKits)); // Pass a copy
      baseTargets.forEach(t => currentTargetsSet.add(t));
      if (additionalTargetsString) {
        processTargetString(additionalTargetsString, currentTargetsSet);
      }
    } else { 
      processTargetString(rawTargets, currentTargetsSet);
    }
  } else { 
    processTargetString(rawTargets, currentTargetsSet);
  }
  
  visitedKits.delete(kitRefToResolve); 
  return currentTargetsSet;
};

// Helper function to parse price string (e.g., "185,00€") to a number
const parsePriceString = (priceStr) => {
  if (!priceStr || typeof priceStr !== 'string') return 0;
  return parseFloat(priceStr.replace('€', '').replace(',', '.'));
};

// Helper function to format a number back to a price string (e.g., 185.00 => "185,00 €")
const formatPriceNumber = (num) => {
  if (typeof num !== 'number') return 'N/A';
  return num.toFixed(2).replace('.', ',') + ' €';
};

// Define Q&A driven kit groups structure
const qnaKitGroups = [
  { id: 'qna-group-q1_sub1', titleKey: 'group_title.q1_sub1', kits: [{ ref: 'PF000011', introKey: 'qna_intro.q1_sub1_PF000011' }, { ref: 'PF000016', introKey: 'qna_intro.q1_sub1_PF000016' }] },
  { id: 'qna-group-q1_sub2', titleKey: 'group_title.q1_sub2', kits: [{ ref: 'PF000013', introKey: 'qna_intro.q1_sub2_PF000013' }, { ref: 'PF000018', introKey: 'qna_intro.q1_sub2_PF000018' }, { ref: 'PF000019', introKey: 'qna_intro.q1_sub2_PF000019' }] },
  { id: 'qna-group-q1_sub3', titleKey: 'group_title.q1_sub3', kits: [{ ref: 'PF000015', introKey: 'qna_intro.q1_sub3_PF000015' }, { ref: 'PF000020', introKey: 'qna_intro.q1_sub3_PF000020' }] },
  { id: 'qna-group-q1_sub4', titleKey: 'group_title.q1_sub4', kits: [{ ref: 'PF000048', introKey: 'qna_intro.q1_sub4_PF000048' }] }, // Also for Q2_sub2
  { id: 'qna-group-q1_sub5', titleKey: 'group_title.q1_sub5', kits: [{ ref: 'PF000047', introKey: 'qna_intro.q1_sub5_PF000047' }] }, // Also for Q2_sub3
  { id: 'qna-group-q2_sub1', titleKey: 'group_title.q2_sub1', kits: [{ ref: 'PF000033', introKey: 'qna_intro.q2_sub1_PF000033' }, { ref: 'PF000035', introKey: 'qna_intro.q2_sub1_PF000035' }] },
  { id: 'qna-group-q3', titleKey: 'group_title.q3', kits: [{ ref: 'PF000050', introKey: 'qna_intro.q3_PF000050' }] },
  {
    id: 'qna-group-q4_combined',
    titleKey: 'group_title.q4_combined',
    kits: [
      { ref: 'PF000049', introKey: 'qna_intro.q4_PF000049' },
      { ref: 'PF000050', introKey: 'qna_intro.q4_PF000050' }
    ]
  },
];

// Need to define renderKitDetails function
const renderKitDetails = (kitRef) => {
  const descriptiveTargetsText = getDiagboxText(`kits.${kitRef}.targets`, 'N/A');
  let finalTargetsDisplayHtml = descriptiveTargetsText; 

  const resolvedTargetsSet = getFullyResolvedTargetsSet(kitRef, texts); 
  const resolvedTargetsArray = Array.from(resolvedTargetsSet).sort();

  let sumOfIndividualPrices = 0;
  let saving = 0;
  let individualPricesText = null;
  let savingText = null;

  const combinedKitPriceString = getDiagboxText(`prices.${kitRef}`, 'N/A');
  const combinedKitPrice = parsePriceString(combinedKitPriceString);

  if (kitRef === 'PF000049') {
    const componentRefs = ['PF000020', 'PF000048'];
    componentRefs.forEach(ref => {
      sumOfIndividualPrices += parsePriceString(getDiagboxText(`prices.${ref}`));
    });
  } else if (kitRef === 'PF000050') {
    const componentRefs = ['PF000020', 'PF000047', 'PF000048'];
    componentRefs.forEach(ref => {
      sumOfIndividualPrices += parsePriceString(getDiagboxText(`prices.${ref}`));
    });
  }

  if ((kitRef === 'PF000049' || kitRef === 'PF000050') && sumOfIndividualPrices > 0 && combinedKitPrice > 0) {
    saving = sumOfIndividualPrices - combinedKitPrice;
    individualPricesText = `Prix total des kits individuels : ${formatPriceNumber(sumOfIndividualPrices)}`;
    if (saving > 0) {
      savingText = `Soit une économie de : ${formatPriceNumber(saving)}`;
    }
  }

  if (kitRef === 'PF000049' || kitRef === 'PF000050') {
    if (resolvedTargetsArray.length > 0) {
      finalTargetsDisplayHtml = `${descriptiveTargetsText}. <br/><b>Cibles effectives&nbsp;:</b> ${resolvedTargetsArray.join(', ')}`;
    }
  } else if (descriptiveTargetsText.toLowerCase().startsWith('idem pf')) {
    if (resolvedTargetsArray.length > 0) {
        finalTargetsDisplayHtml = `${descriptiveTargetsText}. <br/><b>Cibles effectives&nbsp;:</b> ${resolvedTargetsArray.join(', ')}`;
    }
  } else {
    if (resolvedTargetsArray.length > 0) {
        finalTargetsDisplayHtml = resolvedTargetsArray.join(', ');
    } else {
        finalTargetsDisplayHtml = descriptiveTargetsText; 
    }
  }

  return (
    <>
      <div className="space-y-1">
        <p><strong>Référence:</strong> {kitRef}</p>
        <p><strong>Désignation:</strong> {getDiagboxText(`kits.${kitRef}.name`, 'N/A')}</p>
        <p><strong>Organismes Ciblés:</strong> <span dangerouslySetInnerHTML={{ __html: finalTargetsDisplayHtml }} /></p>
        <p><strong>Prix Indicatif HT:</strong> {combinedKitPriceString}</p>
        {individualPricesText && <p className="text-sm text-primary dark:text-gray-300">{individualPricesText}</p>}
        {savingText && <p className="text-sm font-semibold text-green-600 dark:text-green-400">{savingText}</p>}
      </div>
      
      {(() => {
        const targetsWithAsterisk = resolvedTargetsArray.filter(target => target.includes('*'));
        if (targetsWithAsterisk.length > 0) {
          const notePrefix = getDiagboxText('pythium_note_prefix', '* Pour : ');
          const noteSuffix = getDiagboxText('pythium_note_suffix_detail', '. Le détail des 9 souches...');
          const affectedTargetsString = targetsWithAsterisk.map(t => t.replace('*', '')).join(', ');
          return (
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 italic">
              {notePrefix}{affectedTargetsString}{noteSuffix}
            </p>
          );
        }
        return null;
      })()}
    </>
  );
};

function SectorPage() {
  const { language } = useLanguage();
  const { sectorId } = useParams(); 
  const navigate = useNavigate();
  const [openKitAccordions, setOpenKitAccordions] = useState({});
  const [openKitGroupAccordions, setOpenKitGroupAccordions] = useState({});
  const [showAllKitGroups, setShowAllKitGroups] = useState(false);
  const [initiallyOpenKitGroup, setInitiallyOpenKitGroup] = useState(null);

  // Get sector data from the correct location in texts
  const sectorData = texts.fr.home.sectors[sectorId];
  const pageData = texts.fr.sectors.page[sectorId];

  // Determine the back button text outside the return statement
  const backButtonText = texts.sectors?.common?.back_button || 'Retour à l\'accueil'; // Escaped apostrophe

  useEffect(() => {
    if (initiallyOpenKitGroup) {
      setOpenKitGroupAccordions(prev => ({ ...prev, [initiallyOpenKitGroup]: true }));
      setInitiallyOpenKitGroup(null); // Reset after opening
    }
  }, [initiallyOpenKitGroup]);

  const handleToggleKitAccordion = (kitId) => {
    setOpenKitAccordions(prev => ({
      ...prev,
      [kitId]: !prev[kitId]
    }));
  };

  const handleToggleKitGroupAccordion = (groupId) => {
    setOpenKitGroupAccordions(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const handleToggleAllKitGroups = () => {
    const newState = !showAllKitGroups;
    setShowAllKitGroups(newState);
    const allStates = {};
    qnaKitGroups.forEach(group => {
      allStates[group.id] = newState;
    });
    setOpenKitGroupAccordions(allStates);
  };

  const handleNavigateToQnaAndCollapseKits = () => {
    setShowAllKitGroups(false);
    setOpenKitGroupAccordions({}); // Collapse all individual accordions
    const qnaElement = document.getElementById('gazon-qna-accordion');
    if (qnaElement) {
      qnaElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!sectorData || !pageData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Secteur non trouvé</h1>
        <p className="mt-4">Les informations pour ce secteur n'ont pas pu être chargées.</p>
        <Link to="/" className="mt-6 inline-block btn-primary">Retour à l'accueil</Link> {/* Changed link to root */}
      </div>
    );
  }

  const sectorName = sectorData.name || `Secteur ${sectorId}`;

  // Conditional Rendering based on sectorId
  if (sectorId === '01') {
    // --- Render Epidemiosurveillance WES Page ---
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto px-4 py-12 md:py-16"
      >
        {/* --- WES Intro Section - Title and Direct Intro --- */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 p-8 rounded-lg mb-6 shadow-sm md:max-w-3xl lg:max-w-4xl md:mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-primary dark:text-secondary mb-4">{sectorName}</h1>
          <div className="text-lg md:text-xl text-primary dark:text-secondary">
            <div className="flex items-start">
              <FaAngleRight className="text-blue-300 dark:text-blue-400 text-2xl mt-1 mr-2 flex-shrink-0" />
              <div>
                {getText('sectors.page.01.intro', '').split('\n').map((line, index) => {
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

        {/* --- Services Section --- */}
        <section className="mb-12 md:mb-16 md:max-w-3xl lg:max-w-4xl md:mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-primary dark:text-secondary mb-8">
            {getText('sectors.page.01.services.title', '')}
          </h2>

          {/* DiagBox WES */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold mb-3 text-primary dark:text-secondary">
              {getText('sectors.page.01.diagbox.title', '')}
            </h3>
            <p className="text-primary dark:text-secondary">
              {getText('sectors.page.01.diagbox.description', '')}
            </p>
          </div>

          {/* Section CTA */}
          <div className="max-w-4xl mx-auto px-4 text-center mt-8 mb-12">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              {getText('sectors.common.cta.text')}
            </p>
            <Link to="/contact" className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors">
              {getText('sectors.common.cta.button')}
            </Link>
          </div>

          {/* Analyses Catalogue */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold mb-3 text-primary dark:text-secondary">
              {getText('sectors.page.01.catalog.title', '')}
            </h3>
            <p className="text-primary dark:text-secondary">
              {getText('sectors.page.01.catalog.description', '')}
            </p>
          </div>

          {/* Développement */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold mb-3 text-primary dark:text-secondary">
              {getText('sectors.page.01.development.title', '')}
            </h3>
            <p className="text-primary dark:text-secondary">
              {getText('sectors.page.01.development.description', '')}
            </p>
          </div>

          {/* Prélèvement */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-primary dark:text-secondary">
              {getText('sectors.page.01.sampling.title', '')}
            </h3>
            <p className="text-primary dark:text-secondary">
              {getText('sectors.page.01.sampling.description', '')}
            </p>
          </div>
        </section>

        {/* Back to Domains Button */}
        <div className="text-center mt-16 mb-12">
          <Link 
            to="/" 
            className="inline-block bg-[#52c6dd] py-3 px-6 rounded-lg text-white hover:text-white/90 font-medium transition-colors"
          >
            {getText('sectors.common.back_button')}
          </Link>
        </div>
      </motion.div>
    );
  }

  if (sectorId === '04') {
    // --- Render Comprehensive Gazons Page ---
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto px-4 py-12 md:py-16"
      >
        {/* --- Gazon Intro Section - Title and Direct Intro --- */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 p-8 rounded-lg mb-6 shadow-sm md:max-w-3xl lg:max-w-4xl md:mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-primary dark:text-secondary mb-4">{sectorName}</h1>
          <div className="text-lg md:text-xl text-primary dark:text-secondary">
            <div className="flex items-start">
              <FaAngleRight className="text-blue-300 dark:text-blue-400 text-2xl mt-1 mr-2 flex-shrink-0" />
              <div>
                {getText('sectors.page.04.intro', '').split('\n').map((line, index) => {
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

        {/* --- Q&A Accordion Section --- */}
        <GazonQnaAccordion onOpenKitGroup={setInitiallyOpenKitGroup} />

        {/* --- Process Section --- */}
        <section className="mb-12 md:mb-16 bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-sm md:max-w-3xl lg:max-w-4xl md:mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-primary dark:text-secondary mb-8 text-center">
            {getDiagboxText('process.title', '')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 text-center">
            <div className="flex flex-col items-center">
              <img src="/assets/icons/box.svg" alt="Ouvrir le kit" className="w-12 h-12 mb-3" />
              <p className="text-primary dark:text-secondary">{getText('diagbox.process.step1.text', '')}</p>
            </div>
            <div className="flex flex-col items-center">
              <img src="/assets/icons/test-tube.svg" alt="Prélever l'échantillon" className="w-12 h-12 mb-3" />
              <p className="text-primary dark:text-secondary">{getText('diagbox.process.step2.text', '')}</p>
            </div>
            <div className="flex flex-col items-center">
              <img src="/assets/icons/qr-code.svg" alt="Scanner le QR code" className="w-12 h-12 mb-3" />
              <p className="text-primary dark:text-secondary">{getText('diagbox.process.step3.text', '')}</p>
            </div>
            <div className="flex flex-col items-center">
              <img src="/assets/icons/delivery-truck.svg" alt="Envoyer au laboratoire" className="w-12 h-12 mb-3" />
              <p className="text-primary dark:text-secondary">{getText('diagbox.process.step4.text', '')}</p>
            </div>
            <div className="flex flex-col items-center">
              <img src="/assets/icons/chart.svg" alt="Obtenir les résultats" className="w-12 h-12 mb-3" />
              <p className="text-primary dark:text-secondary">{getText('diagbox.process.step5.text', '')}</p>
            </div>
          </div>
        </section>

        {/* --- General Info Sections --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 md:mb-16 md:max-w-3xl lg:max-w-4xl md:mx-auto">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-primary dark:text-secondary">
              {getDiagboxText('ideal_for.title', '')}
            </h3>
            <p className="text-primary dark:text-secondary">
              {getDiagboxText('ideal_for.text', '')}
            </p>
          </div>
           <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-primary dark:text-secondary">
              {getDiagboxText('kit_content.title', '')}
            </h3>
            <p className="text-primary dark:text-secondary whitespace-pre-line">
              {getDiagboxText('kit_content.text', '')}
            </p>
          </div>
        </section>

        {/* Price List Section */}
        <section id="prices" className="mt-12 md:mt-16 pt-10 border-t border-gray-200 dark:border-gray-700 scroll-mt-20 md:scroll-mt-24 md:max-w-3xl lg:max-w-4xl md:mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-primary dark:text-secondary mb-8 text-center">
            {getDiagboxText('prices.title', '')}
          </h2>
          <div className="bg-white dark:bg-gray-800 shadow-sm md:rounded-lg overflow-hidden">
            <div className="overflow-x-auto md:overflow-visible">
              <table className="min-w-full w-full divide-y divide-gray-200 dark:divide-gray-700 responsive-kit-table">
                <thead className="bg-gray-50 dark:bg-gray-700 hidden md:table-header-group">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-2/12">Référence</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-2/12">Désignation</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-2/12">Type de kit</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-5/12">Pathogènes cibles</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/12">Prix Indicatif HT</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 flex flex-col md:table-row-group md:divide-y">
                {['PF000011', 'PF000013', 'PF000015', 'PF000016', 'PF000018', 'PF000019', 'PF000020', 'PF000033', 'PF000035', 'PF000047', 'PF000048', 'PF000049', 'PF000050'].map((kitRef) => {
                  const kitInfo = getKitInfo(kitRef);
                    return (
                      <tr key={kitRef} className="block md:table-row border-b last:border-b-0 md:border-none dark:border-gray-700 p-4 md:p-0">
                        <td 
                          data-label="Référence"
                          className="block md:table-cell md:px-4 md:py-3 md:whitespace-nowrap text-sm font-medium text-primary dark:text-gray-100 responsive-cell w-2/12"
                        >
                        {kitInfo.reference}
                        </td>
                        <td 
                          data-label="Désignation"
                          className="block md:table-cell md:px-4 md:py-3 text-sm text-primary dark:text-gray-300 responsive-cell w-2/12"
                        >
                        {kitInfo.designation}
                        </td>
                        <td 
                          data-label="Type de kit"
                          className="block md:table-cell md:px-4 md:py-3 text-sm text-gray-500 dark:text-gray-400 responsive-cell w-2/12"
                        >
                        {kitInfo.type}
                        </td>
                        <td 
                          data-label="Pathogènes cibles"
                          className="block md:table-cell md:px-4 md:py-3 text-sm text-gray-600 dark:text-gray-300 responsive-cell w-5/12"
                        >
                        {kitInfo.targets}
                        </td>
                        <td 
                          data-label="Prix Indicatif HT"
                          className="block md:table-cell md:px-4 md:py-3 md:whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 md:text-right responsive-cell w-1/12"
                        >
                        {kitInfo.price}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="border-t border-gray-200 dark:border-gray-700">
                <div className="mt-4 mb-4 text-sm text-gray-500 dark:text-gray-400 italic px-4">
                  {texts[language]?.diagbox?.gazon?.pythium_note}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section CTA */}
        <div className="max-w-4xl mx-auto px-4 text-center mt-12 mb-16">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            {getDiagboxText('cta.text')}
          </p>
          <Link to="/contact" className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors">
            {getDiagboxText('cta.button')}
          </Link>
        </div>

                  {/* Services Sections */}
        <section className="flex flex-col gap-8 mt-20 mb-12 md:mb-16 md:max-w-3xl lg:max-w-4xl md:mx-auto">
          {/* Analyse Catalogue */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-primary dark:text-secondary">
              {getText(`sectors.page.${sectorId}.catalog.title`, '')}
            </h3>
            <p className="text-primary dark:text-secondary">
              {getText(`sectors.page.${sectorId}.catalog.description`, '')}
            </p>
          </div>

          {/* Développement */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold mb-3 text-primary dark:text-secondary">
              {getText(`sectors.page.${sectorId}.development.title`, '')}
            </h3>
            <p className="text-primary dark:text-secondary">
              {getText(`sectors.page.${sectorId}.development.description`, '')}
            </p>
          </div>
        </section>

        {/* Back to Domains Button */}
        <div className="text-center mt-16 mb-12">
          <Link 
            to="/" 
            className="inline-block bg-[#52c6dd] py-3 px-6 rounded-lg text-white hover:text-white/90 font-medium transition-colors"
          >
            {getText('sectors.common.back_button')}
          </Link>
        </div>
      </motion.div>
    );
  } else {
    // Default layout for other sectors (02, 03, 05, 06, 07, 08)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto px-4 py-12 md:py-16"
      >
        {/* --- Sector Intro Section --- */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 p-8 rounded-lg mb-6 shadow-sm md:max-w-3xl lg:max-w-4xl md:mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-primary dark:text-secondary mb-4">{sectorName}</h1>
          <div className="text-lg md:text-xl text-primary dark:text-secondary">
            <div className="flex items-start">
              <FaAngleRight className="text-blue-300 dark:text-blue-400 text-2xl mt-1 mr-2 flex-shrink-0" />
              <div>
                {getText(`sectors.page.${sectorId}.intro`, '').split('\n').map((line, index) => {
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

        {/* --- Services Section --- */}
        <section className="mb-12 md:mb-16 md:max-w-3xl lg:max-w-4xl md:mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-primary dark:text-secondary mb-8">
            {getText(`sectors.page.${sectorId}.services.title`, '')}
          </h2>

          {/* DiagBox Service */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold mb-3 text-primary dark:text-secondary">
              {getText(`sectors.page.${sectorId}.diagbox.title`, '')}
            </h3>
            <p className="text-primary dark:text-secondary">
              {getText(`sectors.page.${sectorId}.diagbox.description`, '')}
            </p>
          </div>

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
              {getText(`sectors.page.${sectorId}.catalog.title`, '')}
            </h3>
            <p className="text-primary dark:text-secondary">
              {getText(`sectors.page.${sectorId}.catalog.description`, '')}
            </p>
          </div>

          {/* Développement */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-primary dark:text-secondary">
              {getText(`sectors.page.${sectorId}.development.title`, '')}
            </h3>
            <p className="text-primary dark:text-secondary">
              {getText(`sectors.page.${sectorId}.development.description`, '')}
            </p>
          </div>

          {/* Prélèvement */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-primary dark:text-secondary">
              {getText(`sectors.page.${sectorId}.sampling.title`, '')}
            </h3>
            <p className="text-primary dark:text-secondary">
              {getText(`sectors.page.${sectorId}.sampling.description`, '')}
            </p>
          </div>
        </section>

        {/* Back to Domains Button */}
        <div className="text-center mt-16 mb-12">
          <Link 
            to="/" 
            className="inline-block bg-[#52c6dd] py-3 px-6 rounded-lg text-white hover:text-white/90 font-medium transition-colors"
          >
            {getText('sectors.common.back_button')}
          </Link>
        </div>
      </motion.div>
    );
  }
}

export default SectorPage;