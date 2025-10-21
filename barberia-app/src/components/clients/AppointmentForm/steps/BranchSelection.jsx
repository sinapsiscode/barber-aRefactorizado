import { FiCheck, FiClock } from 'react-icons/fi';
import CountryFlag from '../../../common/CountryFlag';

/**
 * Paso 1: Selección de Sede
 */
const BranchSelection = ({ branches, selectedBranchId, onSelectBranch }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-xl font-semibold text-gray-900">
          Selecciona tu sede preferida
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {branches.map(branch => (
            <div
              key={branch.id}
              onClick={() => onSelectBranch(branch.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedBranchId === branch.id
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <CountryFlag country={branch.country} size={16} />
                    <h4 className="ml-2 font-semibold text-gray-900">{branch.name}</h4>
                  </div>
                  <p className="mb-2 text-sm text-gray-600">{branch.address}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <FiClock className="w-4 h-4 mr-1" />
                    <span>{branch.openTime} - {branch.closeTime}</span>
                  </div>
                </div>
                {selectedBranchId === branch.id && (
                  <FiCheck className="w-5 h-5 text-primary-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BranchSelection;
