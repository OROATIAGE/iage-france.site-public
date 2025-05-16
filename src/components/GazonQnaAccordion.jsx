import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { texts } from '../content/texts';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa'; // Icons for accordion
import { FaRegLightbulb } from 'react-icons/fa'; // Ajout de l'icône ampoule
import TextWithBoldMarkdown from './TextWithBoldMarkdown'; // Import du composant de mise en forme
import KitDetailCard from './KitDetailCard';
import { getEnhancedKitData } from '../utils/kitDataHelpers'; // Import the main helper

const qnaData = [
  {
    id: 'q1',
    titleKey: 'q1_title',
    recommendationKey: 'qna_reco.qna-group-q1_sub1',
    bonASavoirKey: 'qna_bon_a_savoir.q1',
    recommendedKitRefs: [ // Define recommended kits directly
      { ref: 'PF000049', introKey: 'qna_intro.reco_PF000049' },
      { ref: 'PF000011', introKey: 'qna_intro.reco_PF000011' },
      { ref: 'PF000016', introKey: 'qna_intro.reco_PF000016' },
    ],
  },
  {
    id: 'q2',
    titleKey: 'q2_title',
    recommendationKey: 'qna_reco.qna-group-q2_sub1',
    bonASavoirKey: 'qna_bon_a_savoir.q2',
    recommendedKitRefs: [
      { ref: 'PF000049', introKey: 'qna_intro.reco_PF000049' },
    ],
  },
  {
    id: 'q3',
    titleKey: 'q3_title',
    recommendationKey: 'qna_reco.qna-group-q3',
    bonASavoirKey: 'qna_bon_a_savoir.q3',
    recommendedKitRefs: [
      { ref: 'PF000018', introKey: 'qna_intro.reco_PF000018' },
      { ref: 'PF000019', introKey: 'qna_intro.reco_PF000019' },
      { ref: 'PF000020', introKey: 'qna_intro.reco_PF000020' },
    ],
  },
  {
    id: 'q4',
    titleKey: 'q4_title',
    recommendationKey: 'qna_reco.qna-group-q4_combined',
    bonASavoirKey: 'qna_bon_a_savoir.q4',
    recommendedKitRefs: [
      { ref: 'PF000047', introKey: 'qna_intro.reco_PF000047' },
      { ref: 'PF000049', introKey: 'qna_intro.reco_PF000049' },
      { ref: 'PF000050', introKey: 'qna_intro.reco_PF000050' },
    ],
  },
  {
    id: 'q5',
    titleKey: 'q5_title',
    bonASavoirKey: 'qna_bon_a_savoir.q5',
    recommendedKitRefs: [], // No kits for this question, only contact link
  },
];

// Define kitTypes and kitRefToSectionIdMap here for getEnhancedKitData
// This can be moved to a shared location if used by more components extensively
const kitTypes = [
  { type: 'lingette', kits: ['PF000011', 'PF000013', 'PF000015'] },
  { type: 'dechet', kits: ['PF000016', 'PF000018', 'PF000019', 'PF000020'] },
  { type: 'sympto', kits: ['PF000033', 'PF000035'] },
  { type: 'racine', kits: ['PF000048'] },
  { type: 'sol', kits: ['PF000047'] },
  { type: 'racine_gazon', kits: ['PF000049'] },
  { type: 'plaquage', kits: ['PF000050'] }
];
const kitRefToSectionIdMap = {};
kitTypes.forEach(typeInfo => {
  typeInfo.kits.forEach(kitRef => {
    kitRefToSectionIdMap[kitRef] = typeInfo.type;
  });
});

// Helper to get text specifically for this component
const getQnaText = (key) => texts.gazon?.qna?.[key] || '';
const getRecommendationText = (key) => {
  const keys = key.split('.');
  let current = texts.diagbox?.gazon;
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      return '';
    }
  }
  return current;
};
// Helper to get Bon à savoir text for each question
const getBonASavoirText = (key) => {
  const keys = key.split('.');
  let current = texts.diagbox?.gazon;
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      return "Ici, vous pouvez ajouter une information utile, un conseil ou une astuce en lien avec la question posée.";
    }
  }
  return current;
};

function GazonQnaAccordion({ onOpenKitGroup }) {
  const [openAccordion, setOpenAccordion] = useState(null); // State to track open section
  const [openKitAccordions, setOpenKitAccordions] = useState({}); // State for kit accordions
  const navigate = useNavigate(); // Initialize navigate

  // Ajout refs pour chaque question
  const questionRefs = useRef({});
  qnaData.forEach(item => {
    if (!questionRefs.current[item.id]) {
      questionRefs.current[item.id] = React.createRef();
    }
  });

  const handleToggle = (id) => {
    const previouslyOpenAccordionId = openAccordion; // Store the ID of the accordion that was open before this click
    const isCurrentlyOpen = openAccordion === id;    // Is the clicked accordion the one that was already open?
    const isOpeningNew = !isCurrentlyOpen;          // Are we trying to open this accordion (it wasn't open or a different one was)?

    // If a new accordion is being opened, and there was a different one open before,
    // close the kit details of the previously open accordion.
    if (isOpeningNew && previouslyOpenAccordionId && previouslyOpenAccordionId !== id) {
      setOpenKitAccordions(prev => ({ ...prev, [previouslyOpenAccordionId]: false }));
    }

    // Set the new state for the main accordion (open the clicked one, or close it if it was already open)
    setOpenAccordion(isOpeningNew ? id : null);

    // If we are explicitly closing the accordion that was just open (by clicking it again),
    // also ensure its corresponding kit details accordion is closed.
    // This handles the case where the user clicks the same accordion header to close it.
    if (isCurrentlyOpen) { 
      setOpenKitAccordions(prev => ({ ...prev, [id]: false }));
    }

    // Scroll logic for when a new main accordion is being opened
    if (isOpeningNew) {
      setTimeout(() => {
        const ref = questionRefs.current[id];
        if (ref && ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const offset = 80; // Ajuste cette valeur selon la hauteur de ton header sticky
          const top = rect.top + scrollTop - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 100); // 100ms pour laisser le DOM se mettre à jour
    }
  };

  const handleToggleKitAccordion = (itemId) => {
    setOpenKitAccordions(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleLinkClick = (e, target) => {
    if (target?.startsWith('#')) { // Added optional chaining for target
      const targetId = target.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (onOpenKitGroup) {
          onOpenKitGroup(targetId);
        }
      }
    } else if (target) { // Ensure target is not undefined
      e.preventDefault();
      navigate(target);
    }
  };

  return (
    <div id="gazon-qna-accordion" className="space-y-4 mb-12 md:mb-16">
      {qnaData.map((item) => {
        // Get data for all recommended kits for this Q&A item
        const recommendedKitsData = item.recommendedKitRefs.map(kitInfo =>
          getEnhancedKitData(kitInfo.ref, kitInfo.introKey, kitRefToSectionIdMap)
        );

        // Aggregate summary notes
        let collectiveSumIndividual = null;
        let collectiveSaving = null;
        let hasAnyPythiumNote = false;
        let pythiumNoteToDisplay = null;

        recommendedKitsData.forEach(kit => {
          if (kit.sumOfIndividualPricesText) collectiveSumIndividual = kit.sumOfIndividualPricesText; // Assuming only one kit in a group has this
          if (kit.savingText) collectiveSaving = kit.savingText; // Assuming only one kit in a group has this
          if (kit.hasPythiumNote && kit.pythiumNoteText) {
            hasAnyPythiumNote = true;
            pythiumNoteToDisplay = kit.pythiumNoteText; // Take the first one encountered
          }
        });

        return (
          <div
            key={item.id}
            className="border rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700 md:max-w-3xl lg:max-w-4xl md:mx-auto"
          >
            {/* Accordion Header */}
            <button
              ref={questionRefs.current[item.id]}
              onClick={() => handleToggle(item.id)}
              className="w-full flex justify-between items-center p-4 text-left text-lg font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span>{getQnaText(item.titleKey)}</span>
              <FaChevronDown className={`text-primary dark:text-secondary transform transition-transform duration-200 ${openAccordion === item.id ? 'rotate-180' : ''}`} />
            </button>

            {/* Accordion Content */}
            {openAccordion === item.id && (
              <div className="p-4 border-t bg-gray-50 dark:bg-gray-800/50 dark:border-gray-600">
                {/* Bon à savoir */}
                <div className="flex items-start gap-3 mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 rounded md:max-w-3xl lg:max-w-4xl md:mx-auto">
                  <FaRegLightbulb className="text-yellow-500 text-2xl mt-1" />
                  <div>
                    <div className="font-semibold text-yellow-700 dark:text-yellow-300 mb-1">Bon à savoir</div>
                    <div className="text-yellow-800 dark:text-yellow-200 text-sm">
                      <TextWithBoldMarkdown text={getBonASavoirText(item.bonASavoirKey)} />
                    </div>
                  </div>
                </div>

                {/* Recommendations Section (Text Only) */}
                {item.recommendationKey && (
                  <div className="mt-4 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm mb-4 md:max-w-3xl lg:max-w-4xl md:mx-auto">
                    <h4 className="text-lg font-semibold text-primary dark:text-secondary mb-2">
                      <TextWithBoldMarkdown text={getRecommendationText(`${item.recommendationKey}.recommendation_text`)} />
                    </h4>
                    <div className="w-16 h-1.5 bg-secondary mb-4 rounded-full"></div>
                    <div className="prose dark:prose-invert w-full">
                      <TextWithBoldMarkdown text={getRecommendationText(`${item.recommendationKey}.conclusion_text_prefix`)} />
                    </div>
                  </div>
                )}

                {/* Collapsible Kit Details Section */}
                {item.recommendedKitRefs && item.recommendedKitRefs.length > 0 && item.recommendationKey && (
                  <div className="mt-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm md:max-w-3xl lg:max-w-4xl md:mx-auto">
                    <button
                      onClick={() => handleToggleKitAccordion(item.id)}
                      className="w-full flex justify-between items-center p-3 text-left font-semibold text-secondary dark:text-secondary hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors rounded-t-lg"
                    >
                      <span>
                        {getRecommendationText(`${item.recommendationKey}.conclusion_text_suffix`)}
                      </span>
                      <FaChevronDown className={`transform transition-transform duration-200 ${openKitAccordions[item.id] ? 'rotate-180' : ''}`} />
                    </button>
                    {openKitAccordions[item.id] && (
                      <div className="p-4 border-t border-gray-200 dark:border-gray-600">
                        {/* Desktop: Table View */}
                        <div className="hidden md:block overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                              <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-2/12">Référence</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-2/12">Désignation</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-2/12">Type de kit</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-5/12">Pathogènes cibles</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/12">Prix Indicatif HT</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                              {recommendedKitsData.map((kitData) => (
                                <tr key={kitData.kitRef}>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 w-2/12">{kitData.kitRef}</td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 w-2/12">{kitData.designation}</td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 w-2/12">{kitData.typeDeKit}</td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 w-5/12">{kitData.ciblesEffectives}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 w-1/12">{kitData.prixIndicatifHT}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile: Card View */}
                        <div className="md:hidden">
                          {recommendedKitsData.map((kitData) => (
                            <KitDetailCard 
                              key={kitData.kitRef} 
                              kitRef={kitData.kitRef} // Pass kitRef down 
                              introKey={item.recommendedKitRefs.find(k => k.ref === kitData.kitRef)?.introKey || ''} // Find original introKey
                              kitRefToSectionIdMap={kitRefToSectionIdMap} // Pass the map
                            />
                          ))}
                        </div>
                        
                        {/* Aggregated Summary Notes - Rendered after table/cards */}
                        <div className="mt-4 space-y-1 text-sm">
                            {hasAnyPythiumNote && pythiumNoteToDisplay && (
                                <p className="italic text-gray-500 dark:text-gray-400 text-xs">
                                    {pythiumNoteToDisplay}
                                </p>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Contact Link - Placed after both recommendation and kit sections */}
                {(item.recommendationKey || item.id === 'q5') && (
                  <div className="mt-6 text-center md:max-w-3xl lg:max-w-4xl md:mx-auto">
                    <a
                      href="/contact"
                      onClick={(e) => handleLinkClick(e, '/contact')}
                      className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      {getRecommendationText('qna_reco.common.contact_link')}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default GazonQnaAccordion; 