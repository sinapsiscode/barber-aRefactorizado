import { useEffect } from 'react';
import { useAuthStore, useBranchStore, useClientStore, useStaffStore, useFinancialStore, useAppointmentStore } from '../stores';
import { useReminders } from './useReminders';
import { initializeAppData, getDataLoadingDependencies } from '../utils/appHelpers';
import { DATA_LOADING_CONFIG } from '../constants/appConfig';

export const useAppInitialization = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { loadMockBranches } = useBranchStore();
  const { loadMockClients } = useClientStore();
  const { loadMockStaff } = useStaffStore();
  const { loadMockData: loadFinancialData } = useFinancialStore();
  const { loadMockData: loadAppointmentData } = useAppointmentStore();

  // Sistema de recordatorios automático
  useReminders();

  // Cargar datos mock al inicializar la app
  useEffect(() => {
    const loadAppData = async () => {
      const stores = {
        loadMockBranches,
        loadMockClients,
        loadMockStaff,
        loadFinancialData,
        loadAppointmentData
      };

      const loadingFunctions = getDataLoadingDependencies(stores);
      const result = await initializeAppData(loadingFunctions);

      if (result.success) {
        console.log(DATA_LOADING_CONFIG.LOG_SUCCESS);
      } else {
        console.error(DATA_LOADING_CONFIG.LOG_ERROR, result.error);
      }
    };

    loadAppData();
  }, [loadMockBranches, loadMockClients, loadMockStaff, loadFinancialData, loadAppointmentData]);

  return {
    isAuthenticated,
    user
  };
};