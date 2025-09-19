import { useState, useCallback, useMemo } from 'react';

/**
 * Hook personalizado para manejo de filtros
 * Centraliza la lógica de filtrado y estado de filtros
 */
export const useFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [showFilters, setShowFilters] = useState(false);

  // Actualizar un filtro específico
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Actualizar múltiples filtros
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  // Limpiar todos los filtros
  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Limpiar un filtro específico
  const clearFilter = useCallback((key) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  // Togglear visibilidad de filtros
  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  // Contar filtros activos
  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(value =>
      value !== '' && value !== null && value !== undefined
    ).length;
  }, [filters]);

  // Verificar si hay filtros activos
  const hasActiveFilters = useMemo(() => {
    return activeFiltersCount > 0;
  }, [activeFiltersCount]);

  // Aplicar filtros a una lista de elementos
  const applyFilters = useCallback((items, filterFunctions) => {
    if (!hasActiveFilters || !filterFunctions) return items;

    return items.filter(item => {
      return Object.keys(filters).every(key => {
        const filterValue = filters[key];
        const filterFunction = filterFunctions[key];

        // Si no hay valor de filtro o función, no filtrar
        if (!filterValue || !filterFunction) return true;

        return filterFunction(item, filterValue);
      });
    });
  }, [filters, hasActiveFilters]);

  return {
    // Estado
    filters,
    showFilters,
    activeFiltersCount,
    hasActiveFilters,

    // Funciones de actualización
    updateFilter,
    updateFilters,
    setFilters,

    // Funciones de limpieza
    clearFilters,
    clearFilter,

    // Funciones de UI
    toggleFilters,
    setShowFilters,

    // Funciones de aplicación
    applyFilters
  };
};