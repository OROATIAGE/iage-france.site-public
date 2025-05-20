import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTextByLanguage } from '../utils/textHelpers';

// UPDATED sections list to include all individual services
const sections = [
  { id: 'catalog' },
  { id: 'specific-combinations' },
  { id: 'development' },
  { id: 'diagbox' },
  { id: 'sampling-advice' },
  { id: 'thresholds' },
  { id: 'mobile-viz' },
  { id: 'modeling' },
  { id: 'sampling-tools' },
  { id: 'local-labs' },
];

function ServicesNav() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const navRef = useRef(null); 
  const itemRefs = useRef({}); 
  const { language } = useLanguage();

  // Fonction pour générer la clé de texte pour la nav
  const getNavText = (sectionId) => getTextByLanguage(`services.nav.${sectionId}`, language, sectionId);

  useEffect(() => {
    // Initialiser les refs pour les items
    sections.forEach(section => {
      itemRefs.current[section.id] = React.createRef();
    });

    // Fonction pour gérer la visibilité au scroll
    const handleScrollVisibility = () => {
      // Ajuster le seuil si nécessaire (ex: après l'intro)
      const introElement = document.querySelector('.container p.text-lg'); // Sélecteur pour le paragraphe d'intro
      const introBottom = introElement ? introElement.getBoundingClientRect().bottom + window.scrollY : 300; // Fallback à 300px
      const threshold = introBottom - 50; // Apparaître un peu avant la fin de l'intro
      
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setActiveSection(null);
      }
    };

    // Observer pour détecter quelle section est visible
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // Centre vertical
      threshold: 0 
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Cibler les sections sur la page principale
    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    window.addEventListener('scroll', handleScrollVisibility);

    // Nettoyage
    return () => {
      window.removeEventListener('scroll', handleScrollVisibility);
      sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
          observer.unobserve(element);
        }
      });
      observer.disconnect();
    };
  }, []);

  // Effet pour faire défiler la nav horizontalement
  useEffect(() => {
    if (activeSection && itemRefs.current[activeSection]?.current && navRef.current) {
      const activeItemElement = itemRefs.current[activeSection].current;
      const navElement = navRef.current;
      const navRect = navElement.getBoundingClientRect();
      const itemRect = activeItemElement.getBoundingClientRect();
      const scrollLeft = navElement.scrollLeft + itemRect.left - navRect.left - (navRect.width / 2) + (itemRect.width / 2);
      
      navElement.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
    }
  }, [activeSection]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-[68px] left-0 right-0 z-30">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md">
          <div ref={navRef} className="overflow-x-auto no-scrollbar py-2 px-4">
            <div className="flex space-x-4 min-w-max">
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                const text = getNavText(section.id);
                
                return (
                  <a
                    key={section.id}
                    ref={itemRefs.current[section.id]} 
                    href={`#${section.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById(section.id);
                      if (element) {
                        const navHeight = 120; // Hauteur de la navbar + barre de navigation + marge
                        const y = element.getBoundingClientRect().top + window.scrollY - navHeight;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                      }
                      setActiveSection(section.id); 
                    }}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                      ${isActive
                        ? 'bg-[#f0f4fa] text-[#003366] border border-[#c9d6e3]'
                        : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    {text}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServicesNav; 