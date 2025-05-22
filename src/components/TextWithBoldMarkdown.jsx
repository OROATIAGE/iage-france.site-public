import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { texts } from '../content/texts';

const KitPopup = ({ kitRef, onClose, kitRefToSectionIdMap }) => {
  const { language } = useLanguage();
  const kitData = texts[language]?.diagbox?.gazon?.kits?.[kitRef] || {};
  const kitType = texts[language]?.diagbox?.gazon?.types?.[kitRefToSectionIdMap[kitRef]] || '';
  const price = texts[language]?.diagbox?.gazon?.prices?.[kitRef] || '';

  // Fonction pour obtenir toutes les cibles d'une DiagBox, y compris les références
  const getAllTargets = (kitRef, visitedRefs = new Set()) => {
    if (visitedRefs.has(kitRef)) return new Set();
    visitedRefs.add(kitRef);

    const targets = texts[language]?.diagbox?.gazon?.kits?.[kitRef]?.targets || '';
    const uniqueTargets = new Set(
      targets
        .split(/[,+]/)
        .map(target => target.trim())
        .filter(target => target && !target.toLowerCase().startsWith('idem') && !target.toLowerCase().startsWith('combine'))
    );

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full m-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            DiagBox {kitRef}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <div className="mb-3">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Désignation : </span>
              <span className="text-gray-900 dark:text-white">{kitData.name || 'Non spécifié'}</span>
            </div>
            <div className="mb-3">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Type de kit : </span>
              <span className="text-gray-900 dark:text-white">{kitType || 'Non spécifié'}</span>
            </div>
            <div className="mb-3">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Pathogènes cibles : </span>
              <span className="text-gray-900 dark:text-white whitespace-pre-line">{getKitTargets(kitRef) || 'Non spécifié'}</span>
            </div>
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Prix indicatif HT : </span>
              <span className="text-secondary font-bold">{price || 'Non spécifié'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TextWithBoldMarkdown = ({ text }) => {
  if (!text || typeof text !== 'string') return null;

  const [selectedKit, setSelectedKit] = useState(null);

  // Découpe le texte par les retours à la ligne
  const lines = text.replace(/\\n/g, '\n').split(/\n/);

  // Regular expression to match DiagBox references (e.g., PF000049)
  const diagboxRefRegex = /(PF\d{6})/g;

  // Get kitRefToSectionIdMap from GazonQnaAccordion
  const kitTypes = [
    { type: 'lingette', kits: ['PF000011', 'PF000013', 'PF000015'] },
    { type: 'dechet', kits: ['PF000016', 'PF000018', 'PF000019', 'PF000020'] },
    { type: 'sympto', kits: ['PF000033', 'PF000035'] },
    { type: 'racine', kits: ['PF000048'] },
    { type: 'sol', kits: ['PF000047'] },
    { type: 'racine_gazon', kits: ['PF000049'] },
    { type: 'plaquage', kits: ['PF000050'] }
  ];
  const kitRefToSectionIdMap = {};
  kitTypes.forEach(typeInfo => {
    typeInfo.kits.forEach(kitRef => {
      kitRefToSectionIdMap[kitRef] = typeInfo.type;
    });
  });

  return (
    <>
      <div className="space-y-2">
        {lines.map((line, lineIdx) => {
          const isList = line.trim().startsWith('-');
          
          // First split by bold markers
          const boldParts = line.split(/\*\*(.*?)\*\*/g);
          
          return (
            <div 
              key={lineIdx} 
              className={`${isList ? 'ml-6' : ''}`}
            >
              {boldParts.map((part, idx) => {
                if (idx % 2 === 1) {
                  // This is bold text
                  return <strong key={idx} className="font-bold">{part}</strong>;
                }
                
                // For non-bold text, look for DiagBox references
                const parts = [];
                let lastIndex = 0;
                let match;
                
                while ((match = diagboxRefRegex.exec(part)) !== null) {
                  // Add text before the match
                  if (match.index > lastIndex) {
                    parts.push(part.substring(lastIndex, match.index));
                  }
                  
                  // Add the DiagBox reference as a clickable span
                  const kitRef = match[1];
                  parts.push(
                    <button
                      key={`${kitRef}-${match.index}`}
                      onClick={() => setSelectedKit(kitRef)}
                      className="font-bold text-secondary hover:underline cursor-pointer underline"
                    >
                      {kitRef}
                    </button>
                  );
                  
                  lastIndex = match.index + match[0].length;
                }
                
                // Add remaining text after last match
                if (lastIndex < part.length) {
                  parts.push(part.substring(lastIndex));
                }
                
                return parts.length > 0 ? parts : part;
              })}
            </div>
          );
        })}
      </div>
      {selectedKit && (
        <KitPopup 
          kitRef={selectedKit} 
          onClose={() => setSelectedKit(null)}
          kitRefToSectionIdMap={kitRefToSectionIdMap}
        />
      )}
    </>
  );
};

export default TextWithBoldMarkdown; 