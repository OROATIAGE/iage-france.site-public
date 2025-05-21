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

// Define Navbar height (h-16 is 64px). Add some padding.
const NAVBAR_OFFSET = 140; // Navbar height (64px) + padding + shadow + extra margin

function ScrollToTop() {
  const location = useLocation();
  const prevLocation = usePrevious(location);

  useEffect(() => {
    // Check if it's a navigation to a new page or if the hash changed
    if (location.pathname !== prevLocation?.pathname || location.hash !== prevLocation?.hash) {
      if (location.hash) {
        // If there's a hash, try scrolling to the element
        const id = location.hash.replace('#', '');
        // Use a timeout to ensure the element is available after navigation and rendering
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;
            window.scrollTo({ top: y, behavior: 'auto' }); // 'auto' for instant jump on page load
          } else {
            // Fallback if element not found, scroll to top
            window.scrollTo(0, 0);
          }
        }, 100); // Delay might need adjustment based on page complexity
      } else {
        // If no hash, scroll to top
        window.scrollTo(0, 0);
      }
    }
  }, [location, prevLocation]); // Depend on current and previous location

  return null;
}

export default ScrollToTop; 