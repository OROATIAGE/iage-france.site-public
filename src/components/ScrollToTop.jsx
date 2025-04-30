import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Scroll to top only if pathname changes AND there is no hash
    if (!hash) {
      window.scrollTo(0, 0);
    }
    // If there is a hash, let the browser handle scrolling to the element
  }, [pathname, hash]);

  return null; // This component does not render anything itself
}

export default ScrollToTop; 