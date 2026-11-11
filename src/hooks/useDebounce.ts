import { useEffect, useState } from 'react';

// Generic hook: returns `value` only after it stopped changing for `delay` ms.
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // cleanup: a new keystroke cancels the previous timer
  }, [value, delay]);
  return debounced;
}
