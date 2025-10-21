import { useState, useEffect, useCallback } from 'react';
import { useAppointmentStore, useStaffStore, useBranchStore } from '../../stores';
import { getInitialFormData } from '../../constants/appointmentForm';
import { validateStep } from '../../utils/clients/appointmentFormValidation';
import { filterPortfolioImages } from '../../utils/clients/appointmentFormUtils';
import portfolioData from '../../data/portfolio.json';
import { PORTFOLIO_CONFIG } from '../../constants/appointmentForm';

/**
 * Hook para manejar la lógica del formulario de citas
 */
export const useAppointmentForm = (selectedDate) => {
  const { services, generateTimeSlots } = useAppointmentStore();
  const { getActiveBarbers, loadStaff, barbers } = useStaffStore();
  const { branches, loadBranches } = useBranchStore();

  // Estados
  const [formData, setFormData] = useState(getInitialFormData(selectedDate));
  const [step, setStep] = useState(1);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [portfolioImages, setPortfolioImages] = useState([]);

  // Cargar datos iniciales
  useEffect(() => {
    if (!branches || branches.length === 0) {
      loadBranches();
    }
    if (!barbers || barbers.length === 0) {
      loadStaff();
    }
  }, [branches, barbers, loadBranches, loadStaff]);

  // Generar slots disponibles cuando se seleccione barbero y fecha
  useEffect(() => {
    if (formData.date && formData.barberId) {
      const slots = generateTimeSlots(new Date(formData.date), parseInt(formData.barberId));
      setAvailableSlots(slots.filter(slot => slot.available));
    }
  }, [formData.date, formData.barberId, generateTimeSlots]);

  // Cargar portafolio cuando se seleccionan servicios
  useEffect(() => {
    if (formData.services.length > 0 && step === 3 && formData.branchId) {
      const images = filterPortfolioImages(
        portfolioData,
        formData.services,
        formData.branchId,
        PORTFOLIO_CONFIG.MIN_IMAGES_BEFORE_ADDING_GENERAL,
        PORTFOLIO_CONFIG.MAX_IMAGES
      );
      setPortfolioImages(images);
    }
  }, [formData.services, formData.branchId, step]);

  // Datos computados
  const selectedBranch = branches.find(b => b.id === parseInt(formData.branchId));
  const branchBarbers = formData.branchId
    ? getActiveBarbers().filter(b => b.branchId === parseInt(formData.branchId))
    : [];
  const selectedBarber = branchBarbers.find(b => b.id === parseInt(formData.barberId));
  const selectedServices = services.filter(s => formData.services.includes(s.id));
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  // Funciones de navegación
  const isStepValid = useCallback((stepNumber) => {
    return validateStep(stepNumber, formData);
  }, [formData]);

  const canProceed = useCallback(() => {
    return isStepValid(step);
  }, [step, isStepValid]);

  const nextStep = useCallback(() => {
    if (canProceed()) {
      setStep(prev => prev + 1);
      return true;
    }
    return false;
  }, [canProceed]);

  const prevStep = useCallback(() => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  }, [step]);

  const goToStep = useCallback((targetStep) => {
    if (targetStep >= 1 && targetStep <= 7) {
      setStep(targetStep);
    }
  }, []);

  // Actualizar datos del formulario
  const updateFormData = useCallback((updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    // Estado
    formData,
    step,
    availableSlots,
    portfolioImages,

    // Datos computados
    selectedBranch,
    branchBarbers,
    selectedBarber,
    selectedServices,
    totalPrice,
    totalDuration,
    branches,
    services,

    // Funciones
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    canProceed,
    isStepValid
  };
};
