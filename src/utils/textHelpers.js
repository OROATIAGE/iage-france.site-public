import { texts } from '../content/texts';

export const getTextByLanguage = (key, language = 'fr', defaultValue = '') => {
  const keys = key.split('.');
  let current = texts[language];

  try {
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        return defaultValue;
      }
    }
    return typeof current === 'string' ? current.replace(/\\n/g, '\n') : current;
  } catch (e) {
    console.warn(`Error retrieving text for ${key} in ${language}:`, e);
    return defaultValue;
  }
};

export const getDiagboxTextByLanguage = (key, language = 'fr', defaultValue = '') => {
  return getTextByLanguage(`diagbox.gazon.${key}`, language, defaultValue);
}; 