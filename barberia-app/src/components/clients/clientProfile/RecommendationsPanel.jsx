import { RECOMMENDATION_COLORS, CLIENT_PROFILE_TEXTS } from '../../../constants/clientProfile';

/**
 * Panel de recomendaciones personalizadas
 */
const RecommendationsPanel = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="card">
      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
        {CLIENT_PROFILE_TEXTS.recommendationsTitle}
      </h4>
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border-l-4 ${RECOMMENDATION_COLORS[rec.type] || RECOMMENDATION_COLORS.default}`}
          >
            <div className="font-medium text-gray-900 dark:text-white">
              {rec.title}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {rec.description}
            </div>
            {rec.discount && (
              <div className="text-sm font-medium text-green-600 mt-1">
                {rec.discount}% de descuento disponible
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsPanel;
