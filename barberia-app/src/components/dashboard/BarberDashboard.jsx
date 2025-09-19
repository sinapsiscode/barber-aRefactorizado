// ===================================================================
// ✂️ DASHBOARD DE BARBERO - REFACTORIZADO
// ===================================================================
// Dashboard principal para el rol de barbero
import React from 'react';
import { useBarberDashboard } from '../../hooks';
import {
  BarberHeader,
  MetricCard,
  AttendanceControls,
  PerformanceStats,
  CommissionStats,
  RecentActivity
} from './components';

const BarberDashboard = () => {
  const {
    dashboardConfig,
    loading,
    lastUpdated,
    error,
    currentTime,
    isCheckedIn,
    checkInTime,
    isTemporarilyAbsent,
    metrics,
    quickActions,
    recentActivity,
    currentBarber,
    barberStats,
    barberStatus,
    refresh,
    handleQuickAction,
    handleMetricClick
  } = useBarberDashboard();

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
      {/* Header personalizado con reloj */}
      <BarberHeader
        title={dashboardConfig.title}
        subtitle={dashboardConfig.subtitle}
        gradient={dashboardConfig.gradient}
        currentTime={currentTime}
        checkInTime={checkInTime}
        isCheckedIn={isCheckedIn}
        countryCode={currentBarber.country}
        onRefresh={refresh}
        loading={loading}
      />

      {/* Controles de asistencia */}
      <AttendanceControls
        isCheckedIn={isCheckedIn}
        isTemporarilyAbsent={isTemporarilyAbsent}
        barberStatus={barberStatus}
        quickActions={quickActions}
        onActionClick={handleQuickAction}
      />

      {/* Métricas del día */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            color={metric.color}
            onClick={() => handleMetricClick(metric)}
            loading={loading}
            className="relative"
          >
            {metric.subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {metric.subtitle}
              </p>
            )}
          </MetricCard>
        ))}
      </div>

      {/* Estadísticas adicionales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceStats
          currentBarber={currentBarber}
          barberStats={barberStats}
        />

        <CommissionStats
          currentBarber={currentBarber}
        />
      </div>

      {/* Actividad reciente */}
      <RecentActivity
        activities={recentActivity}
        title="Mi Actividad Reciente"
        maxItems={3}
        showTime={true}
      />
    </div>
  );
};

export default BarberDashboard;