import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { MetricCard } from '../common';
import { METRICS_CONFIG } from '../../constants/staffPage';
import ChangeIndicator from './ChangeIndicator';

const StaffMetrics = ({
  staffSummary,
  commissionData,
  user,
  onToggleCommissions,
  onToggleServices,
  showCommissionDetails,
  showServicesDetails
}) => {
  const isSupeAdmin = user?.role === 'super_admin';
  const gridCols = isSupeAdmin ? 'lg:grid-cols-5' : 'lg:grid-cols-4';

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${gridCols} gap-6`}>
      <MetricCard
        title={METRICS_CONFIG.TOTAL_STAFF.title}
        value={staffSummary.totalStaff}
        icon={METRICS_CONFIG.TOTAL_STAFF.icon}
        color={METRICS_CONFIG.TOTAL_STAFF.color}
      />

      <MetricCard
        title={METRICS_CONFIG.PRESENT_TODAY.title}
        value={`${staffSummary.presentToday}/${staffSummary.totalStaff}`}
        icon={METRICS_CONFIG.PRESENT_TODAY.icon}
        color={METRICS_CONFIG.PRESENT_TODAY.color}
        description={`${staffSummary.attendanceRate.toFixed(0)}% asistencia`}
      />

      <MetricCard
        title={METRICS_CONFIG.AVG_RATING.title}
        value={staffSummary.avgRating}
        icon={METRICS_CONFIG.AVG_RATING.icon}
        color={METRICS_CONFIG.AVG_RATING.color}
      />

      <MetricCard
        onClick={onToggleServices}
        title={
          <div className="flex items-center justify-between">
            <span>{METRICS_CONFIG.TOTAL_SERVICES.title}</span>
            {showServicesDetails ?
              <FiChevronUp className="h-4 w-4 text-purple-500" /> :
              <FiChevronDown className="h-4 w-4 text-purple-500" />
            }
          </div>
        }
        value={staffSummary.totalServices.toLocaleString()}
        icon={METRICS_CONFIG.TOTAL_SERVICES.icon}
        color={METRICS_CONFIG.TOTAL_SERVICES.color}
        className="transition-transform hover:scale-105"
      />

      {/* Métrica de Comisiones - Solo para Super Admin */}
      {isSupeAdmin && commissionData && (
        <MetricCard
          onClick={onToggleCommissions}
          title={
            <div className="flex items-center justify-between">
              <span>{METRICS_CONFIG.COMMISSIONS.title}</span>
              {showCommissionDetails ?
                <FiChevronUp className="h-4 w-4 text-[#D4AF37]" /> :
                <FiChevronDown className="h-4 w-4 text-[#D4AF37]" />
              }
            </div>
          }
          value={`S/${commissionData.totalCommissions.toLocaleString()}`}
          icon={METRICS_CONFIG.COMMISSIONS.icon}
          color={METRICS_CONFIG.COMMISSIONS.color}
          description={
            <div className="flex flex-col space-y-1">
              <span className="text-white dark:text-gray-100">
                S/${Math.round(commissionData.avgCommissionPerBarber).toLocaleString()} promedio
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

export default StaffMetrics;