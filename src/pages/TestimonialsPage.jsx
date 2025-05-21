import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { getTextByLanguage } from '../utils/textHelpers';

function TestimonialsPage() {
  const { language } = useLanguage();
  const getText = (key, defaultValue = '') => getTextByLanguage(`testimonials.${key}`, language, defaultValue);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-12 md:py-16"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-secondary mb-8">
          {getText('title', 'Ils nous font confiance')}
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
          {getText('intro', 'Découvrez les retours d\'expérience de nos clients et partenaires.')}
        </p>

        {/* Section Partenaires */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-primary dark:text-secondary mb-6">
            {getText('partners.title', 'Nos Partenaires')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Les logos des partenaires seront ajoutés ici */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg flex items-center justify-center">
              <p className="text-gray-600 dark:text-gray-300 text-center">
                {getText('partners.coming_soon', 'Liste des partenaires à venir')}
              </p>
            </div>
          </div>
        </section>

        {/* Section Témoignages */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-primary dark:text-secondary mb-6">
            {getText('testimonials.title', 'Témoignages')}
          </h2>
          <div className="space-y-8">
            {/* Les témoignages seront ajoutés ici */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <p className="text-gray-600 dark:text-gray-300">
                {getText('testimonials.coming_soon', 'Les témoignages de nos clients seront bientôt disponibles.')}
              </p>
            </div>
          </div>
        </section>

        {/* Section Chiffres Clés */}
        <section className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold text-primary dark:text-secondary mb-6">
            {getText('key_figures.title', 'Chiffres Clés')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary dark:text-secondary mb-2">+500</p>
              <p className="text-gray-600 dark:text-gray-300">
                {getText('key_figures.clients', 'Clients satisfaits')}
              </p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary dark:text-secondary mb-2">15</p>
              <p className="text-gray-600 dark:text-gray-300">
                {getText('key_figures.years', 'Années d\'expertise')}
              </p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary dark:text-secondary mb-2">98%</p>
              <p className="text-gray-600 dark:text-gray-300">
                {getText('key_figures.satisfaction', 'Taux de satisfaction')}
              </p>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

export default TestimonialsPage; 