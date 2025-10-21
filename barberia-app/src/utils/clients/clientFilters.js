/**
 * Utilidades de filtrado para clientes
 * Funciones puras que pueden ser testeadas independientemente
 */

import { CLIENT_TABS } from '../../constants/clients/clientStatus';

/**
 * Nivel 1: Filtro por sucursal (para super_admin)
 * @param {Array} clients - Lista de clientes
 * @param {Object} user - Usuario actual
 * @param {Object} selectedBranch - Sucursal seleccionada
 * @returns {Array} - Clientes filtrados
 */
export const filterByBranch = (clients, user, selectedBranch) => {
  // Si no es super_admin o no hay sucursal seleccionada, no filtrar
  if (user?.role !== 'super_admin' || !selectedBranch) {
    return clients;
  }

  // Filtrar por branchId
  return clients.filter(client => client.branchId === selectedBranch.id);
};

/**
 * Nivel 2: Filtro por tab (Todos / Sospechosos / No Gratos)
 * @param {Array} clients - Lista de clientes
 * @param {string} selectedTab - Tab seleccionado ('all', 'flagged', 'unwelcome')
 * @returns {Array} - Clientes filtrados
 */
export const filterByTab = (clients, selectedTab) => {
  switch (selectedTab) {
    case CLIENT_TABS.FLAGGED:
      // Clientes problemáticos (con banderas de seguridad)
      return clients.filter(client =>
        client.securityFlags?.isFlagged ||
        client.securityFlags?.blacklisted ||
        (client.securityFlags?.falseVouchersCount || 0) > 0
      );

    case CLIENT_TABS.UNWELCOME:
      // Solo clientes marcados como "no gratos"
      return clients.filter(client => client.isUnwelcome);

    case CLIENT_TABS.ALL:
    default:
      // Todos los clientes
      return clients;
  }
};

/**
 * Nivel 3: Filtro por búsqueda (nombre, email, teléfono)
 * @param {Array} clients - Lista de clientes
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Array} - Clientes filtrados
 */
export const filterBySearch = (clients, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return clients;
  }

  const term = searchTerm.toLowerCase().trim();

  return clients.filter(client => {
    // Buscar en nombre
    const matchName = client.name?.toLowerCase().includes(term);

    // Buscar en email
    const matchEmail = client.email?.toLowerCase().includes(term);

    // Buscar en teléfono
    const matchPhone = client.phone?.includes(term);

    return matchName || matchEmail || matchPhone;
  });
};

/**
 * Aplica todos los filtros en cascada
 * @param {Array} clients - Lista de clientes
 * @param {Object} filters - Objeto con todos los filtros
 * @param {Object} filters.user - Usuario actual
 * @param {Object} filters.selectedBranch - Sucursal seleccionada
 * @param {string} filters.selectedTab - Tab seleccionado
 * @param {string} filters.searchTerm - Término de búsqueda
 * @returns {Array} - Clientes filtrados
 */
export const applyAllFilters = (clients, { user, selectedBranch, selectedTab, searchTerm }) => {
  let result = clients;

  // Nivel 1: Filtro por sucursal
  result = filterByBranch(result, user, selectedBranch);

  // Nivel 2: Filtro por tab
  result = filterByTab(result, selectedTab);

  // Nivel 3: Filtro por búsqueda
  if (searchTerm) {
    result = filterBySearch(result, searchTerm);
  }

  return result;
};

/**
 * Obtiene clientes con banderas de seguridad
 * @param {Array} clients - Lista de clientes
 * @returns {Array} - Clientes con flags
 */
export const getFlaggedClients = (clients) => {
  return clients.filter(client =>
    client.securityFlags?.isFlagged ||
    client.securityFlags?.blacklisted ||
    (client.securityFlags?.falseVouchersCount || 0) > 0
  );
};

/**
 * Obtiene clientes marcados como "no gratos"
 * @param {Array} clients - Lista de clientes
 * @returns {Array} - Clientes unwelcome
 */
export const getUnwelcomeClients = (clients) => {
  return clients.filter(client => client.isUnwelcome);
};

/**
 * Verifica si debe mostrar el sistema de tabs
 * @param {Object} user - Usuario actual
 * @param {number} flaggedCount - Cantidad de clientes sospechosos
 * @param {number} unwelcomeCount - Cantidad de clientes no gratos
 * @returns {boolean}
 */
export const shouldShowTabs = (user, flaggedCount, unwelcomeCount) => {
  const isAdmin = user?.role === 'super_admin' || user?.role === 'branch_admin';
  const hasSpecialClients = flaggedCount > 0 || unwelcomeCount > 0;

  return isAdmin && hasSpecialClients;
};
