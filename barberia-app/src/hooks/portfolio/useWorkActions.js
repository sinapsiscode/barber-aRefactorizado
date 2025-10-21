/**
 * Custom Hook para acciones de trabajo (CRUD)
 */
import { useCallback } from 'react';
import { validateWorkForm } from '../../utils/portfolio/validations';
import { generatePhotoFilename } from '../../utils/portfolio/formatters';
import { WORK_MESSAGES } from '../../constants/portfolio/ratingMessages';

export const useWorkActions = (user, portfolioItems, setPortfolioItems) => {
  /**
   * Agregar nuevo trabajo al portafolio
   */
  const handleAddWork = useCallback(async (workData) => {
    // Validar
    const { isValid, errors } = validateWorkForm(workData);
    if (!isValid) {
      alert(errors[0]);
      return { success: false, error: errors[0] };
    }

    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Crear nuevo item
      const newPortfolioItem = {
        id: Date.now(),
        barberId: user.id,
        barberName: user.name,
        clientId: null,
        clientName: workData.clientName,
        service: workData.service,
        serviceId: parseInt(workData.serviceId),
        beforePhoto: workData.beforePhoto
          ? generatePhotoFilename('before')
          : '/images/portfolio/default_before.jpg',
        afterPhoto: workData.afterPhoto
          ? generatePhotoFilename('after')
          : '/images/portfolio/default_after.jpg',
        date: workData.date,
        rating: 0,
        notes: workData.notes
      };

      // Agregar al estado
      setPortfolioItems(prev => [newPortfolioItem, ...prev]);

      alert(WORK_MESSAGES.addSuccess);
      return { success: true, data: newPortfolioItem };
    } catch (error) {
      console.error('Error al guardar el trabajo:', error);
      alert(WORK_MESSAGES.addError);
      return { success: false, error };
    }
  }, [user, setPortfolioItems]);

  /**
   * Actualizar rating de un trabajo
   */
  const handleUpdateRating = useCallback(async (workId, rating, comment) => {
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Actualizar estado
      setPortfolioItems(prev => prev.map(item =>
        item.id === workId
          ? {
              ...item,
              rating,
              ratingComment: comment,
              ratedAt: new Date().toISOString()
            }
          : item
      ));

      return { success: true };
    } catch (error) {
      console.error('Error al guardar calificación:', error);
      return { success: false, error };
    }
  }, [setPortfolioItems]);

  return {
    handleAddWork,
    handleUpdateRating
  };
};
