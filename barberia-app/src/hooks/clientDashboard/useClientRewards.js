import { useState, useEffect } from 'react';
import { useLoyaltyStore } from '../../stores';

/**
 * Hook para gestionar puntos y recompensas del cliente
 */
export const useClientRewards = (currentClient) => {
  const { getClientPoints, getClientActiveRewards } = useLoyaltyStore();
  const [currentPoints, setCurrentPoints] = useState(0);
  const [activeRewards, setActiveRewards] = useState([]);

  useEffect(() => {
    if (currentClient) {
      setCurrentPoints(getClientPoints(currentClient.id));
      setActiveRewards(getClientActiveRewards(currentClient.id));
    }
  }, [currentClient, getClientPoints, getClientActiveRewards]);

  const handleRewardRedeemed = (reward) => {
    // Actualizar puntos después del canje
    if (currentClient) {
      setCurrentPoints(getClientPoints(currentClient.id));
      setActiveRewards(getClientActiveRewards(currentClient.id));
    }
  };

  return {
    currentPoints,
    activeRewards,
    handleRewardRedeemed
  };
};
