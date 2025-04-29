import React, { useState, useEffect, useRef } from 'react';
import { texts } from '../content/texts';

// Helper function pour récupérer les textes (simplifiée)
const getText = (key, defaultValue = '') => {
  const keys = key.split('.');
  let current = texts.diagbox?.gazon; // Assurez-vous que la structure correspond
  try {
    for (const k of keys) {
      current = current[k];
    }
    return typeof current === 'string' ? current : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

// Définir les sections ici pour éviter de dépendre d'une importation complexe
const sections = [
  { id: 'lingette', textKey: 'toc.lingette_link' },
  { id: 'dechet', textKey: 'toc.dechet_link' },
  { id: 'sympto', textKey: 'toc.sympto_link' },
  { id: 'racine', textKey: 'toc.racine_link' },
  { id: 'sol', textKey: 'toc.sol_link' },
  { id: 'racine_gazon', textKey: 'toc.racine_gazon_link' },
  { id: 'plaquage', textKey: 'toc.plaquage_link' },
  { id: 'prices', textKey: 'toc.prices_link', isPrice: true }, // Marquer la section prix
];

function DiagboxGazonNav() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const navRef = useRef(null); // Référence pour le conteneur de la nav
  const itemRefs = useRef({}); // Références pour chaque lien dans la nav

  useEffect(() => {
    // Initialiser les refs pour les items
    sections.forEach(section => {
      itemRefs.current[section.id] = React.createRef();
    });

    // Fonction pour gérer la visibilité au scroll
    const handleScrollVisibility = () => {
      // Ajuster le seuil si nécessaire (ex: hauteur du hero)
      const threshold = window.innerHeight * 0.5; 
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setActiveSection(null); // Réinitialiser l'actif si on remonte en haut
      }
    };

    // Observer pour détecter quelle section est visible
    const observerOptions = {
      root: null, // par rapport au viewport
      rootMargin: '-50% 0px -50% 0px', // Centre vertical de l'écran
      threshold: 0 // Dès qu'un pixel entre dans la zone
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
  }, []); // Exécuter une seule fois au montage

  // Effet pour faire défiler la nav horizontalement quand l'élément actif change
  useEffect(() => {
    if (activeSection && itemRefs.current[activeSection]?.current && navRef.current) {
      const activeItemElement = itemRefs.current[activeSection].current;
      const navElement = navRef.current;

      const navRect = navElement.getBoundingClientRect();
      const itemRect = activeItemElement.getBoundingClientRect();

      // Calcul pour centrer l'élément actif
      const scrollLeft = navElement.scrollLeft + itemRect.left - navRect.left - (navRect.width / 2) + (itemRect.width / 2);
      
      navElement.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
    }
  }, [activeSection]); // Déclencher quand activeSection change


  if (!isVisible) {
    return null; // Ne rien rendre si pas visible
  }

  return (
    <nav 
      ref={navRef}
      className="sticky top-16 md:top-[70px] z-40 bg-white dark:bg-gray-900 shadow-md overflow-x-auto whitespace-nowrap scrollbar-hide py-2 px-4 border-b dark:border-gray-700"
      // scrollbar-hide est une classe utilitaire possible, sinon utiliser CSS custom
      style={{ 
        // Fallback si scrollbar-hide n'existe pas
        msOverflowStyle: 'none',  /* IE and Edge */
        scrollbarWidth: 'none',  /* Firefox */
        WebkitOverflowScrolling: 'touch', /* Smooth scrolling sur iOS */
      }}
    >
        {/* Style pour cacher la scrollbar si scrollbar-hide n'est pas défini dans tailwind.config.js */}
        <style>{`
            .scrollbar-hide::-webkit-scrollbar {
                display: none;
            }
        `}</style>
      {sections.map((section) => {
        const isActive = activeSection === section.id;
        const text = getText(section.textKey, section.id); // Fallback sur l'ID si texte non trouvé

        // Style conditionnel pour le lien actif et le lien prix
        const baseClasses = "inline-block px-4 py-2 rounded-full text-sm font-medium mr-2 transition-all duration-300";
        const activeClasses = section.isPrice 
            ? "bg-accent/20 dark:bg-accent/30 text-accent dark:text-orange-300 ring-2 ring-accent/50" 
            : "bg-secondary/20 dark:bg-secondary/30 text-secondary dark:text-secondary-light ring-2 ring-secondary/50";
        const inactiveClasses = section.isPrice 
            ? "bg-accent/5 dark:bg-accent/10 text-accent/80 dark:text-orange-400/80 hover:bg-accent/10 dark:hover:bg-accent/20"
            : "bg-secondary/5 dark:bg-secondary/10 text-secondary/80 dark:text-secondary-light/80 hover:bg-secondary/10 dark:hover:bg-secondary/20";

        return (
          <a
            key={section.id}
            ref={itemRefs.current[section.id]} // Attribuer la ref ici
            href={`#${section.id}`}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
            onClick={(e) => {
              // Optionnel: Améliorer le smooth scroll si nécessaire
              // e.preventDefault();
              // document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
              setActiveSection(section.id); // Marquer comme actif au clic immédiatement
            }}
          >
            {text}
          </a>
        );
      })}
    </nav>
  );
}

export default DiagboxGazonNav; 