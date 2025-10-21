import PropTypes from 'prop-types';
import { FiClock } from 'react-icons/fi';
import { TAB_TYPES } from '../../constants/appointmentConstants';

/**
 * Componente de tabs para filtrar citas
 */
const AppointmentTabs = ({
  selectedTab,
  onTabChange,
  pendingPaymentCount,
  pendingApprovalCount,
  showPaymentTab,
  showApprovalTab
}) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => onTabChange(TAB_TYPES.ALL)}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            selectedTab === TAB_TYPES.ALL
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Todas las citas
        </button>

        {showPaymentTab && pendingPaymentCount > 0 && (
          <button
            onClick={() => onTabChange(TAB_TYPES.PENDING_PAYMENT)}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              selectedTab === TAB_TYPES.PENDING_PAYMENT
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <span>Pagos pendientes</span>
            <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-0.5 rounded-full">
              {pendingPaymentCount}
            </span>
          </button>
        )}

        {showApprovalTab && pendingApprovalCount > 0 && (
          <button
            onClick={() => onTabChange(TAB_TYPES.PENDING_APPROVAL)}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              selectedTab === TAB_TYPES.PENDING_APPROVAL
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <FiClock className="h-4 w-4" />
            <span>Pendientes Aprobación</span>
            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded-full">
              {pendingApprovalCount}
            </span>
          </button>
        )}
      </nav>
    </div>
  );
};

AppointmentTabs.propTypes = {
  selectedTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  pendingPaymentCount: PropTypes.number.isRequired,
  pendingApprovalCount: PropTypes.number.isRequired,
  showPaymentTab: PropTypes.bool.isRequired,
  showApprovalTab: PropTypes.bool.isRequired
};

export default AppointmentTabs;
