import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { getTextByLanguage } from '../utils/textHelpers';

function About() {
  const { language } = useLanguage();

  // Helper to get text safely with current language
  const getText = (key, defaultValue = '') => {
    return getTextByLanguage(`about.page.${key}`, language, defaultValue);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold mb-8">{getTextByLanguage('about.title', language)}</h1>
      <div className="prose lg:prose-xl max-w-none dark:prose-invert">
        <p>
          {getText('intro1')}
        </p>
        <p>
          {getText('intro2')}
        </p>
        <p className="font-semibold italic">
          {getText('ambition_title')}
        </p>
        <p>
          {getText('ambition_text')}
        </p>
         <p className="font-semibold italic">
          {getText('strength_title')}
        </p>
       <p>
          {getText('strength_text')}
        </p>
        <p>
          {getText('conclusion')}
        </p>
      </div>
    </motion.div>
  );
}

export default About; 