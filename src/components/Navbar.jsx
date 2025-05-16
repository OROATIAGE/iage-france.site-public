import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { logos } from "../assets/logo"
import ThemeSwitcher from "./ThemeSwitcher"
import { texts } from '../content/texts'

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

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const servicesTimeoutRef = useRef(null);
  const [isDomainesOpen, setIsDomainesOpen] = useState(false);
  const domainesTimeoutRef = useRef(null);
  const isDark = useIsDark()
  const location = useLocation();
  const navigate = useNavigate();

  // Define Navbar height (h-16 is 64px). Add some padding.
  const NAVBAR_OFFSET = 80; // 64px for navbar + 16px padding

  // Updated list of all services for the dropdown
  const servicesDropdownItems = [
    { name: texts.navbar.services.dropdown.all, path: '/services' }, // Voir tous les services
    { name: texts.services?.nav?.catalog || 'Catalogue', path: '/services#catalog' },
    { name: texts.services?.nav?.['specific-combinations'] || 'Combinaisons', path: '/services#specific-combinations' },
    { name: texts.services?.nav?.development || 'R&D', path: '/services#development' },
    { name: texts.services?.nav?.diagbox || 'DiagBox®', path: '/services#diagbox' },
    { name: texts.services?.nav?.['sampling-advice'] || 'Conseil Prélèvement', path: '/services#sampling-advice' },
    { name: texts.services?.nav?.thresholds || 'Seuils Décisionnels', path: '/services#thresholds' },
    { name: texts.services?.nav?.['mobile-viz'] || 'Viz Mobilité', path: '/services#mobile-viz' },
    { name: texts.services?.nav?.modeling || 'Modélisation', path: '/services#modeling' },
    { name: texts.services?.nav?.['sampling-tools'] || 'Préleveurs', path: '/services#sampling-tools' },
    { name: texts.services?.nav?.['local-labs'] || 'Labos Locaux', path: '/services#local-labs' },
  ];

  // Data for the Domaines dropdown
  const domainDropdownItems = [
    { nameKey: 'category_health_hygiene_title', hash: '#title-domaine1' },
    { nameKey: 'category_agriculture_livestock_title', hash: '#title-domaine2' },
    { nameKey: 'category_industrial_fermentation_title', hash: '#title-domaine3' },
    { nameKey: 'category_turf_parks_title', hash: '#title-domaine4' },
  ];

  const navItems = [
    { name: texts.navbar.home, path: '/' },
    { name: texts.navbar.about, path: '/about' },
    { 
      name: texts.navbar.services.title,
      path: '/services',
      dropdown: servicesDropdownItems
    },
    {
      name: texts.navbar.sectors,
      path: '/',
      dropdown: domainDropdownItems,
      isDomaines: true
    },
    { name: texts.navbar.contact, path: '/contact' },
  ]

  const handleServicesMouseEnter = () => {
    clearTimeout(servicesTimeoutRef.current);
    setIsServicesOpen(true);
  };

  const handleServicesMouseLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false);
    }, 200);
  };

  const handleDomainesMouseEnter = () => {
    clearTimeout(domainesTimeoutRef.current);
    setIsDomainesOpen(true);
  };

  const handleDomainesMouseLeave = () => {
    domainesTimeoutRef.current = setTimeout(() => {
      setIsDomainesOpen(false);
    }, 200);
  };

  const handleDropdownItemClick = (path, isDomainesDropdown = false) => {
    if (isDomainesDropdown) {
      setIsDomainesOpen(false);
      clearTimeout(domainesTimeoutRef.current);
    } else {
      setIsServicesOpen(false);
      clearTimeout(servicesTimeoutRef.current);
    }
    setIsOpen(false);

    const hash = path.includes('#') ? path.substring(path.indexOf('#')) : null;
    const basePath = path.includes('#') ? path.substring(0, path.indexOf('#')) : path;

    if (location.pathname === basePath && hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } else {
      navigate(path);
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash.substring(1));
          if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 150); // Adjusted delay slightly, ensure it's enough for page load
      }
    }
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50 dark:bg-gray-900 dark:shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img src={isDark ? logos.symbol.white : logos.primary.horizontal} alt="Logo IAGE" className="h-8" style={{ maxWidth: 160 }} />
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {navItems.map((item) => {
              if (item.dropdown) {
                const isOpenState = item.isDomaines ? isDomainesOpen : isServicesOpen;
                const handleMouseEnter = item.isDomaines ? handleDomainesMouseEnter : handleServicesMouseEnter;
                const handleMouseLeave = item.isDomaines ? handleDomainesMouseLeave : handleServicesMouseLeave;
                const dropdownItems = item.dropdown;

                return (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      to={item.path}
                      className="text-primary dark:text-gray-100 hover:text-primary dark:hover:text-secondary px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-primary dark:hover:border-secondary transition-colors flex items-center"
                      onClick={(e) => {
                        if (item.isDomaines && item.path === '/' && location.pathname === '/') {
                          
                        } else if (item.path.includes('#') && location.pathname === item.path.substring(0, item.path.indexOf('#'))) {
                            e.preventDefault();
                            handleDropdownItemClick(item.path, item.isDomaines);
                        }
                      }}
                    >
                      {item.name}
                      <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${isOpenState ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </Link>
                    {isOpenState && (
                      <div
                        className={`absolute left-0 mt-1 ${item.isDomaines ? 'w-64' : 'w-56'} rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 py-1 z-50`}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        {dropdownItems.map((subItem) => (
                          <Link
                            key={subItem.name || subItem.nameKey}
                            to={item.isDomaines ? `/${subItem.hash}` : subItem.path}
                            className="block px-4 py-2 text-sm text-primary dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-secondary whitespace-normal"
                            onClick={() => handleDropdownItemClick(item.isDomaines ? `/${subItem.hash}` : subItem.path, item.isDomaines)}
                          >
                            {item.isDomaines ? (texts.home.sectors[subItem.nameKey] || subItem.nameKey) : subItem.name}
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
                    className="text-primary dark:text-gray-100 hover:text-primary dark:hover:text-secondary px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-primary dark:hover:border-secondary transition-colors"
                  >
                    {item.name}
                  </Link>
                );
              }
            })}
            <ThemeSwitcher />
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <ThemeSwitcher />
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
      <div className={`sm:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            item.dropdown ? (
              <div key={`${item.name}-mobile`} className="px-3 py-2">
                <span className="text-primary dark:text-gray-100 text-base font-medium block mb-1">{item.name}</span>
                <div className="pl-3 space-y-1 border-l border-gray-300 dark:border-gray-600">
                  {item.dropdown.map((subItem) => (
                    <Link
                      key={subItem.name || subItem.nameKey_mobile}
                      to={item.isDomaines ? `/${subItem.hash}` : subItem.path}
                      className="text-primary dark:text-gray-300 hover:text-primary dark:hover:text-secondary block py-1 text-base font-medium whitespace-normal"
                      onClick={() => handleDropdownItemClick(item.isDomaines ? `/${subItem.hash}` : subItem.path, item.isDomaines)}
                    >
                      {item.isDomaines ? (texts.home.sectors[subItem.nameKey] || subItem.nameKey) : subItem.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.name}
                to={item.path}
                className="text-primary dark:text-gray-100 hover:text-primary dark:hover:text-secondary block px-3 py-2 text-base font-medium border-l-4 border-transparent hover:border-primary dark:hover:border-secondary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            )
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;