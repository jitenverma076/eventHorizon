import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This component will scroll the window to the top whenever the pathname changes
const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Scroll to top when route changes (either pathname or search params)
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Use 'instant' for immediate jump
    });
  }, [pathname, search]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;
