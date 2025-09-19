// ===================================================================
// ✂️ HOOK PERSONALIZADO PARA PRECIOS DE SERVICIOS - REFACTORIZADO
// ===================================================================
// Lógica centralizada para gestión de precios de servicios
import { useState, useEffect, useMemo } from 'react';
import { useAppointmentStore, useBranchStore, useAuthStore } from '../stores';
import { SERVICE_LABELS, SERVICE_CONFIG } from '../constants/services';
import Swal from 'sweetalert2';

export const useServicePricing = () => {
  const { user } = useAuthStore();
  const { selectedBranch } = useBranchStore();
  const {
    getServicesWithBranchPricing,
    updateBranchPricing,
    getBranchPricingStats,
    isLoading
  } = useAppointmentStore();

  const [localPrices, setLocalPrices] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [savingStatus, setSavingStatus] = useState('');

  // Datos de la sucursal actual
  const branchData = useMemo(() => {
    const currentBranchId = selectedBranch?.id || user?.branchId || 1;
    const currentBranchName = selectedBranch?.name || `Sede ${currentBranchId}`;

    return {
      id: currentBranchId,
      name: currentBranchName
    };
  }, [selectedBranch, user]);

  // Obtener servicios y estadísticas
  const services = getServicesWithBranchPricing(branchData.id);
  const pricingStats = getBranchPricingStats(branchData.id);

  // Inicializar precios locales
  useEffect(() => {
    const servicesData = getServicesWithBranchPricing(branchData.id);
    const initialPrices = {};
    servicesData.forEach(service => {
      initialPrices[service.id] = service.price;
    });
    setLocalPrices(initialPrices);
    setHasChanges(false);
  }, [branchData.id, getServicesWithBranchPricing]);

  // Handlers
  const handlePriceChange = (serviceId, newPrice) => {
    const price = parseFloat(newPrice) || 0;
    setLocalPrices(prev => ({
      ...prev,
      [serviceId]: price
    }));
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    try {
      setSavingStatus('saving');

      const result = await updateBranchPricing(branchData.id, localPrices);

      if (result.success) {
        setSavingStatus('success');
        setHasChanges(false);

        await Swal.fire({
          title: SERVICE_LABELS.NOTIFICATIONS.SUCCESS_TITLE,
          text: `Los precios de ${branchData.name} ${SERVICE_LABELS.NOTIFICATIONS.SUCCESS_MESSAGE}`,
          icon: 'success',
          timer: SERVICE_CONFIG.NOTIFICATIONS.SUCCESS_TIMER,
          showConfirmButton: false
        });

        setTimeout(() => setSavingStatus(''), SERVICE_CONFIG.NOTIFICATIONS.SUCCESS_TIMER);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setSavingStatus('error');
      await Swal.fire({
        title: SERVICE_LABELS.NOTIFICATIONS.ERROR_TITLE,
        text: SERVICE_LABELS.NOTIFICATIONS.ERROR_MESSAGE,
        icon: 'error'
      });
      setTimeout(() => setSavingStatus(''), SERVICE_CONFIG.NOTIFICATIONS.ERROR_TIMER);
    }
  };

  const handleResetPrices = async () => {
    const confirmed = await Swal.fire({
      title: SERVICE_LABELS.NOTIFICATIONS.RESET_TITLE,
      text: SERVICE_LABELS.NOTIFICATIONS.RESET_MESSAGE,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: SERVICE_LABELS.NOTIFICATIONS.CONFIRM_TEXT,
      cancelButtonText: SERVICE_LABELS.NOTIFICATIONS.CANCEL_TEXT
    });

    if (confirmed.isConfirmed) {
      const originalPrices = {};
      services.forEach(service => {
        originalPrices[service.id] = service.originalPrice;
      });
      setLocalPrices(originalPrices);
      setHasChanges(true);
    }
  };

  const handleBulkPriceUpdate = async () => {
    const { value: percentage } = await Swal.fire({
      title: SERVICE_LABELS.NOTIFICATIONS.BULK_TITLE,
      text: SERVICE_LABELS.NOTIFICATIONS.BULK_MESSAGE,
      input: 'number',
      inputPlaceholder: SERVICE_LABELS.NOTIFICATIONS.BULK_PLACEHOLDER,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value || isNaN(value)) {
          return SERVICE_LABELS.NOTIFICATIONS.BULK_VALIDATION;
        }
        if (value < SERVICE_CONFIG.VALIDATION.MIN_PERCENTAGE || value > SERVICE_CONFIG.VALIDATION.MAX_PERCENTAGE) {
          return SERVICE_LABELS.NOTIFICATIONS.BULK_RANGE;
        }
      }
    });

    if (percentage) {
      const multiplier = 1 + (parseFloat(percentage) / 100);
      const updatedPrices = {};

      services.forEach(service => {
        const currentPrice = localPrices[service.id] || service.price;
        updatedPrices[service.id] = Math.round(currentPrice * multiplier * 100) / 100;
      });

      setLocalPrices(updatedPrices);
      setHasChanges(true);

      await Swal.fire({
        title: SERVICE_LABELS.NOTIFICATIONS.BULK_SUCCESS,
        text: `Se aplicó un ${percentage > 0 ? 'aumento' : 'descuento'} del ${Math.abs(percentage)}% a todos los servicios`,
        icon: 'info',
        timer: SERVICE_CONFIG.NOTIFICATIONS.SUCCESS_TIMER,
        showConfirmButton: false
      });
    }
  };

  // Utilidades
  const getServicePriceData = (service) => {
    const currentPrice = localPrices[service.id] || service.price;
    const hasChanged = currentPrice !== service.price;
    const isIncreased = currentPrice > service.originalPrice;
    const isDecreased = currentPrice < service.originalPrice;

    return {
      currentPrice,
      hasChanged,
      isIncreased,
      isDecreased
    };
  };

  const getFallbackImage = () => {
    return SERVICE_CONFIG.IMAGE.FALLBACK_SVG(SERVICE_CONFIG.IMAGE.FALLBACK_SIZE);
  };

  return {
    // Estados
    localPrices,
    hasChanges,
    savingStatus,
    isLoading,

    // Datos
    branchData,
    services,
    pricingStats,

    // Handlers
    handlePriceChange,
    handleSaveChanges,
    handleResetPrices,
    handleBulkPriceUpdate,

    // Utilidades
    getServicePriceData,
    getFallbackImage
  };
};