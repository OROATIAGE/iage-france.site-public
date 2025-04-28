import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top on pathname change
    window.scrollTo(0, 0);
  }, [pathname]); // Dependency array ensures this runs only when pathname changes

  return null; // This component does not render anything itself
}

export default ScrollToTop; 