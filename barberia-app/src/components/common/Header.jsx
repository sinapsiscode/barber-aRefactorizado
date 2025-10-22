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
const Header = ({ onToggleSidebar, onPageChange }) => {
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
    <header className="bg-white dark:bg-black px-3 sm:px-4 lg:px-6 py-2 sm:py-3 elevation-4 relative z-20">
      <div className="relative flex items-center justify-between gap-2 sm:gap-3">
        {/* Left Side */}
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-1 min-w-0">
          {/* Mobile Menu Toggle - always visible on mobile */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors ripple flex-shrink-0"
          >
            <FiMenu className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Branch Selector - Only for Super Admin - hide on very small screens */}
          {canManageMultipleBranches && user?.role !== 'branch_admin' && (
            <div className="hidden sm:block flex-shrink-0">
              <BranchSelectorDropdown
                user={user}
                selectedBranch={selectedBranch}
                branches={branches}
                showDropdown={showBranchSelector}
                onToggle={toggleBranchSelector}
                onBranchChange={handleBranchChange}
              />
            </div>
          )}

          {/* Desktop Search Bar - progressively show larger */}
          <HeaderSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            className="hidden md:block md:w-64 lg:w-80 flex-shrink min-w-0"
          />
        </div>

        {/* Center - Time Display - hide on smaller screens */}
        <div className="hidden xl:flex items-center flex-shrink-0">
          <HeaderClock currentTime={currentTime} />
        </div>

        {/* Right Side - responsive spacing */}
        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 flex-shrink-0">
          {/* Mobile Search Icon */}
          <button className="md:hidden p-1.5 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 transition-colors ripple flex-shrink-0">
            <FiSearch className="h-5 w-5" />
          </button>

          {/* Demo Mode Control - hide on very small screens */}
          <div className="hidden sm:block flex-shrink-0">
            <DemoModeControl />
          </div>

          {/* Theme Toggle - smaller on mobile */}
          <div className="flex-shrink-0">
            <ThemeToggle themeMode={themeMode} onToggle={toggleTheme} />
          </div>

          {/* Notifications */}
          <div className="relative flex-shrink-0" ref={dropdownRef}>
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

          {/* User Profile - hide on very small screens */}
          <div className="hidden sm:block flex-shrink-0">
            <UserProfile user={user} onPageChange={onPageChange} />
          </div>
        </div>
      </div>

      {/* Mobile Search Bar - better spacing */}
      <div className="md:hidden mt-3 sm:mt-4">
        <HeaderSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>
    </header>
  );
};

export default Header;
