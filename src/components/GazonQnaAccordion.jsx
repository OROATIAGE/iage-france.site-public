import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { texts } from '../content/texts';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa'; // Icons for accordion

const qnaData = [
  {
    id: 'q1',
    titleKey: 'q1_title',
    subquestions: [
      { textKey: 'q1_sub1', target: '#qna-group-q1_sub1' }, 
      { textKey: 'q1_sub2', target: '#qna-group-q1_sub2' }, 
      { textKey: 'q1_sub3', target: '#qna-group-q1_sub3' }, 
      { textKey: 'q1_sub4', target: '#qna-group-q1_sub4' }, 
      { textKey: 'q1_sub5', target: '#qna-group-q1_sub5' }, 
    ],
  },
  {
    id: 'q2',
    titleKey: 'q2_title',
    subquestions: [
      { textKey: 'q2_sub1', target: '#qna-group-q2_sub1' }, 
      { textKey: 'q2_sub2', target: '#qna-group-q1_sub4' }, // Reuse target for PF000048
      { textKey: 'q2_sub3', target: '#qna-group-q1_sub5' }, // Reuse target for PF000047
    ],
  },
  {
    id: 'q3',
    titleKey: 'q3_title', 
    target: '#qna-group-q3', // Corrected: was #qna-group-q1_sub5, should be q3 specific group for plaquage
    subquestions: [],
  },
  {
    id: 'q4',
    titleKey: 'q4_title',
    target: '#qna-group-q4_combined',
    subquestions: [],
  },
  {
    id: 'q5', // New question ID
    titleKey: 'q5_title', // New text key
    target: '/contact',     // Target is the contact page path
    subquestions: [],
  },
];

// Helper to get text specifically for this component
const getQnaText = (key) => texts.gazon?.qna?.[key] || '';

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
            onClick={(event) => item.subquestions.length > 0 ? handleToggle(item.id) : handleLinkClick(event, item.target)}
            className="w-full flex justify-between items-center p-4 text-left text-lg font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span>{getQnaText(item.titleKey)}</span>
            {item.subquestions.length > 0 && (
              openAccordion === item.id ? <FaChevronDown className="text-primary dark:text-secondary" /> : <FaChevronRight className="text-gray-500" />
            )}
          </button>

          {/* Accordion Content (Subquestions) */}
          {item.subquestions.length > 0 && openAccordion === item.id && (
            <div className="p-4 border-t bg-gray-50 dark:bg-gray-800/50 dark:border-gray-600">
              <ul className="space-y-3 list-disc list-inside pl-4">
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
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default GazonQnaAccordion; 