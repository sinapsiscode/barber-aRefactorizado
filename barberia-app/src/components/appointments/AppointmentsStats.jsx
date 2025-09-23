import React from 'react';
import { FiCalendar, FiClock, FiUser, FiScissors } from 'react-icons/fi';
import MetricCard from '../common/MetricCard';
import { APPOINTMENTS_STATS_LABELS } from '../../constants/appointments';

const AppointmentsStats = ({ stats }) => {
  const statsConfig = [
    {
      title: APPOINTMENTS_STATS_LABELS.TOTAL,
      value: stats.total,
      icon: FiCalendar,
      color: 'bg-blue-500'
    },
    {
      title: APPOINTMENTS_STATS_LABELS.TODAY,
      value: stats.today,
      icon: FiClock,
      color: 'bg-green-500'
    },
    {
      title: APPOINTMENTS_STATS_LABELS.CONFIRMED,
      value: stats.confirmed,
      icon: FiUser,
      color: 'bg-purple-500'
    },
    {
      title: APPOINTMENTS_STATS_LABELS.COMPLETED,
      value: stats.completed,
      icon: FiScissors,
      color: 'bg-emerald-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsConfig.map((stat, index) => (
        <MetricCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
};

export default AppointmentsStats;