/**
 * Banner de acciones masivas para clientes "No Gratos"
 * Solo visible en el tab "unwelcome"
 */

import { FiUserX } from 'react-icons/fi';

const UnwelcomeActions = ({
  unwelcomeClients,
  selectedClients,
  onSelectAll,
  onRehabilitateSelected,
  onRehabilitateAll,
  onExport
}) => {
  const selectedCount = selectedClients.size;
  const totalCount = unwelcomeClients.length;

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FiUserX className="h-5 w-5 text-red-600" />
          <div>
            <h3 className="text-sm font-medium text-red-900 dark:text-red-100">
              Gestión de Clientes No Gratos
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300">
              {totalCount} cliente{totalCount > 1 ? 's' : ''} marcado{totalCount > 1 ? 's' : ''} como no grato{totalCount > 1 ? 's' : ''}
              {selectedCount > 0 && (
                <span className="ml-2 font-medium">
                  • {selectedCount} seleccionado{selectedCount > 1 ? 's' : ''}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex space-x-3">
          {/* Botón Seleccionar/Deseleccionar Todos */}
          <button
            onClick={onSelectAll}
            className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            {selectedCount === totalCount ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
          </button>

          {/* Botón Rehabilitar Seleccionados (solo si hay selección) */}
          {selectedCount > 0 && (
            <button
              onClick={onRehabilitateSelected}
              className="px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
            >
              Rehabilitar Seleccionados ({selectedCount})
            </button>
          )}

          {/* Botón Rehabilitar Todos */}
          <button
            onClick={onRehabilitateAll}
            className="px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
          >
            Rehabilitar Todos
          </button>

          {/* Botón Exportar */}
          <button
            onClick={onExport}
            className="px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors"
          >
            Exportar Lista
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnwelcomeActions;
