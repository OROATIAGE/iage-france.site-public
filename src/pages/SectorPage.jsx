import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { texts } from '../content/texts'; // Import des textes centralisés

// Helper pour accéder aux textes de manière sécurisée
const getText = (baseKey, path) => {
  const keys = path.split('.');
  let current = baseKey;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      console.warn(`Texte manquant pour la clé: ${path} dans ${JSON.stringify(baseKey)}`);
      return ''; // Retourne une chaîne vide ou une valeur par défaut
    }
  }
  return current;
};

function SectorPage() {
  const { sectorId } = useParams(); // Récupère l'ID du secteur depuis l'URL

  // Trouve les données du secteur actuel dans texts.js
  // Exemple de structure attendue dans texts.js: texts.home.sectors['01'].name, texts.sectors.page['01'].catchphrase etc.
  const sectorData = texts.home?.sectors?.[sectorId];
  const pageData = texts.sectors?.page?.[sectorId];

  if (!sectorData || !pageData) {
    // Gérer le cas où les données pour cet ID n'existent pas
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Secteur non trouvé</h1>
        <p className="mt-4">Les informations pour ce secteur n'ont pas pu être chargées.</p>
        <Link to="/sectors" className="mt-6 inline-block btn-primary">Retour aux secteurs</Link>
      </div>
    );
  }

  const sectorName = sectorData.name || `Secteur ${sectorId}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12 md:py-16" // Ajout de padding vertical
    >
      {/* Phrase d'accroche et introduction */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 p-8 rounded-lg mb-12 shadow-sm">
        <h1 className="text-3xl md:text-4xl font-bold text-primary dark:text-secondary mb-4">{sectorName}</h1>
        <p className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
          {getText(pageData, 'catchphrase')}
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {getText(pageData, 'intro')}
        </p>
      </div>

      {/* Présentation des services */}
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-8 text-center">
        {getText(pageData, 'services.title')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Service 1: DiagBox */}
        <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold text-primary dark:text-secondary mb-3">{getText(pageData, 'diagbox.title')}</h3>
          <p className="text-gray-600 dark:text-gray-300">{getText(pageData, 'diagbox.description')}</p>
          {/* Bouton CTA spécifique à DiagBox pour ce secteur */}
           <Link
             to={`/services/diagbox/${sectorId}`} // Lien dynamique basé sur sectorId
             className="mt-6 inline-block bg-accent text-white font-semibold px-5 py-2 rounded-md hover:bg-accent/90 transition-colors text-sm"
           >
             {getText(pageData, 'cta.diagbox')}
           </Link>
        </div>

        {/* Service 2: Catalogue */}
        <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold text-primary dark:text-secondary mb-3">{getText(pageData, 'catalog.title')}</h3>
          <p className="text-gray-600 dark:text-gray-300">{getText(pageData, 'catalog.description')}</p>
        </div>

        {/* Service 3: Développement */}
        <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold text-primary dark:text-secondary mb-3">{getText(pageData, 'development.title')}</h3>
          <p className="text-gray-600 dark:text-gray-300">{getText(pageData, 'development.description')}</p>
        </div>
      </div>

      {/* Mention Prélèvement Continu */}
      {getText(pageData, 'sampling.description') && ( // Affiche seulement si la description existe
         <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-inner mb-12">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">{getText(pageData, 'sampling.title')}</h3>
            <p className="text-gray-600 dark:text-gray-300">{getText(pageData, 'sampling.description')}</p>
         </div>
      )}

      {/* Bouton Retour (optionnel) */}
      <div className="text-center mt-12">
        <Link to="/#sectors-grid" className="btn-secondary">
          Voir tous les secteurs
        </Link>
      </div>

    </motion.div>
  );
}

export default SectorPage; 