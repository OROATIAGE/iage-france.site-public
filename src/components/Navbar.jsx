import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
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
  const isDark = useIsDark()

  const servicesDropdownItems = [
    { name: texts.navbar.services.dropdown.all, path: '/services' },
    { name: texts.navbar.services.dropdown.diagbox, path: '/services#diagbox' },
    { name: texts.navbar.services.dropdown.catalog, path: '/services#catalog' },
    { name: texts.navbar.services.dropdown.specific, path: '/services#specific-combinations' },
    { name: texts.navbar.services.dropdown.development, path: '/services#development' },
    { name: texts.navbar.services.dropdown.sampling, path: '/services#sampling-tools' },
    { name: texts.navbar.services.dropdown.local_labs, path: '/services#local-labs' },
  ];

  const navItems = [
    { name: texts.navbar.home, path: '/' },
    { name: texts.navbar.about, path: '/about' },
    { 
      name: texts.navbar.services.title,
      path: '/services',
      dropdown: servicesDropdownItems
    },
    { name: texts.navbar.sectors, path: '/#sectors-grid' },
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
            {navItems.map((item) => (
              item.dropdown ? (
                <div 
                  key={item.name}
                  className="relative" 
                  onMouseEnter={handleServicesMouseEnter}
                  onMouseLeave={handleServicesMouseLeave}
                >
                  <Link
                    to={item.path}
                    className="text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-secondary px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-primary dark:hover:border-secondary transition-colors flex items-center"
                  >
                    {item.name}
                    <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${isServicesOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </Link>
                  {isServicesOpen && (
                    <div 
                      className="absolute left-0 mt-1 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 py-1 z-50"
                      onMouseEnter={handleServicesMouseEnter}
                      onMouseLeave={handleServicesMouseLeave}
                    >
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-secondary"
                          onClick={() => {
                            setIsServicesOpen(false);
                            clearTimeout(servicesTimeoutRef.current);
                          }}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-secondary px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-primary dark:hover:border-secondary transition-colors"
                >
                  {item.name}
                </Link>
              )
            ))}
            <ThemeSwitcher />
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <ThemeSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-50"
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
              <div key={item.name} className="px-3 py-2">
                <span className="text-gray-900 dark:text-gray-100 text-base font-medium">{item.name}</span>
                <div className="mt-1 pl-3 space-y-1 border-l border-gray-300 dark:border-gray-600">
                  {item.dropdown.map((subItem) => (
                    <Link
                      key={subItem.name}
                      to={subItem.path}
                      className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-secondary block py-1 text-base font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-secondary block px-3 py-2 text-base font-medium border-l-4 border-transparent hover:border-primary dark:hover:border-secondary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            )
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar 