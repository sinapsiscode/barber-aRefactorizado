import { LOYALTY_TEXTS } from '../../../../constants/loyaltySettings';

/**
 * Card de estado del sistema (on/off toggle)
 */
const SystemStatus = ({ enabled, onToggle }) => {
  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h4 className="font-medium text-gray-900 dark:text-white">{LOYALTY_TEXTS.systemStatusTitle}</h4>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="font-medium text-gray-900 dark:text-white">
              {LOYALTY_TEXTS.systemStatusLabel}
            </h5>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {enabled ? LOYALTY_TEXTS.systemEnabledText : LOYALTY_TEXTS.systemDisabledText}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => onToggle('enabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
