import { SORT_OPTIONS, FILTER_OPTIONS, PRICE_CONFIG, SERVICES_TEXTS } from '../constants/servicesPage';

// Filtrar servicios por criterios
export const filterServices = (services, searchTerm, selectedCategory, filterBy) => {
  return services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        service.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' ||
                          (selectedCategory === 'popular' && service.popular) ||
                          service.category?.toLowerCase() === selectedCategory;

    const matchesFilter = filterBy === FILTER_OPTIONS.ALL ||
                        (filterBy === FILTER_OPTIONS.POPULAR && service.popular) ||
                        (filterBy === FILTER_OPTIONS.DISCOUNTS && service.discount);

    return matchesSearch && matchesCategory && matchesFilter;
  });
};

// Ordenar servicios
export const sortServices = (services, sortBy) => {
  return [...services].sort((a, b) => {
    switch (sortBy) {
      case SORT_OPTIONS.PRICE:
        return a.price - b.price;
      case SORT_OPTIONS.DURATION:
        return a.duration - b.duration;
      case SORT_OPTIONS.POPULAR:
        return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      default:
        return a.name.localeCompare(b.name);
    }
  });
};

// Obtener servicios filtrados y ordenados
export const getFilteredAndSortedServices = (services, filters) => {
  const { searchTerm, selectedCategory, sortBy, filterBy } = filters;

  const filtered = filterServices(services, searchTerm, selectedCategory, filterBy);
  return sortServices(filtered, sortBy);
};

// Verificar permisos del usuario
export const getUserPermissions = (userRole, rolePermissions) => {
  return rolePermissions[userRole] || {
    canManagePricing: false,
    canAddService: false,
    canEditService: false,
    canDeleteService: false
  };
};

// Formatear precio
export const formatPrice = (price) => {
  return `${PRICE_CONFIG.CURRENCY}${price.toFixed(PRICE_CONFIG.DECIMAL_PLACES)}`;
};

// Generar imagen de fallback para servicios
export const generateFallbackImage = (serviceName) => {
  const safeName = serviceName.replace(/[^\w\s]/g, '');
  const svgContent = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><g transform="translate(200,150)"><circle cx="0" cy="-30" r="25" fill="#d1d5db"/><rect x="-15" y="-10" width="30" height="40" rx="5" fill="#d1d5db"/><text x="0" y="70" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="14">${safeName}</text></g></svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgContent)))}`;
};

// Obtener mensaje de reserva
export const getBookingMessage = (serviceName) => {
  return SERVICES_TEXTS.BOOK_SUCCESS.replace('{serviceName}', serviceName);
};

// Obtener conteo de fotos
export const getPhotosCountText = (count) => {
  return SERVICES_TEXTS.PHOTOS_COUNT.replace('{count}', count || 0);
};

// Verificar si un servicio está en favoritos
export const isServiceFavorite = (serviceId, favorites) => {
  return favorites.includes(serviceId);
};

// Alternar favorito
export const toggleFavorite = (serviceId, favorites) => {
  return favorites.includes(serviceId)
    ? favorites.filter(id => id !== serviceId)
    : [...favorites, serviceId];
};

// Validar precio
export const validatePrice = (price) => {
  const numPrice = parseFloat(price);
  return !isNaN(numPrice) && numPrice >= PRICE_CONFIG.MIN_PRICE && numPrice <= PRICE_CONFIG.MAX_PRICE;
};

// Obtener badge de descuento
export const getDiscountBadge = (discount) => {
  return SERVICES_TEXTS.DISCOUNT_BADGE.replace('{discount}', discount);
};

// Truncar descripción
export const truncateDescription = (description, maxLength) => {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength) + '...';
};

// Obtener alt text para imagen
export const getServiceImageAlt = (serviceName) => {
  return SERVICES_TEXTS.SERVICE_IMAGE_ALT.replace('{serviceName}', serviceName);
};