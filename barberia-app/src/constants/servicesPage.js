import { FiScissors, FiStar, FiGift, FiAward } from 'react-icons/fi';

// Categorías de servicios
export const SERVICE_CATEGORIES = [
  { id: 'all', name: 'Todos', icon: FiScissors },
  { id: 'popular', name: 'Populares', icon: FiStar },
  { id: 'cortes', name: 'Cortes', icon: FiScissors },
  { id: 'barba', name: 'Barba', icon: FiScissors },
  { id: 'combos', name: 'Combos', icon: FiGift },
  { id: 'tratamientos', name: 'Tratamientos', icon: FiAward }
];

// Opciones de ordenamiento
export const SORT_OPTIONS = {
  NAME: 'name',
  PRICE: 'price',
  DURATION: 'duration',
  POPULAR: 'popular'
};

// Opciones de filtrado
export const FILTER_OPTIONS = {
  ALL: 'all',
  POPULAR: 'popular',
  DISCOUNTS: 'discounts'
};

// Modos de vista
export const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list'
};

// Textos de la interfaz
export const SERVICES_TEXTS = {
  // Títulos principales
  HERO_TITLE: 'Nuestros Servicios',
  HERO_SUBTITLE: 'Experimenta el arte de la barbería con nuestros servicios profesionales diseñados para el caballero moderno',
  MANAGEMENT_TITLE: 'Gestión de Servicios',
  MANAGEMENT_SUBTITLE: 'Administra el catálogo de servicios de barbería',

  // Botones
  NEW_SERVICE: 'Nuevo Servicio',
  CONFIGURE_PRICES: 'Configurar Precios',
  BOOK_SERVICE: 'Reservar',
  VIEW_GALLERY: 'Ver galería',
  EDIT_SERVICE: 'Editar',
  ADD_TO_FAVORITES: 'Agregar a favoritos',

  // Labels y placeholders
  SEARCH_PLACEHOLDER: 'Buscar servicios...',
  PHOTOS_COUNT: '{count} fotos',
  MINUTES_LABEL: 'min',

  // Badges
  POPULAR_BADGE: '🔥 Popular',
  DISCOUNT_BADGE: '-{discount}%',

  // Mensajes
  BOOK_SUCCESS: '¡Perfecto! Te redirigiremos para reservar: {serviceName}',
  NO_SERVICES: 'No se encontraron servicios',
  NO_SERVICES_DESCRIPTION: 'Intenta cambiar los filtros o buscar algo diferente',

  // Tooltips
  PRICING_TOOLTIP: 'Gestionar precios de la sede',
  VIDEO_INDICATOR: 'Ver video',
  FAVORITE_TOOLTIP: 'Agregar a favoritos',

  // Accesibilidad
  SERVICE_IMAGE_ALT: 'Imagen del servicio {serviceName}',
  CATEGORY_BUTTON_LABEL: 'Filtrar por categoría {categoryName}',
  SORT_BUTTON_LABEL: 'Ordenar por {sortType}',
  VIEW_MODE_LABEL: 'Cambiar a vista {viewMode}'
};

// Configuración de límites
export const SERVICES_LIMITS = {
  MAX_FEATURES_DISPLAYED: 2,
  MAX_DESCRIPTION_LENGTH: 150,
  GALLERY_PREVIEW_LIMIT: 3
};

// Configuración de precios
export const PRICE_CONFIG = {
  CURRENCY: 'S/',
  DECIMAL_PLACES: 0,
  MIN_PRICE: 0,
  MAX_PRICE: 999
};

// Estados iniciales
export const INITIAL_FILTERS = {
  selectedCategory: 'all',
  searchTerm: '',
  viewMode: VIEW_MODES.GRID,
  sortBy: SORT_OPTIONS.NAME,
  filterBy: FILTER_OPTIONS.ALL
};

// Configuración de permisos por rol
export const ROLE_PERMISSIONS = {
  super_admin: {
    canManagePricing: true,
    canAddService: true,
    canEditService: true,
    canDeleteService: true
  },
  branch_admin: {
    canManagePricing: true,
    canAddService: true,
    canEditService: true,
    canDeleteService: false
  },
  reception: {
    canManagePricing: false,
    canAddService: false,
    canEditService: false,
    canDeleteService: false
  },
  barber: {
    canManagePricing: false,
    canAddService: false,
    canEditService: false,
    canDeleteService: false
  },
  client: {
    canManagePricing: false,
    canAddService: false,
    canEditService: false,
    canDeleteService: false
  }
};

// Configuración de estilos para categorías
export const CATEGORY_STYLES = {
  ACTIVE: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/30',
  INACTIVE: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-yellow-500/20 hover:border-yellow-500/50 hover:text-yellow-600 dark:hover:text-yellow-400'
};

// Configuración de animaciones
export const ANIMATION_CONFIG = {
  HOVER_SCALE: 'hover:scale-105',
  HOVER_TRANSLATE: 'hover:-translate-y-1',
  TRANSITION_DURATION: 'transition-all duration-300'
};