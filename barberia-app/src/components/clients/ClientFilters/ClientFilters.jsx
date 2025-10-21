/**
 * Componente de Filtros y Header para la página de clientes
 * Incluye título, búsqueda y botón de nuevo cliente
 */

import { FiPlus, FiSearch } from 'react-icons/fi';

const ClientFilters = ({
  user,
  selectedBranch,
  searchTerm,
  onSearchChange,
  onNewClient
}) => {
  return (
    <div className="flex items-center justify-between">
      {/* Título */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestión de Clientes
          {user?.role === 'super_admin' && selectedBranch && (
            <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-2">
              - {selectedBranch.name}
            </span>
          )}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {user?.role === 'super_admin' && selectedBranch
            ? `Administra clientes y programa de fidelización de ${selectedBranch.city}`
            : 'Administra clientes y programa de fidelización'
          }
        </p>
      </div>

      {/* Controles */}
      <div className="flex space-x-4">
        {/* Barra de búsqueda */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <FiSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 w-80 input-field"
          />
        </div>

        {/* Botón nuevo cliente */}
        <button
          onClick={onNewClient}
          className="btn-primary"
        >
          <FiPlus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </button>
      </div>
    </div>
  );
};

export default ClientFilters;
