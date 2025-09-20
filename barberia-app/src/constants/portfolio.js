// Configuración de servicios disponibles
export const SERVICES = [
  { id: 1, name: 'Corte Clásico' },
  { id: 2, name: 'Corte + Barba' },
  { id: 3, name: 'Barba' },
  { id: 4, name: 'Corte Premium' },
  { id: 5, name: 'Diseño de Barba' },
  { id: 6, name: 'Fade Moderno' },
  { id: 7, name: 'Tinte' },
  { id: 8, name: 'Tratamiento Capilar' }
];

// Textos de la interfaz
export const PORTFOLIO_TEXTS = {
  // Títulos principales por rol
  TITLE_BARBER: 'Mi Portafolio',
  TITLE_CLIENT: 'Mis Fotos Antes y Después',
  TITLE_ADMIN: 'Portafolio de Barberos',

  // Subtítulos por rol
  SUBTITLE_BARBER: 'Gestiona tus trabajos y fotos del antes y después',
  SUBTITLE_CLIENT: 'Ve las fotos de tus servicios realizados por nuestros barberos',
  SUBTITLE_ADMIN: 'Muestra los trabajos realizados a nuevos clientes',
  SUBTITLE_ADMIN_BRANCH: 'Muestra los trabajos realizados en {city} a nuevos clientes',

  // Botones
  ADD_WORK: 'Agregar Trabajo',
  VIEW_PHOTOS: 'Ver Fotos',
  RATE_SERVICE: 'Calificar Servicio',
  EDIT_RATING: 'Editar Calificación',
  GRID_VIEW: 'Grid',
  LIST_VIEW: 'Lista',

  // Secciones
  FILTERS: 'Filtros',
  WORKS_DONE: 'Trabajos Realizados',
  MY_PHOTOS: 'Mis Fotos del Antes y Después',

  // Labels de filtros
  ALL_BARBERS: 'Todos los barberos',
  ALL_SERVICES: 'Todos los servicios',
  BARBER_LABEL: 'Barbero',
  SERVICE_LABEL: 'Servicio',

  // Estados
  NO_RATING: 'Sin calificar',
  PENDING_RATING: 'Pendiente de calificación por el cliente',
  PHOTO_UPLOADED: 'Foto cargada',

  // Placeholders
  EMPTY_STATE_TITLE: 'No hay trabajos para mostrar',
  EMPTY_STATE_DESCRIPTION: 'Ajusta los filtros para ver más trabajos del portafolio',

  // Formularios
  ADD_WORK_TITLE: 'Agregar Nuevo Trabajo',
  CLIENT_NAME_LABEL: 'Nombre del Cliente *',
  SERVICE_LABEL_REQUIRED: 'Servicio Realizado *',
  SERVICE_DATE_LABEL: 'Fecha del Servicio *',
  PHOTOS_LABEL: 'Fotos del Antes y Después',
  NOTES_LABEL: 'Notas Adicionales',

  // Placeholders formulario
  CLIENT_NAME_PLACEHOLDER: 'Ingresa el nombre del cliente',
  SELECT_SERVICE_PLACEHOLDER: 'Seleccionar servicio',
  NOTES_PLACEHOLDER: 'Detalles especiales del trabajo, técnicas utilizadas, comentarios del cliente...',

  // Botones formulario
  SAVE_WORK: 'Guardar Trabajo',
  CANCEL: 'Cancelar',
  TAKE_PHOTO: 'Tomar Foto',
  CHANGE_PHOTO: 'Cambiar Foto',
  PHOTO_BEFORE: 'Foto Antes',
  PHOTO_AFTER: 'Foto Después',

  // Modal de calificación
  RATING_TITLE: 'Calificar Servicio',
  EDIT_RATING_TITLE: 'Editar Calificación',
  YOUR_RATING: 'Tu Calificación *',
  COMMENT_LABEL: 'Comentario (opcional)',
  COMMENT_PLACEHOLDER: 'Comparte tu experiencia con este servicio...',
  SEND_RATING: 'Enviar Calificación',
  UPDATE_RATING: 'Actualizar Calificación',

  // Etiquetas de calificación
  RATING_VERY_BAD: 'Muy malo',
  RATING_BAD: 'Malo',
  RATING_REGULAR: 'Regular',
  RATING_GOOD: 'Bueno',
  RATING_EXCELLENT: 'Excelente',

  // Mensajes de éxito
  WORK_ADDED_SUCCESS: 'Trabajo agregado exitosamente al portafolio',
  RATING_SAVED_SUCCESS: '¡Calificación guardada exitosamente!',

  // Mensajes de error
  REQUIRED_FIELDS_ERROR: 'Por favor completa los campos obligatorios',
  SAVE_WORK_ERROR: 'Error al guardar el trabajo. Por favor intenta nuevamente.',
  SAVE_RATING_ERROR: 'Error al guardar la calificación. Por favor intenta nuevamente.',

  // Contadores
  WORKS_FOUND: '{count} trabajos encontrados',
  TOTAL_WORKS: 'Total Trabajos',
  AVERAGE_RATING: 'Calificación Promedio',
  THIS_MONTH: 'Este Mes',
  TOTAL_PHOTOS: 'Total Fotos',
  SERVICES_DONE: 'Servicios Realizados',
  LAST_SERVICE: 'Último Servicio',
  LATEST_WORK: 'Último trabajo:',
  WORKS_COUNT: '{count} trabajos'
};

// Configuración de vistas
export const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list'
};

// Estados del portafolio
export const PORTFOLIO_STATES = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Configuración de colores para métricas
export const METRIC_COLORS = {
  BLUE: 'blue',
  YELLOW: 'yellow',
  GREEN: 'green',
  PURPLE: 'purple'
};

// Configuración de formulario de nuevo trabajo
export const NEW_WORK_INITIAL_STATE = {
  clientName: '',
  service: '',
  serviceId: '',
  date: new Date().toISOString().split('T')[0],
  notes: '',
  beforePhoto: null,
  afterPhoto: null
};

// Configuración de calificación inicial
export const RATING_INITIAL_STATE = {
  newRating: 5,
  ratingComment: ''
};

// Datos mock del portafolio
export const PORTFOLIO_MOCK_DATA = [
  {
    id: 1,
    barberId: 2,
    barberName: 'Miguel Barbero',
    clientId: 3,
    clientName: 'Juan Cliente',
    service: 'Corte + Barba',
    serviceId: 2,
    beforePhoto: '/images/portfolio/before1.jpg',
    afterPhoto: '/images/portfolio/after1.jpg',
    date: '2024-01-15',
    rating: 5,
    notes: 'Cliente muy satisfecho con el resultado'
  },
  {
    id: 2,
    barberId: 2,
    barberName: 'Miguel Barbero',
    clientId: 1,
    clientName: 'Juan Carlos Pérez',
    service: 'Fade Moderno',
    serviceId: 2,
    beforePhoto: '/images/portfolio/before2.jpg',
    afterPhoto: '/images/portfolio/after2.jpg',
    date: '2024-01-14',
    rating: 5,
    notes: 'Corte moderno, cliente joven'
  },
  {
    id: 3,
    barberId: 2,
    barberName: 'Luis Martínez',
    clientId: 2,
    clientName: 'María Fernanda López',
    service: 'Diseño de Barba',
    serviceId: 5,
    beforePhoto: '/images/portfolio/before3.jpg',
    afterPhoto: '/images/portfolio/after3.jpg',
    date: '2024-01-13',
    rating: 5,
    notes: 'Diseño especial con detalles'
  },
  {
    id: 4,
    barberId: 2,
    barberName: 'Miguel Barbero',
    clientId: 3,
    clientName: 'Juan Cliente',
    service: 'Corte Clásico',
    serviceId: 1,
    beforePhoto: '/images/portfolio/before4.jpg',
    afterPhoto: '/images/portfolio/after4.jpg',
    date: '2024-01-12',
    rating: 4,
    notes: 'Estilo clásico elegante'
  },
  {
    id: 5,
    barberId: 3,
    barberName: 'Carlos Sánchez',
    clientId: 3,
    clientName: 'Juan Cliente',
    service: 'Tinte',
    serviceId: 7,
    beforePhoto: '/images/portfolio/before5.jpg',
    afterPhoto: '/images/portfolio/after5.jpg',
    date: '2024-01-11',
    rating: 5,
    notes: 'Cambio de color exitoso'
  }
];