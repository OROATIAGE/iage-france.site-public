import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DOCUMENTS_DIR = './public/documents';
const CONTENT_DIR = path.join(__dirname, '..', 'src', 'content');
const TEXTS_CSV = path.join(__dirname, '..', 'texts.csv');
const TEXTS_OUTPUT = path.join(CONTENT_DIR, 'texts.js');
const DOCUMENTS_OUTPUT = path.join(CONTENT_DIR, 'documents.js');

// ====== Génération des textes ======

const generateTexts = () => {
  console.log('\n🔄 Génération des textes...');
  
  try {
    // Lire et parser le CSV
    const csvContent = fs.readFileSync(TEXTS_CSV, 'utf-8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ';',
    });

    // Initialiser l'objet des textes
    const texts = { fr: {}, en: {} };

    // Fonction pour définir une valeur imbriquée
    const setNestedValue = (obj, path, value) => {
      const keys = path.split('.');
      let current = obj;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in current)) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
    };

    // Traiter chaque enregistrement
    records.forEach(record => {
      if (!record.key || !record.texte) return;
      setNestedValue(texts.fr, record.key, record.texte);
      setNestedValue(texts.en, record.key, record.texte_en || record.texte);
    });

    // Écrire le fichier
    const jsonContent = `export const texts = ${JSON.stringify(texts, null, 2)};`;
    fs.writeFileSync(TEXTS_OUTPUT, jsonContent, 'utf8');
    console.log('✅ Fichier texts.js généré avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la génération des textes:', error);
    process.exit(1);
  }
};

// ====== Génération des documents ======

const generateDocuments = () => {
  console.log('\n🔄 Génération de la liste des documents...');

  try {
    // Vérifier si le répertoire documents existe
    if (!fs.existsSync(DOCUMENTS_DIR)) {
      console.error(`❌ Le répertoire ${DOCUMENTS_DIR} n'existe pas.`);
      process.exit(1);
    }

    const isSupportedDocument = (filename) => {
      const supportedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
      return supportedExtensions.includes(path.extname(filename).toLowerCase());
    };

    const scanDirectory = (currentDir) => {
      const items = fs.readdirSync(currentDir);
      const documents = [];

      items.forEach(item => {
        const fullPath = path.join(currentDir, item);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
          const subdirDocs = scanDirectory(fullPath);
          documents.push(...subdirDocs);
        } else if (stats.isFile() && isSupportedDocument(item)) {
          const relativePath = path.relative(DOCUMENTS_DIR, currentDir);
          const domain = relativePath || path.basename(currentDir);

          documents.push({
            path: `/documents/${relativePath}/${item}`.replace(/\\/g, '/'),
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

    // Scanner et trier les documents
    const documents = scanDirectory(DOCUMENTS_DIR);

    // Fonction pour obtenir l'extension d'un fichier
    const getFileExtension = (filename) => {
      return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
    };

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

    // Écrire le fichier
    fs.writeFileSync(DOCUMENTS_OUTPUT, fileContent, 'utf8');
    console.log('✅ Liste des documents générée avec succès');
    console.log(`📊 Nombre total de documents : ${documents.length}`);

    // Afficher un résumé par domaine
    const domainCounts = {};
    documents.forEach(doc => {
      domainCounts[doc.domain] = (domainCounts[doc.domain] || 0) + 1;
    });
    console.log('\n📁 Résumé par domaine :');
    Object.entries(domainCounts).forEach(([domain, count]) => {
      console.log(`   ${domain}: ${count} document(s)`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de la génération de la liste des documents:', error);
    process.exit(1);
  }
};

// ====== Exécution principale ======

console.log('🚀 Démarrage de la génération des sources...');

// Créer le répertoire content s'il n'existe pas
if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
}

// Générer les textes et les documents
generateTexts();
generateDocuments();

console.log('\n✨ Génération des sources terminée avec succès !'); 