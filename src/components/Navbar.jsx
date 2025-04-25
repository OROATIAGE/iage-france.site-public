import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { logos } from "../assets/logo"
import ThemeSwitcher from "./ThemeSwitcher"

function useIsDark() {
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const match = window.matchMedia("(prefers-color-scheme: dark)")
    const check = () => setIsDark(document.documentElement.classList.contains("dark") || match.matches)
    check()
    match.addEventListener("change", check)
    return () => match.removeEventListener("change", check)
  }, [])
  return isDark
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const isDark = useIsDark()

  const navItems = [
    { name: 'Accueil', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Secteurs', path: '/sectors' },
    { name: 'Contact', path: '/contact' },
  ]

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
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-900 hover:text-primary px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-primary transition-colors"
              >
                {item.name}
              </Link>
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
            <Link
              key={item.name}
              to={item.path}
              className="text-gray-900 hover:text-primary block px-3 py-2 text-base font-medium border-l-4 border-transparent hover:border-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar 