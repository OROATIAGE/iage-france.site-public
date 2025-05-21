import React from 'react';
import { texts } from '../content/texts';
import { useLanguage } from '../context/LanguageContext';

function DiagboxKitTable({ kitList, kitRefToSectionIdMap }) {
  const { language } = useLanguage();

  // Vérifier si au moins un kit contient une étoile dans ses pathogènes cibles
  const hasPythiumNote = kitList.some(kitRef => {
    const targets = texts[language]?.diagbox?.gazon?.kits?.[kitRef]?.targets || '';
    
    // Check direct targets
    if (targets.includes('*')) {
      return true;
    }

    // Check referenced kits
    if (targets.toLowerCase().startsWith('combine les cibles des kits')) {
      const refPattern = /PF\d{6}/g;
      const matches = targets.match(refPattern) || [];
      return matches.some(ref => {
        const refTargets = texts[language]?.diagbox?.gazon?.kits?.[ref]?.targets || '';
        return refTargets.includes('*');
      });
    } else if (targets.toLowerCase().startsWith('idem')) {
      const refPattern = /PF\d{6}/;
      const match = targets.match(refPattern);
      if (match) {
        const refKitRef = match[0];
        const refTargets = texts[language]?.diagbox?.gazon?.kits?.[refKitRef]?.targets || '';
        return refTargets.includes('*');
      }
    }
    return false;
  });

  // Fonction pour extraire les cibles uniques d'une chaîne de cibles
  const extractUniqueTargets = (targetsString) => {
    if (!targetsString) return new Set();
    return new Set(
      targetsString
        .split(/[,+]/)
        .map(target => target.trim())
        .filter(target => target && !target.toLowerCase().startsWith('idem') && !target.toLowerCase().startsWith('combine'))
    );
  };

  // Fonction pour obtenir toutes les cibles d'une DiagBox, y compris les références
  const getAllTargets = (kitRef, visitedRefs = new Set()) => {
    if (visitedRefs.has(kitRef)) return new Set();
    visitedRefs.add(kitRef);

    const targets = texts[language]?.diagbox?.gazon?.kits?.[kitRef]?.targets || '';
    const uniqueTargets = extractUniqueTargets(targets);

    if (targets.toLowerCase().startsWith('combine les cibles des kits')) {
      const refPattern = /PF\d{6}/g;
      const matches = targets.match(refPattern) || [];
      matches.forEach(ref => {
        const refTargets = getAllTargets(ref, visitedRefs);
        refTargets.forEach(target => uniqueTargets.add(target));
      });
    } else if (targets.toLowerCase().startsWith('idem')) {
      const refPattern = /PF\d{6}/;
      const match = targets.match(refPattern);
      if (match) {
        const refKitRef = match[0];
        const refTargets = getAllTargets(refKitRef, visitedRefs);
        refTargets.forEach(target => uniqueTargets.add(target));
      }
    }

    return uniqueTargets;
  };

  // Fonction pour formater l'affichage des cibles
  const getKitTargets = (kitRef) => {
    const targets = texts[language]?.diagbox?.gazon?.kits?.[kitRef]?.targets || '';
    if (!targets) return '';

    let displayText = '';

    // Afficher d'abord la référence aux autres DiagBox si elle existe
    if (targets.toLowerCase().startsWith('combine les cibles des kits')) {
      displayText = targets.split('.')[0] + '.\n';
    } else if (targets.toLowerCase().startsWith('idem')) {
      displayText = targets.split('+')[0] + '\n';
    }

    // Ajouter la liste unique des cibles
    const allTargets = Array.from(getAllTargets(kitRef))
      .filter(target => target && target.trim())
      .sort();

    if (allTargets.length > 0) {
      displayText += (displayText ? '\nCibles : ' : '') + allTargets.join(', ');
    }

    return displayText;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 md:border dark:border-gray-600">
        <thead className="bg-gray-50 dark:bg-gray-700 hidden md:table-header-group">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[12%]">Réf.</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[18%]">Désignation</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[12%]">Type de kit</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[48%]">Pathogènes cibles</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[10%]">Prix indicatif HT</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 md:divide-y">
          {kitList.map((kitRef) => (
            <tr key={kitRef} className="flex flex-col md:table-row">
              <td data-label="Réf." className="block md:table-cell px-4 py-2 md:py-3 text-sm font-medium text-gray-900 dark:text-gray-100 w-full md:w-[12%] before:content-[attr(data-label)] before:float-left md:before:content-none before:font-medium before:text-gray-700 dark:before:text-gray-300">
                {kitRef}
              </td>
              <td data-label="Désignation" className="block md:table-cell px-4 py-2 md:py-3 text-sm text-gray-600 dark:text-gray-300 w-full md:w-[18%] before:content-[attr(data-label)] before:float-left md:before:content-none before:font-medium before:text-gray-700 dark:before:text-gray-300">
                {texts[language]?.diagbox?.gazon?.kits?.[kitRef]?.name || 'N/A'}
              </td>
              <td data-label="Type de kit" className="block md:table-cell px-4 py-2 md:py-3 text-sm text-gray-600 dark:text-gray-300 w-full md:w-[12%] before:content-[attr(data-label)] before:float-left md:before:content-none before:font-medium before:text-gray-700 dark:before:text-gray-300">
                {texts[language]?.diagbox?.gazon?.types?.[kitRefToSectionIdMap[kitRef]] || 'N/A'}
              </td>
              <td data-label="Pathogènes cibles" className="block md:table-cell px-4 py-2 md:py-3 text-sm text-gray-600 dark:text-gray-300 w-full md:w-[48%] before:content-[attr(data-label)] before:float-left md:before:content-none before:font-medium before:text-gray-700 dark:before:text-gray-300 whitespace-pre-line">
                {getKitTargets(kitRef)}
              </td>
              <td data-label="Prix indicatif HT" className="block md:table-cell px-4 py-2 md:py-3 text-sm text-gray-600 dark:text-gray-300 w-full md:w-[10%] before:content-[attr(data-label)] before:float-left md:before:content-none before:font-medium before:text-gray-700 dark:before:text-gray-300">
                {texts[language]?.diagbox?.gazon?.prices?.[kitRef] || 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {hasPythiumNote && (
        <div className="border-t border-gray-200 dark:border-gray-700 mt-0">
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic px-4">
            {texts[language]?.diagbox?.gazon?.pythium_note}
          </div>
        </div>
      )}
    </div>
  );
}

export default DiagboxKitTable; 