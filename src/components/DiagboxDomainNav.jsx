import React, { useState, useEffect, useRef } from 'react';
import { texts } from '../content/texts';

// Helper to get domain/sector titles from texts.home.sectors
const getHomeSectorText = (key, defaultValue = '') => {
  return texts.home?.sectors?.[key] || defaultValue || key;
};

function DiagboxDomainNav({ domains }) { // domains will be diagboxDomainData from DiagboxPage
  const [isVisible, setIsVisible] = useState(false);
  const [activeDomain, setActiveDomain] = useState(null);
  const navRef = useRef(null); // This ref will now be for the inner scrolling container
  const itemRefs = useRef({});

  useEffect(() => {
    if (!domains || domains.length === 0) return;

    domains.forEach(domain => {
      itemRefs.current[domain.domainKey] = React.createRef();
    });

    const handleScrollVisibility = () => {
      const heroSection = document.querySelector('.container > div:first-child'); 
      let threshold = 200; 
      if (heroSection) {
        threshold = heroSection.getBoundingClientRect().bottom + window.scrollY - 50; 
      }
      
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setActiveDomain(null); // Clear active domain when nav is not visible
      }
    };

    // Observer pour détecter quelle section est visible
    const observerOptions = {
      root: null,
      rootMargin: '-125px 0px 0px 0px', // Detect when element top is 125px from viewport top
      threshold: 0.01 
    };

    const observerCallback = (entries) => {
      let topmostIntersectingId = null;
      let minTopValue = Infinity;

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const entryTop = entry.boundingClientRect.top;
          if (entryTop < minTopValue) {
            minTopValue = entryTop;
            topmostIntersectingId = entry.target.id;
          }
        }
      });

      if (topmostIntersectingId) {
        setActiveDomain(topmostIntersectingId);
      }
      // If no specific intersecting element is found to be the topmost, 
      // activeDomain retains its current value, which might be null if nav just became visible
      // or the last active one if scrolling within sections.
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    domains.forEach(domain => {
      const element = document.getElementById(domain.domainKey);
      if (element) {
        observer.observe(element);
      }
    });

    window.addEventListener('scroll', handleScrollVisibility, { passive: true });
    handleScrollVisibility(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScrollVisibility);
      domains.forEach(domain => {
        const element = document.getElementById(domain.domainKey);
        if (element) {
          observer.unobserve(element);
        }
      });
      observer.disconnect();
    };
  }, [domains]);

  useEffect(() => {
    if (activeDomain && itemRefs.current[activeDomain]?.current && navRef.current) {
      const activeItemElement = itemRefs.current[activeDomain].current;
      const navElement = navRef.current; // This is now the inner scrolling nav
      const navRect = navElement.getBoundingClientRect();
      const itemRect = activeItemElement.getBoundingClientRect();
      
      const scrollLeft = navElement.scrollLeft + itemRect.left - navRect.left - (navRect.width / 2) + (itemRect.width / 2);
      
      navElement.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
    }
  }, [activeDomain]);

  const handleLinkClick = (e, domainKey) => {
    e.preventDefault(); 
    // setActiveDomain(domainKey); // Don't set immediately
    const element = document.getElementById(domainKey);
    if (element) {
      const yOffset = -130;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });

      // After a delay (to allow smooth scroll to largely finish),
      // explicitly set the active domain to the one that was clicked.
      setTimeout(() => {
        setActiveDomain(domainKey);
      }, 350); // Adjust timeout if necessary (300-400ms is often good for smooth scrolls)
    }
  };

  if (!isVisible || !domains || domains.length === 0) {
    return null;
  }

  return (
    <nav 
      ref={navRef}
      className="sticky top-16 md:top-[70px] z-30 bg-white dark:bg-gray-900 shadow-md border-b dark:border-gray-700 md:max-w-3xl lg:max-w-4xl mx-auto overflow-x-auto whitespace-nowrap scrollbar-hide py-2 px-4 flex rounded-b-lg"
      style={{ 
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
      {/* Inner div for flex items to correctly handle whitespace-nowrap with scrolling when justify-center is on parent */}
      <div className="flex items-center">
        {domains.map((domain) => {
          const isActive = activeDomain === domain.domainKey;
          const text = getHomeSectorText(domain.domainKey);
          
          const baseClasses = "inline-block px-4 py-2 rounded-full text-sm font-medium mr-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-900 text-center";
          const activeClasses = "bg-primary/10 dark:bg-primary/20 text-primary dark:text-secondary-light ring-2 ring-primary/50 dark:ring-secondary-light/50";
          const inactiveClasses = "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-secondary-light focus:ring-primary/30 dark:focus:ring-secondary-light/30";

          return (
            <a
              key={domain.domainKey}
              ref={itemRefs.current[domain.domainKey]}
              href={`#${domain.domainKey}`}
              className={`flex-1 ${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
              onClick={(e) => handleLinkClick(e, domain.domainKey)}
            >
              {text}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

export default DiagboxDomainNav; 