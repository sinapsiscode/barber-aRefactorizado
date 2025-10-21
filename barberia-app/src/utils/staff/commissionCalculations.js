import { COMMISSION_RATES, PREVIOUS_MONTH_SIMULATION } from '../../constants/staff';

/**
 * Calcula comisiones para SuperAdmin (70% de totalEarnings) con comparativas
 * Líneas 65-133 del original
 * @param {Array} barbers - Array de barberos
 * @param {Object} selectedBranch - Sucursal seleccionada (opcional)
 * @param {string} userRole - Rol del usuario
 * @returns {Object|null} Datos de comisiones con comparativas
 */
export const calculateCommissions = (barbers, selectedBranch, userRole) => {
  if (userRole !== 'super_admin') return null;

  const targetBarbers = userRole === 'super_admin' && selectedBranch
    ? barbers.filter(barber => barber.branchId === selectedBranch.id)
    : barbers;

  // Datos del mes actual
  const currentMonth = {
    totalEarnings: targetBarbers.reduce((sum, barber) => sum + (barber.totalEarnings || 0), 0),
    activeBarbers: targetBarbers.filter(b => b.status === 'active').length,
    totalServices: targetBarbers.reduce((sum, barber) => sum + (barber.totalServices || 0), 0)
  };

  // Simular datos del mes anterior (85% del actual para demo)
  const previousMonth = {
    totalEarnings: Math.round(currentMonth.totalEarnings * PREVIOUS_MONTH_SIMULATION.EARNINGS_RATE),
    activeBarbers: currentMonth.activeBarbers,
    totalServices: Math.round(currentMonth.totalServices * PREVIOUS_MONTH_SIMULATION.SERVICES_RATE)
  };

  // Cálculos de comisiones
  const currentCommissions = currentMonth.totalEarnings * COMMISSION_RATES.DEFAULT;
  const previousCommissions = previousMonth.totalEarnings * COMMISSION_RATES.DEFAULT;

  // Cálculos comparativos
  const commissionsChange = previousCommissions > 0
    ? ((currentCommissions - previousCommissions) / previousCommissions) * 100
    : 0;

  const earningsChange = previousMonth.totalEarnings > 0
    ? ((currentMonth.totalEarnings - previousMonth.totalEarnings) / previousMonth.totalEarnings) * 100
    : 0;

  const servicesChange = previousMonth.totalServices > 0
    ? ((currentMonth.totalServices - previousMonth.totalServices) / previousMonth.totalServices) * 100
    : 0;

  const avgCommissionPerBarber = currentMonth.activeBarbers > 0 ? currentCommissions / currentMonth.activeBarbers : 0;
  const prevAvgCommissionPerBarber = previousMonth.activeBarbers > 0 ? previousCommissions / previousMonth.activeBarbers : 0;
  const avgCommissionChange = prevAvgCommissionPerBarber > 0
    ? ((avgCommissionPerBarber - prevAvgCommissionPerBarber) / prevAvgCommissionPerBarber) * 100
    : 0;

  return {
    // Datos actuales
    totalCommissions: currentCommissions,
    totalEarnings: currentMonth.totalEarnings,
    avgCommissionPerBarber,
    activeBarbers: currentMonth.activeBarbers,
    totalServices: currentMonth.totalServices,

    // Datos del mes anterior
    previousMonth: {
      totalCommissions: previousCommissions,
      totalEarnings: previousMonth.totalEarnings,
      avgCommissionPerBarber: prevAvgCommissionPerBarber,
      totalServices: previousMonth.totalServices
    },

    // Comparativas (% de cambio)
    changes: {
      commissions: commissionsChange,
      earnings: earningsChange,
      avgCommission: avgCommissionChange,
      services: servicesChange
    }
  };
};

/**
 * Calcula la comisión individual de un barbero
 * @param {number} totalRevenue - Ingresos totales del barbero
 * @param {number} commissionRate - Tasa de comisión (default 0.7)
 * @returns {number} Comisión calculada
 */
export const calculateBarberCommission = (totalRevenue, commissionRate = COMMISSION_RATES.DEFAULT) => {
  return totalRevenue * commissionRate;
};

/**
 * Calcula el cambio porcentual entre dos valores
 * @param {number} current - Valor actual
 * @param {number} previous - Valor anterior
 * @returns {number} Cambio porcentual
 */
export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Calcula margen neto después de comisiones
 * @param {number} totalEarnings - Ingresos totales
 * @param {number} totalCommissions - Comisiones totales
 * @returns {number} Margen neto en porcentaje
 */
export const calculateNetMargin = (totalEarnings, totalCommissions) => {
  if (totalEarnings === 0) return 0;
  return ((totalEarnings - totalCommissions) / totalEarnings) * 100;
};

/**
 * Simula cambio individual para top performers (entre -10% y +25%)
 * Usado para demo de cambios individuales
 * @returns {number} Cambio porcentual aleatorio
 */
export const simulateIndividualChange = () => {
  return -10 + (Math.random() * 35);
};
