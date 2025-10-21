/**
 * Configuración de columnas para la tabla de clientes
 */

import { FiAlertTriangle, FiGift, FiUserX } from 'react-icons/fi';
import { getTierInfo } from '../../utils/clients/loyaltyUtils';

/**
 * Columna de checkbox (solo visible en tab "unwelcome")
 */
const getCheckboxColumn = (handlers) => ({
  key: 'select',
  label: (
    <input
      type="checkbox"
      checked={handlers.isAllSelected}
      onChange={handlers.onSelectAll}
      className="rounded border-gray-300"
    />
  ),
  render: (value, client) => (
    <input
      type="checkbox"
      checked={handlers.selectedClients.has(client.id)}
      onChange={() => handlers.onSelectClient(client.id)}
      className="rounded border-gray-300"
    />
  ),
  width: '50px'
});

/**
 * Columna de Cliente (avatar, nombre, email, badges)
 */
const getClientColumn = (onClientClick) => ({
  key: 'name',
  label: 'Cliente',
  render: (value, client) => (
    <button
      onClick={() => onClientClick(client)}
      className="flex items-center space-x-3 text-left hover:text-primary-600"
    >
      {/* Avatar con inicial */}
      <div className="relative">
        <div className="h-10 w-10 bg-primary-500 rounded-full flex items-center justify-center">
          <span className="text-white font-medium">
            {value?.charAt(0) || '?'}
          </span>
        </div>

        {/* Badge de alerta si tiene flags */}
        {(client.securityFlags?.isFlagged || client.securityFlags?.blacklisted) && (
          <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
            <FiAlertTriangle className="h-2.5 w-2.5 text-white" />
          </div>
        )}
      </div>

      {/* Nombre y email */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-900 dark:text-white">{value}</span>

          {/* Badge BLOQUEADO */}
          {client.securityFlags?.blacklisted && (
            <span className="px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded">
              BLOQUEADO
            </span>
          )}
        </div>

        <div className="text-sm text-gray-500">{client.email}</div>
      </div>
    </button>
  )
});

/**
 * Columna de Teléfono
 */
const getPhoneColumn = () => ({
  key: 'phone',
  label: 'Teléfono'
});

/**
 * Columna de Visitas
 */
const getVisitsColumn = () => ({
  key: 'totalVisits',
  label: 'Visitas',
  render: (value) => (
    <div className="text-center">
      <div className="font-semibold">{value}</div>
      <div className="text-xs text-gray-500">veces</div>
    </div>
  )
});

/**
 * Columna de Total Gastado
 */
const getTotalSpentColumn = () => ({
  key: 'totalSpent',
  label: 'Total Gastado',
  render: (value) => (
    <div className="text-right">
      <div className="font-semibold text-green-600">
        S/{value?.toLocaleString() || '0'}
      </div>
    </div>
  )
});

/**
 * Columna de Puntos de Lealtad
 */
const getLoyaltyPointsColumn = () => ({
  key: 'loyaltyPoints',
  label: 'Puntos',
  render: (value) => (
    <div className="flex items-center space-x-1">
      <FiGift className="h-4 w-4 text-yellow-500" />
      <span className="font-medium">{value}</span>
    </div>
  )
});

/**
 * Columna de Última Visita
 */
const getLastVisitColumn = () => ({
  key: 'lastVisit',
  label: 'Última Visita',
  render: (value) => value ? new Date(value).toLocaleDateString() : 'Nunca'
});

/**
 * Columna de Categoría (Tier)
 */
const getTierColumn = () => ({
  key: 'tier',
  label: 'Categoría',
  render: (value, client) => {
    const tier = getTierInfo(client.totalSpent);
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${tier.color}`}>
        {tier.name}
      </span>
    );
  }
});

/**
 * Columna de Estado
 */
const getStatusColumn = () => ({
  key: 'status',
  label: 'Estado',
  render: (value, client) => {
    if (client.isUnwelcome) {
      return (
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 flex items-center space-x-1">
            <FiUserX className="h-3 w-3" />
            <span>No Grato</span>
          </span>
        </div>
      );
    }

    if (client.status === 'blacklisted') {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
          Bloqueado
        </span>
      );
    }

    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
        Activo
      </span>
    );
  }
});

/**
 * Columna de Acciones
 */
const getActionsColumn = (handlers) => ({
  key: 'actions',
  label: 'Acciones',
  render: (value, client) => (
    <div className="flex items-center space-x-2">
      {client.isUnwelcome ? (
        <button
          onClick={() => handlers.onRemoveUnwelcome(client.id, client.name)}
          className="text-green-600 hover:text-green-800 text-xs px-2 py-1 rounded bg-green-50 hover:bg-green-100"
          title="Remover estado 'No Grato'"
        >
          Rehabilitar
        </button>
      ) : (
        <button
          onClick={() => handlers.onMarkAsUnwelcome(client.id, client.name)}
          className="text-red-600 hover:text-red-800 text-xs px-2 py-1 rounded bg-red-50 hover:bg-red-100"
          title="Marcar como 'No Grato'"
        >
          Marcar No Grato
        </button>
      )}

      <button
        onClick={() => handlers.onClientClick(client)}
        className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 rounded bg-blue-50 hover:bg-blue-100"
      >
        Ver Perfil
      </button>
    </div>
  )
});

/**
 * Función principal que retorna todas las columnas configuradas
 * @param {string} selectedTab - Tab seleccionado ('all', 'flagged', 'unwelcome')
 * @param {Object} handlers - Objeto con todos los handlers necesarios
 * @returns {Array} - Array de columnas configuradas
 */
export const getClientColumns = (selectedTab, handlers) => {
  const columns = [];

  // Agregar columna de checkbox solo en tab "unwelcome"
  if (selectedTab === 'unwelcome') {
    columns.push(getCheckboxColumn(handlers));
  }

  // Agregar columnas principales
  columns.push(
    getClientColumn(handlers.onClientClick),
    getPhoneColumn(),
    getVisitsColumn(),
    getTotalSpentColumn(),
    getLoyaltyPointsColumn(),
    getLastVisitColumn(),
    getTierColumn(),
    getStatusColumn(),
    getActionsColumn(handlers)
  );

  return columns;
};
