import { FiMapPin } from 'react-icons/fi';
import { DEFAULT_WORKING_HOURS } from '../../../constants/clientDashboard';

/**
 * Card de información de la sucursal preferida
 */
const BranchInfoCard = ({ preferredBranch }) => {
  if (!preferredBranch) return null;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Mi Sede Preferida
      </h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <FiMapPin className="h-5 w-5 text-primary-500" />
          <div>
            <div className="font-medium">{preferredBranch.name}</div>
            <div className="text-sm text-gray-600">{preferredBranch.address}</div>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          <strong>Horarios:</strong><br />
          Lun-Vie: {DEFAULT_WORKING_HOURS.weekdays}<br />
          Sáb: {DEFAULT_WORKING_HOURS.saturday}<br />
          Dom: {DEFAULT_WORKING_HOURS.sunday}
        </div>
      </div>
    </div>
  );
};

export default BranchInfoCard;
