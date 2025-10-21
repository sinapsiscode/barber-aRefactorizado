import { useState, useCallback, useMemo } from 'react';
import { filterAppointments, getActiveFiltersCount, filterBarbersByBranch } from '../../utils/calendar/calendarUtils';
import { useBranchStore, useStaffStore } from '../../stores';

/**
 * Hook para manejar los filtros del calendario
 */
export const useCalendarFilters = () => {
  const { selectedBranch } = useBranchStore();
  const { barbers } = useStaffStore();

  const [filters, setFilters] = useState({
    branchId: selectedBranch?.id || '',
    barberId: '',
    serviceType: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      // Si cambia la sucursal, resetear el barbero
      if (key === 'branchId') {
        newFilters.barberId = '';
      }
      return newFilters;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      branchId: selectedBranch?.id || '',
      barberId: '',
      serviceType: ''
    });
  }, [selectedBranch]);

  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  const activeFiltersCount = useMemo(() => {
    return getActiveFiltersCount(filters, selectedBranch?.id);
  }, [filters, selectedBranch]);

  const filteredBarbers = useMemo(() => {
    return filterBarbersByBranch(barbers, filters.branchId);
  }, [barbers, filters.branchId]);

  const applyFilters = useCallback((appointments) => {
    return filterAppointments(appointments, filters);
  }, [filters]);

  return {
    filters,
    showFilters,
    activeFiltersCount,
    filteredBarbers,
    updateFilter,
    clearFilters,
    toggleFilters,
    applyFilters
  };
};
