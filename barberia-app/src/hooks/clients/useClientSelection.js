/**
 * Custom Hook para manejo de selección de clientes (checkboxes)
 * Usado principalmente en el tab "unwelcome" para acciones masivas
 */

import { useState, useCallback, useEffect } from 'react';

/**
 * Hook para manejar selección múltiple de clientes
 * @param {string} selectedTab - Tab actual (limpia selección al cambiar)
 * @returns {Object} - Estado y funciones de selección
 */
export const useClientSelection = (selectedTab) => {
  const [selectedClients, setSelectedClients] = useState(new Set());

  // Limpiar selecciones cuando cambia el tab
  useEffect(() => {
    setSelectedClients(new Set());
  }, [selectedTab]);

  /**
   * Toggle selección de un cliente individual
   */
  const handleSelectClient = useCallback((clientId) => {
    setSelectedClients(prev => {
      const newSet = new Set(prev);
      if (newSet.has(clientId)) {
        newSet.delete(clientId);
      } else {
        newSet.add(clientId);
      }
      return newSet;
    });
  }, []);

  /**
   * Seleccionar o deseleccionar todos
   */
  const handleSelectAll = useCallback((unwelcomeClients) => {
    setSelectedClients(prev => {
      // Si ya están todos seleccionados, deseleccionar
      if (prev.size === unwelcomeClients.length && unwelcomeClients.length > 0) {
        return new Set();
      }
      // Si no, seleccionar todos
      return new Set(unwelcomeClients.map(c => c.id));
    });
  }, []);

  /**
   * Limpiar todas las selecciones
   */
  const clearSelection = useCallback(() => {
    setSelectedClients(new Set());
  }, []);

  /**
   * Verificar si todos están seleccionados
   */
  const isAllSelected = useCallback((unwelcomeClients) => {
    return selectedClients.size === unwelcomeClients.length && unwelcomeClients.length > 0;
  }, [selectedClients]);

  /**
   * Obtener IDs de clientes seleccionados como array
   */
  const getSelectedIds = useCallback(() => {
    return Array.from(selectedClients);
  }, [selectedClients]);

  /**
   * Verificar si hay selecciones
   */
  const hasSelection = selectedClients.size > 0;

  return {
    selectedClients,
    handleSelectClient,
    handleSelectAll,
    clearSelection,
    isAllSelected,
    getSelectedIds,
    hasSelection,
    selectedCount: selectedClients.size
  };
};
