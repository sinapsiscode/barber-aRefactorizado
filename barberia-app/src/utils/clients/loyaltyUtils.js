/**
 * Utilidades para el sistema de lealtad de clientes
 */

import { LOYALTY_TIERS } from '../../constants/clients/loyaltyTiers';

/**
 * Obtiene el tier de lealtad basado en el gasto total
 * @param {number} totalSpent - Gasto total del cliente en soles
 * @returns {{ name: string, color: string, minSpent: number, maxSpent: number|null, icon: string, benefits: string, multiplier: number }}
 */
export const getTierInfo = (totalSpent) => {
  // Validar entrada
  if (typeof totalSpent !== 'number' || totalSpent < 0) {
    console.warn('getTierInfo: totalSpent debe ser un número positivo', totalSpent);
    return LOYALTY_TIERS[0]; // Bronze por defecto
  }

  // Buscar el tier más alto que cumple la condición
  // Itera de atrás hacia adelante para encontrar el tier más alto primero
  for (let i = LOYALTY_TIERS.length - 1; i >= 0; i--) {
    const tier = LOYALTY_TIERS[i];
    if (totalSpent >= tier.minSpent) {
      return tier;
    }
  }

  // Fallback: Bronze (esto no debería ocurrir nunca si Bronze.minSpent = 0)
  return LOYALTY_TIERS[0];
};

/**
 * Calcula el progreso al siguiente tier
 * @param {number} totalSpent - Gasto total del cliente
 * @returns {{ currentTier: object, nextTier: object|null, progress: number, amountNeeded: number }}
 */
export const getTierProgress = (totalSpent) => {
  const currentTier = getTierInfo(totalSpent);
  const currentIndex = LOYALTY_TIERS.findIndex(t => t.name === currentTier.name);

  // Si ya está en el tier más alto
  if (currentIndex === LOYALTY_TIERS.length - 1) {
    return {
      currentTier,
      nextTier: null,
      progress: 100,
      amountNeeded: 0
    };
  }

  const nextTier = LOYALTY_TIERS[currentIndex + 1];
  const amountNeeded = nextTier.minSpent - totalSpent;
  const progress = ((totalSpent - currentTier.minSpent) / (nextTier.minSpent - currentTier.minSpent)) * 100;

  return {
    currentTier,
    nextTier,
    progress: Math.min(Math.max(progress, 0), 100), // Clamp entre 0-100
    amountNeeded: Math.max(amountNeeded, 0)
  };
};

/**
 * Obtiene el nombre del tier basado en el gasto
 * @param {number} totalSpent
 * @returns {string} - 'Bronze', 'Silver', 'Gold', 'Platinum'
 */
export const getTierName = (totalSpent) => {
  return getTierInfo(totalSpent).name;
};

/**
 * Obtiene el color del tier basado en el gasto
 * @param {number} totalSpent
 * @returns {string} - Clase Tailwind CSS
 */
export const getTierColor = (totalSpent) => {
  return getTierInfo(totalSpent).color;
};

/**
 * Obtiene el multiplicador de puntos basado en el tier
 * @param {number} totalSpent
 * @returns {number} - 1.0, 1.2, 1.5, 2.0
 */
export const getTierMultiplier = (totalSpent) => {
  return getTierInfo(totalSpent).multiplier;
};

/**
 * Calcula cuántos puntos ganará un cliente por un monto específico
 * @param {number} amount - Monto del servicio
 * @param {number} totalSpent - Gasto total del cliente (para determinar tier)
 * @param {number} pointsPerSol - Puntos por sol (ej: 1 punto por cada S/10 = 0.1)
 * @returns {number} - Puntos a otorgar
 */
export const calculateLoyaltyPoints = (amount, totalSpent, pointsPerSol = 0.1) => {
  const multiplier = getTierMultiplier(totalSpent);
  const basePoints = amount * pointsPerSol;
  return Math.floor(basePoints * multiplier);
};

/**
 * Obtiene todos los tiers disponibles
 * @returns {Array} - Array de tiers
 */
export const getAllTiers = () => {
  return [...LOYALTY_TIERS];
};

/**
 * Verifica si un cliente es VIP (Gold o Platinum)
 * @param {number} totalSpent
 * @returns {boolean}
 */
export const isVIPClient = (totalSpent) => {
  const tierName = getTierName(totalSpent);
  return tierName === 'Gold' || tierName === 'Platinum';
};
