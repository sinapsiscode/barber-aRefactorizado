/**
 * Utilidades de filtrado para el portafolio
 */

/**
 * Filtrar portafolio por rol de usuario
 */
export const filterByRole = (portfolioItems, user) => {
  return portfolioItems.filter(item => {
    // Barberos solo ven sus propios trabajos
    if (user?.role === 'barber') {
      return item.barberId === user.id;
    }

    // Clientes solo ven sus propias fotos
    if (user?.role === 'client') {
      return item.clientId === user.id;
    }

    // Admins y recepción ven todo (filtrado por sucursal se aplica después)
    return true;
  });
};

/**
 * Filtrar portafolio por sucursal
 */
export const filterByBranch = (portfolioItems, selectedBranch, barbers) => {
  if (!selectedBranch) return portfolioItems;

  return portfolioItems.filter(item => {
    const barber = barbers.find(b => b.id === item.barberId);
    return barber && barber.branchId === selectedBranch.id;
  });
};

/**
 * Filtrar por barbero seleccionado
 */
export const filterByBarber = (portfolioItems, selectedBarberId) => {
  if (!selectedBarberId) return portfolioItems;
  return portfolioItems.filter(item => item.barberId.toString() === selectedBarberId);
};

/**
 * Filtrar por servicio seleccionado
 */
export const filterByService = (portfolioItems, selectedServiceId) => {
  if (!selectedServiceId) return portfolioItems;
  return portfolioItems.filter(item => item.serviceId.toString() === selectedServiceId);
};

/**
 * Aplicar todos los filtros
 */
export const applyAllFilters = (portfolioItems, filters) => {
  const { user, selectedBranch, barbers, selectedBarber, selectedService } = filters;

  let result = portfolioItems;

  // Filtro por rol
  result = filterByRole(result, user);

  // Filtro por sucursal (solo para super_admin y reception)
  if ((user?.role === 'super_admin' || user?.role === 'reception') && selectedBranch) {
    result = filterByBranch(result, selectedBranch, barbers);
  }

  // Filtros generales
  result = filterByBarber(result, selectedBarber);
  result = filterByService(result, selectedService);

  return result;
};
