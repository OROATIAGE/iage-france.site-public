import React, { useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTextByLanguage } from '../utils/textHelpers';

function DocumentSlider({ documents }) {
  const sliderRef = useRef(null);
  const { language } = useLanguage();
  const getText = (key, defaultValue = '') => getTextByLanguage(key, language, defaultValue);

  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!documents || documents.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <p className="text-gray-600 dark:text-gray-300">
          {getText('documents.no_documents', 'Les documents seront bientôt disponibles.')}
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Navigation buttons */}
      <button
        onClick={() => handleScroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
        aria-label="Scroll left"
      >
        <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      {/* Documents container */}
      <div
        ref={sliderRef}
        className="flex overflow-x-auto gap-6 py-4 px-8 no-scrollbar"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {documents.map((doc, index) => (
          <div
            key={index}
            className="flex-none w-64 scroll-snap-align-start"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              {/* Document preview (first page) */}
              <div className="h-80 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <embed
                  src={`${doc.path}#page=1`}
                  type="application/pdf"
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Document info */}
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {doc.title}
                </h3>
                <a
                  href={doc.path}
                  download
                  className="inline-flex items-center text-sm text-primary hover:text-primary-dark dark:text-secondary dark:hover:text-secondary-light"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {getText('documents.download', 'Télécharger')}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right navigation button */}
      <button
        onClick={() => handleScroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
        aria-label="Scroll right"
      >
        <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

export default DocumentSlider; 