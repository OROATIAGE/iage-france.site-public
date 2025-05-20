import { motion } from 'framer-motion';
import { texts } from '../content/texts';
import { useLanguage } from '../context/LanguageContext';
import { getTextByLanguage } from '../utils/textHelpers';

function PrivacyPolicy() {
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      <h1 className="text-4xl font-bold mb-8 text-primary dark:text-secondary">
        {getText('title', 'Politique de confidentialité')}
      </h1>

      <div className="prose lg:prose-lg max-w-none dark:prose-invert space-y-8">
        {/* Introduction */}
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          {getText('intro')}
        </p>

        {/* Sections */}
        {sections.map(section => (
          section.key !== 'intro' && (
            <section key={section.key} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-primary dark:text-secondary">
                {getText(`${section.key}.title`)}
              </h2>
              <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                {getText(`${section.key}.text`)}
              </div>
            </section>
          )
        ))}

        {/* Date de dernière mise à jour */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-12 pt-4 border-t border-gray-200 dark:border-gray-700">
          Dernière mise à jour : {new Date().toLocaleDateString()}
        </p>
      </div>
    </motion.div>
  );
}

export default PrivacyPolicy; 