import { useState, useCallback, useMemo } from 'react';
import { calculateTotalPrice, calculateTotalDuration } from '../../utils/publicBooking/publicBookingUtils';
import { DEFAULT_DURATION } from '../../constants/publicBooking';

/**
 * Hook para manejar la selección de servicios
 */
export const useServiceSelection = () => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [otherService, setOtherService] = useState(false);
  const [otherServiceText, setOtherServiceText] = useState('');

  /**
   * Toggle de selección de servicio
   */
  const handleServiceToggle = useCallback((service) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s.id === service.id);
      if (exists) {
        return prev.filter(s => s.id !== service.id);
      }
      return [...prev, service];
    });
  }, []);

  /**
   * Activa/desactiva el campo de servicio personalizado
   */
  const toggleOtherService = useCallback((checked) => {
    setOtherService(checked);
    if (!checked) {
      setOtherServiceText('');
    }
  }, []);

  /**
   * Actualiza el texto del servicio personalizado
   */
  const updateOtherServiceText = useCallback((text) => {
    setOtherServiceText(text);
  }, []);

  /**
   * Precio total de los servicios seleccionados
   */
  const totalPrice = useMemo(() => {
    return calculateTotalPrice(selectedServices);
  }, [selectedServices]);

  /**
   * Duración total de los servicios seleccionados
   */
  const totalDuration = useMemo(() => {
    const duration = calculateTotalDuration(selectedServices);
    return duration || DEFAULT_DURATION;
  }, [selectedServices]);

  /**
   * Verifica si un servicio está seleccionado
   */
  const isServiceSelected = useCallback((serviceId) => {
    return selectedServices.some(s => s.id === serviceId);
  }, [selectedServices]);

  /**
   * Resetea la selección de servicios
   */
  const resetServices = useCallback(() => {
    setSelectedServices([]);
    setOtherService(false);
    setOtherServiceText('');
  }, []);

  return {
    selectedServices,
    otherService,
    otherServiceText,
    totalPrice,
    totalDuration,
    handleServiceToggle,
    toggleOtherService,
    updateOtherServiceText,
    isServiceSelected,
    resetServices
  };
};
