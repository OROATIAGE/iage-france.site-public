import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { texts } from '../content/texts'; // Import des textes centralisés
// Import necessary components and icons for the Gazons specific section
import DiagboxGazonNav from '../components/DiagboxGazonNav'; 
import { FaLeaf, FaVial, FaPaperPlane, FaChevronDown, FaChevronRight, FaAngleRight } from 'react-icons/fa';
import GazonQnaAccordion from '../components/GazonQnaAccordion'; // Import the new component
import { useState, useEffect } from 'react';

// Original getText helper for general sector page data
const getText = (baseKey, path) => {
  const keys = path.split('.');
  let current = baseKey;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      console.warn(`Texte manquant pour la clé: ${path} dans ${JSON.stringify(baseKey)}`);
      return '';
    }
  }
  return typeof current === 'string' ? current.replace(/\\n/g, '\n') : current; // Added newline handling here too
};

// Specific getText helper for Diagbox Gazon content
const getDiagboxText = (key, defaultValue = '') => {
  const keys = key.split('.');
  let current = texts.diagbox?.gazon;
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      return defaultValue;
    }
  }
  if (typeof current === 'string') {
    return current.replace(/\\n/g, '\n'); 
  }
  return current;
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
  const { sectorId } = useParams(); 
  const [openKitGroupAccordions, setOpenKitGroupAccordions] = useState({});
  const [showAllKitGroups, setShowAllKitGroups] = useState(false);
  const [initiallyOpenKitGroup, setInitiallyOpenKitGroup] = useState(null);

  const sectorData = texts.home?.sectors?.[sectorId];
  const pageData = texts.sectors?.page?.[sectorId];

  // Determine the back button text outside the return statement
  const backButtonText = texts.sectors?.common?.back_button || 'Retour à l\'accueil'; // Escaped apostrophe

  useEffect(() => {
    if (initiallyOpenKitGroup) {
      setOpenKitGroupAccordions(prev => ({ ...prev, [initiallyOpenKitGroup]: true }));
      setInitiallyOpenKitGroup(null); // Reset after opening
    }
  }, [initiallyOpenKitGroup]);

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
  if (sectorId === '04') {
    // --- Render Comprehensive Gazons Page ---
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto px-4 py-12 md:py-16"
      >
        {/* --- Gazon Intro Section - Part 1 (Title and Catchphrase) --- */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 p-8 rounded-lg mb-6 shadow-sm">
          <h1 className="text-3xl md:text-4xl font-bold text-primary dark:text-secondary mb-4">{sectorName}</h1>
          <p className="text-xl md:text-2xl font-semibold text-primary dark:text-gray-300 whitespace-pre-line">
            {getText(pageData, 'catchphrase')}
          </p>
        </div>

        {/* --- NEW Perspective Text Section --- */}
        <div className="my-8 md:my-12 prose lg:prose-xl max-w-none dark:prose-invert text-primary dark:text-gray-300">
          <p className="whitespace-pre-line">
            {getText(pageData, 'perspective_text')}
          </p>
        </div>

        {/* --- Gazon Intro Section - Part 2 (IAGE Intro with list) --- */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 p-8 rounded-lg mb-12 shadow-sm">
          {
            (() => {
              const introText = getText(pageData, 'intro');
              const lines = introText.split('\n');
              const mainLine = lines[0];
              const listItems = lines.slice(1);

              return (
                <>
                  <p className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <FaAngleRight className="mr-2 text-secondary dark:text-secondary-light" /> 
                    {mainLine}
                  </p>
                  {listItems.map((item, index) => (
                    <p key={index} className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-300 ml-12 mb-1">
                      {item.startsWith('-') ? item.substring(1).trim() : item.trim()} {/* Remove dash if present, then trim */}
                    </p>
                  ))}
                </>
              );
            })()
          }
        </div>

        {/* --- Q&A Accordion Section --- */}
        <GazonQnaAccordion onOpenKitGroup={setInitiallyOpenKitGroup} />

        {/* --- Diagbox Navigation --- */}
        <DiagboxGazonNav onNavigateToQna={handleNavigateToQnaAndCollapseKits} />

        {/* --- Content from DiagboxGazonPage.jsx --- */}
        {/* --- Diagbox Hero Section (copied) --- */}
        <div className="text-center mb-12 md:mb-16 mt-8"> {/* Added margin top */}
          <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-secondary mb-4">
            {getDiagboxText('title')} {/* DIAGBOX® Gazon */}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {getDiagboxText('subtitle')}
          </p>
        </div>

        {/* --- Process Section (copied) --- */}
        <section className="mb-12 md:mb-16 bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-8">
            {getDiagboxText('process.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <FaLeaf className="text-4xl text-secondary mb-3" />
              <h3 className="text-lg font-semibold mb-2 dark:text-white">{getDiagboxText('process.step1.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{getDiagboxText('process.step1.text')}</p>
            </div>
            <div className="flex flex-col items-center">
              <FaVial className="text-4xl text-secondary mb-3" />
              <h3 className="text-lg font-semibold mb-2 dark:text-white">{getDiagboxText('process.step2.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{getDiagboxText('process.step2.text')}</p>
            </div>
            <div className="flex flex-col items-center">
              <FaPaperPlane className="text-4xl text-secondary mb-3" />
              <h3 className="text-lg font-semibold mb-2 dark:text-white">{getDiagboxText('process.step3.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{getDiagboxText('process.step3.text')}</p>
            </div>
          </div>
        </section>

        {/* --- General Info Sections (copied) --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 md:mb-16">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-primary dark:text-secondary">{getDiagboxText('ideal_for.title')}</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">{getDiagboxText('ideal_for.text')}</p>
          </div>
           <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-primary dark:text-secondary">{getDiagboxText('kit_content.title')}</h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{getDiagboxText('kit_content.text')}</p>
          </div>
        </section>

        {/* --- NEW: Q&A Driven Diagbox Groups --- */}
        <div className="mt-8 md:mt-12 mb-8">
            <button 
                onClick={handleToggleAllKitGroups}
                className="mb-6 px-4 py-2 bg-secondary/10 hover:bg-secondary/20 dark:bg-secondary/20 dark:hover:bg-secondary/30 text-secondary dark:text-secondary-light rounded-md text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
            >
                {showAllKitGroups ? getDiagboxText('button_hide_all_kits', 'Masquer tous les kits') : getDiagboxText('button_show_all_kits', 'Afficher tous les kits')}
            </button>
        </div>

        <div className="space-y-6">
          {qnaKitGroups.map((group) => {
            const isOpen = showAllKitGroups || !!openKitGroupAccordions[group.id];
            return (
              <section key={group.id} id={group.id} className="scroll-mt-24 md:scroll-mt-28 border rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700">
                <button
                  onClick={() => handleToggleKitGroupAccordion(group.id)}
                  className="w-full flex justify-between items-center p-4 text-left text-lg font-semibold text-primary dark:text-secondary hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <span>{getDiagboxText(group.titleKey, `Groupe ${group.id}`)}</span>
                  {isOpen ? <FaChevronDown className="text-primary dark:text-secondary" /> : <FaChevronRight className="text-gray-500" />}
                </button>

                {isOpen && (
                  <div className="p-4 md:p-6 border-t bg-gray-50 dark:bg-gray-800/30 dark:border-gray-600 space-y-6">
                    {group.kits.map(kit => (
                      <div key={kit.ref} className="bg-white dark:bg-gray-800 p-4 rounded-md shadow">
                         <p 
                           className="italic text-gray-600 dark:text-gray-400 mb-3 border-l-4 border-secondary/50 pl-3"
                           dangerouslySetInnerHTML={{ __html: getDiagboxText(kit.introKey, `Intro pour ${kit.ref}`) }}
                         />
                         {renderKitDetails(kit.ref)}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Price List Section remains */}
        <section id="prices" className="mt-12 md:mt-16 pt-10 border-t border-gray-200 dark:border-gray-700 scroll-mt-20 md:scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-semibold text-center text-primary dark:text-gray-200 mb-8">
              {getDiagboxText('prices.title')}
            </h2>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 -mt-4 mb-6">
              {getDiagboxText('prices.info_link')}
            </p>
            <div className="overflow-x-auto md:overflow-visible">
              <table className="min-w-full w-full divide-y divide-gray-200 dark:divide-gray-700 md:border dark:border-gray-600 shadow-sm md:rounded-lg responsive-kit-table">
                <thead className="bg-gray-50 dark:bg-gray-700 hidden md:table-header-group">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Référence</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Désignation</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {getDiagboxText('prices.type_header')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Prix Indicatif HT</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 flex flex-col md:table-row-group md:divide-y">
                  {priceList.map((kitRef) => {
                    const typeId = kitRefToSectionIdMap[kitRef] ?? '';
                    const typeText = getDiagboxText(`types.${typeId}`) || typeId;
                    return (
                      <tr key={kitRef} className="block md:table-row border-b last:border-b-0 md:border-none dark:border-gray-700 p-4 md:p-0">
                        <td 
                          data-label="Référence"
                          className="block md:table-cell md:px-6 md:py-4 md:whitespace-nowrap text-sm font-medium text-primary dark:text-gray-100 responsive-cell"
                        >
                          {kitRef}
                        </td>
                        <td 
                          data-label="Désignation"
                          className="block md:table-cell md:px-6 md:py-4 md:whitespace-nowrap text-sm text-primary dark:text-gray-300 responsive-cell"
                        >
                          {/* Link removed, just display text */}
                          {getDiagboxText(`kits.${kitRef}.name`)}
                        </td>
                        <td 
                          data-label={getDiagboxText('prices.type_header', 'Type')}
                          className="block md:table-cell md:px-6 md:py-4 md:whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 responsive-cell"
                        >
                           {/* Link removed, just display text */}
                           {typeText}
                        </td>
                        <td 
                          data-label="Prix Indicatif HT"
                          className="block md:table-cell md:px-6 md:py-4 md:whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 md:text-right responsive-cell"
                        >
                          {getDiagboxText(`prices.${kitRef}`)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
        </section>

        {/* --- Final CTA Section (copied) --- */}
        <section className="mt-12 md:mt-16 text-center mb-12"> {/* Added margin bottom */}
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              {getDiagboxText('cta.text')}
            </p>
            <Link to="/contact" className="btn-primary">
              {getDiagboxText('cta.button')}
            </Link>
        </section>

        {/* --- Add Catalog and Development Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12 md:my-16">
          {/* Card 1: Catalogue */}
          <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-primary dark:text-secondary mb-3">{getText(pageData, 'catalog.title')}</h3>
            <p className="text-primary dark:text-gray-300">{getText(pageData, 'catalog.description')}</p>
          </div>

          {/* Card 2: Development */}
          <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-primary dark:text-secondary mb-3">{getText(pageData, 'development.title')}</h3>
            <p className="text-primary dark:text-gray-300">{getText(pageData, 'development.description')}</p>
          </div>
        </div>

        {/* --- Original Return Button */}
        <div className="text-center mt-12">
          <Link to="/" className="btn-secondary">
            {backButtonText}
          </Link>
        </div>

      </motion.div>
    );

  } else {
    // --- Render Original SectorPage Layout for other sectors ---
    const sectorName = sectorData.name || `Secteur ${sectorId}`;
    // Determine back button text here as well for consistency
    const backButtonText = texts.sectors?.common?.back_button || 'Voir tous les secteurs'; // Use original fallback for other sectors

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12 md:py-16"
      >
        {/* Phrase d'accroche et introduction */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 p-8 rounded-lg mb-12 shadow-sm">
          <h1 className="text-3xl md:text-4xl font-bold text-primary dark:text-secondary mb-4">{sectorName}</h1>
          <p className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
            {getText(pageData, 'catchphrase')}
          </p>
          <p className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
            {getText(pageData, 'intro')}
          </p>
        </div>

        {/* Présentation des services */}
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-8 text-center">
          {getText(pageData, 'services.title')}
        </h2>
        {/* Original 3-column service grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-primary dark:text-secondary mb-3">{getText(pageData, 'diagbox.title')}</h3>
            <p className="text-primary dark:text-gray-300">{getText(pageData, 'diagbox.description')}</p>
            {getText(pageData, 'cta.diagbox') && (
               <Link
                 to={`/services/diagbox/${sectorId}`} // Lien dynamique basé sur sectorId
                 className="mt-6 inline-block bg-accent text-white font-semibold px-5 py-2 rounded-md hover:bg-accent/90 transition-colors text-sm"
               >
                 {getText(pageData, 'cta.diagbox')}
               </Link>
             )}
          </div>
          <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-primary dark:text-secondary mb-3">{getText(pageData, 'catalog.title')}</h3>
            <p className="text-primary dark:text-gray-300">{getText(pageData, 'catalog.description')}</p>
          </div>
          <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-primary dark:text-secondary mb-3">{getText(pageData, 'development.title')}</h3>
            <p className="text-primary dark:text-gray-300">{getText(pageData, 'development.description')}</p>
          </div>
        </div>

        {/* Mention Prélèvement Continu */}
        {getText(pageData, 'sampling.description') && (
           <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-inner mb-12">
              <h3 className="text-xl font-semibold text-primary dark:text-gray-200 mb-3">{getText(pageData, 'sampling.title')}</h3>
              <p className="text-primary dark:text-gray-300">{getText(pageData, 'sampling.description')}</p>
           </div>
        )}

        {/* Bouton Retour */}
        <div className="text-center mt-12">
          <Link to="/#sectors-grid" className="btn-secondary">
            {backButtonText}
          </Link>
        </div>

      </motion.div>
    );
  }
}

export default SectorPage;