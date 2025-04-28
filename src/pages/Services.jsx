import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { texts } from '../content/texts'; // Import des textes

function Services() {
  const location = useLocation();

  // Données des services avec leurs IDs pour les ancres et les NOUVELLES clés de texte
  const servicesData = [
    { id: 'diagbox', titleKey: 'diagbox_title', descriptionKey: 'diagbox_description' },
    { id: 'catalog', titleKey: 'catalog_title', descriptionKey: 'catalog_description' },
    { id: 'specific-combinations', titleKey: 'specific_title', descriptionKey: 'specific_description' },
    { id: 'development', titleKey: 'development_title', descriptionKey: 'development_description' },
    { id: 'sampling-tools', titleKey: 'sampling_title', descriptionKey: 'sampling_description' },
    { id: 'local-labs', titleKey: 'local_labs_title', descriptionKey: 'local_labs_description' },
  ];

  // Réintroduire le useEffect avec une dépendance plus fiable
  useEffect(() => {
    // Essayer de défiler seulement si on a un hash
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // S'il n'y a pas de hash, s'assurer qu'on est en haut de page
      window.scrollTo(0, 0);
    }
    // Déclencher l'effet si la clé ou le hash change (pathname géré par ScrollToTop globalement)
  }, [location.key, location.hash]); // Garder ces dépendances

  // Fonction pour récupérer les textes de manière sûre
  const getPageText = (key) => texts.services?.page?.[key] || '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-12 md:py-16"
    >
      <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-secondary mb-6 text-center">
        {getPageText('title')}
      </h1>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 md:mb-16 text-center max-w-3xl mx-auto">
        {getPageText('intro')}
      </p>

      <div className="space-y-16 md:space-y-20">
        {servicesData.map((service) => (
          <section key={service.id} id={service.id} className="scroll-mt-20 md:scroll-mt-24"> {/* scroll-mt pour compenser la navbar fixe */}
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-4 border-l-4 border-secondary pl-4">
              {getPageText(service.titleKey)}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              {getPageText(service.descriptionKey)}
            </p>
          </section>
        ))}
      </div>

      {/* Section Retour aux Secteurs */}
      <section className="mt-16 md:mt-20 pt-10 border-t border-gray-200 dark:border-gray-700 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
          {getPageText('back_to_sectors_title')}
        </h2>
        <Link to="/#sectors-grid" className="btn-primary">
          {getPageText('back_to_sectors_link_text')}
        </Link>
      </section>
    </motion.div>
  );
}

export default Services; 