import fs from 'fs';
import path from 'path';

// Configuration
const DOCUMENTS_DIR = './public/documents';
const OUTPUT_FILE = './src/content/documents.js';

// Fonction pour obtenir l'extension d'un fichier
const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase();
};

// Fonction pour vérifier si un fichier est un document supporté
const isSupportedDocument = (filename) => {
  const supportedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
  return supportedExtensions.includes(getFileExtension(filename));
};

// Fonction pour scanner récursivement un répertoire
const scanDirectory = (currentDir) => {
  const items = fs.readdirSync(currentDir);
  const documents = [];

  items.forEach(item => {
    const fullPath = path.join(currentDir, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      // Récursion pour les sous-répertoires
      const subdirDocs = scanDirectory(fullPath);
      documents.push(...subdirDocs);
    } else if (stats.isFile() && isSupportedDocument(item)) {
      // Calculer le chemin relatif par rapport au répertoire documents
      const relativePath = path.relative(DOCUMENTS_DIR, currentDir);
      const domain = relativePath || path.basename(currentDir);

      // Modification du chemin pour assurer la cohérence
      const documentPath = path.posix.join('/documents', relativePath, item);

      // Ajouter le document à la liste avec le chemin correct pour Vercel
      documents.push({
        path: documentPath,
        filename: item,
        domain: domain,
        title: path.basename(item, path.extname(item))
          .replace(/_/g, ' ')
          .replace(/([A-Z])/g, ' $1')
          .trim(),
        size: stats.size,
        lastModified: stats.mtime.toISOString()
      });
    }
  });

  return documents;
};

// Fonction principale
const generateDocumentsList = () => {
  try {
    // Vérifier si le répertoire documents existe
    if (!fs.existsSync(DOCUMENTS_DIR)) {
      console.error(`Le répertoire ${DOCUMENTS_DIR} n'existe pas.`);
      process.exit(1);
    }

    // Scanner le répertoire
    const documents = scanDirectory(DOCUMENTS_DIR);

    // Trier les documents par type (PDF en premier) puis par titre
    documents.sort((a, b) => {
      // Si les documents sont dans le même domaine
      if (a.domain === b.domain) {
        const extA = getFileExtension(a.filename);
        const extB = getFileExtension(b.filename);
        
        // Si l'un est un PDF et l'autre non
        if (extA === 'pdf' && extB !== 'pdf') return -1;
        if (extA !== 'pdf' && extB === 'pdf') return 1;
        
        // Si les extensions sont différentes
        if (extA !== extB) {
          return extA.localeCompare(extB);
        }
        
        // Si même extension, trier par titre sans tenir compte de la casse
        return a.title.toLowerCase().localeCompare(b.title.toLowerCase(), undefined, { numeric: true });
      }
      // Sinon trier par domaine
      return a.domain.localeCompare(b.domain);
    });

    // Générer le contenu du fichier
    const fileContent = `// Ce fichier est généré automatiquement. Ne pas modifier directement.
// Dernière génération : ${new Date().toISOString()}

export const documents = ${JSON.stringify(documents, null, 2)};

// Fonction utilitaire pour obtenir les documents par domaine
export const getDocumentsByDomain = (domain) => {
  return documents.filter(doc => doc.domain === domain);
};

// Fonction utilitaire pour obtenir tous les domaines uniques
export const getAllDomains = () => {
  return [...new Set(documents.map(doc => doc.domain))];
};
`;

    // Créer le répertoire content s'il n'existe pas
    const contentDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
    }

    // Écrire le fichier
    fs.writeFileSync(OUTPUT_FILE, fileContent, 'utf8');
    console.log(`Liste des documents générée dans ${OUTPUT_FILE}`);
    console.log(`Nombre total de documents : ${documents.length}`);

    // Afficher un résumé par domaine
    const domainCounts = {};
    documents.forEach(doc => {
      domainCounts[doc.domain] = (domainCounts[doc.domain] || 0) + 1;
    });
    console.log('\nRésumé par domaine :');
    Object.entries(domainCounts).forEach(([domain, count]) => {
      console.log(`${domain}: ${count} document(s)`);
    });

  } catch (error) {
    console.error('Erreur lors de la génération de la liste des documents:', error);
    process.exit(1);
  }
};

// Exécuter le script
generateDocumentsList(); 