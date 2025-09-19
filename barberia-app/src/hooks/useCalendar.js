import { useState, useCallback, useMemo } from 'react';
import { CALENDAR } from '../constants';

/**
 * Hook personalizado para funcionalidad de calendario
 * Centraliza la lógica de navegación y generación de fechas
 */
export const useCalendar = (initialDate = new Date()) => {
  const [currentDate, setCurrentDate] = useState(initialDate);

  // Generar días del mes actual
  const getDaysInMonth = useCallback((date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Agregar celdas vacías para días antes del primer día del mes
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Agregar todos los días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, []);

  // Navegación de mes
  const navigateMonth = useCallback((direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  }, []);

  // Ir al mes anterior
  const goToPreviousMonth = useCallback(() => {
    navigateMonth(-1);
  }, [navigateMonth]);

  // Ir al mes siguiente
  const goToNextMonth = useCallback(() => {
    navigateMonth(1);
  }, [navigateMonth]);

  // Ir a una fecha específica
  const goToDate = useCallback((date) => {
    setCurrentDate(new Date(date));
  }, []);

  // Ir al día de hoy
  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  // Verificar si una fecha es hoy
  const isToday = useCallback((date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }, []);

  // Verificar si una fecha está en el mes actual
  const isCurrentMonth = useCallback((date) => {
    if (!date) return false;
    return date.getMonth() === currentDate.getMonth() &&
           date.getFullYear() === currentDate.getFullYear();
  }, [currentDate]);

  // Obtener información del mes actual
  const currentMonthInfo = useMemo(() => ({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth(),
    monthName: CALENDAR.MONTHS[currentDate.getMonth()],
    days: getDaysInMonth(currentDate)
  }), [currentDate, getDaysInMonth]);

  // Formatear fecha para mostrar
  const formatDateDisplay = useCallback((date, format = 'full') => {
    if (!date) return '';

    const options = {
      full: {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      },
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      monthYear: {
        year: 'numeric',
        month: 'long'
      }
    };

    return date.toLocaleDateString('es-ES', options[format] || options.full);
  }, []);

  return {
    // Estado actual
    currentDate,
    currentMonthInfo,

    // Funciones de navegación
    navigateMonth,
    goToPreviousMonth,
    goToNextMonth,
    goToDate,
    goToToday,

    // Funciones de utilidad
    getDaysInMonth,
    isToday,
    isCurrentMonth,
    formatDateDisplay
  };
};