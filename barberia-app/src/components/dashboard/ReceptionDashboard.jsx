// ===================================================================
// 🏢 DASHBOARD DE RECEPCIÓN - REFACTORIZADO
// ===================================================================
// Dashboard principal para el rol de recepción
import React from 'react';
import { useReceptionDashboard } from '../../hooks';
import {
  DashboardHeader,
  MetricCard,
  QuickActions,
  RecentActivity,
  TodaySchedule
} from './components';

const ReceptionDashboard = () => {
  const {
    dashboardConfig,
    loading,
    lastUpdated,
    error,
    metrics,
    quickActions,
    recentActivity,
    todaySchedule,
    refresh,
    handleQuickAction,
    handleMetricClick,
    getStatusStyle,
    getStatusText,
    handleConfirmAppointment,
    handleViewFullCalendar
  } = useReceptionDashboard();

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
      <DashboardHeader
        title={dashboardConfig.title}
        subtitle={dashboardConfig.subtitle}
        gradient={dashboardConfig.gradient}
        onRefresh={refresh}
        loading={loading}
        lastUpdated={lastUpdated}
      />

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            color={metric.color}
            trend={metric.trend}
            trendValue={metric.trendValue}
            onClick={() => handleMetricClick(metric)}
            loading={loading}
          />
        ))}
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Acciones rápidas */}
        <QuickActions
          actions={quickActions}
          onActionClick={handleQuickAction}
          columns={2}
        />

        {/* Actividad reciente */}
        <RecentActivity
          activities={recentActivity}
          maxItems={4}
          showTime={true}
        />
      </div>

      {/* Agenda del día */}
      <TodaySchedule
        schedule={todaySchedule}
        onViewFullCalendar={handleViewFullCalendar}
        onConfirmAppointment={handleConfirmAppointment}
        getStatusStyle={getStatusStyle}
        getStatusText={getStatusText}
      />
    </div>
  );
};

export default ReceptionDashboard;