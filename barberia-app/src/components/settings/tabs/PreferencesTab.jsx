import { FiSun, FiMoon, FiMonitor, FiGlobe, FiClock } from 'react-icons/fi';
import { SETTINGS_TEXTS, THEME_MODES, LANGUAGES, TIMEZONES } from '../../../constants/settingsPage';
import { getThemeModeText } from '../../../utils/settingsHelpers';

const PreferencesTab = ({
  themeMode,
  isDark,
  onThemeChange
}) => {
  return (
    <div className="space-y-6">
      <AppearanceSection
        themeMode={themeMode}
        isDark={isDark}
        onThemeChange={onThemeChange}
      />
      <LanguageSection />
      <TimezoneSection />
    </div>
  );
};

const AppearanceSection = ({ themeMode, isDark, onThemeChange }) => (
  <div className="bg-white dark:bg-dark-800 rounded-lg p-6">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      {SETTINGS_TEXTS.APPEARANCE}
    </h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6">
      {SETTINGS_TEXTS.APPEARANCE_DESCRIPTION}
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <ThemeOption
        mode={THEME_MODES.LIGHT}
        icon={FiSun}
        label={SETTINGS_TEXTS.LIGHT_THEME}
        isActive={themeMode === THEME_MODES.LIGHT}
        onClick={onThemeChange}
      />
      <ThemeOption
        mode={THEME_MODES.DARK}
        icon={FiMoon}
        label={SETTINGS_TEXTS.DARK_THEME}
        isActive={themeMode === THEME_MODES.DARK}
        onClick={onThemeChange}
      />
      <ThemeOption
        mode={THEME_MODES.AUTO}
        icon={FiMonitor}
        label={SETTINGS_TEXTS.AUTO_THEME}
        isActive={themeMode === THEME_MODES.AUTO}
        onClick={onThemeChange}
      />
    </div>

    {themeMode === THEME_MODES.AUTO && (
      <AutoModeInfo isDark={isDark} />
    )}
  </div>
);

const ThemeOption = ({ mode, icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={() => onClick(mode)}
    className={`p-4 rounded-lg border-2 transition-all ${
      isActive
        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
    }`}
  >
    <Icon className={`h-8 w-8 mx-auto mb-2 ${
      isActive ? 'text-primary-600' : 'text-gray-600 dark:text-gray-400'
    }`} />
    <span className={`text-sm font-medium ${
      isActive
        ? 'text-primary-700 dark:text-primary-300'
        : 'text-gray-700 dark:text-gray-300'
    }`}>
      {label}
    </span>
  </button>
);

const AutoModeInfo = ({ isDark }) => (
  <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
      {SETTINGS_TEXTS.AUTO_MODE_ACTIVE}
    </h4>
    <p className="text-sm text-blue-600 dark:text-blue-300 mb-2">
      {SETTINGS_TEXTS.AUTO_MODE_DESCRIPTION}
    </p>
    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
      {SETTINGS_TEXTS.CURRENT_THEME} {getThemeModeText(isDark ? 'dark' : 'light')}
    </p>
  </div>
);

const LanguageSection = () => (
  <div className="bg-white dark:bg-dark-800 rounded-lg p-6">
    <div className="flex items-center mb-4">
      <FiGlobe className="h-6 w-6 text-primary-600 mr-3" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {SETTINGS_TEXTS.LANGUAGE}
      </h3>
    </div>

    <div className="space-y-2">
      <LanguageOption
        value={LANGUAGES.ES}
        label={SETTINGS_TEXTS.SPANISH}
        isSelected={true}
      />
      <LanguageOption
        value={LANGUAGES.EN}
        label={SETTINGS_TEXTS.ENGLISH}
        isSelected={false}
      />
    </div>
  </div>
);

const TimezoneSection = () => (
  <div className="bg-white dark:bg-dark-800 rounded-lg p-6">
    <div className="flex items-center mb-4">
      <FiClock className="h-6 w-6 text-primary-600 mr-3" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {SETTINGS_TEXTS.TIMEZONE}
      </h3>
    </div>

    <div className="space-y-2">
      <TimezoneOption
        value={TIMEZONES.LIMA}
        label={SETTINGS_TEXTS.LIMA_TIMEZONE}
        isSelected={true}
      />
      <TimezoneOption
        value={TIMEZONES.BOGOTA}
        label={SETTINGS_TEXTS.BOGOTA_TIMEZONE}
        isSelected={false}
      />
    </div>
  </div>
);

const LanguageOption = ({ value, label, isSelected }) => (
  <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer">
    <input
      type="radio"
      name="language"
      value={value}
      checked={isSelected}
      className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
    />
    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </span>
  </label>
);

const TimezoneOption = ({ value, label, isSelected }) => (
  <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer">
    <input
      type="radio"
      name="timezone"
      value={value}
      checked={isSelected}
      className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
    />
    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </span>
  </label>
);

export default PreferencesTab;