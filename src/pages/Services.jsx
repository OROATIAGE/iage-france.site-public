import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTextByLanguage } from '../utils/textHelpers';
import ServicesNav from '../components/ServicesNav';

function Services() {
  const location = useLocation();
  const { language } = useLanguage();

  // Fonction pour récupérer les textes de manière sûre
  const getPageText = (key, defaultValue = '') => getTextByLanguage(`services.page.${key}`, language, defaultValue);

  // NOUVELLE structure de données par catégorie
  const categoriesData = [
    {
      categoryTitleKey: 'category1_title', // Analyses de précision
      services: [
        { id: 'catalog', titleKey: 'catalog_title', descriptionKey: 'catalog_description' },
        { id: 'specific-combinations', titleKey: 'specific_title', descriptionKey: 'specific_description' },
        { id: 'development', titleKey: 'development_title', descriptionKey: 'development_description' },
      ],
    },
    {
      categoryTitleKey: 'category2_title', // Diagbox®, Conseil et Expertise
      services: [
        { id: 'diagbox', titleKey: 'diagbox_title', descriptionKey: 'diagbox_description' },
        // Nouveaux services ajoutés ici
        { id: 'sampling-advice', titleKey: 'sampling_advice_title', descriptionKey: 'sampling_advice_description' },
        { id: 'thresholds', titleKey: 'thresholds_title', descriptionKey: 'thresholds_description' },
        { id: 'mobile-viz', titleKey: 'mobile_viz_title', descriptionKey: 'mobile_viz_description' },
        { id: 'modeling', titleKey: 'modeling_title', descriptionKey: 'modeling_description' },
      ],
    },
    {
      categoryTitleKey: 'category3_title', // Équipements et labo dédiés
      services: [
        { id: 'sampling-tools', titleKey: 'sampling_title', descriptionKey: 'sampling_description' },
        { id: 'local-labs', titleKey: 'local_labs_title', descriptionKey: 'local_labs_description' },
      ],
    },
  ];

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Use timeout to ensure layout is complete before scrolling
        setTimeout(() => {
           element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.key, location.hash]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ServicesNav />

      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-secondary mb-6 text-center">
          {getPageText('title', 'Nos services')}
        </h1>
        <p className="text-lg md:text-xl text-primary dark:text-gray-300 mb-12 md:mb-16 text-center max-w-3xl mx-auto">
          {getPageText('intro')}
        </p>

        {/* Boucle sur les catégories */}
        <div className="space-y-16 md:space-y-20">
          {categoriesData.map((category, categoryIndex) => {
            // Define category ID based on index or title key
            let categoryId = '';
            if (category.categoryTitleKey === 'category1_title') categoryId = 'category-analyses';
            else if (category.categoryTitleKey === 'category2_title') categoryId = 'category-diagbox-conseil';
            else if (category.categoryTitleKey === 'category3_title') categoryId = 'category-equipements';

            return (
              <div key={category.categoryTitleKey} id={categoryId} className="scroll-mt-32">
                {/* Titre de la catégorie */}
                <h2 className="text-3xl md:text-4xl font-semibold text-primary dark:text-secondary mb-8 border-b-2 border-primary/30 dark:border-secondary/30 pb-3">
                  {getPageText(category.categoryTitleKey)}
                </h2>
                {/* Boucle sur les services DANS la catégorie */}
                <div className="space-y-10 md:space-y-12 pl-4">
                  {category.services.map((service) => (
                    <section key={service.id} id={service.id} className="scroll-mt-32">
                      {/* Titre du service */}
                      <h3 className="text-2xl md:text-3xl font-semibold text-primary dark:text-gray-200 mb-4 border-l-4 border-secondary pl-4">
                        {getPageText(service.titleKey)}
                      </h3>
                      {/* Description du service */}
                      <p className="text-primary dark:text-gray-300 text-lg leading-relaxed whitespace-pre-line ml-6">
                        {getPageText(service.descriptionKey)}
                      </p>
                    </section>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Retour aux Secteurs - Modified */}
        <section className="mt-16 md:mt-20 pt-10 pb-20 border-t border-gray-200 dark:border-gray-700 text-center">
          <Link 
            to="/#sectors-grid" 
            className="inline-block bg-[#52c6dd] dark:bg-blue-700 py-3 px-6 rounded-lg text-white hover:text-white/90 dark:text-white dark:hover:text-white/90 font-medium"
          > 
            {getPageText('back_to_sectors_link_text', 'Retour aux domaines')}
          </Link>
        </section>
      </div>
    </motion.div>
  );
}

export default Services; 