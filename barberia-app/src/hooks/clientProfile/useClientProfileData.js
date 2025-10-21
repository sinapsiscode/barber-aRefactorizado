import { useClientStore } from '../../stores';

/**
 * Hook para obtener datos calculados del perfil del cliente
 */
export const useClientProfileData = (client) => {
  const { calculateLoyaltyTier, getLoyaltyRecommendations } = useClientStore();

  const tier = calculateLoyaltyTier(client);
  const recommendations = getLoyaltyRecommendations(client.id);

  const getDaysSinceLastVisit = () => {
    if (!client.lastVisit) return 'Nunca';
    const days = Math.floor((new Date() - new Date(client.lastVisit)) / (1000 * 60 * 60 * 24));
    return `${days} días`;
  };

  const getDaysUntilNextWarning = (warningInterval) => {
    if (!client.lastVisit) return warningInterval;
    const daysSinceVisit = Math.floor((new Date() - new Date(client.lastVisit)) / (1000 * 60 * 60 * 24));
    return Math.max(0, warningInterval - daysSinceVisit);
  };

  return {
    tier,
    recommendations,
    daysSinceLastVisit: getDaysSinceLastVisit(),
    getDaysUntilNextWarning
  };
};
