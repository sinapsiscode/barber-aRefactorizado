import { useState, useCallback } from 'react';
import { getDaysInMonth, navigateMonth as navigateMonthUtil } from '../../utils/calendar/calendarUtils';

/**
 * Hook para manejar la navegación del calendario
 */
export const useCalendarNavigation = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const navigateMonth = useCallback((direction) => {
    setCurrentDate(prev => navigateMonthUtil(prev, direction));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const goToDate = useCallback((date) => {
    setCurrentDate(date);
  }, []);

  const days = getDaysInMonth(currentDate);

  return {
    currentDate,
    days,
    navigateMonth,
    goToToday,
    goToDate
  };
};
