/**
 * Custom Hook para manejo de datos del portafolio
 */

import { useState, useEffect, useMemo } from 'react';
import { PORTFOLIO_MOCK_DATA } from '../../constants/portfolio/mockData';
import { applyAllFilters } from '../../utils/portfolio/portfolioFilters';
import { groupByBarber } from '../../utils/portfolio/portfolioStats';

export const usePortfolioData = (user, selectedBranch, barbers) => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedService, setSelectedService] = useState('');

  // Cargar datos iniciales
  useEffect(() => {
    if (portfolioItems.length === 0) {
      setPortfolioItems(PORTFOLIO_MOCK_DATA);
    }
  }, [portfolioItems.length]);

  // Aplicar filtros con memoización
  const filteredPortfolio = useMemo(() => {
    return applyAllFilters(portfolioItems, {
      user,
      selectedBranch,
      barbers,
      selectedBarber,
      selectedService
    });
  }, [portfolioItems, user, selectedBranch, barbers, selectedBarber, selectedService]);

  // Agrupar por barbero con estadísticas
  const portfolioByBarber = useMemo(() => {
    return groupByBarber(filteredPortfolio, barbers || []);
  }, [filteredPortfolio, barbers]);

  // Agregar nuevo trabajo
  const addWork = (newWork) => {
    setPortfolioItems(prev => [newWork, ...prev]);
  };

  // Actualizar calificación
  const updateRating = (workId, rating, comment) => {
    setPortfolioItems(prev => prev.map(item =>
      item.id === workId
        ? { ...item, rating, ratingComment: comment, ratedAt: new Date().toISOString() }
        : item
    ));
  };

  return {
    portfolioItems,
    filteredPortfolio,
    portfolioByBarber,
    selectedBarber,
    setSelectedBarber,
    selectedService,
    setSelectedService,
    addWork,
    updateRating
  };
};
