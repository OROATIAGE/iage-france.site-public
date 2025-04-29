import React, { useState, useEffect, useRef } from 'react';
import { texts } from '../content/texts';

// Helper function pour récupérer n'importe quel texte via sa clé
const getText = (keyString, defaultValue = '') => {
  const keys = keyString.split('.');
  let current = texts;
  try {
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        // console.warn(`Texte manquant pour ${keyString}`);
        return defaultValue;
      }
    }
    return typeof current === 'string' ? current : defaultValue;
  } catch (e) {
    // console.warn(`Erreur lors de la récupération de ${keyString}`);
    return defaultValue;
  }
};

// Définir les sections pour la page Services (sans shortLabel)
const sections = [
  { id: 'diagbox' }, // Utiliser l'ID pour construire la clé du label nav
  { id: 'catalog' },
  { id: 'specific-combinations' },
  { id: 'development' },
  { id: 'sampling-tools' },
  { id: 'local-labs' },
];

function ServicesNav() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const navRef = useRef(null); 
  const itemRefs = useRef({}); 

  // Fonction pour générer la clé de texte pour la nav
  const getNavTextKey = (sectionId) => `services.nav.${sectionId}`;

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
    <nav 
      ref={navRef}
      className="sticky top-16 md:top-[70px] z-40 bg-white dark:bg-gray-900 shadow-md overflow-x-auto whitespace-nowrap scrollbar-hide py-2 px-4 border-b dark:border-gray-700"
      style={{ 
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
      }}
    >
        <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
      {sections.map((section) => {
        const isActive = activeSection === section.id;
        // Construire la clé et récupérer le texte depuis texts.js
        const navTextKey = getNavTextKey(section.id);
        const text = getText(navTextKey, section.id); // Fallback sur l'ID si texte non trouvé
        
        // Styles des boutons (inchangés)
        const baseClasses = "inline-block px-4 py-2 rounded-full text-sm font-medium mr-2 transition-all duration-300";
        const activeClasses = "bg-secondary/20 dark:bg-secondary/30 text-secondary dark:text-secondary-light ring-2 ring-secondary/50";
        const inactiveClasses = "bg-secondary/5 dark:bg-secondary/10 text-secondary/80 dark:text-secondary-light/80 hover:bg-secondary/10 dark:hover:bg-secondary/20";

        return (
          <a
            key={section.id}
            ref={itemRefs.current[section.id]} 
            href={`#${section.id}`}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
            onClick={(e) => {
              setActiveSection(section.id); 
            }}
          >
            {text}
          </a>
        );
      })}
    </nav>
  );
}

export default ServicesNav; 