import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { getTextByLanguage } from '../utils/textHelpers';
import DocumentSlider from '../components/DocumentSlider';

function DocumentsPage() {
  const { language } = useLanguage();
  const getText = (key, defaultValue = '') => getTextByLanguage(key, language, defaultValue);

  // Structure des domaines (identique à la page d'accueil)
  const domains = [
    {
      key: 'category_health_hygiene_title',
      folder: 'Santé_publique_et_hygiene',
      documents: []
    },
    {
      key: 'category_agriculture_livestock_title',
      folder: 'Agriculture_elevage',
      documents: []
    },
    {
      key: 'category_industrial_fermentation_title',
      folder: 'Traitements_industriels',
      documents: []
    },
    {
      key: 'category_turf_parks_title',
      folder: 'Gazons',
      documents: [
        {
          path: '/documents/Gazons/Plaquette_Gazon_V5.pdf',
          title: getText('documents.turf.brochure', 'Plaquette Gazon')
        },
        {
          path: '/documents/Gazons/Offre_Gazon_V5.pdf',
          title: getText('documents.turf.offer', 'Offre Gazon')
        },
        {
          path: '/documents/Gazons/Offre_Gazon_Diagbox_V5.pdf',
          title: getText('documents.turf.diagbox', 'Offre DiagBox® Gazon')
        }
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-12 md:py-16"
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-secondary mb-8">
          {getText('documents.title', 'Documents')}
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
          {getText('documents.intro', 'Retrouvez ici tous nos documents et ressources.')}
        </p>

        {/* Sections par domaine */}
        <div className="space-y-16">
          {domains.map((domain) => (
            <section key={domain.key} className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-secondary mb-2">
                {getText(`home.sectors.${domain.key}`)}
          </h2>
              <div className="w-16 h-1.5 bg-secondary mb-6 rounded-full"></div>
              
              <DocumentSlider documents={domain.documents} />
        </section>
          ))}
          </div>
      </div>
    </motion.div>
  );
}

export default DocumentsPage; 