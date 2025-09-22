import { COMMISSION_RATES, SIMULATION_CONFIG, LIMITS } from '../constants/staffPage';

// Calcular comisiones para Super Admin
export const calculateCommissions = (barbers, user, selectedBranch) => {
  if (user?.role !== 'super_admin') return null;

  const targetBarbers = user?.role === 'super_admin' && selectedBranch
    ? barbers.filter(barber => barber.branchId === selectedBranch.id)
    : barbers;

  // Datos del mes actual
  const currentMonth = {
    totalEarnings: targetBarbers.reduce((sum, barber) => sum + (barber.totalEarnings || 0), 0),
    activeBarbers: targetBarbers.filter(b => b.status === 'active').length,
    totalServices: targetBarbers.reduce((sum, barber) => sum + (barber.totalServices || 0), 0)
  };

  // Simular datos del mes anterior
  const previousMonth = {
    totalEarnings: Math.round(currentMonth.totalEarnings * COMMISSION_RATES.PREVIOUS_MONTH_SIMULATION),
    activeBarbers: currentMonth.activeBarbers,
    totalServices: Math.round(currentMonth.totalServices * SIMULATION_CONFIG.SERVICES_CHANGE_MULTIPLIER)
  };

  // Cálculos de comisiones
  const currentCommissions = currentMonth.totalEarnings * COMMISSION_RATES.BARBER_COMMISSION;
  const previousCommissions = previousMonth.totalEarnings * COMMISSION_RATES.BARBER_COMMISSION;

  // Cálculos comparativos
  const commissionsChange = calculatePercentageChange(currentCommissions, previousCommissions);
  const earningsChange = calculatePercentageChange(currentMonth.totalEarnings, previousMonth.totalEarnings);
  const servicesChange = calculatePercentageChange(currentMonth.totalServices, previousMonth.totalServices);

  const avgCommissionPerBarber = currentMonth.activeBarbers > 0 ? currentCommissions / currentMonth.activeBarbers : 0;
  const prevAvgCommissionPerBarber = previousMonth.activeBarbers > 0 ? previousCommissions / previousMonth.activeBarbers : 0;
  const avgCommissionChange = calculatePercentageChange(avgCommissionPerBarber, prevAvgCommissionPerBarber);

  return {
    totalCommissions: currentCommissions,
    totalEarnings: currentMonth.totalEarnings,
    avgCommissionPerBarber,
    activeBarbers: currentMonth.activeBarbers,
    totalServices: currentMonth.totalServices,
    previousMonth: {
      totalCommissions: previousCommissions,
      totalEarnings: previousMonth.totalEarnings,
      avgCommissionPerBarber: prevAvgCommissionPerBarber,
      totalServices: previousMonth.totalServices
    },
    changes: {
      commissions: commissionsChange,
      earnings: earningsChange,
      avgCommission: avgCommissionChange,
      services: servicesChange
    }
  };
};

// Calcular cambio porcentual
export const calculatePercentageChange = (current, previous) => {
  return previous > 0 ? ((current - previous) / previous) * 100 : 0;
};

// Filtrar barberos según la sede seleccionada
export const filterBarbersByBranch = (barbers, user, selectedBranch) => {
  return user?.role === 'super_admin' && selectedBranch
    ? barbers.filter(barber => barber.branchId === selectedBranch.id)
    : barbers;
};

// Obtener servicios realizados por un barbero
export const getServicesPerformedByBarber = (barberId, appointments, services) => {
  const barberAppointments = appointments.filter(apt =>
    apt.barberId === barberId && apt.status === 'completed'
  );

  const servicesMap = {};
  let totalRevenue = 0;

  barberAppointments.forEach(apt => {
    apt.services.forEach(serviceId => {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        const serviceRevenue = apt.totalPrice / apt.services.length;

        if (servicesMap[serviceId]) {
          servicesMap[serviceId].count += 1;
          servicesMap[serviceId].revenue += serviceRevenue;
        } else {
          servicesMap[serviceId] = {
            id: serviceId,
            name: service.name,
            count: 1,
            revenue: serviceRevenue
          };
        }
        totalRevenue += serviceRevenue;
      }
    });
  });

  return {
    services: Object.values(servicesMap).sort((a, b) => b.count - a.count),
    totalServices: barberAppointments.length,
    totalRevenue: totalRevenue
  };
};

// Generar ranking de barberos por ingresos
export const getTopPerformersByEarnings = (barbers, limit = LIMITS.TOP_PERFORMERS) => {
  return barbers
    .sort((a, b) => (b.totalEarnings || 0) - (a.totalEarnings || 0))
    .slice(0, limit);
};

// Generar ranking de barberos por servicios
export const getTopPerformersByServices = (barbers, limit = LIMITS.TOP_PERFORMERS) => {
  return barbers
    .sort((a, b) => b.totalServices - a.totalServices)
    .slice(0, limit);
};

// Calcular porcentaje de servicios de un barbero respecto al total
export const calculateServicePercentage = (barberServices, totalServices) => {
  return totalServices > 0 ? (barberServices / totalServices) * 100 : 0;
};

// Simular cambio individual para un barbero
export const generateIndividualChange = () => {
  return SIMULATION_CONFIG.MIN_CHANGE + (Math.random() * (SIMULATION_CONFIG.MAX_CHANGE - SIMULATION_CONFIG.MIN_CHANGE));
};

// Formatear valor monetario
export const formatCurrency = (value, suffix = '') => {
  if (suffix === 'K') {
    return `S/${(value / 1000).toFixed(1)}K`;
  }
  return `S/${value.toLocaleString()}`;
};

// Calcular eficiencia (servicios por día por barbero)
export const calculateEfficiency = (totalServices, barberCount) => {
  return barberCount > 0 ? Math.round((totalServices / barberCount) / LIMITS.DAYS_IN_MONTH) : 0;
};

// Obtener color de ranking según posición
export const getRankingColor = (index) => {
  switch (index) {
    case 0:
      return {
        bg: 'bg-yellow-500',
        text: 'text-yellow-800',
        bgLight: 'bg-yellow-100'
      };
    case 1:
      return {
        bg: 'bg-gray-400',
        text: 'text-gray-800',
        bgLight: 'bg-gray-100'
      };
    case 2:
      return {
        bg: 'bg-yellow-600',
        text: 'text-orange-800',
        bgLight: 'bg-orange-100'
      };
    default:
      return {
        bg: 'bg-blue-500',
        text: 'text-blue-800',
        bgLight: 'bg-blue-100'
      };
  }
};

// Validar si un barbero está presente
export const isBarberPresent = (barber) => {
  return barber.isPresent === true;
};

// Calcular promedio de calificaciones
export const calculateAverageRating = (barbers) => {
  const totalRating = barbers.reduce((sum, barber) => sum + (barber.rating || 0), 0);
  return barbers.length > 0 ? (totalRating / barbers.length).toFixed(1) : '0.0';
};

// Obtener barberos presentes hoy
export const getPresentBarbers = (barbers) => {
  return barbers.filter(barber => isBarberPresent(barber));
};

// Calcular tasa de asistencia
export const calculateAttendanceRate = (presentCount, totalCount) => {
  return totalCount > 0 ? (presentCount / totalCount) * 100 : 0;
};