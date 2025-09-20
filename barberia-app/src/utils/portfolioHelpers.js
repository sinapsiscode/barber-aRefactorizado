import { PORTFOLIO_TEXTS } from '../constants/portfolio';

// Obtener título según el rol del usuario
export const getPortfolioTitle = (userRole) => {
  switch (userRole) {
    case 'barber':
      return PORTFOLIO_TEXTS.TITLE_BARBER;
    case 'client':
      return PORTFOLIO_TEXTS.TITLE_CLIENT;
    default:
      return PORTFOLIO_TEXTS.TITLE_ADMIN;
  }
};

// Obtener subtítulo según el rol y sede
export const getPortfolioSubtitle = (userRole, selectedBranch) => {
  switch (userRole) {
    case 'barber':
      return PORTFOLIO_TEXTS.SUBTITLE_BARBER;
    case 'client':
      return PORTFOLIO_TEXTS.SUBTITLE_CLIENT;
    case 'super_admin':
    case 'reception':
      if (selectedBranch) {
        return PORTFOLIO_TEXTS.SUBTITLE_ADMIN_BRANCH.replace('{city}', selectedBranch.city);
      }
      return PORTFOLIO_TEXTS.SUBTITLE_ADMIN;
    default:
      return PORTFOLIO_TEXTS.SUBTITLE_ADMIN;
  }
};

// Filtrar portafolio según permisos y filtros
export const filterPortfolio = (portfolioItems, user, selectedBranch, availableBarbers, selectedBarber, selectedService) => {
  return portfolioItems.filter(item => {
    // Si es barbero, solo mostrar sus propios trabajos
    if (user?.role === 'barber' && item.barberId !== user.id) return false;

    // Si es cliente, solo mostrar sus propias fotos
    if (user?.role === 'client' && item.clientId !== user.id) return false;

    // Para super admin y reception, filtrar por sede seleccionada si hay una
    if ((user?.role === 'super_admin' || user?.role === 'reception') && selectedBranch) {
      const barber = availableBarbers.find(b => b.id === item.barberId);
      if (barber && barber.branchId !== selectedBranch.id) return false;
    }

    // Aplicar filtros generales
    if (selectedBarber && item.barberId.toString() !== selectedBarber) return false;
    if (selectedService && item.serviceId.toString() !== selectedService) return false;
    return true;
  });
};

// Agrupar portafolio por barbero con estadísticas
export const groupPortfolioByBarber = (filteredPortfolio, availableBarbers) => {
  return availableBarbers.map(barber => {
    const barberWork = filteredPortfolio.filter(item => item.barberId === barber.id);
    const ratedWork = barberWork.filter(item => item.rating > 0);
    const avgRating = ratedWork.length > 0
      ? (ratedWork.reduce((sum, item) => sum + item.rating, 0) / ratedWork.length).toFixed(1)
      : 0;

    return {
      ...barber,
      workCount: barberWork.length,
      avgRating: parseFloat(avgRating),
      latestWork: barberWork.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
    };
  });
};

// Calcular promedio de calificaciones para barbero
export const calculateAverageRating = (portfolioItems) => {
  const ratedItems = portfolioItems.filter(item => item.rating > 0);
  if (ratedItems.length === 0) return '0.0';

  const average = ratedItems.reduce((sum, item) => sum + item.rating, 0) / ratedItems.length;
  return average.toFixed(1);
};

// Calcular trabajos del mes actual
export const getThisMonthWork = (portfolioItems) => {
  return portfolioItems.filter(item => {
    const itemDate = new Date(item.date);
    const now = new Date();
    return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
  }).length;
};

// Obtener servicios únicos realizados por un cliente
export const getUniqueServicesCount = (portfolioItems) => {
  return new Set(portfolioItems.map(item => item.serviceId)).size;
};

// Obtener fecha del último servicio
export const getLastServiceDate = (portfolioItems) => {
  if (portfolioItems.length === 0) return 'N/A';

  const lastDate = Math.max(...portfolioItems.map(item => new Date(item.date)));
  return new Date(lastDate).toLocaleDateString();
};

// Crear nuevo item de portafolio
export const createNewPortfolioItem = (newWork, user) => {
  return {
    id: Date.now(),
    barberId: user.id,
    barberName: user.name,
    clientId: null,
    clientName: newWork.clientName,
    service: newWork.service,
    serviceId: parseInt(newWork.serviceId),
    beforePhoto: newWork.beforePhoto ? `/images/portfolio/before_${Date.now()}.jpg` : '/images/portfolio/default_before.jpg',
    afterPhoto: newWork.afterPhoto ? `/images/portfolio/after_${Date.now()}.jpg` : '/images/portfolio/default_after.jpg',
    date: newWork.date,
    rating: 0,
    notes: newWork.notes
  };
};

// Obtener texto de calificación
export const getRatingText = (rating) => {
  switch (rating) {
    case 1: return PORTFOLIO_TEXTS.RATING_VERY_BAD;
    case 2: return PORTFOLIO_TEXTS.RATING_BAD;
    case 3: return PORTFOLIO_TEXTS.RATING_REGULAR;
    case 4: return PORTFOLIO_TEXTS.RATING_GOOD;
    case 5: return PORTFOLIO_TEXTS.RATING_EXCELLENT;
    default: return PORTFOLIO_TEXTS.RATING_EXCELLENT;
  }
};

// Validar formulario de nuevo trabajo
export const validateNewWork = (newWork) => {
  return newWork.clientName && newWork.serviceId;
};

// Procesar subida de foto
export const processPhotoUpload = (file, callback) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    callback({
      file: file,
      preview: e.target.result,
      name: file.name
    });
  };
  reader.readAsDataURL(file);
};

// Simular delay para operaciones async
export const simulateAsyncOperation = (delay = 1000) => {
  return new Promise(resolve => setTimeout(resolve, delay));
};