/**
 * Utilidades para cálculo de estadísticas del portafolio
 */

/**
 * Calcular rating promedio
 */
export const calculateAverageRating = (portfolioItems) => {
  const ratedItems = portfolioItems.filter(item => item.rating > 0);
  if (ratedItems.length === 0) return 0;

  const sum = ratedItems.reduce((acc, item) => acc + item.rating, 0);
  return (sum / ratedItems.length).toFixed(1);
};

/**
 * Contar trabajos del mes actual
 */
export const countThisMonthWorks = (portfolioItems) => {
  const now = new Date();
  return portfolioItems.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate.getMonth() === now.getMonth() &&
           itemDate.getFullYear() === now.getFullYear();
  }).length;
};

/**
 * Obtener fecha del último servicio
 */
export const getLastServiceDate = (portfolioItems) => {
  if (portfolioItems.length === 0) return null;

  const dates = portfolioItems.map(item => new Date(item.date));
  const maxDate = new Date(Math.max(...dates));

  return maxDate.toLocaleDateString();
};

/**
 * Contar servicios únicos realizados
 */
export const countUniqueServices = (portfolioItems) => {
  const serviceIds = portfolioItems.map(item => item.serviceId);
  return new Set(serviceIds).size;
};

/**
 * Agrupar portafolio por barbero con estadísticas
 */
export const groupByBarber = (portfolioItems, barbers) => {
  return barbers.map(barber => {
    const barberWork = portfolioItems.filter(item => item.barberId === barber.id);
    const ratedWork = barberWork.filter(item => item.rating > 0);
    const avgRating = ratedWork.length > 0
      ? (ratedWork.reduce((sum, item) => sum + item.rating, 0) / ratedWork.length).toFixed(1)
      : 0;

    const latestWork = barberWork.length > 0
      ? barberWork.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
      : null;

    return {
      ...barber,
      workCount: barberWork.length,
      avgRating: parseFloat(avgRating),
      latestWork
    };
  });
};

/**
 * Estadísticas para barbero
 */
export const getBarberStats = (portfolioItems) => {
  return {
    totalWorks: portfolioItems.length,
    averageRating: parseFloat(calculateAverageRating(portfolioItems)),
    thisMonth: countThisMonthWorks(portfolioItems)
  };
};

/**
 * Estadísticas para cliente
 */
export const getClientStats = (portfolioItems) => {
  return {
    totalPhotos: portfolioItems.length,
    uniqueServices: countUniqueServices(portfolioItems),
    lastService: getLastServiceDate(portfolioItems)
  };
};
