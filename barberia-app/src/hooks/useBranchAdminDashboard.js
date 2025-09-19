// ===================================================================
// 🏢 HOOK DE DASHBOARD DE ADMIN DE SEDE - REFACTORIZADO
// ===================================================================
// Hook específico para dashboard de administrador de sede
import { useState, useMemo } from 'react';
import {
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiActivity,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiTrendingUp,
  FiUserCheck,
  FiBarChart,
  FiSettings,
  FiMapPin
} from 'react-icons/fi';
import {
  DASHBOARD_LABELS,
  DASHBOARD_METRICS,
  METRIC_COLORS,
  QUICK_ACTIONS
} from '../constants';
import { useDashboard } from './useDashboard';
import { useAuthStore, useStaffStore, useAppointmentStore, useBranchStore } from '../stores';

export const useBranchAdminDashboard = () => {
  const { loading, lastUpdated, error, refresh } = useDashboard('branchAdmin');
  const { user } = useAuthStore();
  const { getStaffByBranch, getAttendanceStats } = useStaffStore();
  const { appointments } = useAppointmentStore();
  const { branches } = useBranchStore();

  // Estado local
  const [showAttendanceDetails, setShowAttendanceDetails] = useState(false);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);

  // Datos de la sucursal
  const currentBranch = useMemo(() =>
    branches.find(b => b.id === (user?.branchId || 1)) || {},
    [branches, user?.branchId]
  );

  const branchStaff = useMemo(() =>
    getStaffByBranch(user?.branchId || 1),
    [getStaffByBranch, user?.branchId]
  );

  // Cálculos de datos
  const today = new Date().toISOString().split('T')[0];
  const attendanceStats = getAttendanceStats(today, user?.branchId);

  const branchAppointments = useMemo(() =>
    appointments.filter(apt => apt.branchId === (user?.branchId || 1)),
    [appointments, user?.branchId]
  );

  const todayAppointments = useMemo(() =>
    branchAppointments.filter(apt => apt.date === today),
    [branchAppointments, today]
  );

  const completedToday = useMemo(() =>
    todayAppointments.filter(apt => apt.status === 'completed').length,
    [todayAppointments]
  );

  const pendingToday = useMemo(() =>
    todayAppointments.filter(apt => apt.status === 'confirmed').length,
    [todayAppointments]
  );

  // Configuración del dashboard
  const dashboardConfig = {
    title: DASHBOARD_LABELS.BRANCH_ADMIN.TITLE.replace('{branchName}', currentBranch.name || 'Sede'),
    subtitle: DASHBOARD_LABELS.BRANCH_ADMIN.SUBTITLE,
    gradient: DASHBOARD_LABELS.BRANCH_ADMIN.GRADIENT
  };

  // Métricas principales
  const metrics = useMemo(() => [
    {
      title: DASHBOARD_METRICS.APPOINTMENTS.TODAY,
      value: todayAppointments.length,
      icon: FiCalendar,
      color: METRIC_COLORS.APPOINTMENTS.icon,
      trend: 'up',
      trendValue: '+15%',
      onClick: () => setShowAppointmentDetails(true)
    },
    {
      title: DASHBOARD_METRICS.APPOINTMENTS.COMPLETED,
      value: completedToday,
      icon: FiCheckCircle,
      color: METRIC_COLORS.PERFORMANCE.icon,
      trend: 'up',
      trendValue: '+8%'
    },
    {
      title: DASHBOARD_METRICS.STAFF.PRESENT,
      value: `${attendanceStats.present}/${branchStaff.length}`,
      icon: FiUsers,
      color: METRIC_COLORS.STAFF.icon,
      trend: attendanceStats.present === branchStaff.length ? 'up' : 'down',
      trendValue: `${attendanceStats.present === branchStaff.length ? '100%' : `${Math.round(attendanceStats.present / branchStaff.length * 100)}%`}`,
      onClick: () => setShowAttendanceDetails(true)
    },
    {
      title: DASHBOARD_METRICS.REVENUE.TODAY,
      value: 'S/2,450',
      icon: FiDollarSign,
      color: METRIC_COLORS.REVENUE.icon,
      trend: 'up',
      trendValue: '+12%'
    }
  ], [todayAppointments.length, completedToday, attendanceStats, branchStaff.length]);

  // Estadísticas por barbero
  const barberStats = useMemo(() => {
    return branchStaff.map(barber => {
      const barberAppointments = todayAppointments.filter(apt => apt.barberId === barber.id);
      const completed = barberAppointments.filter(apt => apt.status === 'completed').length;
      const total = barberAppointments.length;

      return {
        ...barber,
        appointmentsToday: total,
        completedToday: completed,
        completionRate: total > 0 ? (completed / total * 100).toFixed(0) : 0
      };
    }).sort((a, b) => b.completedToday - a.completedToday);
  }, [branchStaff, todayAppointments]);

  // Acciones rápidas
  const quickActions = QUICK_ACTIONS.BRANCH_ADMIN;

  // Actividad reciente
  const recentActivity = useMemo(() => [
    {
      title: 'Personal marcó entrada',
      description: 'Miguel Rodríguez llegó a tiempo',
      timestamp: new Date(Date.now() - 300000),
      icon: FiUserCheck,
      iconColor: 'bg-green-500',
      status: 'success',
      statusText: 'A tiempo'
    },
    {
      title: 'Cita completada',
      description: 'Luis Martínez - Fade Moderno - S/35',
      timestamp: new Date(Date.now() - 600000),
      icon: FiCheckCircle,
      iconColor: 'bg-blue-500',
      status: 'success',
      statusText: 'Completada'
    },
    {
      title: 'Tardanza registrada',
      description: 'Ana García llegó 15 min tarde',
      timestamp: new Date(Date.now() - 900000),
      icon: FiAlertCircle,
      iconColor: 'bg-yellow-500',
      status: 'warning',
      statusText: 'Tardanza'
    },
    {
      title: 'Meta alcanzada',
      description: 'Ingresos diarios superaron objetivo',
      timestamp: new Date(Date.now() - 1200000),
      icon: FiTrendingUp,
      iconColor: 'bg-purple-500',
      status: 'success',
      statusText: '110%'
    }
  ], []);

  // Handlers para acciones
  const handleQuickAction = (action, actionData) => {
    console.log(`Acción de admin de sede: ${action}`, actionData);

    switch (action) {
      case 'manageStaff':
        // Navegar a gestión de personal
        break;
      case 'viewReports':
        // Navegar a reportes
        break;
      case 'settings':
        // Navegar a configuración
        break;
      default:
        console.log('Acción no reconocida:', action);
    }
  };

  const handleMetricClick = (metric) => {
    console.log('Métrica clickeada:', metric);
    if (metric.onClick) {
      metric.onClick();
    }
  };

  return {
    // Configuración
    dashboardConfig,

    // Estado
    loading,
    lastUpdated,
    error,
    showAttendanceDetails,
    showAppointmentDetails,

    // Datos
    metrics,
    quickActions,
    recentActivity,
    currentBranch,
    branchStaff,
    barberStats,
    attendanceStats,
    todayAppointments,
    completedToday,
    pendingToday,

    // Acciones
    refresh,
    handleQuickAction,
    handleMetricClick,
    setShowAttendanceDetails,
    setShowAppointmentDetails
  };
};