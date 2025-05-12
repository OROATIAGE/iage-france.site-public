import React from 'react';

const TextWithBoldMarkdown = ({ text }) => {
  if (!text || typeof text !== 'string') return null;
  // Découpe le texte par les retours à la ligne
  const lines = text.replace(/\\n/g, '\n').split(/\n/);
  return (
    <>
      {lines.map((line, lineIdx) => {
        // Découpe chaque ligne par les marqueurs de gras **
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <span key={lineIdx}>
            {parts.map((part, idx) =>
              idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part
            )}
            {lineIdx < lines.length - 1 && <br />}
          </span>
        );
      })}
    </>
  );
};

export default TextWithBoldMarkdown; 