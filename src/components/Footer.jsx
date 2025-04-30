import { Link } from 'react-router-dom'
import { logos } from "../assets/logo"
import { useState, useEffect } from "react"
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

function Footer() {
  const isDark = useIsDark()
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white dark:bg-black dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <img src={isDark ? logos.symbol.white : logos.symbol.blue} alt="Logo IAGE" className="h-10 mb-2" style={{ maxWidth: 60 }} />
            <h3 className="text-lg font-semibold mb-4">{texts.footer.title}</h3>
            <p className="text-gray-300">
              {texts.footer.subtitle}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{texts.footer.navigation}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  {texts.footer.home}
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white">
                  {texts.footer.services}
                </Link>
              </li>
              <li>
                <Link 
                  to="/#sectors-grid" 
                  className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white"
                  onClick={() => {
                    const element = document.getElementById('sectors-grid');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                >
                  {texts.footer.sectors}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white">
                  {texts.footer.contact}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{texts.footer.contactTitle}</h3>
            <p className="text-gray-300">{texts.footer.email}</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>{texts.footer.copyright.replace('{année}', currentYear)}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 