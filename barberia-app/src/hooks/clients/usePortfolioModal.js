import { useState, useCallback } from 'react';

/**
 * Hook para manejar el modal de portafolio
 */
export const usePortfolioModal = () => {
  const [selectedPortfolioImage, setSelectedPortfolioImage] = useState(null);

  const openPortfolioImage = useCallback((image) => {
    setSelectedPortfolioImage(image);
  }, []);

  const closePortfolioImage = useCallback(() => {
    setSelectedPortfolioImage(null);
  }, []);

  return {
    selectedPortfolioImage,
    openPortfolioImage,
    closePortfolioImage
  };
};
