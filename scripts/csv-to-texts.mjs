import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputCsvPath = path.join(__dirname, '..', 'texts.csv');
const outputDirPath = path.join(__dirname, '..', 'src', 'content'); // Dossier de sortie
const outputJsPath = path.join(outputDirPath, 'texts.js'); // Chemin complet du fichier

// Read the CSV file
const csvContent = fs.readFileSync(inputCsvPath, 'utf-8');

// Parse the CSV content
const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
  delimiter: ';',
});

// Initialize the texts object with language support
const texts = {
  fr: {},
  en: {}
};

// Helper function to set nested object value
function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in current)) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  
  current[keys[keys.length - 1]] = value;
}

// Process each record and build the texts object
records.forEach(record => {
  if (!record.key || !record.texte) return; // Skip if no key or French text

  // Process French text
  setNestedValue(texts.fr, record.key, record.texte);

  // Process English text if available
  if (record.texte_en) {
    setNestedValue(texts.en, record.key, record.texte_en);
  } else {
    // If no English translation, use French text as fallback
    setNestedValue(texts.en, record.key, record.texte);
  }
});

// Convert to JSON string with proper formatting
const jsonContent = `export const texts = ${JSON.stringify(texts, null, 2)};`;

// Write to the output file
try {
  fs.writeFileSync(outputJsPath, jsonContent, 'utf8');
  console.log('✅ Fichier texts.js généré avec succès :', outputJsPath);
} catch (err) {
  console.error(`❌ Erreur lors de l'écriture du fichier texts.js :`, err);
} 