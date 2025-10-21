/**
 * Configuración de niveles de lealtad
 * Define los thresholds de gasto y colores para cada tier
 */

export const LOYALTY_TIERS = [
  {
    name: 'Bronze',
    minSpent: 0,
    maxSpent: 199999,
    color: 'bg-orange-100 text-orange-800',
    icon: '🥉',
    benefits: 'Puntos básicos',
    multiplier: 1.0
  },
  {
    name: 'Silver',
    minSpent: 200000,
    maxSpent: 499999,
    color: 'bg-gray-100 text-gray-800',
    icon: '🥈',
    benefits: '5% descuento + puntos x1.2',
    multiplier: 1.2
  },
  {
    name: 'Gold',
    minSpent: 500000,
    maxSpent: 999999,
    color: 'bg-yellow-100 text-yellow-800',
    icon: '🥇',
    benefits: '10% descuento + puntos x1.5',
    multiplier: 1.5
  },
  {
    name: 'Platinum',
    minSpent: 1000000,
    maxSpent: null, // Sin límite
    color: 'bg-purple-100 text-purple-800',
    icon: '💎',
    benefits: '15% descuento + puntos x2.0',
    multiplier: 2.0
  }
];

/**
 * Colores para la distribución de tiers en gráficos
 */
export const TIER_CHART_COLORS = {
  Platinum: 'bg-purple-500',
  Gold: 'bg-yellow-500',
  Silver: 'bg-gray-400',
  Bronze: 'bg-orange-500'
};
