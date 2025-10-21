import { FiGift, FiRefreshCw, FiSave, FiPlus, FiSettings, FiAward } from 'react-icons/fi';
import { LOYALTY_SECTIONS, LOYALTY_TEXTS } from '../../../constants/loyaltySettings';

/**
 * Header del panel de configuración de lealtad con tabs y botones de acción
 */
const LoyaltyHeader = ({
  activeSection,
  onSectionChange,
  hasChanges,
  saving,
  onSave,
  onReset,
  onNewLevel
}) => {
  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <FiGift className="h-5 w-5 text-purple-500 mr-2" />
            {LOYALTY_TEXTS.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {LOYALTY_TEXTS.subtitle}
          </p>
        </div>
        <div className="flex space-x-3">
          {hasChanges && activeSection === LOYALTY_SECTIONS.BASIC && (
            <button
              onClick={onReset}
              className="btn-secondary flex items-center text-sm px-3 py-2"
            >
              <FiRefreshCw className="h-4 w-4 mr-1" />
              {LOYALTY_TEXTS.undoButton}
            </button>
          )}
          {activeSection === LOYALTY_SECTIONS.BASIC && (
            <button
              onClick={onSave}
              disabled={saving || !hasChanges}
              className="btn-primary flex items-center text-sm px-3 py-2 disabled:opacity-50"
            >
              <FiSave className="h-4 w-4 mr-1" />
              {saving ? LOYALTY_TEXTS.savingButton : LOYALTY_TEXTS.saveButton}
            </button>
          )}
          {activeSection === LOYALTY_SECTIONS.LEVELS && (
            <button
              onClick={onNewLevel}
              className="btn-primary flex items-center text-sm px-3 py-2"
            >
              <FiPlus className="h-4 w-4 mr-1" />
              {LOYALTY_TEXTS.newLevelButton}
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => onSectionChange(LOYALTY_SECTIONS.BASIC)}
          className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeSection === LOYALTY_SECTIONS.BASIC
              ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <FiSettings className="h-4 w-4 mr-2" />
          {LOYALTY_TEXTS.basicConfigTab}
        </button>
        <button
          onClick={() => onSectionChange(LOYALTY_SECTIONS.LEVELS)}
          className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeSection === LOYALTY_SECTIONS.LEVELS
              ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <FiAward className="h-4 w-4 mr-2" />
          {LOYALTY_TEXTS.levelsTab}
        </button>
      </div>
    </div>
  );
};

export default LoyaltyHeader;
