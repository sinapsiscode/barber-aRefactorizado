import { useMemo } from 'react';
import { useClientStore, useAppointmentStore, useStaffStore, useBranchStore } from '../../stores';
import { RECENT_HISTORY_LIMIT } from '../../constants/clientDashboard';

/**
 * Hook para obtener y calcular todos los datos necesarios del dashboard del cliente
 */
export const useClientDashboardData = (user) => {
  const { getCurrentClientData, calculateLoyaltyTier } = useClientStore();
  const { getAppointmentsByClient } = useAppointmentStore();
  const { barbers } = useStaffStore();
  const { branches } = useBranchStore();

  // Obtener datos del cliente actual
  const currentClient = getCurrentClientData(user);

  // Calcular citas del cliente
  const clientAppointments = useMemo(() => {
    return currentClient ? getAppointmentsByClient(currentClient.id) : [];
  }, [currentClient, getAppointmentsByClient]);

  // Filtrar citas próximas
  const upcomingAppointments = useMemo(() => {
    return clientAppointments.filter(apt =>
      new Date(apt.date) >= new Date() && apt.status !== 'cancelled'
    );
  }, [clientAppointments]);

  // Próxima cita
  const nextAppointment = upcomingAppointments[0];

  // Barbero preferido
  const preferredBarber = useMemo(() => {
    return barbers.find(b => b.id === currentClient?.preferredBarber) || barbers[0];
  }, [barbers, currentClient?.preferredBarber]);

  // Sucursal preferida
  const preferredBranch = useMemo(() => {
    return branches.find(b => b.id === currentClient?.preferredBranch);
  }, [branches, currentClient?.preferredBranch]);

  // Tier de lealtad
  const tier = useMemo(() => {
    return currentClient ? calculateLoyaltyTier(currentClient) : 'Bronze';
  }, [currentClient, calculateLoyaltyTier]);

  // Historial reciente
  const recentHistory = useMemo(() => {
    return clientAppointments
      .filter(apt => apt.status === 'completed')
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, RECENT_HISTORY_LIMIT);
  }, [clientAppointments]);

  // Días desde última visita
  const getDaysSinceLastVisit = () => {
    if (!currentClient?.lastVisit) return 'Nunca';
    const days = Math.floor((new Date() - new Date(currentClient.lastVisit)) / (1000 * 60 * 60 * 24));
    return `${days} días`;
  };

  return {
    currentClient,
    clientAppointments,
    upcomingAppointments,
    nextAppointment,
    preferredBarber,
    preferredBranch,
    tier,
    recentHistory,
    getDaysSinceLastVisit
  };
};
