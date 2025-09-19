// ===================================================================
// 📊 TARJETAS DE ESTADÍSTICAS RÁPIDAS - COMPONENTE ESPECIALIZADO
// ===================================================================
// Panel de estadísticas rápidas para super admin
import React from 'react';

const QuickStatsCards = ({
  appointmentStats = {},
  staffSummary = {},
  clientStats = {}
}) => {
  const statsCards = [
    {
      title: "Citas de Hoy",
      value: appointmentStats.today || 0,
      subtitle: `${appointmentStats.confirmed || 0} confirmadas`,
      color: "text-primary-600"
    },
    {
      title: "Personal Presente",
      value: `${staffSummary.presentToday || 0}/${staffSummary.totalStaff || 0}`,
      subtitle: `${(staffSummary.attendanceRate || 0).toFixed(0)}% asistencia`,
      color: "text-green-600"
    },
    {
      title: "Clientes VIP",
      value: clientStats.vipCount || 0,
      subtitle: "Clientes premium",
      color: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statsCards.map((stat, index) => (
        <div key={index} className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {stat.title}
          </h3>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className={`text-3xl font-bold ${stat.color} dark:${stat.color.replace('text-', 'text-')} mb-2`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.subtitle}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStatsCards;