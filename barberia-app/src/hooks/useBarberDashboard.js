// ===================================================================
// ✂️ HOOK DE DASHBOARD DE BARBERO - REFACTORIZADO
// ===================================================================
// Hook específico para dashboard de barbero
import { useState, useEffect, useMemo } from 'react';
import {
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiAward,
  FiCheckCircle,
  FiXCircle,
  FiCoffee,
  FiActivity,
  FiStar,
  FiTrendingUp
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import {
  DASHBOARD_LABELS,
  DASHBOARD_METRICS,
  METRIC_COLORS,
  QUICK_ACTIONS,
  SWEETALERT_CONFIG
} from '../constants';
import { useDashboard } from './useDashboard';
import { useAuthStore, useStaffStore, useAppointmentStore } from '../stores';

export const useBarberDashboard = () => {
  const { loading, lastUpdated, error, refresh } = useDashboard('barber');
  const { user } = useAuthStore();
  const { checkIn, checkOut, setTemporaryAbsence, barbers, getBarberStats } = useStaffStore();
  const { appointments } = useAppointmentStore();

  // Estados locales
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [isTemporarilyAbsent, setIsTemporarilyAbsent] = useState(false);

  // Actualizar reloj cada segundo
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Datos del barbero actual
  const currentBarber = useMemo(() =>
    barbers.find(b => b.id === user?.id) || {
      id: user?.id,
      name: user?.name,
      country: 'PE',
      totalServices: 1250,
      totalEarnings: 37500,
      rating: 4.8,
      status: 'active'
    }, [barbers, user?.id, user?.name]
  );

  // Estadísticas del barbero
  const barberStats = useMemo(() =>
    getBarberStats(currentBarber.id), [getBarberStats, currentBarber.id]
  );

  // Cálculos de citas del día
  const today = new Date().toISOString().split('T')[0];

  const todayAppointments = useMemo(() =>
    appointments.filter(apt =>
      apt.barberId === user?.id &&
      apt.date === today
    ), [appointments, user?.id, today]
  );

  const completedToday = useMemo(() =>
    todayAppointments.filter(apt => apt.status === 'completed').length,
    [todayAppointments]
  );

  const pendingToday = useMemo(() =>
    todayAppointments.filter(apt => apt.status === 'confirmed').length,
    [todayAppointments]
  );

  const nextAppointment = useMemo(() =>
    todayAppointments
      .filter(apt => apt.status === 'confirmed')
      .sort((a, b) => a.time.localeCompare(b.time))[0],
    [todayAppointments]
  );

  // Cálculos financieros
  const todayEarnings = completedToday * 30; // S/30 promedio por servicio
  const todayCommission = todayEarnings * 0.7; // 70% de comisión

  // Configuración del dashboard
  const dashboardConfig = {
    title: `¡Hola, ${user?.name}!`,
    subtitle: currentTime.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }),
    gradient: DASHBOARD_LABELS.BARBER.GRADIENT,
    showClock: true,
    currentTime,
    checkInTime,
    isCheckedIn
  };

  // Métricas principales
  const metrics = useMemo(() => [
    {
      title: DASHBOARD_METRICS.APPOINTMENTS.TODAY,
      value: todayAppointments.length,
      icon: FiCalendar,
      color: METRIC_COLORS.APPOINTMENTS.icon,
      subtitle: `${completedToday} completadas, ${pendingToday} pendientes`
    },
    {
      title: 'Próxima Cita',
      value: nextAppointment ? nextAppointment.time : '--:--',
      icon: FiClock,
      color: METRIC_COLORS.PERFORMANCE.icon,
      subtitle: nextAppointment ? nextAppointment.clientName : 'Sin citas pendientes'
    },
    {
      title: 'Comisión Hoy (70%)',
      value: `S/${todayCommission.toLocaleString()}`,
      icon: FiDollarSign,
      color: METRIC_COLORS.REVENUE.icon,
      subtitle: `De S/${todayEarnings} en servicios`
    },
    {
      title: 'Total Servicios',
      value: currentBarber.totalServices.toLocaleString(),
      icon: FiAward,
      color: METRIC_COLORS.CLIENTS.icon,
      subtitle: 'Histórico total'
    }
  ], [todayAppointments.length, completedToday, pendingToday, nextAppointment, todayCommission, todayEarnings, currentBarber.totalServices]);

  // Acciones rápidas personalizadas para barbero
  const quickActions = [
    {
      label: isCheckedIn ? 'Marcar Salida' : 'Marcar Entrada',
      icon: isCheckedIn ? 'FiXCircle' : 'FiCheckCircle',
      action: isCheckedIn ? 'checkOut' : 'checkIn',
      color: isCheckedIn ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600',
      disabled: false
    },
    {
      label: isTemporarilyAbsent ? 'Regresar' : 'Ausente Temporal',
      icon: 'FiCoffee',
      action: 'temporaryAbsence',
      color: isTemporarilyAbsent ? 'bg-blue-500 hover:bg-blue-600' : 'bg-yellow-500 hover:bg-yellow-600',
      disabled: !isCheckedIn
    }
  ];

  // Estado del barbero
  const barberStatus = {
    status: !isCheckedIn ? 'No disponible' :
             isTemporarilyAbsent ? 'Ausente temporal' : 'Disponible',
    color: !isCheckedIn ? 'text-gray-500' :
           isTemporarilyAbsent ? 'text-yellow-600' : 'text-green-600',
    bgColor: isTemporarilyAbsent ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300' : ''
  };

  // Actividad reciente del barbero
  const recentActivity = useMemo(() => [
    {
      title: 'Servicio completado',
      description: 'Corte + Barba - Luis García - S/45',
      timestamp: new Date(Date.now() - 900000),
      icon: FiCheckCircle,
      iconColor: 'bg-green-500',
      status: 'success',
      statusText: 'Completado'
    },
    {
      title: 'Check-in registrado',
      description: 'Entrada marcada a las 08:30',
      timestamp: new Date(Date.now() - 7200000),
      icon: FiClock,
      iconColor: 'bg-blue-500',
      status: 'success',
      statusText: 'A tiempo'
    },
    {
      title: 'Calificación recibida',
      description: '5 estrellas de María Pérez',
      timestamp: new Date(Date.now() - 14400000),
      icon: FiStar,
      iconColor: 'bg-yellow-500',
      status: 'success',
      statusText: '⭐⭐⭐⭐⭐'
    }
  ], []);

  // Mostrar alertas con configuración centralizada
  const showAlert = async (type, title, text, options = {}) => {
    const config = {
      icon: type,
      title,
      text,
      ...SWEETALERT_CONFIG.THEME,
      ...options
    };

    return await Swal.fire(config);
  };

  // Manejar check-in
  const handleCheckIn = async () => {
    const result = await showAlert(
      'question',
      '¿Marcar entrada?',
      `Hora actual: ${currentTime.toLocaleTimeString()}`,
      {
        showCancelButton: true,
        confirmButtonText: 'Sí, marcar entrada',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#10b981'
      }
    );

    if (result.isConfirmed) {
      const checkInResult = await checkIn(user.id);
      if (checkInResult.success) {
        setIsCheckedIn(true);
        setCheckInTime(currentTime);
        await showAlert('success', '¡Entrada registrada!', 'Tu hora de entrada ha sido marcada');
      }
    }
  };

  // Manejar check-out
  const handleCheckOut = async () => {
    const result = await showAlert(
      'question',
      '¿Marcar salida?',
      `Hora actual: ${currentTime.toLocaleTimeString()}`,
      {
        showCancelButton: true,
        confirmButtonText: 'Sí, marcar salida',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#ef4444'
      }
    );

    if (result.isConfirmed) {
      const checkOutResult = await checkOut(user.id);
      if (checkOutResult.success) {
        setIsCheckedIn(false);
        await showAlert('success', '¡Salida registrada!', 'Tu hora de salida ha sido marcada');
      }
    }
  };

  // Manejar ausencia temporal
  const handleTemporaryAbsence = async () => {
    const result = await showAlert(
      'question',
      isTemporarilyAbsent ? '¿Regresar de ausencia?' : '¿Marcar ausencia temporal?',
      isTemporarilyAbsent
        ? 'Marcarte como disponible nuevamente'
        : 'Esto indicará que estás temporalmente ausente (almuerzo, descanso, etc.)',
      {
        showCancelButton: true,
        confirmButtonText: isTemporarilyAbsent ? 'Sí, ya regresé' : 'Sí, ausente temporal',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#f59e0b'
      }
    );

    if (result.isConfirmed) {
      setIsTemporarilyAbsent(!isTemporarilyAbsent);
      await setTemporaryAbsence(user.id, !isTemporarilyAbsent);

      await showAlert(
        'success',
        isTemporarilyAbsent ? '¡Bienvenido de vuelta!' : 'Ausencia registrada',
        isTemporarilyAbsent
          ? 'Has sido marcado como disponible'
          : 'Has sido marcado como temporalmente ausente'
      );
    }
  };

  // Handlers para acciones
  const handleQuickAction = (action, actionData) => {
    console.log(`Acción de barbero: ${action}`, actionData);

    switch (action) {
      case 'checkIn':
        handleCheckIn();
        break;
      case 'checkOut':
        handleCheckOut();
        break;
      case 'temporaryAbsence':
        handleTemporaryAbsence();
        break;
      default:
        console.log('Acción no reconocida:', action);
    }
  };

  const handleMetricClick = (metric) => {
    console.log('Métrica clickeada:', metric);
    // Navegar a vista detallada de la métrica
  };

  return {
    // Configuración
    dashboardConfig,

    // Estado
    loading,
    lastUpdated,
    error,
    currentTime,
    isCheckedIn,
    checkInTime,
    isTemporarilyAbsent,

    // Datos
    metrics,
    quickActions,
    recentActivity,
    currentBarber,
    barberStats,
    barberStatus,
    todayAppointments,
    completedToday,
    pendingToday,
    nextAppointment,

    // Acciones
    refresh,
    handleQuickAction,
    handleMetricClick,
    handleCheckIn,
    handleCheckOut,
    handleTemporaryAbsence
  };
};