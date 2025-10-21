import { FiX, FiEdit, FiGift, FiUserX, FiAlertTriangle } from 'react-icons/fi';
import { TIER_COLORS, CLIENT_PROFILE_TEXTS } from '../../../constants/clientProfile';

/**
 * Header del modal de perfil de cliente
 */
const ClientProfileHeader = ({ client, tier, isStaffView, onEdit, onClose }) => {
  return (
    <div className="bg-white dark:bg-dark-800 px-6 py-4 border-b border-gray-200 dark:border-dark-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-medium">
              {client.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              {client.name}
            </h3>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${TIER_COLORS[tier] || TIER_COLORS.Bronze}`}>
                {tier}
              </span>
              <div className="flex items-center space-x-1">
                <FiGift className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {client.loyaltyPoints} {CLIENT_PROFILE_TEXTS.pointsLabel}
                </span>
              </div>
              {/* Solo visible para staff/admin, NO para el propio cliente */}
              {isStaffView && client.isUnwelcome && (
                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full flex items-center space-x-1">
                  <FiUserX className="h-3 w-3" />
                  <span>{CLIENT_PROFILE_TEXTS.unwelcomeLabel}</span>
                </span>
              )}
              {isStaffView && client.securityFlags?.blacklisted && (
                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full flex items-center space-x-1">
                  <FiAlertTriangle className="h-3 w-3" />
                  <span>{CLIENT_PROFILE_TEXTS.blockedLabel}</span>
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="btn-secondary"
          >
            <FiEdit className="h-4 w-4 mr-2" />
            {CLIENT_PROFILE_TEXTS.editButton}
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientProfileHeader;
