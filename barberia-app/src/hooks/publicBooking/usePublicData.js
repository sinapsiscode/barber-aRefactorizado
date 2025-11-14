import { useEffect } from 'react';
import useStaffStore from '../../stores/staffStore';
import useBranchStore from '../../stores/branchStore';

/**
 * Hook para cargar datos públicos necesarios para PublicBooking
 * - Barberos
 * - Sucursales
 */
export const usePublicData = () => {
  const { barbers, loadStaff, isLoading: loadingStaff } = useStaffStore();
  const { branches, loadBranches, isLoading: loadingBranches } = useBranchStore();

  useEffect(() => {
    // Cargar barberos si no están cargados
    // includeAttendance = false para acceso público (no requiere autenticación)
    if (barbers.length === 0 && !loadingStaff) {
      loadStaff(false);
    }
  }, [barbers.length, loadStaff, loadingStaff]);

  useEffect(() => {
    // Cargar sucursales si no están cargadas
    if (branches.length === 0 && !loadingBranches) {
      loadBranches();
    }
  }, [branches.length, loadBranches, loadingBranches]);

  return {
    barbers,
    branches,
    isLoading: loadingStaff || loadingBranches
  };
};
