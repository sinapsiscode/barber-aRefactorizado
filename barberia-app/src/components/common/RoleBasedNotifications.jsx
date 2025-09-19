import { useState, useEffect } from 'react';
import { FiBell, FiX, FiSend, FiClock, FiCalendar, FiUsers, FiFileText, FiAlertCircle, FiCheck } from 'react-icons/fi';
import { useAuthStore, useClientStore, useAppointmentStore, useStaffStore } from '../../stores';

const RoleBasedNotifications = ({ forceShow = false, onVisibilityChange }) => {
  const { user } = useAuthStore();
  const { getClientsForWarning, sendCutoffWarning, updateClientWarningSettings } = useClientStore();
  const { appointments } = useAppointmentStore();
  const { barbers } = useStaffStore();
  
  const [notifications, setNotifications] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [sending, setSending] = useState(false);

  // Generar notificaciones según el rol
  const generateNotificationsByRole = () => {
    const today = new Date().toISOString().split('T')[0];
    const newNotifications = [];

    switch (user?.role) {
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
            data: client,
            actions: [
              { label: 'Enviar', action: 'send', color: 'bg-yellow-500 hover:bg-yellow-600' },
              { label: '+7d', action: 'snooze', color: 'hover:bg-gray-100' },
              { label: 'Desactivar', action: 'disable', color: 'text-red-600 hover:bg-red-50' }
            ]
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
            badgeColor: 'bg-blue-100 text-blue-800',
            actions: [
              { label: 'Ver Agenda', action: 'view_schedule', color: 'bg-blue-500 hover:bg-blue-600' }
            ]
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
            badgeColor: 'bg-red-100 text-red-800',
            actions: [
              { label: 'Ver Personal', action: 'view_staff', color: 'bg-red-500 hover:bg-red-600' }
            ]
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
            badgeColor: 'bg-purple-100 text-purple-800',
            actions: [
              { label: 'Generar', action: 'generate_report', color: 'bg-purple-500 hover:bg-purple-600' }
            ]
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
            badgeColor: 'bg-orange-100 text-orange-800',
            actions: [
              { label: 'Confirmar', action: 'confirm_appointments', color: 'bg-orange-500 hover:bg-orange-600' }
            ]
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
            badgeColor: 'bg-green-100 text-green-800',
            actions: [
              { label: 'Ver Agenda', action: 'view_my_schedule', color: 'bg-green-500 hover:bg-green-600' }
            ]
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
            badgeColor: 'bg-blue-100 text-blue-800',
            actions: [
              { label: 'Ver Citas', action: 'view_appointments', color: 'bg-blue-500 hover:bg-blue-600' }
            ]
          });
        }
        break;
    }

    return newNotifications;
  };

  useEffect(() => {
    const updateNotifications = () => {
      const newNotifications = generateNotificationsByRole();
      setNotifications(newNotifications);
      
      if (newNotifications.length > 0 && !forceShow) {
        setIsVisible(true);
      }
    };

    updateNotifications();
    const interval = setInterval(updateNotifications, 60000);

    return () => clearInterval(interval);
  }, [user, forceShow, appointments, barbers]);

  // Control manual desde Header
  useEffect(() => {
    if (forceShow) {
      setIsVisible(true);
    }
  }, [forceShow]);

  // Notificar cambios de visibilidad al componente padre
  useEffect(() => {
    if (onVisibilityChange) {
      onVisibilityChange(isVisible);
    }
  }, [isVisible, onVisibilityChange]);

  // Handlers para acciones
  const handleAction = async (notification, actionType) => {
    switch (actionType) {
      case 'send':
        if (notification.type === 'client_warning') {
          setSending(true);
          const client = notification.data;
          const message = `Hola ${client.name}! Hemos notado que no nos has visitado en un tiempo. ¿Te gustaría agendar una cita? Estamos aquí para ayudarte con tu corte ideal. ¡Te esperamos! 💈`;
          
          try {
            const result = await sendCutoffWarning(client.id, message);
            if (result.success) {
              setNotifications(prev => prev.filter(n => n.id !== notification.id));
              if (notifications.length === 1) {
                setIsVisible(false);
              }
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
          setNotifications(prev => prev.filter(n => n.id !== notification.id));
          if (notifications.length === 1) {
            setIsVisible(false);
          }
        }
        break;

      case 'disable':
        if (notification.type === 'client_warning') {
          const client = notification.data;
          updateClientWarningSettings(client.id, 15, false);
          setNotifications(prev => prev.filter(n => n.id !== notification.id));
          if (notifications.length === 1) {
            setIsVisible(false);
          }
        }
        break;

      default:
        console.log(`Action ${actionType} for ${notification.type}`);
    }
  };

  if (!isVisible || notifications.length === 0) {
    return null;
  }

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
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-[#D4AF37]/20 dark:border-dark-700">
        <div className="p-4 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FiBell className="h-5 w-5 text-[#D4AF37]" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {getNotificationTitle()}
              </h3>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {notifications.length} notificación{notifications.length !== 1 ? 'es' : ''} pendiente{notifications.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((notification) => {
            const IconComponent = notification.icon;
            
            return (
              <div key={notification.id} className="p-4 border-b border-gray-100 dark:border-dark-700 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-gray-100 dark:bg-dark-700 rounded-lg">
                      <IconComponent className="h-4 w-4 text-[#D4AF37]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
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
                
                {notification.actions && (
                  <div className="flex space-x-2 mt-3">
                    {notification.actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleAction(notification, action.action)}
                        disabled={sending}
                        className={`px-3 py-1 text-xs rounded transition-colors disabled:opacity-50 ${
                          action.color.includes('bg-') 
                            ? `${action.color} text-white`
                            : `${action.color} text-gray-600 dark:text-gray-300`
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-b-lg">
          <div className="flex justify-between">
            <button
              onClick={() => setIsVisible(false)}
              className="text-xs text-gray-500 dark:text-gray-400 hover:underline"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleBasedNotifications;