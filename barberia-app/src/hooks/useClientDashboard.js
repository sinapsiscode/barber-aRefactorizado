// ===================================================================
// 🎯 HOOK PERSONALIZADO PARA DASHBOARD DE CLIENTE - REFACTORIZADO
// ===================================================================
// Lógica centralizada para el dashboard del cliente
import { useState, useEffect, useMemo } from 'react';
import { useAuthStore, useAppointmentStore, useClientStore, useStaffStore, useBranchStore } from '../stores';

export const useClientDashboard = () => {
  const { user } = useAuthStore();
  const { appointments, getAppointmentsByClient } = useAppointmentStore();
  const { getCurrentClientData, calculateLoyaltyTier, updateClientWarningSettings } = useClientStore();
  const { barbers } = useStaffStore();
  const { branches } = useBranchStore();

  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Obtener datos del cliente actual
  const currentClient = getCurrentClientData(user);

  const [warningSettings, setWarningSettings] = useState({
    enabled: currentClient?.warningEnabled !== false,
    interval: currentClient?.cutoffWarningInterval || 15
  });

  // Memoizar datos procesados
  const processedData = useMemo(() => {
    if (!currentClient) return null;

    const clientAppointments = getAppointmentsByClient(currentClient.id);
    const upcomingAppointments = clientAppointments.filter(apt =>
      new Date(apt.date) >= new Date() && apt.status !== 'cancelled'
    );
    const nextAppointment = upcomingAppointments[0];

    const preferredBarber = barbers.find(b => b.id === currentClient.preferredBarber) || barbers[0];
    const preferredBranch = branches.find(b => b.id === currentClient.preferredBranch);
    const tier = calculateLoyaltyTier(currentClient);

    const recentHistory = clientAppointments
      .filter(apt => apt.status === 'completed')
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    return {
      clientAppointments,
      upcomingAppointments,
      nextAppointment,
      preferredBarber,
      preferredBranch,
      tier,
      recentHistory
    };
  }, [currentClient, getAppointmentsByClient, barbers, branches, calculateLoyaltyTier]);

  // Recompensas disponibles
  const availableRewards = useMemo(() => [
    { points: 100, reward: 'Descuento 10%', description: 'En cualquier servicio' },
    { points: 200, reward: 'Servicio Gratis', description: 'Corte básico' },
    { points: 300, reward: 'Descuento 25%', description: 'Combo completo' }
  ], []);

  // Handlers
  const handleWarningSettingsChange = (field, value) => {
    setWarningSettings(prev => ({ ...prev, [field]: value }));
    if (currentClient) {
      updateClientWarningSettings(
        currentClient.id,
        field === 'interval' ? value : warningSettings.interval,
        field === 'enabled' ? value : warningSettings.enabled
      );
    }
  };

  const getDaysSinceLastVisit = () => {
    if (!currentClient?.lastVisit) return 'Nunca';
    const days = Math.floor((new Date() - new Date(currentClient.lastVisit)) / (1000 * 60 * 60 * 24));
    return `${days} días`;
  };

  const getNextWarningDays = () => {
    if (!currentClient?.lastVisit) return warningSettings.interval;
    const daysSinceLastVisit = Math.floor((new Date() - new Date(currentClient.lastVisit)) / (1000 * 60 * 60 * 24));
    return Math.max(0, warningSettings.interval - daysSinceLastVisit);
  };

  // Actualizar warningSettings cuando cambie el cliente
  useEffect(() => {
    if (currentClient) {
      setWarningSettings({
        enabled: currentClient.warningEnabled !== false,
        interval: currentClient.cutoffWarningInterval || 15
      });
    }
  }, [currentClient]);

  return {
    // Estados
    currentClient,
    showAppointmentForm,
    showProfile,
    warningSettings,

    // Datos procesados
    ...processedData,
    availableRewards,

    // Handlers
    setShowAppointmentForm,
    setShowProfile,
    handleWarningSettingsChange,
    getDaysSinceLastVisit,
    getNextWarningDays
  };
};