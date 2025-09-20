import { FiPlus, FiGrid, FiList } from 'react-icons/fi';
import { PORTFOLIO_TEXTS, VIEW_MODES } from '../../constants/portfolio';
import { getPortfolioTitle, getPortfolioSubtitle } from '../../utils/portfolioHelpers';

const PortfolioHeader = ({
  user,
  selectedBranch,
  viewMode,
  onViewModeChange,
  onShowAddWorkModal
}) => {
  const title = getPortfolioTitle(user?.role);
  const subtitle = getPortfolioSubtitle(user?.role, selectedBranch);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {title}
          {(user?.role === 'super_admin' || user?.role === 'reception') && selectedBranch && (
            <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-2">
              - {selectedBranch.name}
            </span>
          )}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center space-x-3">
        {user?.role === 'barber' && (
          <button
            onClick={onShowAddWorkModal}
            className="btn-primary"
          >
            <FiPlus className="h-4 w-4 mr-2" />
            {PORTFOLIO_TEXTS.ADD_WORK}
          </button>
        )}

        <ViewModeSelector
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />
      </div>
    </div>
  );
};

const ViewModeSelector = ({ viewMode, onViewModeChange }) => (
  <div className="flex items-center bg-gray-100 dark:bg-dark-700 rounded-lg p-1">
    <button
      onClick={() => onViewModeChange(VIEW_MODES.GRID)}
      className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
        viewMode === VIEW_MODES.GRID
          ? 'bg-white dark:bg-dark-600 text-gray-900 dark:text-white shadow-sm'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
      }`}
    >
      <FiGrid className="h-4 w-4 mr-1" />
      {PORTFOLIO_TEXTS.GRID_VIEW}
    </button>
    <button
      onClick={() => onViewModeChange(VIEW_MODES.LIST)}
      className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
        viewMode === VIEW_MODES.LIST
          ? 'bg-white dark:bg-dark-600 text-gray-900 dark:text-white shadow-sm'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
      }`}
    >
      <FiList className="h-4 w-4 mr-1" />
      {PORTFOLIO_TEXTS.LIST_VIEW}
    </button>
  </div>
);

export default PortfolioHeader;