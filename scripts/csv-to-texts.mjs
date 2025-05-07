import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csvParser from 'csv-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputCsvPath = path.join(__dirname, '..', 'texts.csv');
const outputDirPath = path.join(__dirname, '..', 'src', 'content'); // Dossier de sortie
const outputJsPath = path.join(outputDirPath, 'texts.js'); // Chemin complet du fichier

const result = {};

fs.createReadStream(inputCsvPath, { encoding: 'utf8' })
  .pipe(csvParser())
  .on('data', (row) => {
    // Vérifie si la ligne a bien une clé et un texte
    if (!row.key || typeof row.texte === 'undefined') {
      console.warn(`⚠️ Ligne ignorée dans le CSV (clé ou texte manquant): ${JSON.stringify(row)}`);
      return;
    }

    const keys = row.key.split('.');
    let value = row.texte;

    // Retirer les guillemets de début/fin s'ils existent
    if (typeof value === 'string' && value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
      // Gérer les guillemets doubles échappés ("" -> ") si nécessaire (normalement csv-parser le fait déjà)
      // value = value.replace(/""/g, '"'); // Décommenter si besoin
    }

    let current = result;
    keys.forEach((key, index) => {
      // Vérifie si la clé est valide
      if (!key) {
          console.warn(`⚠️ Clé invalide (vide) détectée dans la clé '${row.key}'. Ligne ignorée.`);
          return; // Ignore cette partie de la clé ou toute la ligne si nécessaire
      }

      if (index === keys.length - 1) {
        current[key] = value;
      } else {
        if (!current[key]) {
          current[key] = {};
        } else if (typeof current[key] !== 'object' || current[key] === null) {
          // Si une clé intermédiaire existe déjà mais n'est pas un objet,
          // on pourrait écraser ou logguer une erreur. Ici, on logue et on ignore.
          console.warn(`⚠️ Conflit de clé : '${keys.slice(0, index + 1).join('.')}' existe déjà mais n'est pas un objet. La clé '${row.key}' sera partiellement ignorée.`);
          return; // Arrête le traitement de cette clé pour cette ligne
        }
        current = current[key];
      }
    });
  })
  .on('end', () => {
    // Assure que le dossier de sortie existe
    if (!fs.existsSync(outputDirPath)) {
      fs.mkdirSync(outputDirPath, { recursive: true });
      console.log(`📁 Dossier créé : ${outputDirPath}`);
    }

    const content = `export const texts = ${JSON.stringify(result, null, 2)};\n`;
    try {
      fs.writeFileSync(outputJsPath, content, 'utf8');
      console.log('✅ Fichier texts.js généré avec succès :', outputJsPath);
    } catch (err) {
      console.error(`❌ Erreur lors de l'écriture du fichier texts.js :`, err);
    }
  })
  .on('error', (error) => {
      console.error(`❌ Erreur lors de la lecture ou du parsing du CSV :`, error);
  }); 