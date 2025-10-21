/**
 * Componente Header del Portfolio
 * Título, descripción, botón agregar, selector de vista
 */
import { FiPlus, FiGrid, FiList } from 'react-icons/fi';
import { PORTFOLIO_TITLES, PORTFOLIO_DESCRIPTIONS, PORTFOLIO_PERMISSIONS } from '../../../constants/portfolio/roles';
import { VIEW_MODES } from '../../../constants/portfolio/viewModes';

const PortfolioHeader = ({
  user,
  selectedBranch,
  viewMode,
  setViewMode,
  onAddWork
}) => {
  const title = PORTFOLIO_TITLES[user?.role] || 'Portafolio';
  const description = PORTFOLIO_DESCRIPTIONS[user?.role] || '';
  const canAddWork = PORTFOLIO_PERMISSIONS.canAddWork(user?.role);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {title}
          {selectedBranch && (
            <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-2">
              - {selectedBranch.name}
            </span>
          )}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {description}
          {selectedBranch && description.includes('Muestra') && (
            <span> en {selectedBranch.city}</span>
          )}
        </p>
      </div>

      <div className="flex items-center space-x-3">
        {canAddWork && (
          <button onClick={onAddWork} className="btn-primary">
            <FiPlus className="h-4 w-4 mr-2" />
            Agregar Trabajo
          </button>
        )}

        <div className="flex items-center bg-gray-100 dark:bg-dark-700 rounded-lg p-1">
          <button
            onClick={() => setViewMode(VIEW_MODES.GRID)}
            className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              viewMode === VIEW_MODES.GRID
                ? 'bg-white dark:bg-dark-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <FiGrid className="h-4 w-4 mr-1" />
            Grid
          </button>
          <button
            onClick={() => setViewMode(VIEW_MODES.LIST)}
            className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              viewMode === VIEW_MODES.LIST
                ? 'bg-white dark:bg-dark-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <FiList className="h-4 w-4 mr-1" />
            Lista
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioHeader;
