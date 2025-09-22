import { FiDollarSign, FiChevronUp, FiTrendingUp, FiAward, FiClock } from 'react-icons/fi';
import { STAFF_TEXTS, METRIC_GRADIENTS, ANIMATIONS } from '../../constants/staffPage';
import ChangeIndicator from './ChangeIndicator';

const CommissionDetails = ({
  commissionData,
  filteredBarbers,
  showCommissionDetails,
  onClose,
  getIndividualChange
}) => {
  if (!showCommissionDetails || !commissionData) return null;

  return (
    <div className={`${ANIMATIONS.TRANSITION_ALL} overflow-hidden ${
      showCommissionDetails ? ANIMATIONS.MAX_HEIGHT_EXPANDED : ANIMATIONS.MAX_HEIGHT_COLLAPSED
    }`}>
      <div className="space-y-6">
        {/* Header de la sección */}
        <CommissionHeader onClose={onClose} />

        {/* Métricas detalladas con comparativas */}
        <CommissionMetrics commissionData={commissionData} />

        {/* Top Performers y Desglose Financiero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopPerformersSection
            filteredBarbers={filteredBarbers}
            getIndividualChange={getIndividualChange}
          />
          <FinancialBreakdownSection commissionData={commissionData} />
        </div>
      </div>
    </div>
  );
};

const CommissionHeader = ({ onClose }) => (
  <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
    <div className="flex items-center space-x-3">
      <div className="h-8 w-8 bg-[#D4AF37]/20 rounded-lg flex items-center justify-center">
        <FiDollarSign className="h-5 w-5 text-[#D4AF37]" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {STAFF_TEXTS.COMMISSION_ANALYSIS}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {STAFF_TEXTS.COMMISSION_SYSTEM}
        </p>
      </div>
    </div>
    <button
      onClick={onClose}
      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
    >
      <FiChevronUp className="h-5 w-5" />
    </button>
  </div>
);

const CommissionMetrics = ({ commissionData }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <MetricCard
      gradient={METRIC_GRADIENTS.GREEN}
      icon={FiTrendingUp}
      iconColor="text-green-600 dark:text-green-400"
      iconBg="bg-green-100 dark:bg-green-800/50"
      title={STAFF_TEXTS.GROSS_INCOME}
      value={`S/${commissionData.totalEarnings.toLocaleString()}`}
      change={commissionData.changes.earnings}
      changeLabel={STAFF_TEXTS.VS_PREVIOUS_MONTH}
      changeColor="text-green-700 dark:text-green-300"
    />

    <MetricCard
      gradient={METRIC_GRADIENTS.GOLD}
      icon={FiDollarSign}
      iconColor="text-[#D4AF37]"
      iconBg="bg-[#D4AF37]/20"
      title={STAFF_TEXTS.COMMISSIONS_PAID}
      value={`S/${commissionData.totalCommissions.toLocaleString()}`}
      change={commissionData.changes.commissions}
      changeLabel={STAFF_TEXTS.VS_PREVIOUS_MONTH}
      changeColor="text-[#D4AF37]"
    />

    <MetricCard
      gradient={METRIC_GRADIENTS.BLUE}
      icon={FiClock}
      iconColor="text-blue-600 dark:text-blue-400"
      iconBg="bg-blue-100 dark:bg-blue-800/50"
      title={STAFF_TEXTS.TOTAL_SERVICES}
      value={commissionData.totalServices.toLocaleString()}
      change={commissionData.changes.services}
      changeLabel={STAFF_TEXTS.VS_PREVIOUS_MONTH}
      changeColor="text-blue-700 dark:text-blue-300"
    />

    <MetricCard
      gradient={METRIC_GRADIENTS.PURPLE}
      icon={FiAward}
      iconColor="text-purple-600 dark:text-purple-400"
      iconBg="bg-purple-100 dark:bg-purple-800/50"
      title={STAFF_TEXTS.AVERAGE_PER_BARBER}
      value={`S/${Math.round(commissionData.avgCommissionPerBarber).toLocaleString()}`}
      change={commissionData.changes.avgCommission}
      changeLabel={STAFF_TEXTS.VS_PREVIOUS_MONTH}
      changeColor="text-purple-700 dark:text-purple-300"
    />
  </div>
);

const MetricCard = ({
  gradient,
  icon: Icon,
  iconColor,
  iconBg,
  title,
  value,
  change,
  changeLabel,
  changeColor
}) => (
  <div className={`card ${gradient}`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`h-10 w-10 ${iconBg} rounded-lg flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div>
          <p className={`text-sm font-medium ${iconColor}`}>{title}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
      <div className="text-right">
        <ChangeIndicator change={change} />
        <p className={`text-xs ${changeColor} mt-1`}>{changeLabel}</p>
      </div>
    </div>
  </div>
);

const TopPerformersSection = ({ filteredBarbers, getIndividualChange }) => (
  <div className="card">
    <div className="flex items-center justify-between mb-4">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
        <FiAward className="h-5 w-5 text-[#D4AF37] mr-2" />
        {STAFF_TEXTS.TOP_PERFORMERS_COMMISSIONS}
      </h4>
    </div>
    <div className="space-y-3">
      {filteredBarbers
        .sort((a, b) => (b.totalEarnings || 0) - (a.totalEarnings || 0))
        .slice(0, 5)
        .map((barber, index) => {
          const commission = (barber.totalEarnings || 0) * 0.7;
          const individualChange = getIndividualChange();
          const previousCommission = commission / (1 + (individualChange / 100));

          return (
            <PerformerCard
              key={barber.id}
              barber={barber}
              index={index}
              commission={commission}
              previousCommission={previousCommission}
              individualChange={individualChange}
            />
          );
        })}
    </div>
  </div>
);

const PerformerCard = ({ barber, index, commission, previousCommission, individualChange }) => {
  const getRankingStyle = (index) => {
    const styles = [
      'bg-yellow-100 text-yellow-800',
      'bg-gray-100 text-gray-800',
      'bg-orange-100 text-orange-800',
      'bg-blue-100 text-blue-800'
    ];
    return styles[index] || styles[3];
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${getRankingStyle(index)}`}>
          {index + 1}
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {barber.name}
          </p>
          <div className="flex items-center space-x-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {barber.totalServices} {STAFF_TEXTS.SERVICES_COUNT}
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
          vs S/{Math.round(previousCommission).toLocaleString()} {STAFF_TEXTS.PREVIOUS_MONTH.toLowerCase()}
        </p>
      </div>
    </div>
  );
};

const FinancialBreakdownSection = ({ commissionData }) => (
  <div className="card">
    <div className="flex items-center justify-between mb-4">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
        <FiDollarSign className="h-5 w-5 text-[#D4AF37] mr-2" />
        {STAFF_TEXTS.FINANCIAL_BREAKDOWN}
      </h4>
    </div>
    <div className="space-y-4">
      {/* Comparación Mensual */}
      <MonthlyComparison commissionData={commissionData} />

      {/* Desglose de ingresos */}
      <IncomeBreakdown commissionData={commissionData} />

      {/* Margen neto */}
      <NetMargin commissionData={commissionData} />
    </div>
  </div>
);

const MonthlyComparison = ({ commissionData }) => (
  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
    <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center">
      <FiTrendingUp className="h-4 w-4 mr-2" />
      {STAFF_TEXTS.MONTHLY_COMPARISON}
    </h5>
    <div className="grid grid-cols-2 gap-3 text-sm">
      <div>
        <p className="text-blue-700 dark:text-blue-300">{STAFF_TEXTS.CURRENT_MONTH}</p>
        <p className="font-bold text-blue-900 dark:text-blue-100">S/{commissionData.totalCommissions.toLocaleString()}</p>
      </div>
      <div>
        <p className="text-blue-700 dark:text-blue-300">{STAFF_TEXTS.PREVIOUS_MONTH}</p>
        <p className="font-bold text-blue-900 dark:text-blue-100">S/{commissionData.previousMonth.totalCommissions.toLocaleString()}</p>
      </div>
    </div>
    <div className="mt-2 flex justify-center">
      <ChangeIndicator change={commissionData.changes.commissions} prefix={STAFF_TEXTS.DIFFERENCE} />
    </div>
  </div>
);

const IncomeBreakdown = ({ commissionData }) => (
  <>
    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
      <span className="text-gray-600 dark:text-gray-400">{STAFF_TEXTS.TOTAL_INCOME}</span>
      <div className="text-right">
        <span className="font-semibold text-gray-900 dark:text-white">
          S/{commissionData.totalEarnings.toLocaleString()}
        </span>
        <div className="text-right">
          <ChangeIndicator change={commissionData.changes.earnings} />
        </div>
      </div>
    </div>
    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
      <span className="text-gray-600 dark:text-gray-400">Comisiones (70%)</span>
      <div className="text-right">
        <span className="font-semibold text-[#D4AF37]">
          -S/{commissionData.totalCommissions.toLocaleString()}
        </span>
        <div className="text-right">
          <ChangeIndicator change={commissionData.changes.commissions} />
        </div>
      </div>
    </div>
    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
      <span className="text-gray-600 dark:text-gray-400">{STAFF_TEXTS.RETENTION}</span>
      <span className="font-semibold text-green-600">
        S/{(commissionData.totalEarnings - commissionData.totalCommissions).toLocaleString()}
      </span>
    </div>
  </>
);

const NetMargin = ({ commissionData }) => (
  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
    <div className="flex justify-between items-center">
      <span className="font-medium text-gray-900 dark:text-white">{STAFF_TEXTS.NET_MARGIN}</span>
      <span className="text-lg font-bold text-green-600">
        {((commissionData.totalEarnings - commissionData.totalCommissions) / commissionData.totalEarnings * 100).toFixed(1)}%
      </span>
    </div>
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
      {STAFF_TEXTS.AFTER_COMMISSIONS}
    </p>
  </div>
);

export default CommissionDetails;