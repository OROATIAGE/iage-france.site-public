import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaAngleRight } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import { getTextByLanguage } from '../utils/textHelpers';
import TextWithBoldMarkdown from '../components/TextWithBoldMarkdown';

function Sector10Page() {
  const { language } = useLanguage();
  const getText = (key, defaultValue = '') => getTextByLanguage(key, language, defaultValue);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-12 md:py-16"
    >
      {/* --- Sector Intro Section --- */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 p-8 rounded-lg mb-6 shadow-sm md:max-w-3xl lg:max-w-4xl md:mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-primary dark:text-secondary mb-4">
          {getText('home.sectors.10.name', 'Fromagerie')}
        </h1>
        <div className="text-lg md:text-xl text-primary dark:text-secondary">
          <div className="flex items-start">
            <FaAngleRight className="text-blue-300 dark:text-blue-400 text-2xl mt-1 mr-2 flex-shrink-0" />
            <div>
              {getText('sectors.page.10.intro', '').split('\n').map((line, index) => {
                if (line.trim().startsWith('-')) {
                  return (
                    <div key={index} className="ml-4 text-base md:text-lg mt-2">
                      <TextWithBoldMarkdown text={line} />
                    </div>
                  );
                }
                return (
                  <div key={index} className="mb-2">
                    <TextWithBoldMarkdown text={line} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* --- Services Section --- */}
      <section className="mb-12 md:mb-16 md:max-w-3xl lg:max-w-4xl md:mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-primary dark:text-secondary mb-8">
          {getText('sectors.page.10.services.title', '')}
        </h2>

        {/* DiagBox Service */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-3 text-primary dark:text-secondary">
            {getText('sectors.page.10.diagbox.title', '')}
          </h3>
          <p className="text-primary dark:text-secondary">
            {getText('sectors.page.10.diagbox.description', '')}
          </p>
        </div>

        {/* Section CTA */}
        <div className="max-w-4xl mx-auto px-4 text-center mt-8 mb-12">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            {getText('diagbox.gazon.cta.text')}
          </p>
          <Link to="/contact" className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors">
            {getText('diagbox.gazon.cta.button')}
          </Link>
        </div>

        {/* Analyses Catalogue */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-3 text-primary dark:text-secondary">
            {getText('sectors.page.10.catalog.title', '')}
          </h3>
          <p className="text-primary dark:text-secondary">
            {getText('sectors.page.10.catalog.description', '')}
          </p>
        </div>

        {/* Développement */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3 text-primary dark:text-secondary">
            {getText('sectors.page.10.development.title', '')}
          </h3>
          <p className="text-primary dark:text-secondary">
            {getText('sectors.page.10.development.description', '')}
          </p>
        </div>
      </section>

      {/* Back to Domains Button */}
      <div className="text-center mt-16 mb-12">
        <Link 
          to="/" 
          className="inline-block bg-[#52c6dd] dark:bg-blue-700 py-3 px-6 rounded-lg text-white hover:text-white/90 dark:text-white dark:hover:text-white/90 font-medium transition-colors"
        >
          {getText('sectors.common.back_button')}
        </Link>
      </div>
    </motion.div>
  );
}

export default Sector10Page; 