// ===================================================================
// 🏢 DASHBOARD DE ADMIN DE SEDE - REFACTORIZADO
// ===================================================================
// Dashboard principal para el rol de administrador de sede
import React from 'react';
import { FiTrendingUp, FiActivity } from 'react-icons/fi';
import CountryFlag from '../common/CountryFlag';
import { useBranchAdminDashboard } from '../../hooks';
import {
  DashboardHeader,
  MetricCard,
  QuickActions,
  RecentActivity,
  AttendanceTable,
  BarberPerformance,
  StaffSummary,
  BranchPerformance
} from './components';

const BranchAdminDashboard = () => {
  const {
    dashboardConfig,
    loading,
    lastUpdated,
    error,
    showAttendanceDetails,
    showAppointmentDetails,
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
    refresh,
    handleQuickAction,
    handleMetricClick,
    setShowAttendanceDetails,
    setShowAppointmentDetails
  } = useBranchAdminDashboard();

  // Customizar métricas con handlers específicos
  const customMetrics = metrics.map(metric => ({
    ...metric,
    onClick: () => {
      if (metric.title.includes('Citas')) {
        setShowAppointmentDetails(!showAppointmentDetails);
      } else if (metric.title.includes('Personal')) {
        setShowAttendanceDetails(!showAttendanceDetails);
      }
      handleMetricClick(metric);
    }
  }));

  // Custom header con información de la sede
  const customHeader = (
    <div className={`bg-gradient-to-r ${dashboardConfig.gradient} rounded-lg p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{dashboardConfig.title}</h1>
          <p className="text-white/80">{dashboardConfig.subtitle}</p>
          <div className="flex items-center space-x-2 mt-2">
            <CountryFlag countryCode={currentBranch?.country || 'PE'} size={20} />
            <span className="text-sm">{currentBranch?.city}</span>
          </div>
        </div>
        <div className="text-right">
          {lastUpdated && (
            <p className="text-xs text-white/60">
              Última actualización: {lastUpdated}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button onClick={refresh} className="mt-4 btn-primary">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header personalizado */}
      {customHeader}

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {customMetrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={
              <div className="flex items-center justify-between">
                <span>{metric.title}</span>
                {metric.title.includes('Citas') ? (
                  <FiTrendingUp className="h-4 w-4 text-blue-500" />
                ) : metric.title.includes('Personal') ? (
                  <FiActivity className="h-4 w-4 text-green-500" />
                ) : null}
              </div>
            }
            value={metric.value}
            icon={metric.icon}
            color={metric.color}
            trend={metric.trend}
            trendValue={metric.trendValue}
            onClick={metric.onClick}
            loading={loading}
          >
            {metric.subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {metric.subtitle}
              </p>
            )}
          </MetricCard>
        ))}
      </div>

      {/* Tabla de asistencia detallada */}
      {showAttendanceDetails && (
        <AttendanceTable
          branchStaff={branchStaff}
          attendanceStats={attendanceStats}
        />
      )}

      {/* Rendimiento por barbero */}
      {showAppointmentDetails && (
        <BarberPerformance
          barberStats={barberStats}
        />
      )}

      {/* Resumen del personal y rendimiento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StaffSummary
          attendanceStats={attendanceStats}
          branchStaff={branchStaff}
        />

        <BranchPerformance
          attendanceStats={attendanceStats}
          branchStaff={branchStaff}
          todayAppointments={todayAppointments}
          completedToday={completedToday}
        />
      </div>

      {/* Acciones rápidas y actividad reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions
          actions={quickActions}
          onActionClick={handleQuickAction}
          columns={1}
        />

        <RecentActivity
          activities={recentActivity}
          title="Actividad de la Sucursal"
          maxItems={4}
          showTime={true}
        />
      </div>
    </div>
  );
};

export default BranchAdminDashboard;