import React from 'react';

const TextWithBoldMarkdown = ({ text }) => {
  if (!text || typeof text !== 'string') return null;

  // Découpe le texte par les retours à la ligne
  const lines = text.replace(/\\n/g, '\n').split(/\n/);

  return (
    <div className="space-y-2">
      {lines.map((line, lineIdx) => {
        const isList = line.trim().startsWith('-');
        // Découpe chaque ligne par les marqueurs de gras **
        const parts = line.split(/\*\*(.*?)\*\*/g);

        return (
          <div 
            key={lineIdx} 
            className={`${isList ? 'ml-6' : ''}`}
          >
            {parts.map((part, idx) =>
              idx % 2 === 1 ? (
                <strong key={idx} className="font-semibold">{part}</strong>
              ) : (
                <span key={idx}>{part}</span>
              )
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TextWithBoldMarkdown; 