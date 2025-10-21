import { FiUsers, FiUserCheck, FiStar, FiClock, FiDollarSign, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { MetricCard } from '../../common';
import ChangeIndicator from './ChangeIndicator';

/**
 * Componente de estadísticas de staff
 * Líneas 446-507 del original
 */
const StaffStats = ({
  staffSummary,
  commissionData,
  userRole,
  showServicesDetails,
  showCommissionDetails,
  onToggleServicesDetails,
  onToggleCommissionDetails
}) => {
  const isSuperAdmin = userRole === 'super_admin';

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${isSuperAdmin ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-6`}>
      <MetricCard
        title="Personal Total"
        value={staffSummary.totalStaff}
        icon={FiUsers}
        color="bg-blue-500"
      />
      <MetricCard
        title="Presentes Hoy"
        value={`${staffSummary.presentToday}/${staffSummary.totalStaff}`}
        icon={FiUserCheck}
        color="bg-green-500"
        description={`${staffSummary.attendanceRate.toFixed(0)}% asistencia`}
      />
      <MetricCard
        title="Calificación Promedio"
        value={staffSummary.avgRating}
        icon={FiStar}
        color="bg-yellow-500"
      />
      <MetricCard
        onClick={onToggleServicesDetails}
        title={
          <div className="flex items-center justify-between">
            <span>Servicios Total</span>
            {showServicesDetails ?
              <FiChevronUp className="h-4 w-4 text-purple-500" /> :
              <FiChevronDown className="h-4 w-4 text-purple-500" />
            }
          </div>
        }
        value={staffSummary.totalServices.toLocaleString()}
        icon={FiClock}
        color="bg-purple-500"
        className="transition-transform hover:scale-105"
      />

      {/* Métrica de Comisiones - Solo para Super Admin */}
      {isSuperAdmin && commissionData && (
        <MetricCard
          onClick={onToggleCommissionDetails}
          title={
            <div className="flex items-center justify-between">
              <span>Comisiones (70%)</span>
              {showCommissionDetails ?
                <FiChevronUp className="h-4 w-4 text-[#D4AF37]" /> :
                <FiChevronDown className="h-4 w-4 text-[#D4AF37]" />
              }
            </div>
          }
          value={`S/${commissionData.totalCommissions.toLocaleString()}`}
          icon={FiDollarSign}
          color="bg-[#D4AF37]"
          description={
            <div className="flex flex-col space-y-1">
              <span className="text-white dark:text-gray-100">
                S/{Math.round(commissionData.avgCommissionPerBarber).toLocaleString()} promedio
              </span>
              <ChangeIndicator change={commissionData.changes.commissions} />
            </div>
          }
          className="transition-transform hover:scale-105"
        />
      )}
    </div>
  );
};

export default StaffStats;
