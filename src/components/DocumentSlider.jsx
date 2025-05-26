import React, { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTextByLanguage } from '../utils/textHelpers';

function DocumentSlider({ documents }) {
  const sliderRef = useRef(null);
  const { language } = useLanguage();
  const getText = (key, defaultValue = '') => getTextByLanguage(key, language, defaultValue);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [pdfError, setPdfError] = useState(false);

  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Reset PDF error state when selecting a new document
  useEffect(() => {
    setPdfError(false);
  }, [selectedDoc]);

  // Fonction pour formater la taille du fichier
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  // Fonction pour formater la date
  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Vérifier si documents est undefined, null, ou un tableau vide
  if (!Array.isArray(documents) || documents.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <p className="text-gray-600 dark:text-gray-300">
          {getText('documents.no_documents', 'Les documents seront bientôt disponibles.')}
        </p>
      </div>
    );
  }

  const handlePdfError = () => {
    setPdfError(true);
  };

  return (
    <>
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
                {/* Document preview (first page) - Maintenant cliquable */}
                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="block cursor-pointer w-full"
                >
                  <div className="h-80 bg-gray-100 dark:bg-gray-700 flex items-center justify-center group relative">
                    {/* Aperçu du document */}
                    <div className="w-full h-full flex items-center justify-center">
                      <iframe
                        src={`${doc.path}#toolbar=0&navpanes=0&scrollbar=0`}
                        className="w-full h-full"
                        onError={handlePdfError}
                      >
                        <div className="flex flex-col items-center justify-center h-full">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="mt-2 text-sm text-gray-500">Aperçu PDF</span>
                        </div>
                      </iframe>
                    </div>
                    {/* Overlay avec texte au survol */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-200">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {getText('documents.view', 'Voir le document')}
                      </span>
                    </div>
              </div>
                </button>
              
              {/* Document info */}
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {doc.title}
                </h3>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <p>{formatFileSize(doc.size)}</p>
                    <p>{formatDate(doc.lastModified)}</p>
                  </div>
                  <div className="flex gap-3">
                    {/* Bouton Voir */}
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className="inline-flex items-center text-sm text-primary hover:text-primary-dark dark:text-secondary dark:hover:text-secondary-light"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {getText('documents.view', 'Voir')}
                    </button>
                    {/* Bouton Télécharger */}
                <a
                  href={doc.path}
                  download
                      target="_blank"
                      rel="noopener noreferrer"
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

      {/* Modal pour afficher le document */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
            {/* Header de la modale */}
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {selectedDoc.title}
              </h3>
              <div className="flex items-center gap-4">
                <a
                  href={selectedDoc.path}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-dark dark:text-secondary dark:hover:text-secondary-light"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Corps de la modale */}
            <div className="flex-1 relative">
              {pdfError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">
                    {getText('documents.error.loading', 'Le document ne peut pas être affiché directement.')}
                  </p>
                  <a
                    href={selectedDoc.path}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                  >
                    {getText('documents.error.download', 'Télécharger le document')}
                  </a>
                </div>
              ) : (
                <iframe
                  src={`${selectedDoc.path}#toolbar=1&navpanes=1&view=FitH&scrollbar=1&statusbar=1&messages=1&page=1`}
                  className="absolute inset-0 w-full h-full"
                  style={{ WebkitOverflowScrolling: 'touch' }}
                  onError={handlePdfError}
                >
                  <p>
                    {getText('documents.error.browser', 'Votre navigateur ne peut pas afficher ce PDF.')}
                    {' '}
                    <a href={selectedDoc.path} download className="text-primary hover:underline">
                      {getText('documents.error.download_link', 'Cliquez ici pour le télécharger')}
                    </a>.
                  </p>
                </iframe>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DocumentSlider; 