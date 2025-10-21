import { useState, useCallback } from 'react';
import { useBranchStore } from '../../stores';

/**
 * Hook para manejar el selector de sucursales del header
 */
export const useBranchSelector = (user) => {
  const { branches, selectedBranch, setSelectedBranch } = useBranchStore();
  const [showBranchSelector, setShowBranchSelector] = useState(false);

  /**
   * Verifica si el usuario puede gestionar múltiples sucursales
   */
  const canManageMultipleBranches = user?.role === 'super_admin';

  /**
   * Cambia la sucursal seleccionada
   */
  const handleBranchChange = useCallback((branch) => {
    setSelectedBranch(branch);
    setShowBranchSelector(false);
  }, [setSelectedBranch]);

  /**
   * Toggle del dropdown de sucursales
   */
  const toggleBranchSelector = useCallback(() => {
    setShowBranchSelector(prev => !prev);
  }, []);

  /**
   * Cierra el dropdown de sucursales
   */
  const closeBranchSelector = useCallback(() => {
    setShowBranchSelector(false);
  }, []);

  return {
    branches,
    selectedBranch,
    showBranchSelector,
    canManageMultipleBranches,
    handleBranchChange,
    toggleBranchSelector,
    closeBranchSelector
  };
};
