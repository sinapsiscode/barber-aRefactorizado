import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';
import { THEME_TOOLTIPS } from '../../constants/header';

/**
 * Botón de cambio de tema con tooltip
 */
const ThemeToggle = ({ themeMode, onToggle }) => {
  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light': return FiSun;
      case 'dark': return FiMoon;
      case 'auto': return FiMonitor;
      default: return FiSun;
    }
  };

  const getThemeTooltip = () => {
    return THEME_TOOLTIPS[themeMode] || 'Cambiar tema';
  };

  const IconComponent = getThemeIcon();

  return (
    <button
      onClick={onToggle}
      title={getThemeTooltip()}
      className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 transition-colors ripple relative group"
    >
      <IconComponent className="h-5 w-5" />
      {/* Tooltip pequeño */}
      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
        {getThemeTooltip()}
      </span>
    </button>
  );
};

export default ThemeToggle;
