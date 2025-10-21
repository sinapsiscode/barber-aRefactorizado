import { FiDollarSign, FiGift, FiCalendar } from 'react-icons/fi';
import { VALIDATION_RULES, LOYALTY_TEXTS } from '../../../../constants/loyaltySettings';

/**
 * Card de configuración principal de puntos
 */
const PointsConfig = ({ formData, onChange }) => {
  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h4 className="font-medium text-gray-900 dark:text-white">{LOYALTY_TEXTS.pointsConfigTitle}</h4>
      </div>
      <div className="p-4 space-y-6">
        {/* Conversión de Soles a Puntos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FiDollarSign className="inline h-4 w-4 mr-1" />
              {LOYALTY_TEXTS.solesPerPointLabel}
            </label>
            <div className="relative">
              <input
                type="number"
                min={VALIDATION_RULES.pointsPerSol.min}
                step={VALIDATION_RULES.pointsPerSol.step}
                value={formData.pointsPerSol}
                onChange={(e) => onChange('pointsPerSol', parseFloat(e.target.value) || 1)}
                className="input-field pr-12"
                placeholder="1.0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                S/
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {LOYALTY_TEXTS.solesPerPointHelper.replace('{value}', formData.pointsPerSol)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FiGift className="inline h-4 w-4 mr-1" />
              {LOYALTY_TEXTS.minimumPointsLabel}
            </label>
            <input
              type="number"
              min={VALIDATION_RULES.minimumPointsToRedeem.min}
              value={formData.minimumPointsToRedeem}
              onChange={(e) => onChange('minimumPointsToRedeem', parseInt(e.target.value) || 50)}
              className="input-field"
              placeholder="50"
            />
            <p className="text-xs text-gray-500 mt-1">
              {LOYALTY_TEXTS.minimumPointsHelper}
            </p>
          </div>
        </div>

        {/* Configuración de Expiración */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <FiCalendar className="inline h-4 w-4 mr-1" />
            {LOYALTY_TEXTS.expiryLabel}
          </label>
          <div className="relative">
            <input
              type="number"
              min={VALIDATION_RULES.pointsExpiryDays.min}
              max={VALIDATION_RULES.pointsExpiryDays.max}
              value={formData.pointsExpiryDays}
              onChange={(e) => onChange('pointsExpiryDays', parseInt(e.target.value) || 365)}
              className="input-field pr-16"
              placeholder="365"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              días
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {LOYALTY_TEXTS.expiryHelper.replace('{value}', formData.pointsExpiryDays)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PointsConfig;
