import { FiMapPin, FiChevronDown } from 'react-icons/fi';
import BranchStatus from '../common/BranchStatus';
import CountryFlag from '../common/CountryFlag';

/**
 * Selector de sucursales con dropdown
 */
const BranchSelectorDropdown = ({
  user,
  selectedBranch,
  branches,
  showDropdown,
  onToggle,
  onBranchChange
}) => {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ripple"
      >
        <FiMapPin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <div className="flex flex-col items-start">
          <div className="flex items-center space-x-2">
            {selectedBranch && (
              <CountryFlag countryCode={selectedBranch.country} size={16} />
            )}
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {selectedBranch?.name || 'Todas las sedes'}
            </span>
          </div>
          {selectedBranch && (
            <BranchStatus branchId={selectedBranch.id} showText={true} className="text-xs" />
          )}
        </div>
        <FiChevronDown className={`h-4 w-4 text-gray-600 dark:text-gray-400 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {showDropdown && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-950 rounded-lg elevation-8 z-50 overflow-hidden">
          <div className="py-1">
            {user?.role === 'super_admin' && (
              <button
                onClick={() => onBranchChange(null)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-200 ripple"
              >
                <div className="flex items-center space-x-2">
                  <FiMapPin className="h-4 w-4" />
                  <span>Todas las sedes</span>
                </div>
              </button>
            )}
            {branches.map((branch) => (
              <button
                key={branch.id}
                onClick={() => onBranchChange(branch)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-200 ripple"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FiMapPin className="h-4 w-4" />
                    <span>{branch.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BranchStatus branchId={branch.id} showText={false} />
                    <CountryFlag countryCode={branch.country} size={16} />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{branch.city}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchSelectorDropdown;
