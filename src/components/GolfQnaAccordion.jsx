import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { texts } from '../content/texts';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { FaRegLightbulb } from 'react-icons/fa';
import TextWithBoldMarkdown from './TextWithBoldMarkdown';
import DiagboxKitTable from './DiagboxKitTable';
import { getEnhancedKitData } from '../utils/kitDataHelpers';
import { useLanguage } from '../context/LanguageContext';
import { getTextByLanguage } from '../utils/textHelpers';

const qnaData = [
  {
    id: 'q1',
    titleKey: 'sectors.page.09.qna.q1_title',
    recommendationKey: 'sectors.page.09.qna_reco.qna-group-q1',
    bonASavoirKey: 'sectors.page.09.qna_bon_a_savoir.q1',
    recommendedKitRefs: [
      { ref: 'PF000049', introKey: 'diagbox.gazon.qna_intro.reco_PF000049' },
      { ref: 'PF000011', introKey: 'diagbox.gazon.qna_intro.reco_PF000011' },
      { ref: 'PF000016', introKey: 'diagbox.gazon.qna_intro.reco_PF000016' },
    ],
  },
  {
    id: 'q2',
    titleKey: 'sectors.page.09.qna.q2_title',
    recommendationKey: 'sectors.page.09.qna_reco.qna-group-q2',
    bonASavoirKey: 'sectors.page.09.qna_bon_a_savoir.q2',
    recommendedKitRefs: [
      { ref: 'PF000049', introKey: 'diagbox.gazon.qna_intro.reco_PF000049' },
    ],
  },
  {
    id: 'q3',
    titleKey: 'sectors.page.09.qna.q3_title',
    recommendationKey: 'sectors.page.09.qna_reco.qna-group-q3',
    bonASavoirKey: 'sectors.page.09.qna_bon_a_savoir.q3',
    recommendedKitRefs: [
      { ref: 'PF000018', introKey: 'diagbox.gazon.qna_intro.reco_PF000018' },
      { ref: 'PF000020', introKey: 'diagbox.gazon.qna_intro.reco_PF000020' },
    ],
  },
  {
    id: 'q4',
    titleKey: 'sectors.page.09.qna.q4_title',
    recommendationKey: 'sectors.page.09.qna_reco.qna-group-q4',
    bonASavoirKey: 'sectors.page.09.qna_bon_a_savoir.q4',
    recommendedKitRefs: [
      { ref: 'PF000047', introKey: 'diagbox.gazon.qna_intro.reco_PF000047' },
      { ref: 'PF000049', introKey: 'diagbox.gazon.qna_intro.reco_PF000049' },
      { ref: 'PF000050', introKey: 'diagbox.gazon.qna_intro.reco_PF000050' }
    ],
  },
  {
    id: 'q5',
    titleKey: 'sectors.page.09.qna.q5_title',
    bonASavoirKey: 'sectors.page.09.qna_bon_a_savoir.q5',
  },
];

// Define kitTypes and kitRefToSectionIdMap here for getEnhancedKitData
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

// Helper to get text from any path
const getGeneralText = (key, language) => {
  const keys = key.split('.');
  let current = texts[language];
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      return '';
    }
  }
  return current;
};

// Helper to get text specifically for this component
const getQnaText = (key, language) => {
  const keys = key.split('.');
  let current = texts[language];
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      return '';
    }
  }
  return current;
};

const getRecommendationText = (key, language) => {
  const keys = key.split('.');
  let current = texts[language];
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      return {
        recommendation: '',
        conclusionPrefix: '',
        conclusionSuffix: ''
      };
    }
  }
  return {
    recommendation: current.recommendation_text || '',
    conclusionPrefix: current.conclusion_text_prefix || '',
    conclusionSuffix: current.conclusion_text_suffix || ''
  };
};

// Helper to get Bon à savoir text for each question
const getBonASavoirText = (key, language) => {
  const keys = key.split('.');
  let current = texts[language];
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      return '';
    }
  }
  return current;
};

function GolfQnaAccordion({ onOpenKitGroup }) {
  const { language } = useLanguage();
  const [openAccordion, setOpenAccordion] = useState(null);
  const [openKitAccordions, setOpenKitAccordions] = useState({});
  const navigate = useNavigate();

  const questionRefs = useRef({});
  qnaData.forEach(item => {
    if (!questionRefs.current[item.id]) {
      questionRefs.current[item.id] = React.createRef();
    }
  });

  const handleToggle = (id) => {
    const isCurrentlyOpen = openAccordion === id;
    const isOpeningNew = !isCurrentlyOpen;

    if (!isOpeningNew || openAccordion !== null) {
      setOpenKitAccordions(prev => {
        const newState = { ...prev };
        if (!isOpeningNew) {
          newState[id + '_conclusion'] = false;
        }
        if (openAccordion !== null) {
          newState[openAccordion + '_conclusion'] = false;
        }
        return newState;
      });
    }

    setOpenAccordion(isOpeningNew ? id : null);

    if (isOpeningNew) {
      setTimeout(() => {
        const ref = questionRefs.current[id];
        if (ref && ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const offset = 80;
          const top = rect.top + scrollTop - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleToggleKitAccordion = (itemId) => {
    setOpenKitAccordions(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleLinkClick = (e, target) => {
    e.preventDefault();
    if (target.startsWith('#')) {
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(target);
    }
  };

  return (
    <div id="golf-qna-accordion" className="space-y-4 mb-12 md:mb-16">
      {qnaData.map((item) => {
        const recommendedKitsData = item.recommendedKitRefs ? item.recommendedKitRefs.map(kitInfo =>
          getEnhancedKitData(kitInfo.ref, kitInfo.introKey, kitRefToSectionIdMap)
        ) : [];

        const recommendationTexts = item.recommendationKey ? getRecommendationText(item.recommendationKey, language) : null;

        let collectiveSumIndividual = null;
        let collectiveSaving = null;
        let hasAnyPythiumNote = false;
        let pythiumNoteToDisplay = null;

        recommendedKitsData.forEach(kit => {
          if (kit.sumOfIndividualPricesText) collectiveSumIndividual = kit.sumOfIndividualPricesText;
          if (kit.savingText) collectiveSaving = kit.savingText;
          if (kit.hasPythiumNote && kit.pythiumNoteText) {
            hasAnyPythiumNote = true;
            pythiumNoteToDisplay = kit.pythiumNoteText;
          }
        });

        return (
          <div
            key={item.id}
            className="border rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700 md:max-w-3xl lg:max-w-4xl md:mx-auto"
          >
            <button
              ref={questionRefs.current[item.id]}
              onClick={() => handleToggle(item.id)}
              className="w-full flex justify-between items-center p-4 text-left text-lg font-semibold text-primary dark:text-secondary hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span>{getGeneralText(item.titleKey, language)}</span>
              <FaChevronDown className={`text-primary dark:text-secondary transform transition-transform duration-200 ${openAccordion === item.id ? 'rotate-180' : ''}`} />
            </button>

            {openAccordion === item.id && (
              <div className="p-4 border-t bg-gray-50 dark:bg-gray-800/50 dark:border-gray-600">
                <div className="flex items-start gap-3 mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 rounded md:max-w-3xl lg:max-w-4xl md:mx-auto">
                  <div className="flex-shrink-0 text-yellow-500 dark:text-yellow-400">
                    <FaRegLightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1 text-[#996515] dark:text-gray-300">{getGeneralText('sectors.page.09.qna_reco.common.bon_a_savoir_title', language)}</div>
                    <div className="text-sm text-[#8B4513] dark:text-gray-300">
                      <TextWithBoldMarkdown text={getBonASavoirText(item.bonASavoirKey, language)} />
                    </div>
                  </div>
                </div>

                {item.id === 'q5' && (
                  <div className="mt-6 text-center">
                    <a
                      href="/contact"
                      onClick={(e) => handleLinkClick(e, '/contact')}
                      className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      {getGeneralText('home.hero.cta', language)}
                    </a>
                  </div>
                )}

                {recommendationTexts && (
                  <div className="mt-4 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm mb-4 md:max-w-3xl lg:max-w-4xl md:mx-auto">
                    <h4 className="text-lg font-semibold text-primary dark:text-secondary mb-2">
                      <TextWithBoldMarkdown text={recommendationTexts.recommendation} />
                    </h4>
                    <div className="w-16 h-1.5 bg-secondary mb-4 rounded-full"></div>
                    <div className="prose dark:prose-invert w-full">
                      <TextWithBoldMarkdown text={recommendationTexts.conclusionPrefix} />
                    </div>
                  </div>
                )}

                {recommendationTexts && item.id !== 'q5' && (
                  <div className="mt-4 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm mb-4 md:max-w-3xl lg:max-w-4xl md:mx-auto">
                    <h4 className="text-lg font-semibold text-primary dark:text-secondary mb-2">
                      {getGeneralText('sectors.page.09.qna_reco.common.accompagnement_title', language)}
                    </h4>
                    <div className="w-16 h-1.5 bg-secondary mb-4 rounded-full"></div>
                    <div className="prose dark:prose-invert w-full">
                      <TextWithBoldMarkdown text={getGeneralText(`sectors.page.09.qna_reco.${item.id}.accompagnement_text`, language)} />
                    </div>
                    
                    {(item.recommendationKey || item.id === 'q5') && (
                      <div className="mt-6 text-center">
                        <a
                          href="/contact"
                          onClick={(e) => handleLinkClick(e, '/contact')}
                          className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                        >
                          {getGeneralText('home.hero.cta', language)}
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {recommendationTexts && (
                  <div className="mt-4">
                    <button
                      onClick={() => handleToggleKitAccordion(item.id + '_conclusion')}
                      className="w-full flex flex-col p-4 text-left text-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-700 rounded-lg shadow-sm"
                    >
                      <div className="flex justify-between items-center w-full mb-2">
                        <span>{recommendationTexts.conclusionSuffix}</span>
                        <FaChevronDown className={`text-primary dark:text-secondary transform transition-transform duration-200 ${openKitAccordions[item.id + '_conclusion'] ? 'rotate-180' : ''}`} />
                      </div>
                      <div className="w-16 h-1.5 bg-secondary rounded-full"></div>
                    </button>

                    {openKitAccordions[item.id + '_conclusion'] && (
                      <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm mt-2">
                        {item.recommendedKitRefs && (
                          <div>
                            <DiagboxKitTable 
                              kitList={item.recommendedKitRefs.map(kit => kit.ref)}
                              kitRefToSectionIdMap={kitRefToSectionIdMap}
                            />
                          </div>
                        )}
                      </div>
                    )}
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

export default GolfQnaAccordion; 