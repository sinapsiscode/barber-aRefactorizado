// Commission rates
export const COMMISSION_RATES = {
  DEFAULT: 0.7, // 70% para barberos
  RETENTION: 0.3 // 30% retención barbería
};

// Previous month simulation rate (para demo)
export const PREVIOUS_MONTH_SIMULATION = {
  EARNINGS_RATE: 0.85, // 85% del actual
  SERVICES_RATE: 0.88 // 88% del actual
};

// Medal positions colors
export const MEDAL_COLORS = {
  FIRST: 'bg-yellow-500',
  SECOND: 'bg-gray-400',
  THIRD: 'bg-yellow-600',
  OTHER: 'bg-blue-500'
};

// Status colors
export const STATUS_COLORS = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-600',
  PRESENT: 'bg-green-100 text-green-800',
  ABSENT: 'bg-gray-100 text-gray-600'
};

// Table display limits
export const DISPLAY_LIMITS = {
  TOP_PERFORMERS: 5,
  SPECIALTIES_PREVIEW: 2,
  CURRENT_STATUS: 5,
  SERVICES_DROPDOWN_MAX_HEIGHT: 64 // en unidades de Tailwind (16 = 4rem)
};

// Services per day calculation (assuming 30 days month)
export const DAYS_PER_MONTH = 30;

// Default country code
export const DEFAULT_COUNTRY = 'PE';
