import { FiFilter } from 'react-icons/fi';

/**
 * Panel de filtros del calendario
 */
const CalendarFilters = ({
  filters,
  showFilters,
  activeFiltersCount,
  branches,
  filteredBarbers,
  services,
  onToggleFilters,
  onClearFilters,
  onUpdateFilter
}) => {
  return (
    <div className="card mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filtros</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={onClearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Limpiar filtros
          </button>
          <button
            onClick={onToggleFilters}
            className={`flex items-center px-3 py-1 rounded-lg font-medium transition-colors relative ${
              showFilters
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            <FiFilter className="h-4 w-4 mr-1" />
            {showFilters ? 'Ocultar' : 'Mostrar'}
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtro por sede */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sede
            </label>
            <select
              value={filters.branchId}
              onChange={(e) => onUpdateFilter('branchId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
            >
              <option value="">Todas las sedes</option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por barbero */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Barbero
              {filters.branchId && (
                <span className="text-xs text-gray-500 ml-1">
                  (Sede: {branches.find(b => b.id === parseInt(filters.branchId))?.name})
                </span>
              )}
            </label>
            <select
              value={filters.barberId}
              onChange={(e) => onUpdateFilter('barberId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
            >
              <option value="">
                {filters.branchId
                  ? `Todos los barberos de ${branches.find(b => b.id === parseInt(filters.branchId))?.name || 'esta sede'}`
                  : 'Todos los barberos de la empresa'
                }
              </option>
              {filteredBarbers.map(barber => {
                const branch = branches.find(b => b.id === barber.branchId);
                return (
                  <option key={barber.id} value={barber.id}>
                    {barber.name}
                    {!filters.branchId && branch ? ` (${branch.name})` : ''}
                  </option>
                );
              })}
            </select>
            {filteredBarbers.length === 0 && filters.branchId && (
              <p className="text-xs text-gray-500 mt-1">
                No hay barberos disponibles en esta sede
              </p>
            )}
          </div>

          {/* Filtro por tipo de servicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Servicio
            </label>
            <select
              value={filters.serviceType}
              onChange={(e) => onUpdateFilter('serviceType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
            >
              <option value="">Todos los servicios</option>
              {services?.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarFilters;
