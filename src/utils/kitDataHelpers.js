import { texts } from '../content/texts';

// Helper pour récupérer le texte d'un kit depuis texts.diagbox.gazon
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

export const parsePriceString = (priceStr) => {
  if (!priceStr || typeof priceStr !== 'string') return 0;
  return parseFloat(priceStr.replace('€', '').replace(',', '.'));
};

export const formatPriceNumber = (num) => {
  if (typeof num !== 'number') return 'N/A';
  return num.toFixed(2).replace('.', ',') + ' €';
};

export const getFullyResolvedTargetsSet = (kitRefToResolve, allTexts, visitedKits = new Set()) => {
  // Inner helper to access texts, ensuring it uses the passed allTexts object
  const getLocalDiagboxText = (key, defaultValue = '') => {
    const keys = key.split('.');
    let current = allTexts.diagbox?.gazon;
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else { return defaultValue; }
    }
    return (typeof current === 'string') ? current : defaultValue;
  };

  if (visitedKits.has(kitRefToResolve)) {
    // console.warn(`Référence circulaire détectée pour ${kitRefToResolve}`);
    return new Set();
  }
  visitedKits.add(kitRefToResolve);

  const rawTargets = getLocalDiagboxText(`kits.${kitRefToResolve}.targets`, '');
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
      // Pass a new Set for visitedKits in recursive calls to handle separate branches correctly
      const subTargets = getFullyResolvedTargetsSet(combinedRef, allTexts, new Set(visitedKits));
      subTargets.forEach(t => currentTargetsSet.add(t));
    }
  } else if (rawTargets.toLowerCase().startsWith('idem pf')) {
    const idemPattern = /^Idem (PF\d{6})\s*(?:[\s+]+\s*(.*))?$/i;
    const idemMatch = rawTargets.match(idemPattern);
    if (idemMatch) {
      const referencedKitRef = idemMatch[1];
      const additionalTargetsString = idemMatch[2] || '';
      const baseTargets = getFullyResolvedTargetsSet(referencedKitRef, allTexts, new Set(visitedKits));
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

  visitedKits.delete(kitRefToResolve); // Remove from visited set after processing its branch
  return currentTargetsSet;
};

export const getEnhancedKitData = (kitRef, introKey, kitRefToSectionIdMap = {}) => {
  let designation = getDiagboxText(`kits.${kitRef}.name`, 'N/A');
  const descriptiveTargetsText = getDiagboxText(`kits.${kitRef}.targets`, 'N/A');
  const prixIndicatifHT = getDiagboxText(`prices.${kitRef}`, 'N/A');
  const introText = introKey ? getDiagboxText(introKey, `Intro pour ${kitRef}`) : '';

  // Process designation: if it contains " - " or " – ", take only the part before the first occurrence.
  const designationParts = designation.split(/\s*-\s*|\s*–\s*/, 2);
  if (designationParts.length > 1) {
    designation = designationParts[0].trim();
  }

  const resolvedTargetsSet = getFullyResolvedTargetsSet(kitRef, texts); // Use global texts here
  const resolvedTargetsArray = Array.from(resolvedTargetsSet).sort();
  const ciblesEffectives = resolvedTargetsArray.join(', ');

  const typeId = kitRefToSectionIdMap[kitRef] || '';
  const typeDeKit = getDiagboxText(`types.${typeId}`) || typeId || 'N/A';

  let sumOfIndividualPrices = 0;
  let saving = 0;
  let sumOfIndividualPricesText = null;
  let savingText = null;
  const combinedKitPrice = parsePriceString(prixIndicatifHT);

  // Savings calculation for specific composite kits
  if (kitRef === 'PF000049') {
    const componentRefs = ['PF000020', 'PF000048'];
    componentRefs.forEach(ref => {
      sumOfIndividualPrices += parsePriceString(getDiagboxText(`prices.${ref}`));
    });
  } else if (kitRef === 'PF000050') {
    const componentRefs = ['PF000020', 'PF000047', 'PF000048'];
    componentRefs.forEach(ref => {
      sumOfIndividualPrices += parsePriceString(getDiagboxText(`prices.${ref}`));
    });
  }

  if ((kitRef === 'PF000049' || kitRef === 'PF000050') && sumOfIndividualPrices > 0 && combinedKitPrice > 0) {
    saving = sumOfIndividualPrices - combinedKitPrice;
    sumOfIndividualPricesText = `Prix total des kits individuels : ${formatPriceNumber(sumOfIndividualPrices)}`;
    if (saving > 0) {
      savingText = `Soit une économie de : ${formatPriceNumber(saving)}`;
    }
  }
  
  let pythiumNoteText = null;
  const targetsWithAsterisk = resolvedTargetsArray.filter(target => target.includes('*'));
  if (targetsWithAsterisk.length > 0) {
    const notePrefix = getDiagboxText('pythium_note_prefix', '* Pour : ');
    const noteSuffix = getDiagboxText('pythium_note_suffix_detail', '. Le détail des 9 souches...');
    const affectedTargetsString = targetsWithAsterisk.map(t => t.replace('*', '')).join(', ');
    pythiumNoteText = `${notePrefix}${affectedTargetsString}${noteSuffix}`;
  }

  return {
    kitRef,
    designation,
    typeDeKit,
    ciblesEffectives,
    prixIndicatifHT,
    introText,
    descriptiveTargetsText, // Original descriptive target text
    sumOfIndividualPricesText,
    savingText,
    pythiumNoteText,
    hasPythiumNote: targetsWithAsterisk.length > 0,
    resolvedTargetsArray, // Keep the array for potential direct use
  };
}; 