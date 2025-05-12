import React from 'react';
import { texts } from '../content/texts';

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

const KitDetailCard = ({ kitRef, introKey }) => {
  const descriptiveTargetsText = getDiagboxText(`kits.${kitRef}.targets`, 'N/A');
  let finalTargetsDisplayHtml = descriptiveTargetsText;
  const resolvedTargetsSet = getFullyResolvedTargetsSet(kitRef, texts);
  const resolvedTargetsArray = Array.from(resolvedTargetsSet).sort();
  let sumOfIndividualPrices = 0;
  let saving = 0;
  let individualPricesText = null;
  let savingText = null;
  const combinedKitPriceString = getDiagboxText(`prices.${kitRef}`, 'N/A');
  const combinedKitPrice = parsePriceString(combinedKitPriceString);
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
    individualPricesText = `Prix total des kits individuels : ${formatPriceNumber(sumOfIndividualPrices)}`;
    if (saving > 0) {
      savingText = `Soit une économie de : ${formatPriceNumber(saving)}`;
    }
  }
  if (kitRef === 'PF000049' || kitRef === 'PF000050') {
    if (resolvedTargetsArray.length > 0) {
      finalTargetsDisplayHtml = `${descriptiveTargetsText}. <br/><b>Cibles effectives&nbsp;:</b> ${resolvedTargetsArray.join(', ')}`;
    }
  } else if (descriptiveTargetsText.toLowerCase().startsWith('idem pf')) {
    if (resolvedTargetsArray.length > 0) {
        finalTargetsDisplayHtml = `${descriptiveTargetsText}. <br/><b>Cibles effectives&nbsp;:</b> ${resolvedTargetsArray.join(', ')}`;
    }
  } else {
    if (resolvedTargetsArray.length > 0) {
        finalTargetsDisplayHtml = resolvedTargetsArray.join(', ');
    } else {
        finalTargetsDisplayHtml = descriptiveTargetsText;
    }
  }
  return (
    <div className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-sm my-4">
      <p className="italic text-sm text-gray-600 dark:text-gray-400 mb-3 border-l-4 border-secondary/50 pl-3">
        {getDiagboxText(introKey, `Intro pour ${kitRef}`)}
      </p>
      <div className="space-y-1">
        <p><strong>Référence:</strong> {kitRef}</p>
        <p><strong>Désignation:</strong> {getDiagboxText(`kits.${kitRef}.name`, 'N/A')}</p>
        <p><strong>Organismes Ciblés:</strong> <span dangerouslySetInnerHTML={{ __html: finalTargetsDisplayHtml }} /></p>
        <p><strong>Prix Indicatif HT:</strong> {combinedKitPriceString}</p>
        {individualPricesText && <p className="text-sm text-primary dark:text-gray-300">{individualPricesText}</p>}
        {savingText && <p className="text-sm font-semibold text-green-600 dark:text-green-400">{savingText}</p>}
      </div>
      {(() => {
        const targetsWithAsterisk = resolvedTargetsArray.filter(target => target.includes('*'));
        if (targetsWithAsterisk.length > 0) {
          const notePrefix = getDiagboxText('pythium_note_prefix', '* Pour : ');
          const noteSuffix = getDiagboxText('pythium_note_suffix_detail', '. Le détail des 9 souches...');
          const affectedTargetsString = targetsWithAsterisk.map(t => t.replace('*', '')).join(', ');
          return (
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 italic">
              {notePrefix}{affectedTargetsString}{noteSuffix}
            </p>
          );
        }
        return null;
      })()}
    </div>
  );
};

export default KitDetailCard; 