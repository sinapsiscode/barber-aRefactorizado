import { useState, useEffect } from 'react';

/**
 * Hook para el reloj en tiempo real del header
 */
export const useHeaderClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return { currentTime };
};
