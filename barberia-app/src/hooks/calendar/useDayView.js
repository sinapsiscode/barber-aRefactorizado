import { useState, useCallback } from 'react';

/**
 * Hook para manejar la vista de día
 */
export const useDayView = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [showDayView, setShowDayView] = useState(false);

  const handleDayClick = useCallback((date) => {
    if (!date) return;
    setSelectedDay(date);
    setShowDayView(true);
  }, []);

  const closeDayView = useCallback(() => {
    setShowDayView(false);
    setSelectedDay(null);
  }, []);

  return {
    selectedDay,
    showDayView,
    handleDayClick,
    closeDayView
  };
};
