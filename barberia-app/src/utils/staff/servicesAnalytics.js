/**
 * Obtiene servicios realizados por un barbero
 * Líneas 172-205 del original
 * @param {string} barberId - ID del barbero
 * @param {Array} appointments - Array de citas filtradas
 * @param {Array} services - Array de servicios disponibles
 * @returns {Object} Datos de servicios realizados
 */
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
        // Dividir precio entre servicios para distribución equitativa
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

/**
 * Calcula el porcentaje de un servicio sobre el total
 * @param {number} serviceCount - Cantidad del servicio
 * @param {number} totalServices - Total de servicios
 * @returns {number} Porcentaje
 */
export const calculateServicePercentage = (serviceCount, totalServices) => {
  if (totalServices === 0) return 0;
  return (serviceCount / totalServices) * 100;
};

/**
 * Ordena barberos por cantidad de servicios
 * @param {Array} barbers - Array de barberos
 * @param {boolean} descending - Orden descendente (default true)
 * @returns {Array} Barberos ordenados
 */
export const sortBarbersByServices = (barbers, descending = true) => {
  return [...barbers].sort((a, b) =>
    descending
      ? b.totalServices - a.totalServices
      : a.totalServices - b.totalServices
  );
};

/**
 * Ordena barberos por ingresos
 * @param {Array} barbers - Array de barberos
 * @param {boolean} descending - Orden descendente (default true)
 * @returns {Array} Barberos ordenados
 */
export const sortBarbersByEarnings = (barbers, descending = true) => {
  return [...barbers].sort((a, b) =>
    descending
      ? (b.totalEarnings || 0) - (a.totalEarnings || 0)
      : (a.totalEarnings || 0) - (b.totalEarnings || 0)
  );
};
