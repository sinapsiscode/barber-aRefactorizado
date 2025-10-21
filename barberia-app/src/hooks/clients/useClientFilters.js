/**
 * Custom Hook para filtrado de clientes
 * Encapsula la lógica de filtrado en cascada con memoización
 */

import { useMemo } from 'react';
import { applyAllFilters, getFlaggedClients, getUnwelcomeClients } from '../../utils/clients/clientFilters';

/**
 * Hook para filtrar clientes con múltiples criterios
 * @param {Array} clients - Lista completa de clientes
 * @param {Object} filters - Objeto con filtros
 * @param {Object} filters.user - Usuario actual
 * @param {Object} filters.selectedBranch - Sucursal seleccionada
 * @param {string} filters.selectedTab - Tab seleccionado
 * @param {string} filters.searchTerm - Término de búsqueda
 * @returns {Object} - Clientes filtrados y contadores
 */
export const useClientFilters = (clients, filters) => {
  const { user, selectedBranch, selectedTab, searchTerm } = filters;

  // Aplicar todos los filtros con memoización
  const filteredClients = useMemo(() => {
    return applyAllFilters(clients, {
      user,
      selectedBranch,
      selectedTab,
      searchTerm
    });
  }, [clients, user, selectedBranch, selectedTab, searchTerm]);

  // Obtener clientes con flags (memoizado)
  const flaggedClients = useMemo(() => {
    return getFlaggedClients(clients);
  }, [clients]);

  // Obtener clientes unwelcome (memoizado)
  const unwelcomeClients = useMemo(() => {
    return getUnwelcomeClients(clients);
  }, [clients]);

  return {
    filteredClients,
    flaggedClients,
    unwelcomeClients,
    flaggedCount: flaggedClients.length,
    unwelcomeCount: unwelcomeClients.length
  };
};
