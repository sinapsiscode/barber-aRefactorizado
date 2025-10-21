import { useLoyaltyStore } from '../../stores';

/**
 * Hook para obtener estadísticas del sistema de lealtad
 */
export const useLoyaltyStats = () => {
  const { getPointsStats } = useLoyaltyStore();
  const pointsStats = getPointsStats();

  return {
    totalEarned: pointsStats.totalEarned,
    totalRedeemed: pointsStats.totalRedeemed,
    totalActive: pointsStats.totalActive
  };
};
