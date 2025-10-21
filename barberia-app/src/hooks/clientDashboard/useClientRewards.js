import { useMemo } from 'react';
import { useLoyaltyStore } from '../../stores';

/**
 * Hook para gestionar puntos y recompensas del cliente
 */
export const useClientRewards = (currentClient) => {
  const loyaltyStore = useLoyaltyStore();

  // Usar useMemo para calcular valores derivados
  // No incluir las funciones en dependencias para evitar loops
  const currentPoints = useMemo(() => {
    if (!currentClient) return 0;
    return loyaltyStore.getClientPoints(currentClient.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentClient?.id, loyaltyStore.pointsTransactions]);

  const activeRewards = useMemo(() => {
    if (!currentClient) return [];
    return loyaltyStore.getClientActiveRewards(currentClient.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentClient?.id, loyaltyStore.clientRewards]);

  const handleRewardRedeemed = () => {
    // Los valores se recalcularán automáticamente por useMemo
    // cuando cambien pointsTransactions o clientRewards
  };

  return {
    currentPoints,
    activeRewards,
    handleRewardRedeemed
  };
};
