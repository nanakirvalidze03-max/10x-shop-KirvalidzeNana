import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// New route -> the page starts from the top.
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
