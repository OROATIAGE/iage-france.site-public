import React from 'react';
// import { texts } from '../content/texts'; // texts will be accessed via getEnhancedKitData
import { getEnhancedKitData } from '../utils/kitDataHelpers'; // Import the new helper

// Helper pour récupérer le texte d'un kit
const getDiagboxText = (key, defaultValue = '') => {
  const keys = key.split('.');
  let current = texts.diagbox?.gazon;
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      return defaultValue;
    }
  }
  return typeof current === 'string' ? current.replace(/\\n/g, '\n') : current;
};

// Helper pour cibles effectives
const getFullyResolvedTargetsSet = (kitRefToResolve, textsObj, visitedKits = new Set()) => {
  const getDiagboxTextLocal = (key, defaultValue = '') => {
    const keys = key.split('.');
    let current = textsObj.diagbox?.gazon;
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else { return defaultValue; }
    }
    return (typeof current === 'string') ? current : defaultValue;
  };
  if (visitedKits.has(kitRefToResolve)) return new Set();
  visitedKits.add(kitRefToResolve);
  const rawTargets = getDiagboxTextLocal(`kits.${kitRefToResolve}.targets`, '');
  const currentTargetsSet = new Set();
  const processTargetString = (targetStr, set) => {
    targetStr.split(/,\s*|\s*\+\s*/).forEach(part => {
      const trimmed = part.trim();
      if (trimmed && !trimmed.toLowerCase().startsWith('idem pf') && !trimmed.toLowerCase().startsWith('combine les cibles')) {
        set.add(trimmed);
      }
    });
  };
  if (rawTargets.toLowerCase().startsWith('combine les cibles des kits')) {
    const refPattern = /PF\d{6}/g;
    let match;
    while ((match = refPattern.exec(rawTargets)) !== null) {
      const combinedRef = match[0];
      const subTargets = getFullyResolvedTargetsSet(combinedRef, textsObj, new Set(visitedKits));
      subTargets.forEach(t => currentTargetsSet.add(t));
    }
  } else if (rawTargets.toLowerCase().startsWith('idem pf')) {
    const idemPattern = /^Idem (PF\d{6})\s*(?:[\s+]+\s*(.*))?$/i;
    const idemMatch = rawTargets.match(idemPattern);
    if (idemMatch) {
      const referencedKitRef = idemMatch[1];
      const additionalTargetsString = idemMatch[2] || '';
      const baseTargets = getFullyResolvedTargetsSet(referencedKitRef, textsObj, new Set(visitedKits));
      baseTargets.forEach(t => currentTargetsSet.add(t));
      if (additionalTargetsString) {
        processTargetString(additionalTargetsString, currentTargetsSet);
      }
    } else {
      processTargetString(rawTargets, currentTargetsSet);
    }
  } else {
    processTargetString(rawTargets, currentTargetsSet);
  }
  visitedKits.delete(kitRefToResolve);
  return currentTargetsSet;
};

const parsePriceString = (priceStr) => {
  if (!priceStr || typeof priceStr !== 'string') return 0;
  return parseFloat(priceStr.replace('€', '').replace(',', '.'));
};
const formatPriceNumber = (num) => {
  if (typeof num !== 'number') return 'N/A';
  return num.toFixed(2).replace('.', ',') + ' €';
};

const KitDetailCard = ({ kitRef, introKey, kitRefToSectionIdMap }) => {
  // Fetch all data using the new helper
  // We need to pass kitRefToSectionIdMap to getEnhancedKitData
  // This map should ideally be available globally or passed down from a higher component.
  // For now, let's assume it might be undefined if not passed and handle it in getEnhancedKitData or here.
  const kitData = getEnhancedKitData(kitRef, introKey, kitRefToSectionIdMap);

  if (!kitData) {
    return <div className="text-red-500">Erreur: Données du kit non trouvées pour {kitRef}.</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-sm my-4">
      {kitData.introText && (
        <p className="italic text-sm text-gray-600 dark:text-gray-400 mb-3 border-l-4 border-secondary/50 pl-3">
          {kitData.introText}
        </p>
      )}
      <div className="space-y-1">
        <p><strong>Référence:</strong> {kitData.kitRef}</p>
        <p><strong>Désignation:</strong> {kitData.designation}</p>
        {/* Display Cibles Effectives directly for clarity in card view */}
        <p><strong>Organismes Ciblés:</strong> {kitData.ciblesEffectives || kitData.descriptiveTargetsText}</p>
        <p><strong>Type de kit:</strong> {kitData.typeDeKit}</p>
        <p><strong>Prix Indicatif HT:</strong> {kitData.prixIndicatifHT}</p>
      </div>
      {/* 
        The following sections are now handled by the parent component (GazonQnaAccordion) 
        for aggregated display under the table/cards list.

        {kitData.sumOfIndividualPricesText && 
          <p className="text-sm text-primary dark:text-gray-300">{kitData.sumOfIndividualPricesText}</p>}
        {kitData.savingText && 
          <p className="text-sm font-semibold text-green-600 dark:text-green-400">{kitData.savingText}</p>}
        {kitData.pythiumNoteText && (
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 italic">
            {kitData.pythiumNoteText}
          </p>
        )}
      */}
    </div>
  );
};

export default KitDetailCard; 