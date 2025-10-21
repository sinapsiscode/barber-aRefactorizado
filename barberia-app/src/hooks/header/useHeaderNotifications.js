import { useState, useEffect, useCallback } from 'react';
import { FiClock, FiCalendar, FiUsers, FiFileText, FiAlertCircle } from 'react-icons/fi';
import { useClientStore, useAppointmentStore, useStaffStore } from '../../stores';
import { NOTIFICATION_TYPES, BADGE_COLORS, CLIENT_WARNING_MESSAGE, NOTIFICATION_UPDATE_INTERVAL } from '../../constants/header';

/**
 * Hook para manejar el sistema de notificaciones del header
 * Calcula y genera notificaciones basadas en el rol del usuario
 */
export const useHeaderNotifications = (user) => {
  const { getClientsForWarning, sendCutoffWarning, updateClientWarningSettings } = useClientStore();
  const { appointments } = useAppointmentStore();
  const { barbers } = useStaffStore();

  const [notifications, setNotifications] = useState(0);
  const [notificationList, setNotificationList] = useState([]);
  const [sending, setSending] = useState(false);

  /**
   * Calcula el número de notificaciones según el rol
   */
  const getNotificationsByRole = useCallback(() => {
    if (!user?.role) return 0;

    const today = new Date().toISOString().split('T')[0];
    let count = 0;

    switch (user.role) {
      case 'super_admin':
        const clientsForWarning = getClientsForWarning();
        count += clientsForWarning.length;
        break;

      case 'branch_admin':
        const todayAppointments = appointments.filter(apt =>
          apt.date === today && apt.status === 'confirmed'
        );
        count += todayAppointments.length;

        const absentBarbers = barbers.filter(barber =>
          barber.status === 'active' && !barber.isPresent
        );
        count += absentBarbers.length;

        const isPendingReport = new Date().getDate() === 1;
        if (isPendingReport) count += 1;
        break;

      case 'reception':
        const unconfirmedAppointments = appointments.filter(apt =>
          apt.date === today && apt.status === 'pending'
        );
        count += unconfirmedAppointments.length;
        break;

      case 'barber':
        const myAppointments = appointments.filter(apt =>
          apt.date === today && apt.barberId === user.id
        );
        count += myAppointments.length;
        break;

      case 'client':
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

  /**
   * Genera la lista detallada de notificaciones según el rol
   */
  const getNotificationsList = useCallback(() => {
    if (!user?.role) return [];

    const today = new Date().toISOString().split('T')[0];
    const newNotifications = [];

    switch (user.role) {
      case 'super_admin':
        const clientsForWarning = getClientsForWarning();
        clientsForWarning.forEach(client => {
          const daysSinceLastVisit = Math.floor(
            (new Date() - new Date(client.lastVisit)) / (1000 * 60 * 60 * 24)
          );
          newNotifications.push({
            id: `client-${client.id}`,
            type: NOTIFICATION_TYPES.CLIENT_WARNING,
            icon: FiClock,
            title: client.name,
            subtitle: client.phone,
            description: `Última visita: ${new Date(client.lastVisit).toLocaleDateString()}`,
            badge: `${daysSinceLastVisit} días`,
            badgeColor: BADGE_COLORS.yellow,
            data: client
          });
        });
        break;

      case 'branch_admin':
        const todayAppointments = appointments.filter(apt =>
          apt.date === today && apt.status === 'confirmed'
        );
        if (todayAppointments.length > 0) {
          newNotifications.push({
            id: 'today-appointments',
            type: NOTIFICATION_TYPES.DAILY_APPOINTMENTS,
            icon: FiCalendar,
            title: 'Citas Confirmadas Hoy',
            subtitle: `${todayAppointments.length} cita${todayAppointments.length !== 1 ? 's' : ''} programada${todayAppointments.length !== 1 ? 's' : ''}`,
            description: 'Revisa la agenda del día',
            badge: todayAppointments.length.toString(),
            badgeColor: BADGE_COLORS.primary
          });
        }

        const absentBarbers = barbers.filter(barber =>
          barber.status === 'active' && !barber.isPresent
        );
        if (absentBarbers.length > 0) {
          newNotifications.push({
            id: 'absent-barbers',
            type: NOTIFICATION_TYPES.STAFF_ABSENCE,
            icon: FiUsers,
            title: 'Personal Ausente',
            subtitle: `${absentBarbers.length} barbero${absentBarbers.length !== 1 ? 's' : ''} no presente${absentBarbers.length !== 1 ? 's' : ''}`,
            description: absentBarbers.map(b => b.name).join(', '),
            badge: absentBarbers.length.toString(),
            badgeColor: BADGE_COLORS.red
          });
        }

        const isPendingReport = new Date().getDate() === 1;
        if (isPendingReport) {
          newNotifications.push({
            id: 'monthly-report',
            type: NOTIFICATION_TYPES.PENDING_REPORT,
            icon: FiFileText,
            title: 'Reporte Mensual Pendiente',
            subtitle: 'Generar reporte del mes anterior',
            description: 'Datos financieros y operacionales',
            badge: '1',
            badgeColor: BADGE_COLORS.purple
          });
        }
        break;

      case 'reception':
        const unconfirmedAppointments = appointments.filter(apt =>
          apt.date === today && apt.status === 'pending'
        );
        if (unconfirmedAppointments.length > 0) {
          newNotifications.push({
            id: 'unconfirmed-appointments',
            type: NOTIFICATION_TYPES.PENDING_CONFIRMATIONS,
            icon: FiAlertCircle,
            title: 'Citas Sin Confirmar',
            subtitle: `${unconfirmedAppointments.length} cita${unconfirmedAppointments.length !== 1 ? 's' : ''} pendiente${unconfirmedAppointments.length !== 1 ? 's' : ''}`,
            description: 'Requieren confirmación del cliente',
            badge: unconfirmedAppointments.length.toString(),
            badgeColor: BADGE_COLORS.orange
          });
        }
        break;

      case 'barber':
        const myAppointments = appointments.filter(apt =>
          apt.date === today && apt.barberId === user.id
        );
        if (myAppointments.length > 0) {
          newNotifications.push({
            id: 'my-appointments',
            type: NOTIFICATION_TYPES.BARBER_SCHEDULE,
            icon: FiCalendar,
            title: 'Mi Agenda de Hoy',
            subtitle: `${myAppointments.length} cita${myAppointments.length !== 1 ? 's' : ''} programada${myAppointments.length !== 1 ? 's' : ''}`,
            description: 'Revisa tu horario del día',
            badge: myAppointments.length.toString(),
            badgeColor: BADGE_COLORS.green
          });
        }
        break;

      case 'client':
        const upcomingAppointments = appointments.filter(apt =>
          new Date(apt.date) >= new Date() && apt.clientId === user.id
        );
        if (upcomingAppointments.length > 0) {
          newNotifications.push({
            id: 'upcoming-appointments',
            type: NOTIFICATION_TYPES.CLIENT_APPOINTMENTS,
            icon: FiCalendar,
            title: 'Próximas Citas',
            subtitle: `${upcomingAppointments.length} cita${upcomingAppointments.length !== 1 ? 's' : ''} programada${upcomingAppointments.length !== 1 ? 's' : ''}`,
            description: 'No olvides tus citas',
            badge: upcomingAppointments.length.toString(),
            badgeColor: BADGE_COLORS.primary
          });
        }
        break;
    }

    return newNotifications;
  }, [user, getClientsForWarning, appointments, barbers]);

  /**
   * Maneja las acciones sobre notificaciones
   */
  const handleNotificationAction = useCallback(async (notification, actionType) => {
    switch (actionType) {
      case 'send':
        if (notification.type === NOTIFICATION_TYPES.CLIENT_WARNING) {
          setSending(true);
          const client = notification.data;
          const message = CLIENT_WARNING_MESSAGE(client.name);

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
        if (notification.type === NOTIFICATION_TYPES.CLIENT_WARNING) {
          const client = notification.data;
          const newInterval = client.cutoffWarningInterval + 7;
          updateClientWarningSettings(client.id, newInterval, true);
          setNotificationList(prev => prev.filter(n => n.id !== notification.id));
          setNotifications(prev => Math.max(0, prev - 1));
        }
        break;

      case 'disable':
        if (notification.type === NOTIFICATION_TYPES.CLIENT_WARNING) {
          const client = notification.data;
          updateClientWarningSettings(client.id, 15, false);
          setNotificationList(prev => prev.filter(n => n.id !== notification.id));
          setNotifications(prev => Math.max(0, prev - 1));
        }
        break;

      default:
        console.log(`Action ${actionType} for ${notification.type}`);
    }
  }, [sendCutoffWarning, updateClientWarningSettings]);

  /**
   * Actualiza notificaciones periódicamente
   */
  useEffect(() => {
    const updateNotifications = () => {
      const count = getNotificationsByRole();
      const list = getNotificationsList();
      setNotifications(count);
      setNotificationList(list);
    };

    updateNotifications();
    const interval = setInterval(updateNotifications, NOTIFICATION_UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [getNotificationsByRole, getNotificationsList]);

  return {
    notifications,
    notificationList,
    sending,
    handleNotificationAction
  };
};
