import { FiAlertTriangle } from 'react-icons/fi';
import {
  CLIENT_TABS,
  CLIENT_MANAGEMENT_TEXTS,
  CLIENT_SECURITY_ROLES
} from '../../constants/clients';

const ClientsTabs = ({
  selectedTab,
  onTabChange,
  flaggedCount,
  userRole
}) => {
  const hasSecurityAccess = CLIENT_SECURITY_ROLES.includes(userRole);

  if (!hasSecurityAccess || flaggedCount === 0) {
    return null;
  }

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-8">
        <TabButton
          isActive={selectedTab === CLIENT_TABS.ALL}
          onClick={() => onTabChange(CLIENT_TABS.ALL)}
          className="border-primary-500 text-primary-600 dark:text-primary-400"
        >
          {CLIENT_MANAGEMENT_TEXTS.ALL_CLIENTS}
        </TabButton>

        <TabButton
          isActive={selectedTab === CLIENT_TABS.FLAGGED}
          onClick={() => onTabChange(CLIENT_TABS.FLAGGED)}
          className="border-red-500 text-red-600 dark:text-red-400"
        >
          <div className="flex items-center space-x-2">
            <FiAlertTriangle className="h-4 w-4" />
            <span>{CLIENT_MANAGEMENT_TEXTS.SUSPICIOUS_CLIENTS}</span>
            {flaggedCount > 0 && (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {flaggedCount}
              </span>
            )}
          </div>
        </TabButton>
      </nav>
    </div>
  );
};

const TabButton = ({ isActive, onClick, className, children }) => (
  <button
    onClick={onClick}
    className={`py-2 px-1 border-b-2 font-medium text-sm ${
      isActive
        ? className
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
    }`}
  >
    {children}
  </button>
);

export default ClientsTabs;