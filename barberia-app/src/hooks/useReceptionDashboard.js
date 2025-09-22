// ===================================================================
// 🏢 HOOK DE DASHBOARD DE RECEPCIÓN - REFACTORIZADO
// ===================================================================
// Hook específico para dashboard de recepción
import { useState, useMemo } from 'react';
import {
  FiCalendar,
  FiDollarSign,
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiUserPlus,
  FiCreditCard,
  FiPlus
} from 'react-icons/fi';
import {
  DASHBOARD_LABELS,
  DASHBOARD_METRICS,
  METRIC_COLORS,
  QUICK_ACTIONS,
  APPOINTMENT_STYLES
} from '../constants';
import { useDashboard } from './useDashboard';

export const useReceptionDashboard = () => {
  const { loading, lastUpdated, error, refresh } = useDashboard('reception');

  // Mock data - en producción vendría de stores
  const mockData = {
    appointmentsToday: 15,
    paymentsProcessed: 1250,
    clientsAttended: 12,
    averageWaitTime: 8
  };

  // Configuración del dashboard
  const dashboardConfig = {
    title: DASHBOARD_LABELS.RECEPTION.TITLE,
    subtitle: DASHBOARD_LABELS.RECEPTION.SUBTITLE,
    gradient: DASHBOARD_LABELS.RECEPTION.GRADIENT
  };

  // Métricas principales
  const metrics = useMemo(() => [
    {
      title: DASHBOARD_METRICS.APPOINTMENTS.TODAY,
      value: mockData.appointmentsToday,
      icon: FiCalendar,
      color: METRIC_COLORS.APPOINTMENTS.icon,
      trend: 'up',
      trendValue: '+12%'
    },
    {
      title: DASHBOARD_METRICS.PAYMENTS.PROCESSED,
      value: `S/${mockData.paymentsProcessed.toLocaleString()}`,
      icon: FiDollarSign,
      color: METRIC_COLORS.PAYMENTS.icon,
      trend: 'up',
      trendValue: '+8%'
    },
    {
      title: DASHBOARD_METRICS.CLIENTS.ATTENDED,
      value: mockData.clientsAttended,
      icon: FiUsers,
      color: METRIC_COLORS.CLIENTS.icon,
      trend: 'up',
      trendValue: '+5%'
    },
    {
      title: 'Tiempo Promedio Espera',
      value: `${mockData.averageWaitTime} min`,
      icon: FiClock,
      color: METRIC_COLORS.PERFORMANCE.icon,
      trend: 'down',
      trendValue: '-2 min'
    }
  ], [mockData]);

  // Acciones rápidas
  const quickActions = QUICK_ACTIONS.RECEPTION;

  // Actividad reciente
  const recentActivity = useMemo(() => [
    {
      title: 'Nueva cita creada',
      description: 'Juan Pérez - Corte + Barba - 15:30',
      timestamp: new Date(Date.now() - 300000), // 5 min ago
      icon: FiCalendar,
      iconColor: 'bg-blue-500',
      status: 'success',
      statusText: 'Confirmada'
    },
    {
      title: 'Pago procesado',
      description: 'María García - S/45.00',
      timestamp: new Date(Date.now() - 600000), // 10 min ago
      icon: FiCreditCard,
      iconColor: 'bg-green-500',
      status: 'success',
      statusText: 'Completado'
    },
    {
      title: 'Check-in realizado',
      description: 'Carlos López ha llegado',
      timestamp: new Date(Date.now() - 900000), // 15 min ago
      icon: FiCheckCircle,
      iconColor: 'bg-orange-500',
      status: 'success',
      statusText: 'En espera'
    },
    {
      title: 'Cliente nuevo registrado',
      description: 'Ana Martínez - Primera visita',
      timestamp: new Date(Date.now() - 1200000), // 20 min ago
      icon: FiUserPlus,
      iconColor: 'bg-purple-500',
      status: 'success',
      statusText: 'Activo'
    }
  ], []);

  // Handlers para acciones
  const handleQuickAction = (action, actionData) => {
    console.log(`Acción de recepción: ${action}`, actionData);

    switch (action) {
      case 'newAppointment':
        // Lógica para nueva cita
        break;
      case 'processPayment':
        // Lógica para procesar pago
        break;
      case 'newClient':
        // Lógica para nuevo cliente
        break;
      case 'checkIn':
        // Lógica para check-in
        break;
      default:
        console.log('Acción no reconocida:', action);
    }
  };

  const handleMetricClick = (metric) => {
    console.log('Métrica clickeada:', metric);
    // Navegar a vista detallada de la métrica
  };

  // Mock de agenda del día
  const todaySchedule = useMemo(() => [
    {
      time: '09:00',
      client: 'Juan Pérez',
      barber: 'Miguel',
      service: 'Corte + Barba',
      status: 'confirmed'
    },
    {
      time: '09:30',
      client: 'Carlos López',
      barber: 'Ana',
      service: 'Corte',
      status: 'pending'
    },
    {
      time: '10:00',
      client: 'Luis García',
      barber: 'Miguel',
      service: 'Barba',
      status: 'in_progress'
    },
    {
      time: '10:30',
      client: 'Pedro Martín',
      barber: 'José',
      service: 'Corte + Barba',
      status: 'confirmed'
    }
  ], []);

  // Funciones utilitarias para agenda
  const getStatusStyle = (status) => {
    return APPOINTMENT_STYLES.STYLES[status] || APPOINTMENT_STYLES.STYLES.completed;
  };

  const getStatusText = (status) => {
    return APPOINTMENT_STYLES.LABELS[status] || status;
  };

  const handleConfirmAppointment = (appointment) => {
    console.log('Confirmando cita:', appointment);
    // Lógica para confirmar cita
  };

  const handleViewFullCalendar = () => {
    console.log('Ver calendario completo');
    // Navegar a vista de calendario
  };

  return {
    // Configuración
    dashboardConfig,

    // Estado
    loading,
    lastUpdated,
    error,

    // Datos
    metrics,
    quickActions,
    recentActivity,
    todaySchedule,

    // Acciones
    refresh,
    handleQuickAction,
    handleMetricClick,

    // Funciones de agenda
    getStatusStyle,
    getStatusText,
    handleConfirmAppointment,
    handleViewFullCalendar
  };
};