// ===================================================================
// 👥 HOOK DE FORMULARIO DE PERSONAL - REFACTORIZADO
// ===================================================================
// Hook especializado para la gestión de formularios de barberos

import { useState, useCallback, useMemo } from 'react';
import { useStaffStore, useBranchStore } from '../stores';
import { STAFF_CONFIG } from '../constants/staff';

export const useStaffForm = (barber = null, onSuccess, onClose) => {
  // Estados del formulario
  const [formData, setFormData] = useState({
    name: barber?.name || '',
    email: barber?.email || '',
    phone: barber?.phone || '',
    branchId: barber?.branchId || STAFF_CONFIG.VALIDATION.DEFAULT_BRANCH_ID,
    specialties: barber?.specialties || [],
    experience: barber?.experience || '',
    commission: barber?.commission || STAFF_CONFIG.VALIDATION.DEFAULT_COMMISSION,
    country: barber?.country || STAFF_CONFIG.VALIDATION.DEFAULT_COUNTRY
  });

  const [loading, setLoading] = useState(false);

  // Stores
  const { addBarber, updateBarber } = useStaffStore();
  const { branches } = useBranchStore();

  // Datos computados
  const isEditing = useMemo(() => Boolean(barber), [barber]);

  const isFormValid = useMemo(() => {
    return formData.name.trim() &&
           formData.email.trim() &&
           formData.phone.trim() &&
           formData.specialties.length > 0;
  }, [formData]);

  /**
   * Actualizar campo del formulario
   */
  const updateField = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  /**
   * Manejar toggle de especialidades
   */
  const handleSpecialtyToggle = useCallback((specialty) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  }, []);

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!isFormValid) return;

    setLoading(true);

    try {
      if (isEditing) {
        await updateBarber(barber.id, formData);
      } else {
        await addBarber(formData);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Error saving barber:', error);
      // En una implementación real, aquí manejarías el error con notificaciones
    } finally {
      setLoading(false);
    }
  }, [formData, isFormValid, isEditing, barber?.id, updateBarber, addBarber, onSuccess]);

  /**
   * Resetear formulario
   */
  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      branchId: STAFF_CONFIG.VALIDATION.DEFAULT_BRANCH_ID,
      specialties: [],
      experience: '',
      commission: STAFF_CONFIG.VALIDATION.DEFAULT_COMMISSION,
      country: STAFF_CONFIG.VALIDATION.DEFAULT_COUNTRY
    });
  }, []);

  /**
   * Manejar cierre del modal
   */
  const handleClose = useCallback(() => {
    if (!loading) {
      onClose?.();
    }
  }, [loading, onClose]);

  /**
   * Obtener datos de validación de comisión
   */
  const getCommissionValidation = useMemo(() => ({
    min: STAFF_CONFIG.VALIDATION.MIN_COMMISSION,
    max: STAFF_CONFIG.VALIDATION.MAX_COMMISSION,
    step: STAFF_CONFIG.VALIDATION.COMMISSION_STEP,
    percentage: Math.round(formData.commission * 100)
  }), [formData.commission]);

  /**
   * Verificar si una especialidad está seleccionada
   */
  const isSpecialtySelected = useCallback((specialty) => {
    return formData.specialties.includes(specialty);
  }, [formData.specialties]);

  /**
   * Obtener información de la sede seleccionada
   */
  const selectedBranchInfo = useMemo(() => {
    return branches.find(branch => branch.id === formData.branchId);
  }, [branches, formData.branchId]);

  return {
    // Estados
    formData,
    loading,
    isEditing,
    isFormValid,

    // Datos computados
    branches,
    selectedBranchInfo,
    getCommissionValidation,

    // Funciones de manejo
    updateField,
    handleSpecialtyToggle,
    handleSubmit,
    handleClose,
    resetForm,
    isSpecialtySelected
  };
};

export default useStaffForm;