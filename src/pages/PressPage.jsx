import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { getTextByLanguage } from '../utils/textHelpers';

function PressPage() {
  const { language } = useLanguage();
  const getText = (key, defaultValue = '') => getTextByLanguage(`press.${key}`, language, defaultValue);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-12 md:py-16"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-secondary mb-8">
          {getText('title', 'Espace Presse')}
        </h1>

        {/* Section Communiqués de presse */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-primary dark:text-secondary mb-6">
            {getText('press_releases.title', 'Communiqués de presse')}
          </h2>
          <div className="space-y-6">
            {/* Liste des communiqués de presse à venir */}
            <p className="text-gray-600 dark:text-gray-300">
              {getText('press_releases.coming_soon', 'Les communiqués de presse seront bientôt disponibles.')}
            </p>
          </div>
        </section>

        {/* Section Contact Presse */}
        <section className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-primary dark:text-secondary mb-4">
            {getText('contact.title', 'Contact Presse')}
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              {getText('contact.description', 'Pour toute demande presse, merci de contacter :')}
            </p>
            <div className="space-y-2">
              <p className="font-medium text-primary dark:text-secondary">
                {getText('contact.name', 'Service Communication IAGE')}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Email: <a href="mailto:presse@iage.fr" className="text-primary dark:text-secondary hover:underline">presse@iage.fr</a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

export default PressPage; 