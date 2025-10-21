/**
 * Estados de clientes en el sistema
 */

export const CLIENT_STATUS = {
  ACTIVE: 'active',
  BLACKLISTED: 'blacklisted',
  UNWELCOME: 'unwelcome'
};

export const CLIENT_STATUS_LABELS = {
  [CLIENT_STATUS.ACTIVE]: 'Activo',
  [CLIENT_STATUS.BLACKLISTED]: 'Bloqueado',
  [CLIENT_STATUS.UNWELCOME]: 'No Grato'
};

export const CLIENT_STATUS_COLORS = {
  [CLIENT_STATUS.ACTIVE]: 'bg-green-100 text-green-800',
  [CLIENT_STATUS.BLACKLISTED]: 'bg-gray-100 text-gray-800',
  [CLIENT_STATUS.UNWELCOME]: 'bg-red-100 text-red-800'
};

/**
 * Tabs disponibles en la vista de clientes
 */
export const CLIENT_TABS = {
  ALL: 'all',
  FLAGGED: 'flagged',
  UNWELCOME: 'unwelcome'
};

export const CLIENT_TAB_LABELS = {
  [CLIENT_TABS.ALL]: 'Todos los clientes',
  [CLIENT_TABS.FLAGGED]: 'Clientes sospechosos',
  [CLIENT_TABS.UNWELCOME]: 'Clientes No Gratos'
};
