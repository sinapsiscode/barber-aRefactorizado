import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useReviewStore = create(
  persist(
    (set, get) => ({
      // Estado inicial
      reviews: [
        // Datos mock de reseñas
        {
          id: 1,
          barberId: 1,
          clientId: 1,
          appointmentId: 1,
          rating: 5,
          comment: "Excelente servicio, Miguel es muy profesional y atento a los detalles. El corte quedó perfecto.",
          serviceType: "Corte Clásico",
          date: "2024-01-15",
          clientName: "Juan Cliente",
          isPublic: true,
          response: null
        },
        {
          id: 2,
          barberId: 1,
          clientId: 2,
          appointmentId: 5,
          rating: 4,
          comment: "Buen servicio en general, aunque tuve que esperar un poco más de lo esperado.",
          serviceType: "Fade Moderno",
          date: "2024-01-14",
          clientName: "Carlos Mendoza",
          isPublic: true,
          response: "Gracias por tu feedback, trabajamos constantemente en mejorar nuestros tiempos."
        },
        {
          id: 3,
          barberId: 2,
          clientId: 3,
          appointmentId: 8,
          rating: 5,
          comment: "Ana es increíble! El diseño de cejas quedó perfecto y el ambiente es muy relajante.",
          serviceType: "Diseño de Cejas",
          date: "2024-01-13",
          clientName: "María González",
          isPublic: true,
          response: null
        },
        {
          id: 4,
          barberId: 1,
          clientId: 4,
          appointmentId: 12,
          rating: 3,
          comment: "El servicio estuvo bien, pero esperaba un poco más de innovación en el corte.",
          serviceType: "Corte Clásico",
          date: "2024-01-12",
          clientName: "Pedro Sánchez",
          isPublic: false,
          response: null
        },
        {
          id: 5,
          barberId: 3,
          clientId: 5,
          appointmentId: 15,
          rating: 5,
          comment: "Roberto es un artista! El diseño especial superó todas mis expectativas.",
          serviceType: "Diseño Especial",
          date: "2024-01-11",
          clientName: "Diego Torres",
          isPublic: true,
          response: "¡Muchas gracias! Nos encanta cuando nuestros clientes quedan satisfechos."
        },
        {
          id: 6,
          barberId: 2,
          clientId: 6,
          appointmentId: 18,
          rating: 4,
          comment: "Muy profesional y cuidadosa. El resultado fue exactamente lo que quería.",
          serviceType: "Corte Femenino",
          date: "2024-01-10",
          clientName: "Sandra López",
          isPublic: true,
          response: null
        },
        {
          id: 7,
          barberId: 1,
          clientId: 7,
          appointmentId: 22,
          rating: 2,
          comment: "No quedé conforme con el corte, no siguió las indicaciones que le di.",
          serviceType: "Fade Moderno",
          date: "2024-01-09",
          clientName: "Luis Ramírez",
          isPublic: false,
          response: "Lamentamos que no hayas quedado satisfecho. Te invitamos a regresar para corregir cualquier detalle."
        },
        {
          id: 8,
          barberId: 4,
          clientId: 8,
          appointmentId: 25,
          rating: 5,
          comment: "El mejor barbero de la ciudad! Siempre sabe exactamente qué necesito.",
          serviceType: "Corte Clásico",
          date: "2024-01-08",
          clientName: "Fernando Vega",
          isPublic: true,
          response: null
        }
      ],
      isLoading: false,

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

      // Agregar respuesta a una reseña
      addResponse: (reviewId, response) => {
        set(state => ({
          reviews: state.reviews.map(review =>
            review.id === reviewId
              ? { ...review, response, responseDate: new Date().toISOString() }
              : review
          )
        }));
      },

      // Cambiar visibilidad de una reseña
      toggleReviewVisibility: (reviewId) => {
        set(state => ({
          reviews: state.reviews.map(review =>
            review.id === reviewId
              ? { ...review, isPublic: !review.isPublic }
              : review
          )
        }));
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

      // Agregar nueva reseña
      addReview: (reviewData) => {
        const newReview = {
          id: Date.now(),
          ...reviewData,
          date: new Date().toISOString().split('T')[0],
          isPublic: true,
          response: null
        };

        set(state => ({
          reviews: [...state.reviews, newReview]
        }));

        return newReview;
      }
    }),
    {
      name: 'review-store',
      partialize: (state) => ({
        reviews: state.reviews
      })
    }
  )
);

export default useReviewStore;