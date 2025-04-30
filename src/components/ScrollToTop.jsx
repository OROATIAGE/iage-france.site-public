import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Helper hook to track previous value
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function ScrollToTop() {
  const location = useLocation();
  const prevLocation = usePrevious(location);

  useEffect(() => {
    // Check if it's a navigation to a new page or if the hash changed
    if (location.pathname !== prevLocation?.pathname || location.hash !== prevLocation?.hash) {
      if (location.hash) {
        // If there's a hash, try scrolling to the element
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          // Use timeout to allow rendering after navigation
          setTimeout(() => {
             element.scrollIntoView({ behavior: 'auto', block: 'start' }); // Use auto for potentially faster jump
          }, 100);
        } else {
          // Fallback if element not found immediately (e.g., lazy loading)
          window.scrollTo(0, 0);
        }
      } else {
        // If no hash, scroll to top
        window.scrollTo(0, 0);
      }
    }
  }, [location, prevLocation]); // Depend on current and previous location

  return null;
}

export default ScrollToTop; 