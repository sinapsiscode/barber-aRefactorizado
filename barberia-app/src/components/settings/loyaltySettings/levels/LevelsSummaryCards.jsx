import { LOYALTY_TEXTS } from '../../../../constants/loyaltySettings';

/**
 * Cards de resumen de niveles (vista compacta)
 */
const LevelsSummaryCards = ({ loyaltyLevels, clientsByLevel }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {loyaltyLevels.map((level) => (
        <div key={level.id} className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center overflow-hidden border-2"
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
                <span className="text-xs text-white font-bold">{level.name.charAt(0)}</span>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {LOYALTY_TEXTS.clientsLabel.replace('{count}', clientsByLevel[level.id]?.length || 0)}
            </span>
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            {level.name}
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            {level.maxPoints
              ? LOYALTY_TEXTS.pointsRangeLabel.replace('{min}', level.minPoints).replace('{max}', level.maxPoints)
              : LOYALTY_TEXTS.pointsRangeInfiniteLabel.replace('{min}', level.minPoints)}
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>• {LOYALTY_TEXTS.discountLabel.replace('{value}', level.benefits.discountPercentage)}</div>
            <div>• {LOYALTY_TEXTS.multiplierLabel.replace('{value}', level.benefits.pointsMultiplier)}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LevelsSummaryCards;
