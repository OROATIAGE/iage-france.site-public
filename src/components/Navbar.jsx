import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { logos } from "../assets/logo"
import ThemeSwitcher from "./ThemeSwitcher"
import { texts } from '../content/texts'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '../context/LanguageContext'
import { getTextByLanguage } from '../utils/textHelpers'
import { FaChevronDown } from 'react-icons/fa'

function useIsDark() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(darkModeMediaQuery.matches);

    const handleChange = (e) => setIsDark(e.matches);
    darkModeMediaQuery.addEventListener('change', handleChange);

    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isDark;
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isDomainesOpen, setIsDomainesOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false);
  const isDark = useIsDark()
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Define Navbar height (h-16 is 64px) + padding + shadow
  const NAVBAR_OFFSET = location.pathname === '/' ? 80 : 140;

  // Updated list of all services for the dropdown
  const servicesDropdownItems = [
    { name: getTextByLanguage('navbar.services.dropdown.all', language), path: '/services' },
    { name: getTextByLanguage('services.nav.catalog', language), path: '/services#catalog' },
    { name: getTextByLanguage('services.nav.specific-combinations', language), path: '/services#specific-combinations' },
    { name: getTextByLanguage('services.nav.development', language), path: '/services#development' },
    { name: getTextByLanguage('services.nav.sampling-advice', language), path: '/services#sampling-advice' },
    { name: getTextByLanguage('services.nav.thresholds', language), path: '/services#thresholds' },
    { name: getTextByLanguage('services.nav.mobile-viz', language), path: '/services#mobile-viz' },
    { name: getTextByLanguage('services.nav.modeling', language), path: '/services#modeling' },
    { name: getTextByLanguage('services.nav.sampling-tools', language), path: '/services#sampling-tools' },
    { name: getTextByLanguage('services.nav.local-labs', language), path: '/services#local-labs' },
  ];

  // Data for the Domaines dropdown
  const domainDropdownItems = [
    { nameKey: 'category_health_hygiene_title', hash: '#title-domaine1' },
    { nameKey: 'category_agriculture_livestock_title', hash: '#title-domaine2' },
    { nameKey: 'category_industrial_fermentation_title', hash: '#title-domaine3' },
    { nameKey: 'category_turf_parks_title', hash: '#title-domaine4' },
  ];

  // News dropdown items
  const newsDropdownItems = [
    { name: getTextByLanguage('navbar.news.press', language), path: '/news/press' },
    { name: getTextByLanguage('navbar.news.testimonials', language), path: '/news/testimonials' },
    { name: getTextByLanguage('navbar.news.events', language), path: '/news/events' },
  ];

  const navItems = [
    { name: getTextByLanguage('navbar.home', language), path: '/' },
    {
      name: getTextByLanguage('navbar.sectors', language),
      path: '/',
      dropdown: domainDropdownItems,
      isDomaines: true
    },
    { name: getTextByLanguage('navbar.services.dropdown.diagbox', language), path: '/diagbox' },
    {
      name: getTextByLanguage('navbar.services.title', language),
      path: '/services',
      dropdown: servicesDropdownItems,
      isServices: true
    },
    {
      name: getTextByLanguage('navbar.news.title', language),
      path: '/news',
      dropdown: newsDropdownItems,
      isNews: true
    },
    { name: getTextByLanguage('navbar.about', language), path: '/about' },
    { name: getTextByLanguage('navbar.contact', language), path: '/contact' },
  ];

  const scrollToElement = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      // Add a small delay to ensure the dropdown is closed
      setTimeout(() => {
        const offset = location.pathname === '/' ? 80 : 140;
        const y = element.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }, 100);
    }
  };

  const handleDropdownItemClick = (path, type) => {
    // Fermer le menu déroulant correspondant
    switch (type) {
      case 'services':
        setIsServicesOpen(false);
        break;
      case 'domaines':
        setIsDomainesOpen(false);
        break;
      case 'news':
        setIsNewsOpen(false);
        break;
    }
    setIsOpen(false);

    // Normaliser le chemin
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    // Gérer les ancres et les chemins
    const hash = normalizedPath.includes('#') ? normalizedPath.substring(normalizedPath.indexOf('#')) : null;
    const basePath = normalizedPath.includes('#') ? normalizedPath.substring(0, normalizedPath.indexOf('#')) : normalizedPath;

    if (location.pathname === basePath && hash) {
      // Si on est déjà sur la bonne page, juste scroller vers l'ancre
      scrollToElement(hash.substring(1));
    } else {
      // Naviguer vers la nouvelle page
      navigate(basePath);
      if (hash) {
        // Attendre que la page soit chargée avant de scroller
        setTimeout(() => {
          scrollToElement(hash.substring(1));
        }, 300);
      }
    }
  };

  return (
    <nav className="bg-white fixed w-full top-0 z-60 dark:bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo très simplifié */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img 
              src={isDark ? logos.symbol.white : logos.primary.horizontal} 
              alt="Logo IAGE" 
              width="160"
              height="32"
              className="h-8"
              style={{ background: 'white' }}
            />
          </Link>

          {/* Desktop menu */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4 xl:space-x-8">
            {navItems.map((item) => {
              if (item.dropdown) {
                let isOpen;
                if (item.isDomaines) isOpen = isDomainesOpen;
                else if (item.isServices) isOpen = isServicesOpen;
                else if (item.isNews) isOpen = isNewsOpen;

                return (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => {
                      if (item.isDomaines) setIsDomainesOpen(true);
                      else if (item.isServices) setIsServicesOpen(true);
                      else if (item.isNews) setIsNewsOpen(true);
                    }}
                    onMouseLeave={() => {
                      if (item.isDomaines) setIsDomainesOpen(false);
                      else if (item.isServices) setIsServicesOpen(false);
                      else if (item.isNews) setIsNewsOpen(false);
                    }}
                  >
                    <Link
                      to={item.path}
                      className="text-primary dark:text-gray-100 hover:text-primary dark:hover:text-secondary px-2 xl:px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-primary dark:hover:border-secondary transition-colors flex items-center whitespace-nowrap"
                      onClick={(e) => {
                        if (item.isDomaines && item.path === '/' && location.pathname === '/') {
                          e.preventDefault();
                        }
                      }}
                    >
                      {item.name}
                      <FaChevronDown className={`ml-1 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
                    </Link>
                    {isOpen && (
                      <div className="absolute left-0 mt-1 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 py-1 z-50">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name || subItem.nameKey}
                            to={item.isDomaines ? `/${subItem.hash}` : subItem.path}
                            className="block px-4 py-2 text-sm text-primary dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-secondary whitespace-normal"
                            onClick={() => handleDropdownItemClick(
                              item.isDomaines ? `/${subItem.hash}` : subItem.path,
                              item.isDomaines ? 'domaines' : item.isServices ? 'services' : 'news'
                            )}
                          >
                            {item.isDomaines ? getTextByLanguage(`home.sectors.${subItem.nameKey}`, language) : subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="text-primary dark:text-gray-100 hover:text-primary dark:hover:text-secondary px-2 xl:px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-primary dark:hover:border-secondary transition-colors whitespace-nowrap"
                  >
                    {item.name}
                  </Link>
                );
              }
            })}
            <div className="flex items-center space-x-2">
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            <ThemeSwitcher />
            <LanguageSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:text-secondary"
            >
              <span className="sr-only">Ouvrir le menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div 
        className={`${isOpen ? 'block' : 'hidden'} lg:hidden fixed right-0 top-16 w-64 bg-white dark:bg-gray-900 shadow-lg rounded-bl-lg z-40 max-h-[calc(100vh-4rem)] overflow-y-auto`}
        style={{ maxHeight: 'calc(100vh - 4rem)' }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {/* 1. Accueil */}
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:text-secondary dark:hover:bg-gray-800"
            onClick={() => setIsOpen(false)}
          >
            {getTextByLanguage('navbar.home', language)}
          </Link>

          {/* 2. Domaines */}
          <div className="relative">
            <button
              onClick={() => setIsDomainesOpen(!isDomainesOpen)}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:text-secondary dark:hover:bg-gray-800 flex justify-between items-center"
            >
              {getTextByLanguage('navbar.sectors', language)}
              <svg className={`${isDomainesOpen ? 'transform rotate-180' : ''} w-4 h-4 ml-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isDomainesOpen && (
              <div className="px-4 py-2 space-y-1">
                {domainDropdownItems.map((domaine) => (
                  <Link
                    key={domaine.nameKey}
                    to={`/${domaine.hash}`}
                    className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:text-primary hover:bg-gray-50 dark:text-gray-400 dark:hover:text-secondary dark:hover:bg-gray-800"
                    onClick={() => { setIsDomainesOpen(false); setIsOpen(false); }}
                  >
                    {getTextByLanguage(`home.sectors.${domaine.nameKey}`, language)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 3. DiagBox */}
          <Link
            to="/diagbox"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:text-secondary dark:hover:bg-gray-800"
            onClick={() => setIsOpen(false)}
          >
            DiagBox
          </Link>

          {/* 4. Services */}
          <div className="relative">
            <button
              onClick={() => setIsServicesOpen(!isServicesOpen)}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:text-secondary dark:hover:bg-gray-800 flex justify-between items-center"
            >
              {getTextByLanguage('navbar.services.title', language)}
              <svg className={`${isServicesOpen ? 'transform rotate-180' : ''} w-4 h-4 ml-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isServicesOpen && (
              <div className="px-4 py-2 space-y-1">
                {servicesDropdownItems.map((service) => (
                  <Link
                    key={service.path}
                    to={service.path}
                    className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:text-primary hover:bg-gray-50 dark:text-gray-400 dark:hover:text-secondary dark:hover:bg-gray-800"
                    onClick={() => { setIsServicesOpen(false); setIsOpen(false); }}
                  >
                    {service.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 5. Actualités */}
          <div className="relative">
            <button
              onClick={() => setIsNewsOpen(!isNewsOpen)}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:text-secondary dark:hover:bg-gray-800 flex justify-between items-center"
            >
              {getTextByLanguage('navbar.news.title', language)}
              <svg className={`${isNewsOpen ? 'transform rotate-180' : ''} w-4 h-4 ml-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isNewsOpen && (
              <div className="px-4 py-2 space-y-1">
                {newsDropdownItems.map((news) => (
                  <Link
                    key={news.name}
                    to={news.path}
                    className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:text-primary hover:bg-gray-50 dark:text-gray-400 dark:hover:text-secondary dark:hover:bg-gray-800"
                    onClick={() => { setIsNewsOpen(false); setIsOpen(false); }}
                  >
                    {news.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 6. À propos de nous */}
          <Link
            to="/about"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:text-secondary dark:hover:bg-gray-800"
            onClick={() => setIsOpen(false)}
          >
            {getTextByLanguage('navbar.about', language)}
          </Link>

          {/* 7. Contact */}
          <Link
            to="/contact"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:text-secondary dark:hover:bg-gray-800"
            onClick={() => setIsOpen(false)}
          >
            {getTextByLanguage('navbar.contact', language)}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;