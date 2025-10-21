/**
 * REVIEW STORE - REFACTORIZADO CON JSON SERVER
 *
 * Cambios:
 * ✅ Migrado a API real (reviewsApi)
 * ✅ Eliminado hardcode de reviews mock
 * ✅ CRUD completo para reviews
 * ✅ Lógica de negocio (estadísticas, filtros) mantenida localmente
 * ✅ Persist middleware ya existente
 * ✅ Mapeo español ↔ inglés
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { reviewsApi } from '../services/api';

const useReviewStore = create(
  persist(
    (set, get) => ({
      // Estado inicial
      reviews: [],
      isLoading: false,
      error: null,

      /**
       * CARGAR REVIEWS - Fetch desde API
       */
      loadReviews: async () => {
        set({ isLoading: true, error: null });
        try {
          const reviewsData = await reviewsApi.getAll();

          // Mapear estructura backend (español) a frontend (inglés)
          const reviews = reviewsData.map(r => ({
            id: r.id,
            barberId: r.barberoId,
            clientId: r.clienteId,
            clientName: r.nombreCliente,
            appointmentId: r.citaId,
            rating: r.calificacion,
            comment: r.comentario,
            serviceType: r.tipoServicio,
            date: r.fecha,
            isPublic: r.esPublico,
            response: r.respuesta,
            responseDate: r.fechaRespuesta
          }));

          set({ reviews, isLoading: false });
          return { success: true };
        } catch (error) {
          console.error('Error cargando reviews:', error);
          set({ reviews: [], isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * AGREGAR REVIEW - POST a API
       */
      addReview: async (reviewData) => {
        set({ isLoading: true, error: null });
        try {
          // Mapear a estructura backend
          const reviewBackendData = {
            barberoId: reviewData.barberId,
            clienteId: reviewData.clientId,
            nombreCliente: reviewData.clientName,
            citaId: reviewData.appointmentId,
            calificacion: reviewData.rating,
            comentario: reviewData.comment,
            tipoServicio: reviewData.serviceType,
            fecha: new Date().toISOString().split('T')[0],
            esPublico: true,
            respuesta: null,
            fechaRespuesta: null
          };

          const createdReview = await reviewsApi.create(reviewBackendData);

          // Mapear de vuelta
          const newReview = {
            id: createdReview.id,
            barberId: createdReview.barberoId,
            clientId: createdReview.clienteId,
            clientName: createdReview.nombreCliente,
            appointmentId: createdReview.citaId,
            rating: createdReview.calificacion,
            comment: createdReview.comentario,
            serviceType: createdReview.tipoServicio,
            date: createdReview.fecha,
            isPublic: createdReview.esPublico,
            response: createdReview.respuesta,
            responseDate: createdReview.fechaRespuesta
          };

          set(state => ({
            reviews: [...state.reviews, newReview],
            isLoading: false
          }));

          return { success: true, review: newReview };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * AGREGAR RESPUESTA A REVIEW - PATCH a API
       */
      addResponse: async (reviewId, response) => {
        set({ isLoading: true, error: null });
        try {
          const updatedReview = await reviewsApi.patch(reviewId, {
            respuesta: response,
            fechaRespuesta: new Date().toISOString()
          });

          set(state => ({
            reviews: state.reviews.map(review =>
              review.id === reviewId
                ? {
                    ...review,
                    response: updatedReview.respuesta,
                    responseDate: updatedReview.fechaRespuesta
                  }
                : review
            ),
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * CAMBIAR VISIBILIDAD DE REVIEW - PATCH a API
       */
      toggleReviewVisibility: async (reviewId) => {
        set({ isLoading: true, error: null });
        try {
          const review = get().reviews.find(r => r.id === reviewId);
          if (!review) {
            set({ isLoading: false });
            return { success: false, error: 'Review no encontrada' };
          }

          const updatedReview = await reviewsApi.patch(reviewId, {
            esPublico: !review.isPublic
          });

          set(state => ({
            reviews: state.reviews.map(r =>
              r.id === reviewId
                ? { ...r, isPublic: updatedReview.esPublico }
                : r
            ),
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * ELIMINAR REVIEW - DELETE a API
       */
      deleteReview: async (reviewId) => {
        set({ isLoading: true, error: null });
        try {
          await reviewsApi.delete(reviewId);

          set(state => ({
            reviews: state.reviews.filter(r => r.id !== reviewId),
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * MÉTODOS DE CONSULTA LOCAL (No requieren API)
       */

      // Obtener reseñas por barbero
      getReviewsByBarber: (barberId) => {
        const { reviews } = get();
        return reviews.filter(review => review.barberId === barberId);
      },

      // Obtener estadísticas de un barbero
      getBarberStats: (barberId) => {
        const { reviews } = get();
        const barberReviews = reviews.filter(review => review.barberId === barberId);

        if (barberReviews.length === 0) {
          return {
            totalReviews: 0,
            averageRating: 0,
            ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
            publicReviews: 0,
            recentReviews: []
          };
        }

        const totalRating = barberReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = (totalRating / barberReviews.length).toFixed(1);

        const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        barberReviews.forEach(review => {
          ratingDistribution[review.rating]++;
        });

        // Obtener reseñas recientes (últimas 5)
        const recentReviews = barberReviews
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);

        return {
          totalReviews: barberReviews.length,
          averageRating: parseFloat(averageRating),
          ratingDistribution,
          publicReviews: barberReviews.filter(r => r.isPublic).length,
          recentReviews
        };
      },

      // Obtener todas las reseñas con filtros
      getFilteredReviews: (filters = {}) => {
        const { reviews } = get();
        let filteredReviews = [...reviews];

        if (filters.barberId) {
          filteredReviews = filteredReviews.filter(r => r.barberId === filters.barberId);
        }

        if (filters.rating) {
          filteredReviews = filteredReviews.filter(r => r.rating === filters.rating);
        }

        if (filters.dateFrom) {
          filteredReviews = filteredReviews.filter(r => new Date(r.date) >= new Date(filters.dateFrom));
        }

        if (filters.dateTo) {
          filteredReviews = filteredReviews.filter(r => new Date(r.date) <= new Date(filters.dateTo));
        }

        if (filters.onlyPublic) {
          filteredReviews = filteredReviews.filter(r => r.isPublic);
        }

        if (filters.serviceType) {
          filteredReviews = filteredReviews.filter(r => r.serviceType === filters.serviceType);
        }

        return filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
      },

      // Obtener resumen general de todas las reseñas
      getOverallStats: () => {
        const { reviews } = get();

        if (reviews.length === 0) {
          return {
            totalReviews: 0,
            averageRating: 0,
            ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
            recentTrend: 'neutral'
          };
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = (totalRating / reviews.length).toFixed(1);

        const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(review => {
          ratingDistribution[review.rating]++;
        });

        // Calcular tendencia reciente (últimos 7 días vs 7 días anteriores)
        const today = new Date();
        const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const fourteenDaysAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);

        const recentReviews = reviews.filter(r => new Date(r.date) >= sevenDaysAgo);
        const previousReviews = reviews.filter(r =>
          new Date(r.date) >= fourteenDaysAgo && new Date(r.date) < sevenDaysAgo
        );

        const recentAvg = recentReviews.length > 0
          ? recentReviews.reduce((sum, r) => sum + r.rating, 0) / recentReviews.length
          : 0;

        const previousAvg = previousReviews.length > 0
          ? previousReviews.reduce((sum, r) => sum + r.rating, 0) / previousReviews.length
          : 0;

        let recentTrend = 'neutral';
        if (recentAvg > previousAvg + 0.1) recentTrend = 'up';
        else if (recentAvg < previousAvg - 0.1) recentTrend = 'down';

        return {
          totalReviews: reviews.length,
          averageRating: parseFloat(averageRating),
          ratingDistribution,
          recentTrend
        };
      },

      /**
       * OBTENER REVIEWS POR CLIENTE
       */
      getReviewsByClient: (clientId) => {
        const { reviews } = get();
        return reviews.filter(review => review.clientId === clientId);
      },

      /**
       * OBTENER REVIEWS POR CITA
       */
      getReviewByAppointment: (appointmentId) => {
        const { reviews } = get();
        return reviews.find(review => review.appointmentId === appointmentId);
      },

      /**
       * VERIFICAR SI UNA CITA TIENE REVIEW
       */
      hasReview: (appointmentId) => {
        const { reviews } = get();
        return reviews.some(review => review.appointmentId === appointmentId);
      }
    }),
    {
      name: 'review-store',
      partialize: (state) => ({
        // Persistir como cache
        reviews: state.reviews
      })
    }
  )
);

export default useReviewStore;
