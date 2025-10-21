import { useState, useCallback, useMemo } from 'react';
import { getDaysInMonth, isSameDay, isCurrentMonth as checkIsCurrentMonth } from '../../utils/publicBooking/publicBookingUtils';

/**
 * Hook para manejar el calendario de reservas públicas
 */
export const usePublicCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');

  // Generar días del mes actual
  const days = useMemo(() => getDaysInMonth(currentDate), [currentDate]);

  /**
   * Navega al mes anterior o siguiente
   */
  const navigateMonth = useCallback((direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  }, [currentDate]);

  /**
   * Selecciona una fecha
   */
  const handleDateSelect = useCallback((date) => {
    setSelectedDate(date);
    setSelectedTime(''); // Reset time selection
  }, []);

  /**
   * Selecciona una hora
   */
  const handleTimeSelect = useCallback((time) => {
    setSelectedTime(time);
  }, []);

  /**
   * Verifica si una fecha está seleccionada
   */
  const isDateSelected = useCallback((date) => {
    return isSameDay(selectedDate, date);
  }, [selectedDate]);

  /**
   * Verifica si una fecha pertenece al mes actual
   */
  const isCurrentMonth = useCallback((date) => {
    return checkIsCurrentMonth(date, currentDate);
  }, [currentDate]);

  return {
    currentDate,
    selectedDate,
    selectedTime,
    days,
    navigateMonth,
    handleDateSelect,
    handleTimeSelect,
    isDateSelected,
    isCurrentMonth
  };
};
