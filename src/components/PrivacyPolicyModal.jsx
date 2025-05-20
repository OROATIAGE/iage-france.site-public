import { useLanguage } from '../context/LanguageContext';
import { getTextByLanguage } from '../utils/textHelpers';

function PrivacyPolicyModal({ isOpen, onClose }) {
  const { language } = useLanguage();
  const getText = (key, defaultValue = '') => getTextByLanguage(`privacy.${key}`, language, defaultValue);

  const sections = [
    { key: 'intro' },
    { key: 'data_collection' },
    { key: 'data_use' },
    { key: 'data_protection' },
    { key: 'data_retention' },
    { key: 'cookies' },
    { key: 'rights' },
    { key: 'contact' },
    { key: 'updates' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header avec bouton de fermeture */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary dark:text-secondary">
            {getText('title', 'Politique de confidentialité')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6">
          <div className="prose dark:prose-invert max-w-none space-y-6">
            {/* Introduction */}
            <p className="text-gray-700 dark:text-gray-300">
              {getText('intro')}
            </p>

            {/* Sections */}
            {sections.map(section => (
              section.key !== 'intro' && (
                <section key={section.key} className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-primary dark:text-secondary">
                    {getText(`${section.key}.title`)}
                  </h3>
                  <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                    {getText(`${section.key}.text`)}
                  </div>
                </section>
              )
            ))}

            {/* Date de dernière mise à jour */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
              Dernière mise à jour : {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Footer avec bouton de fermeture */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicyModal; 