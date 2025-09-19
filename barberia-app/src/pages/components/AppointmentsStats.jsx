// ===================================================================
// 📊 ESTADÍSTICAS DE CITAS - COMPONENTE ESPECIALIZADO
// ===================================================================
// Tarjetas de métricas para la página de citas

import React from 'react';
import { FiCalendar, FiClock, FiUser, FiScissors } from 'react-icons/fi';
import { MetricCard } from '../../components/common';
import { APPOINTMENTS_STATS_LABELS } from '../../constants/appointments';

const AppointmentsStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title={APPOINTMENTS_STATS_LABELS.TOTAL}
        value={stats.total}
        icon={FiCalendar}
        color="bg-blue-500"
      />
      <MetricCard
        title={APPOINTMENTS_STATS_LABELS.TODAY}
        value={stats.today}
        icon={FiClock}
        color="bg-green-500"
      />
      <MetricCard
        title={APPOINTMENTS_STATS_LABELS.CONFIRMED}
        value={stats.confirmed}
        icon={FiUser}
        color="bg-purple-500"
      />
      <MetricCard
        title={APPOINTMENTS_STATS_LABELS.COMPLETED}
        value={stats.completed}
        icon={FiScissors}
        color="bg-emerald-500"
      />
    </div>
  );
};

export default AppointmentsStats;