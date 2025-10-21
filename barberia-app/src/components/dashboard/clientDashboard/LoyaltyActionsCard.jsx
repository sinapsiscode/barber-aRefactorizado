import { FiShoppingCart, FiList, FiGift } from 'react-icons/fi';
import { LOYALTY_ACTIONS } from '../../../constants/clientDashboard';

/**
 * Mapeo de iconos por nombre
 */
const ICON_MAP = {
  FiShoppingCart,
  FiList,
  FiGift
};

/**
 * Card de acciones rápidas de lealtad
 */
const LoyaltyActionsCard = ({ currentPoints, activeRewardsCount, onNavigate }) => {
  // Filtrar acciones según condiciones
  const visibleActions = LOYALTY_ACTIONS.filter(action => {
    if (action.condition === 'hasActiveRewards') {
      return activeRewardsCount > 0;
    }
    return true;
  });

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Acciones Rápidas
      </h3>
      <div className="space-y-3">
        {visibleActions.map((action) => {
          const Icon = ICON_MAP[action.icon];
          const subtitle = action.subtitle
            .replace('{points}', currentPoints)
            .replace('{count}', activeRewardsCount);

          return (
            <button
              key={action.id}
              onClick={() => onNavigate(action.view)}
              className={`w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 ${action.borderHover} transition-colors bg-gradient-to-r ${action.bgGradient}`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`h-5 w-5 ${action.iconColor}`} />
                <div className="text-left">
                  <div className="font-medium text-gray-900">{action.title}</div>
                  <div className="text-sm text-gray-600">{subtitle}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {action.showBadge && activeRewardsCount > 0 && (
                  <span className="bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {activeRewardsCount}
                  </span>
                )}
                <div className={action.textColor}>{action.arrow}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LoyaltyActionsCard;
