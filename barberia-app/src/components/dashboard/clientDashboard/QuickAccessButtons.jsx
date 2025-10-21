import { FiUser, FiShoppingCart, FiGift, FiList } from 'react-icons/fi';
import { QUICK_ACCESS_CARDS } from '../../../constants/clientDashboard';

/**
 * Mapeo de iconos por nombre
 */
const ICON_MAP = {
  FiUser,
  FiShoppingCart,
  FiGift,
  FiList
};

/**
 * Botones de acceso rápido
 */
const QuickAccessButtons = ({ activeRewardsCount, onNavigate, onShowProfile }) => {
  const handleClick = (card) => {
    if (card.id === 'profile') {
      onShowProfile();
    } else {
      onNavigate(card.view);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {QUICK_ACCESS_CARDS.map((card) => {
        const Icon = ICON_MAP[card.icon];
        const subtitle = card.subtitle.replace('{count}', activeRewardsCount);

        return (
          <button
            key={card.id}
            onClick={() => handleClick(card)}
            className={`card hover:shadow-lg transition-all text-left group ${card.borderHover} relative`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-3 ${card.bgColor} rounded-full ${card.hoverBg} transition-colors`}>
                <Icon className={`h-6 w-6 ${card.iconColor}`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{card.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
              </div>
            </div>
            {card.showBadge && activeRewardsCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeRewardsCount}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default QuickAccessButtons;
