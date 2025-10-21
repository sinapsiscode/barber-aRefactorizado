import { useState, useEffect, useRef } from 'react';
import { FiMenu, FiSearch } from 'react-icons/fi';
import { useAuthStore } from '../../stores';
import { useHeaderNotifications } from '../../hooks/header/useHeaderNotifications';
import { useBranchSelector } from '../../hooks/header/useBranchSelector';
import { useHeaderClock } from '../../hooks/header/useHeaderClock';
import useTheme from '../../hooks/useTheme';
import DemoModeControl from './DemoModeControl';
import HeaderSearch from '../header/HeaderSearch';
import NotificationBell from '../header/NotificationBell';
import NotificationDropdown from '../header/NotificationDropdown';
import BranchSelectorDropdown from '../header/BranchSelectorDropdown';
import ThemeToggle from '../header/ThemeToggle';
import HeaderClock from '../header/HeaderClock';
import UserProfile from '../header/UserProfile';

/**
 * Header Refactorizado
 * Reducido de 642 líneas a ~130 líneas
 *
 * Funcionalidades:
 * - Búsqueda global
 * - Sistema de notificaciones por rol
 * - Selector de sucursales (super_admin)
 * - Toggle de tema (claro/oscuro/auto)
 * - Reloj en tiempo real
 * - Control de modo demo
 * - Perfil de usuario
 */
const Header = ({ onToggleSidebar }) => {
  const { user } = useAuthStore();
  const { themeMode, toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  // Hook de notificaciones
  const {
    notifications,
    notificationList,
    sending,
    handleNotificationAction
  } = useHeaderNotifications(user);

  // Hook de selector de sucursales
  const {
    branches,
    selectedBranch,
    showBranchSelector,
    canManageMultipleBranches,
    handleBranchChange,
    toggleBranchSelector
  } = useBranchSelector(user);

  // Hook de reloj
  const { currentTime } = useHeaderClock();

  // Click outside handler para cerrar dropdown de notificaciones
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showNotifications]);

  return (
    <header className="bg-white dark:bg-black px-4 lg:px-6 py-2 elevation-4 relative z-20">
      <div className="relative flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors ripple"
          >
            <FiMenu className="h-6 w-6" />
          </button>

          {/* Branch Selector - Only for Super Admin */}
          {canManageMultipleBranches && user?.role !== 'branch_admin' && (
            <BranchSelectorDropdown
              user={user}
              selectedBranch={selectedBranch}
              branches={branches}
              showDropdown={showBranchSelector}
              onToggle={toggleBranchSelector}
              onBranchChange={handleBranchChange}
            />
          )}

          {/* Desktop Search Bar */}
          <HeaderSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            className="hidden md:block w-80"
          />
        </div>

        {/* Center - Time Display */}
        <div className="hidden lg:flex items-center">
          <HeaderClock currentTime={currentTime} />
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-3">
          {/* Mobile Search Icon */}
          <button className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 transition-colors ripple">
            <FiSearch className="h-5 w-5" />
          </button>

          {/* Demo Mode Control */}
          <DemoModeControl />

          {/* Theme Toggle */}
          <ThemeToggle themeMode={themeMode} onToggle={toggleTheme} />

          {/* Notifications */}
          <div className="relative" ref={dropdownRef}>
            <NotificationBell
              notifications={notifications}
              onClick={() => setShowNotifications(!showNotifications)}
            />

            {showNotifications && (
              <NotificationDropdown
                user={user}
                notificationList={notificationList}
                sending={sending}
                onNotificationAction={handleNotificationAction}
                onClose={() => setShowNotifications(false)}
              />
            )}
          </div>

          {/* User Profile */}
          <UserProfile user={user} />
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden mt-4">
        <HeaderSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>
    </header>
  );
};

export default Header;
