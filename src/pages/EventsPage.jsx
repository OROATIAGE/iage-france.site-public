import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { getTextByLanguage } from '../utils/textHelpers';

function EventsPage() {
  const { language } = useLanguage();
  const getText = (key, defaultValue = '') => getTextByLanguage(`events.${key}`, language, defaultValue);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-12 md:py-16"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-secondary mb-8">
          {getText('title', 'Événements')}
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
          {getText('intro', 'Retrouvez-nous lors des événements à venir et découvrez nos dernières actualités.')}
        </p>

        {/* Section Événements à venir */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-primary dark:text-secondary mb-6">
            {getText('upcoming.title', 'Événements à venir')}
          </h2>
          <div className="space-y-6">
            {/* Les événements seront ajoutés ici */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <p className="text-gray-600 dark:text-gray-300">
                {getText('upcoming.coming_soon', 'Les prochains événements seront bientôt annoncés.')}
              </p>
            </div>
          </div>
        </section>

        {/* Section Événements passés */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-primary dark:text-secondary mb-6">
            {getText('past.title', 'Événements passés')}
          </h2>
          <div className="space-y-6">
            {/* Les événements passés seront ajoutés ici */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <p className="text-gray-600 dark:text-gray-300">
                {getText('past.no_events', 'Aucun événement passé à afficher pour le moment.')}
              </p>
            </div>
          </div>
        </section>

        {/* Section Newsletter */}
        <section className="bg-primary/10 dark:bg-gray-800 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold text-primary dark:text-secondary mb-4">
            {getText('newsletter.title', 'Restez informé')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {getText('newsletter.description', 'Inscrivez-vous à notre newsletter pour ne manquer aucun événement.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder={getText('newsletter.placeholder', 'Votre adresse email')}
              className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
              {getText('newsletter.button', 'S\'inscrire')}
            </button>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

export default EventsPage; 