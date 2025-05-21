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

    const hash = path.includes('#') ? path.substring(path.indexOf('#')) : null;
    const basePath = path.includes('#') ? path.substring(0, path.indexOf('#')) : path;

    if (location.pathname === basePath && hash) {
      scrollToElement(hash.substring(1));
    } else {
      navigate(path);
      if (hash) {
        // Add a longer delay when navigating to a new page
        setTimeout(() => {
          scrollToElement(hash.substring(1));
        }, 300);
      }
    }
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50 dark:bg-gray-900 dark:shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo - Toujours visible avec une largeur fixe */}
          <div className="flex-none w-[160px] flex items-center">
            <Link to="/" className="block">
              <img 
                src={isDark ? logos.symbol.white : logos.primary.horizontal} 
                alt="Logo IAGE" 
                className="h-8 w-auto object-contain"
              />
            </Link>
          </div>

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

          {/* Mobile/Tablet menu button and controls */}
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

      {/* Mobile menu */}
      <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:text-secondary"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;