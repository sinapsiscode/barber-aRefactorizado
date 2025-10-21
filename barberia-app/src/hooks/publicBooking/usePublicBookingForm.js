import { useState, useCallback } from 'react';
import { validatePublicBookingForm } from '../../utils/publicBooking/publicBookingUtils';

/**
 * Hook para manejar el formulario de información del cliente
 */
export const usePublicBookingForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    correo: '',
    telefono: '',
    distrito: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [acceptTerms, setAcceptTerms] = useState(false);

  /**
   * Actualiza un campo del formulario
   */
  const handleFormChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [formErrors]);

  /**
   * Actualiza el estado de aceptación de términos
   */
  const handleAcceptTermsChange = useCallback((checked) => {
    setAcceptTerms(checked);
    if (checked && formErrors.terms) {
      setFormErrors(prev => ({ ...prev, terms: '' }));
    }
  }, [formErrors]);

  /**
   * Valida el formulario completo
   */
  const validateForm = useCallback((selectedServices, otherService, otherServiceText) => {
    const errors = validatePublicBookingForm(
      formData,
      selectedServices,
      otherService,
      otherServiceText,
      acceptTerms
    );

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, acceptTerms]);

  /**
   * Resetea el formulario
   */
  const resetForm = useCallback(() => {
    setFormData({
      nombre: '',
      apellido: '',
      dni: '',
      correo: '',
      telefono: '',
      distrito: ''
    });
    setFormErrors({});
    setAcceptTerms(false);
  }, []);

  return {
    formData,
    formErrors,
    acceptTerms,
    handleFormChange,
    handleAcceptTermsChange,
    validateForm,
    resetForm
  };
};
