import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTextByLanguage } from '../utils/textHelpers';

function DiagboxDomainNav({ domains }) {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [activeDomain, setActiveDomain] = useState(null);
  const navRef = useRef(null);
  const itemRefs = useRef({});

  useEffect(() => {
    if (!domains || domains.length === 0) return;

    domains.forEach(domain => {
      itemRefs.current[domain.domainKey] = React.createRef();
    });

    const handleScrollVisibility = () => {
      const introSection = document.getElementById('diagbox-intro');
      if (introSection) {
        const rect = introSection.getBoundingClientRect();
        setIsVisible(rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScrollVisibility);
    handleScrollVisibility();

    const observerOptions = {
      root: null,
      rootMargin: '-80px 0px -40% 0px',
      threshold: [0, 0.4, 0.6, 0.8]
    };

    const observerCallback = (entries) => {
      let maxVisibility = 0;
      let mostVisibleId = null;

      entries.forEach(entry => {
        const intersectionRatio = entry.intersectionRatio;
        const boundingRect = entry.boundingClientRect;
        const isAboveMiddle = boundingRect.top < window.innerHeight / 2;

        if (isAboveMiddle && intersectionRatio > maxVisibility) {
          maxVisibility = intersectionRatio;
          mostVisibleId = entry.target.id;
        }
      });

      if (mostVisibleId && maxVisibility > 0.4) {
        setActiveDomain(mostVisibleId);
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    domains.forEach(domain => {
      const element = document.getElementById(domain.domainKey);
      if (element) {
        observer.observe(element);
      }
    });

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
      const navElement = navRef.current;
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
    const element = document.getElementById(domainKey);
    if (element) {
      const navHeight = 120; // Augmentation du décalage pour tenir compte de la hauteur totale du header + nav + marge
      const y = element.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (!domains || domains.length === 0 || !isVisible) {
    return null;
  }

  return (
    <div className="fixed top-[68px] left-0 right-0 z-30 transition-opacity duration-300" style={{ opacity: isVisible ? 1 : 0 }}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-b-lg shadow-md">
          <div ref={navRef} className="overflow-x-auto no-scrollbar py-2">
            <div className="flex space-x-4 min-w-max px-4">
              {domains.map((domain) => (
                <a
                  key={domain.domainKey}
                  ref={itemRefs.current[domain.domainKey]}
                  href={`#${domain.domainKey}`}
                  onClick={(e) => handleLinkClick(e, domain.domainKey)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                    ${activeDomain === domain.domainKey
                      ? 'bg-[#f0f4fa] text-[#003366] border border-[#c9d6e3]'
                      : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {getTextByLanguage(`home.sectors.${domain.domainKey}`, language)}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiagboxDomainNav; 