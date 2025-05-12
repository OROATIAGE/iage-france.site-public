import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { texts } from '../content/texts';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa'; // Icons for accordion
import { FaRegLightbulb } from 'react-icons/fa'; // Ajout de l'icône ampoule
import TextWithBoldMarkdown from './TextWithBoldMarkdown'; // Import du composant de mise en forme
import KitDetailCard from './KitDetailCard';

const qnaData = [
  {
    id: 'q1',
    titleKey: 'q1_title',
    target: '#qna-group-q1_sub1',
    subquestions: [],
    recommendationKey: 'qna_reco.qna-group-q1_sub1',
    bonASavoirKey: 'qna_bon_a_savoir.q1',
  },
  {
    id: 'q2',
    titleKey: 'q2_title',
    target: '#qna-group-q2_sub1',
    subquestions: [],
    recommendationKey: 'qna_reco.qna-group-q2_sub1',
    bonASavoirKey: 'qna_bon_a_savoir.q2',
  },
  {
    id: 'q3',
    titleKey: 'q3_title', 
    target: '#qna-group-q3',
    subquestions: [],
    recommendationKey: 'qna_reco.qna-group-q3',
    bonASavoirKey: 'qna_bon_a_savoir.q3',
  },
  {
    id: 'q4',
    titleKey: 'q4_title',
    target: '#qna-group-q4_combined',
    subquestions: [],
    recommendationKey: 'qna_reco.qna-group-q4_combined',
    bonASavoirKey: 'qna_bon_a_savoir.q4',
  },
  {
    id: 'q5',
    titleKey: 'q5_title',
    target: '/contact',
    subquestions: [],
    bonASavoirKey: 'qna_bon_a_savoir.q5',
  },
];

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

// Helper pour afficher un encart de kit à partir de sa référence
const renderKitCard = (kitRef) => {
  // Accès aux textes
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
    return typeof current === 'string' ? current.replace(/\\n/g, '\n') : current;
  };
  return (
    <div key={kitRef} className="my-4 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
      <div className="font-semibold text-primary dark:text-secondary mb-1 text-base">{getDiagboxText(`kits.${kitRef}.name`, kitRef)}</div>
      <div className="text-gray-700 dark:text-gray-200 text-sm mb-1">
        {getDiagboxText(`kits.${kitRef}.targets`, '') && (
          <div><span className="font-semibold">Cibles&nbsp;:</span> {getDiagboxText(`kits.${kitRef}.targets`, '')}</div>
        )}
      </div>
      <div className="text-gray-700 dark:text-gray-200 text-sm mb-1">
        {getDiagboxText(`kits.${kitRef}.description`, '')}
      </div>
      <div className="text-gray-700 dark:text-gray-200 text-sm">
        <span className="font-semibold">Prix indicatif HT&nbsp;:</span> {getDiagboxText(`prices.${kitRef}`, 'N/A')}
      </div>
    </div>
  );
};

function GazonQnaAccordion({ onOpenKitGroup }) {
  const [openAccordion, setOpenAccordion] = useState(null); // State to track open section
  const navigate = useNavigate(); // Initialize navigate

  const handleToggle = (id) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const handleLinkClick = (e, target) => {
    if (target.startsWith('#')) {
      const targetId = target.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
         e.preventDefault(); 
         element.scrollIntoView({ behavior: 'smooth', block: 'start' });
         if (onOpenKitGroup) {
          onOpenKitGroup(targetId); 
         }
      }
    } else {
      // For internal page links like '/contact'
      e.preventDefault();
      navigate(target);
      // Optionally close this Q&A accordion after click
      // setOpenAccordion(null); 
    }
  };

  return (
    <div id="gazon-qna-accordion" className="space-y-4 mb-12 md:mb-16">
      {qnaData.map((item) => (
        <div key={item.id} className="border rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700">
          {/* Accordion Header */}
          <button
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
              <div className="flex items-start gap-3 mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 rounded">
                <FaRegLightbulb className="text-yellow-500 text-2xl mt-1" />
                <div>
                  <div className="font-semibold text-yellow-700 dark:text-yellow-300 mb-1">Bon à savoir</div>
                  <div className="text-yellow-800 dark:text-yellow-200 text-sm">
                    <TextWithBoldMarkdown text={getBonASavoirText(item.bonASavoirKey)} />
                  </div>
                </div>
              </div>

              {/* Subquestions */}
              {item.subquestions.length > 0 && (
                <ul className="space-y-3 list-disc list-inside pl-4 mb-4">
                  {item.subquestions.map((sub) => (
                    <li key={sub.textKey}>
                      <a
                        href={sub.target}
                        onClick={(e) => handleLinkClick(e, sub.target)}
                        className="text-primary dark:text-secondary hover:underline hover:text-primary-dark dark:hover:text-secondary-light transition-colors"
                      >
                        {getQnaText(sub.textKey)}
                      </a>
                    </li>
                  ))}
                </ul>
              )}

              {/* Recommendations */}
              {item.recommendationKey && (
                <div className="mt-4 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                  <h4 className="text-lg font-semibold text-primary dark:text-secondary mb-2">
                    <TextWithBoldMarkdown text={getRecommendationText(`${item.recommendationKey}.recommendation_text`)} />
                  </h4>
                  <div className="prose dark:prose-invert max-w-none mb-2">
                    <TextWithBoldMarkdown text={getRecommendationText(`${item.recommendationKey}.conclusion_text_prefix`)} />
                  </div>
                  {/* Séparation visuelle */}
                  <div className="my-4 font-semibold text-primary dark:text-secondary text-base">
                    {getRecommendationText(`${item.recommendationKey}.conclusion_text_suffix`)}
                  </div>
                  {/* Encarts des kits recommandés dans l'ordre demandé */}
                  <KitDetailCard kitRef="PF000015" introKey="qna_intro.reco_PF000015" />
                  <KitDetailCard kitRef="PF000020" introKey="qna_intro.reco_PF000020" />
                  <KitDetailCard kitRef="PF000011" introKey="qna_intro.reco_PF000011" />
                  <KitDetailCard kitRef="PF000016" introKey="qna_intro.reco_PF000016" />
                </div>
              )}

              {/* Contact Link */}
              {item.recommendationKey && (
                <div className="mt-4 text-center">
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
      ))}
    </div>
  );
}

export default GazonQnaAccordion; 