import { Link } from 'react-router-dom'
import { logos } from "../assets/logo"
import { useState, useEffect } from "react"
import { useLanguage } from '../context/LanguageContext'
import { getTextByLanguage } from '../utils/textHelpers'

function useIsDark() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

function Footer() {
  const { language } = useLanguage();
  const getText = (key, defaultValue = '') => getTextByLanguage(key, language, defaultValue);
  const isDark = useIsDark()
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white dark:bg-black dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Company Info */}
          <div className="flex flex-col items-center md:items-start">
            <img 
              src={isDark ? logos.symbol.white : logos.symbol.blue} 
              alt="Logo IAGE" 
              className="h-12 mb-3" 
              style={{ maxWidth: 72 }} 
            />
            <h3 className="text-2xl font-bold mb-4 text-white dark:text-gray-100">
              {getText('footer.title')}
            </h3>
            <p className="text-lg text-gray-300 dark:text-gray-400 text-center md:text-left">
              {getText('footer.subtitle')}
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white dark:text-gray-100">
              {getText('footer.navigation')}
            </h3>
            <ul className="space-y-2 text-center md:text-left">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors">
                  {getText('footer.home')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors">
                  {getText('footer.about')}
                </Link>
              </li>
              <li>
                <Link to="/#sectors-grid" className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors">
                  {getText('footer.sectors')}
                </Link>
              </li>
              <li>
                <Link to="/diagbox" className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors">
                  DIAGBOX®
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors">
                  {getText('footer.services')}
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors">
                  {getText('press.title', 'Presse')}
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors">
                  {getText('testimonials.title', 'Ils nous font confiance')}
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors">
                  {getText('events.title', 'Événements')}
                </Link>
              </li>
              <li>
                <Link to="/documents" className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors">
                  {getText('footer.documents')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors">
                  {getText('footer.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white dark:text-gray-100 text-center md:text-left">
              {getText('footer.contactTitle')}
            </h3>
            <ul className="space-y-2 text-center md:text-left">
              <li>
                <a 
                  href={`mailto:${getText('legal.section1_contact_email')}`}
                  className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  {getText('footer.email')}
                </a>
              </li>
              <li className="text-gray-300 dark:text-gray-400">
                {getText('legal.section1_contact_phone')}
              </li>
              <li className="text-gray-300 dark:text-gray-400">
                {getText('legal.section1_address1')}
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright and Legal Links */}
        <div className="pt-8 border-t border-gray-700 dark:border-gray-800">
          <div className="text-center text-sm space-y-2">
            <div className="text-gray-400 dark:text-gray-500">
              {getText('footer.copyright').replace(language === 'fr' ? '{année}' : '{year}', currentYear)}
            </div>
            <div className="text-gray-400 dark:text-gray-500 space-x-4">
              <Link to="/legal-notice" className="hover:text-white transition-colors">
                {getText('footer.legal')}
              </Link>
              <span className="text-gray-600 dark:text-gray-400">|</span>
              <Link to="/privacy-policy" className="hover:text-white transition-colors">
                {getText('footer.privacy')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 