import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  FiMenu, 
  FiSearch, 
  FiBell, 
  FiSun, 
  FiMoon, 
  FiMapPin,
  FiChevronDown,
  FiX,
  FiClock,
  FiCalendar,
  FiUsers,
  FiFileText,
  FiAlertCircle,
  FiMonitor
} from 'react-icons/fi';
import { useAuthStore, useBranchStore, useClientStore, useAppointmentStore, useStaffStore } from '../../stores';
import BranchStatus from './BranchStatus';
import CountryFlag from './CountryFlag';
import DemoModeControl from './DemoModeControl';
import useTheme from '../../hooks/useTheme';

const Header = ({ onToggleSidebar }) => {
  const { user } = useAuthStore();
  const { branches, selectedBranch, setSelectedBranch } = useBranchStore();
  const { getClientsForWarning, sendCutoffWarning, updateClientWarningSettings } = useClientStore();
  const { appointments } = useAppointmentStore();
  const { barbers } = useStaffStore();
  const { getCountryByCode } = useBranchStore();
  const { themeMode, isDark, toggleTheme } = useTheme();
  const [showBranchSelector, setShowBranchSelector] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sending, setSending] = useState(false);
  const [notificationList, setNotificationList] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calcular notificaciones según el rol del usuario
  const getNotificationsByRole = useCallback(() => {
    if (!user?.role) return 0; // Guard clause
    
    const today = new Date().toISOString().split('T')[0];
    let count = 0;

    switch (user.role) {
      case 'super_admin':
        // Super Admin ve avisos de corte de clientes
        const clientsForWarning = getClientsForWarning();
        count += clientsForWarning.length;
        break;

      case 'branch_admin':
        // Citas del día
        const todayAppointments = appointments.filter(apt => 
          apt.date === today && apt.status === 'confirmed'
        );
        count += todayAppointments.length;

        // Barberos ausentes (simulado - barberos no presentes)
        const absentBarbers = barbers.filter(barber => 
          barber.status === 'active' && !barber.isPresent
        );
        count += absentBarbers.length;

        // Reportes pendientes (simulado)
        const isPendingReport = new Date().getDate() === 1; // Primer día del mes
        if (isPendingReport) count += 1;
        break;

      case 'reception':
        // Citas del día sin confirmar
        const unconfirmedAppointments = appointments.filter(apt => 
          apt.date === today && apt.status === 'pending'
        );
        count += unconfirmedAppointments.length;
        break;

      case 'barber':
        // Mis citas del día
        const myAppointments = appointments.filter(apt => 
          apt.date === today && apt.barberId === user.id
        );
        count += myAppointments.length;
        break;

      case 'client':
        // Próximas citas
        const upcomingAppointments = appointments.filter(apt => 
          new Date(apt.date) >= new Date() && apt.clientId === user.id
        );
        count += upcomingAppointments.length;
        break;

      default:
        count = 0;
    }

    return count;
  }, [user, getClientsForWarning, appointments, barbers]);

  // Generar lista detallada de notificaciones
  const getNotificationsList = useCallback(() => {
    if (!user?.role) return [];
    
    const today = new Date().toISOString().split('T')[0];
    const newNotifications = [];

    switch (user.role) {
      case 'super_admin':
        // Avisos de corte de clientes
        const clientsForWarning = getClientsForWarning();
        clientsForWarning.forEach(client => {
          const daysSinceLastVisit = Math.floor(
            (new Date() - new Date(client.lastVisit)) / (1000 * 60 * 60 * 24)
          );
          newNotifications.push({
            id: `client-${client.id}`,
            type: 'client_warning',
            icon: FiClock,
            title: client.name,
            subtitle: client.phone,
            description: `Última visita: ${new Date(client.lastVisit).toLocaleDateString()}`,
            badge: `${daysSinceLastVisit} días`,
            badgeColor: 'bg-yellow-100 text-yellow-800',
            data: client
          });
        });
        break;

      case 'branch_admin':
        // Citas del día confirmadas
        const todayAppointments = appointments.filter(apt => 
          apt.date === today && apt.status === 'confirmed'
        );
        if (todayAppointments.length > 0) {
          newNotifications.push({
            id: 'today-appointments',
            type: 'daily_appointments',
            icon: FiCalendar,
            title: 'Citas Confirmadas Hoy',
            subtitle: `${todayAppointments.length} cita${todayAppointments.length !== 1 ? 's' : ''} programada${todayAppointments.length !== 1 ? 's' : ''}`,
            description: 'Revisa la agenda del día',
            badge: todayAppointments.length.toString(),
            badgeColor: 'bg-primary-100 text-primary-800'
          });
        }

        // Barberos ausentes
        const absentBarbers = barbers.filter(barber => 
          barber.status === 'active' && !barber.isPresent
        );
        if (absentBarbers.length > 0) {
          newNotifications.push({
            id: 'absent-barbers',
            type: 'staff_absence',
            icon: FiUsers,
            title: 'Personal Ausente',
            subtitle: `${absentBarbers.length} barbero${absentBarbers.length !== 1 ? 's' : ''} no presente${absentBarbers.length !== 1 ? 's' : ''}`,
            description: absentBarbers.map(b => b.name).join(', '),
            badge: absentBarbers.length.toString(),
            badgeColor: 'bg-red-100 text-red-800'
          });
        }

        // Reporte mensual pendiente (simulado)
        const isPendingReport = new Date().getDate() === 1;
        if (isPendingReport) {
          newNotifications.push({
            id: 'monthly-report',
            type: 'pending_report',
            icon: FiFileText,
            title: 'Reporte Mensual Pendiente',
            subtitle: 'Generar reporte del mes anterior',
            description: 'Datos financieros y operacionales',
            badge: '1',
            badgeColor: 'bg-purple-100 text-purple-800'
          });
        }
        break;

      case 'reception':
        // Citas sin confirmar
        const unconfirmedAppointments = appointments.filter(apt => 
          apt.date === today && apt.status === 'pending'
        );
        if (unconfirmedAppointments.length > 0) {
          newNotifications.push({
            id: 'unconfirmed-appointments',
            type: 'pending_confirmations',
            icon: FiAlertCircle,
            title: 'Citas Sin Confirmar',
            subtitle: `${unconfirmedAppointments.length} cita${unconfirmedAppointments.length !== 1 ? 's' : ''} pendiente${unconfirmedAppointments.length !== 1 ? 's' : ''}`,
            description: 'Requieren confirmación del cliente',
            badge: unconfirmedAppointments.length.toString(),
            badgeColor: 'bg-orange-100 text-orange-800'
          });
        }
        break;

      case 'barber':
        // Mis citas del día
        const myAppointments = appointments.filter(apt => 
          apt.date === today && apt.barberId === user.id
        );
        if (myAppointments.length > 0) {
          newNotifications.push({
            id: 'my-appointments',
            type: 'barber_schedule',
            icon: FiCalendar,
            title: 'Mi Agenda de Hoy',
            subtitle: `${myAppointments.length} cita${myAppointments.length !== 1 ? 's' : ''} programada${myAppointments.length !== 1 ? 's' : ''}`,
            description: 'Revisa tu horario del día',
            badge: myAppointments.length.toString(),
            badgeColor: 'bg-green-100 text-green-800'
          });
        }
        break;

      case 'client':
        // Próximas citas
        const upcomingAppointments = appointments.filter(apt => 
          new Date(apt.date) >= new Date() && apt.clientId === user.id
        );
        if (upcomingAppointments.length > 0) {
          newNotifications.push({
            id: 'upcoming-appointments',
            type: 'client_appointments',
            icon: FiCalendar,
            title: 'Próximas Citas',
            subtitle: `${upcomingAppointments.length} cita${upcomingAppointments.length !== 1 ? 's' : ''} programada${upcomingAppointments.length !== 1 ? 's' : ''}`,
            description: 'No olvides tus citas',
            badge: upcomingAppointments.length.toString(),
            badgeColor: 'bg-primary-100 text-primary-800'
          });
        }
        break;
    }

    return newNotifications;
  }, [user, getClientsForWarning, appointments, barbers]);

  // Actualizar contador y lista de notificaciones
  useEffect(() => {
    const updateNotifications = () => {
      const count = getNotificationsByRole();
      const list = getNotificationsList();
      setNotifications(count);
      setNotificationList(list);
    };

    updateNotifications();
    const interval = setInterval(updateNotifications, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, [getNotificationsByRole, getNotificationsList]);

  // Click outside handler para cerrar dropdown
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

  // Función para obtener el icono correcto según el modo
  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light': return FiSun;
      case 'dark': return FiMoon;
      case 'auto': return FiMonitor;
      default: return FiSun;
    }
  };

  // Función para obtener el tooltip del tema
  const getThemeTooltip = () => {
    switch (themeMode) {
      case 'light': return 'Modo claro';
      case 'dark': return 'Modo oscuro';
      case 'auto': return 'Automático (sistema)';
      default: return 'Cambiar tema';
    }
  };

  const handleBranchChange = (branch) => {
    setSelectedBranch(branch);
    setShowBranchSelector(false);
  };

  const canManageMultipleBranches = user?.role === 'super_admin';

  // Handlers para acciones de notificaciones
  const handleNotificationAction = async (notification, actionType) => {
    switch (actionType) {
      case 'send':
        if (notification.type === 'client_warning') {
          setSending(true);
          const client = notification.data;
          const message = `Hola ${client.name}! Hemos notado que no nos has visitado en un tiempo. ¿Te gustaría agendar una cita? Estamos aquí para ayudarte con tu corte ideal. ¡Te esperamos! 💈`;
          
          try {
            const result = await sendCutoffWarning(client.id, message);
            if (result.success) {
              setNotificationList(prev => prev.filter(n => n.id !== notification.id));
              setNotifications(prev => Math.max(0, prev - 1));
            }
          } catch (error) {
            console.error('Error sending warning:', error);
          } finally {
            setSending(false);
          }
        }
        break;

      case 'snooze':
        if (notification.type === 'client_warning') {
          const client = notification.data;
          const newInterval = client.cutoffWarningInterval + 7;
          updateClientWarningSettings(client.id, newInterval, true);
          setNotificationList(prev => prev.filter(n => n.id !== notification.id));
          setNotifications(prev => Math.max(0, prev - 1));
        }
        break;

      case 'disable':
        if (notification.type === 'client_warning') {
          const client = notification.data;
          updateClientWarningSettings(client.id, 15, false);
          setNotificationList(prev => prev.filter(n => n.id !== notification.id));
          setNotifications(prev => Math.max(0, prev - 1));
        }
        break;

      default:
        console.log(`Action ${actionType} for ${notification.type}`);
    }
  };

  const getNotificationTitle = () => {
    switch (user?.role) {
      case 'super_admin': return 'Avisos de Corte';
      case 'branch_admin': return 'Notificaciones del Día';
      case 'reception': return 'Tareas Pendientes';
      case 'barber': return 'Mi Agenda';
      case 'client': return 'Mis Citas';
      default: return 'Notificaciones';
    }
  };

  return (
    <header className="bg-white dark:bg-black px-4 lg:px-6 py-2 elevation-4 relative z-20">
      
      <div className="relative flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors ripple"
          >
            <FiMenu className="h-6 w-6" />
          </button>

          {/* Branch Selector */}
          {canManageMultipleBranches && (
            <div className="relative">
              <button
                onClick={() => setShowBranchSelector(!showBranchSelector)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ripple"
              >
                <FiMapPin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <div className="flex flex-col items-start">
                  <div className="flex items-center space-x-2">
                    {selectedBranch && (
                      <CountryFlag countryCode={selectedBranch.country} size={16} />
                    )}
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {selectedBranch?.name || 'Todas las sedes'}
                    </span>
                  </div>
                  {selectedBranch && (
                    <BranchStatus branchId={selectedBranch.id} showText={true} className="text-xs" />
                  )}
                </div>
                <FiChevronDown className={`h-4 w-4 text-gray-600 dark:text-gray-400 transition-transform duration-300 ${showBranchSelector ? 'rotate-180' : ''}`} />
              </button>

              {showBranchSelector && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-950 rounded-lg elevation-8 z-50 overflow-hidden">
                  <div className="py-1">
                    {user?.role === 'super_admin' && (
                      <button
                        onClick={() => handleBranchChange(null)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-200 ripple"
                      >
                        <div className="flex items-center space-x-2">
                          <FiMapPin className="h-4 w-4" />
                          <span>Todas las sedes</span>
                        </div>
                      </button>
                    )}
                    {branches.map((branch, index) => (
                      <button
                        key={branch.id}
                        onClick={() => handleBranchChange(branch)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-200 ripple"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <FiMapPin className="h-4 w-4" />
                            <span>{branch.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <BranchStatus branchId={branch.id} showText={false} />
                            <CountryFlag countryCode={branch.country} size={16} />
                            <span className="text-xs text-gray-600 dark:text-gray-400">{branch.city}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Search Bar */}
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <FiSearch className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Center - Time Display */}
        <div className="hidden lg:flex items-center">
          <div className="text-center">
            <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              {currentTime.toLocaleDateString('es-ES', { weekday: 'long' })}
            </div>
            <div className="text-lg font-mono text-gray-900 dark:text-gray-100">
              {currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-3">
          {/* Mobile Search */}
          <button className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 transition-colors ripple">
            <FiSearch className="h-5 w-5" />
          </button>

          {/* Demo Mode Control - Solo para admin */}
          <DemoModeControl />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={getThemeTooltip()}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 transition-colors ripple relative group"
          >
            {(() => {
              const IconComponent = getThemeIcon();
              return <IconComponent className="h-5 w-5" />;
            })()}
            {/* Tooltip pequeño */}
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
              {getThemeTooltip()}
            </span>
          </button>

          {/* Notifications */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors ripple"
            >
              <FiBell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {notifications}
                </span>
              )}
            </button>

            {/* Dropdown de Notificaciones */}
            {showNotifications && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-96 bg-white dark:bg-gray-950 rounded-lg elevation-8 z-50 max-h-96 overflow-visible">
                {/* Header del dropdown */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FiBell className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {getNotificationTitle()}
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ripple p-1 rounded"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {notificationList.length} notificación{notificationList.length !== 1 ? 'es' : ''} pendiente{notificationList.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Lista de notificaciones */}
                <div className="max-h-80 overflow-y-auto overflow-x-visible">
                  {notificationList.length === 0 ? (
                    <div className="px-8 py-6 text-center">
                      <FiBell className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No hay notificaciones pendientes
                      </p>
                    </div>
                  ) : (
                    notificationList.map((notification) => {
                      const IconComponent = notification.icon;
                      
                      return (
                        <div key={notification.id} className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-start space-x-3">
                              <div className="p-2 bg-gray-100 dark:bg-gray-900 rounded">
                                <IconComponent className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {notification.subtitle}
                                </p>
                                {notification.description && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {notification.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded ${notification.badgeColor}`}>
                              {notification.badge}
                            </span>
                          </div>
                          
                          {/* Acciones para super_admin client warnings */}
                          {notification.type === 'client_warning' && (
                            <div className="flex space-x-2 mt-3">
                              <button
                                onClick={() => handleNotificationAction(notification, 'send')}
                                disabled={sending}
                                className="px-3 py-1 text-xs rounded bg-primary-600 hover:bg-primary-700 text-white transition-colors disabled:opacity-50 ripple"
                              >
                                Enviar
                              </button>
                              <button
                                onClick={() => handleNotificationAction(notification, 'snooze')}
                                className="px-3 py-1 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors ripple"
                              >
                                +7d
                              </button>
                              <button
                                onClick={() => handleNotificationAction(notification, 'disable')}
                                className="px-3 py-1 text-xs rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ripple"
                              >
                                Desactivar
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          {user && (
            <div className="flex items-center space-x-3 pl-3 border-l border-gray-200 dark:border-gray-700">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {user.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                  {user.role?.replace('_', ' ')}
                </p>
              </div>
              <div className="h-10 w-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden mt-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <FiSearch className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;