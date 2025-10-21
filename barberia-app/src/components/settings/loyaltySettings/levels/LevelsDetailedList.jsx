import { FiTrendingUp, FiDollarSign, FiGift, FiUsers, FiEdit, FiTrash } from 'react-icons/fi';
import { LOYALTY_TEXTS } from '../../../../constants/loyaltySettings';

/**
 * Lista detallada de niveles con acciones CRUD
 */
const LevelsDetailedList = ({ loyaltyLevels, clientsByLevel, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h4 className="font-medium text-gray-900 dark:text-white">{LOYALTY_TEXTS.levelsManagementTitle}</h4>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {loyaltyLevels.map((level) => (
          <div key={level.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className="h-12 w-12 rounded-full flex items-center justify-center text-white font-medium overflow-hidden border-2"
                  style={{
                    backgroundColor: level.image ? 'transparent' : level.color,
                    borderColor: level.color
                  }}
                >
                  {level.image ? (
                    <img
                      src={level.image}
                      alt={level.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    level.name.charAt(0)
                  )}
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">
                    {level.name}
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {level.maxPoints
                      ? LOYALTY_TEXTS.pointsRangeLabel.replace('{min}', level.minPoints).replace('{max}', level.maxPoints)
                      : LOYALTY_TEXTS.pointsRangeInfiniteLabel.replace('{min}', level.minPoints)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                {/* Beneficios resumidos */}
                <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <FiTrendingUp className="h-4 w-4" />
                    <span>{LOYALTY_TEXTS.multiplierLabel.replace('{value}', level.benefits.pointsMultiplier)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FiDollarSign className="h-4 w-4" />
                    <span>{LOYALTY_TEXTS.discountLabel.replace('{value}', level.benefits.discountPercentage)}</span>
                  </div>
                  {level.benefits.freeServicesPerMonth > 0 && (
                    <div className="flex items-center space-x-1">
                      <FiGift className="h-4 w-4" />
                      <span>{LOYALTY_TEXTS.freeServicesLabel.replace('{value}', level.benefits.freeServicesPerMonth)}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <FiUsers className="h-4 w-4" />
                    <span>{clientsByLevel[level.id]?.length || 0}</span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEdit(level)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Editar"
                  >
                    <FiEdit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(level.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Eliminar"
                  >
                    <FiTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Beneficios detallados para móvil */}
            <div className="md:hidden mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                <div>• {LOYALTY_TEXTS.multiplierLabel.replace('{value}', level.benefits.pointsMultiplier)}</div>
                <div>• {LOYALTY_TEXTS.discountLabel.replace('{value}', level.benefits.discountPercentage)}</div>
                {level.benefits.freeServicesPerMonth > 0 && (
                  <div>• {LOYALTY_TEXTS.freeServicesLabel.replace('{value}', level.benefits.freeServicesPerMonth)}</div>
                )}
                {level.benefits.priorityBooking && (
                  <div>• {LOYALTY_TEXTS.priorityBookingLabel}</div>
                )}
                <div>• {LOYALTY_TEXTS.clientsLabel.replace('{count}', clientsByLevel[level.id]?.length || 0)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LevelsDetailedList;
