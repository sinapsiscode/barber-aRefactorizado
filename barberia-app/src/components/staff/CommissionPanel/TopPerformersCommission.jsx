import { FiAward } from 'react-icons/fi';
import ChangeIndicator from '../StaffStats/ChangeIndicator';
import { sortBarbersByEarnings } from '../../../utils/staff/servicesAnalytics';
import { simulateIndividualChange, calculateBarberCommission } from '../../../utils/staff/commissionCalculations';
import { DISPLAY_LIMITS, MEDAL_COLORS } from '../../../constants/staff';

/**
 * Top Performers - Comisiones
 * Líneas 622-675 del original
 */
const TopPerformersCommission = ({ barbers }) => {
  const topBarbers = sortBarbersByEarnings(barbers).slice(0, DISPLAY_LIMITS.TOP_PERFORMERS);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <FiAward className="h-5 w-5 text-[#D4AF37] mr-2" />
          Top Performers - Comisiones
        </h4>
      </div>
      <div className="space-y-3">
        {topBarbers.map((barber, index) => {
          const commission = calculateBarberCommission(barber.totalEarnings || 0);
          // Simular cambio individual (variación entre -10% y +25%)
          const individualChange = simulateIndividualChange();
          const previousCommission = commission / (1 + (individualChange / 100));

          const medalColor = index === 0 ? MEDAL_COLORS.FIRST :
                            index === 1 ? MEDAL_COLORS.SECOND :
                            index === 2 ? MEDAL_COLORS.THIRD :
                            MEDAL_COLORS.OTHER;

          return (
            <div key={barber.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${medalColor}`}>
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {barber.name}
                  </p>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {barber.totalServices} servicios
                    </p>
                    <ChangeIndicator change={individualChange} />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#D4AF37]">
                  S/{commission.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  vs S/{Math.round(previousCommission).toLocaleString()} mes ant.
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopPerformersCommission;
