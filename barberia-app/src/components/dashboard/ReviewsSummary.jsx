import { useState } from 'react';
import { FiStar, FiTrendingUp, FiTrendingDown, FiMinus, FiMessageSquare, FiEye, FiAlertTriangle } from 'react-icons/fi';
import { useReviewStore, useStaffStore } from '../../stores';
import { MetricCard } from '../common';
import useBranchFilter from '../../hooks/useBranchFilter';

const ReviewsSummary = () => {
  const { getOverallStats, getFilteredReviews, getBarberStats } = useReviewStore();
  const { barbers } = useStaffStore();
  const { filterStaffData } = useBranchFilter();

  // Filtrar barberos según el rol del usuario
  const filteredBarbers = filterStaffData(barbers);
  const overallStats = getOverallStats();

  // Obtener estadísticas de barberos filtrados
  const barberStatsData = filteredBarbers.map(barber => {
    const stats = getBarberStats(barber.id);
    return {
      ...barber,
      reviewStats: stats
    };
  }).filter(barber => barber.reviewStats.totalReviews > 0);

  // Barberos mejor calificados
  const topRatedBarbers = barberStatsData
    .sort((a, b) => b.reviewStats.averageRating - a.reviewStats.averageRating)
    .slice(0, 3);

  // Barberos que necesitan atención (calificación < 4.0)
  const needsAttentionBarbers = barberStatsData
    .filter(barber => barber.reviewStats.averageRating < 4.0)
    .sort((a, b) => a.reviewStats.averageRating - b.reviewStats.averageRating);

  // Reseñas recientes que necesitan respuesta
  const recentReviews = getFilteredReviews({})
    .filter(review => !review.response && review.rating <= 3)
    .slice(0, 5);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <FiTrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <FiTrendingDown className="h-4 w-4 text-red-500" />;
      default: return <FiMinus className="h-4 w-4 text-gray-500" />;
    }
  };

  const renderStars = (rating, size = 'h-3 w-3') => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <FiStar
            key={star}
            className={`${size} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (barberStatsData.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <FiMessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Sin Reseñas Disponibles
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Aún no hay reseñas de clientes para mostrar estadísticas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Reseñas"
          value={overallStats.totalReviews}
          icon={FiMessageSquare}
          color="bg-blue-500"
        />
        <MetricCard
          title="Calificación Promedio"
          value={`${overallStats.averageRating}/5`}
          icon={FiStar}
          color="bg-yellow-500"
          description={`${overallStats.ratingDistribution[5]} reseñas de 5★`}
        />
        <MetricCard
          title="Tendencia"
          value={overallStats.recentTrend === 'up' ? 'Mejorando' : overallStats.recentTrend === 'down' ? 'Bajando' : 'Estable'}
          icon={getTrendIcon(overallStats.recentTrend).type}
          color={overallStats.recentTrend === 'up' ? 'bg-green-500' : overallStats.recentTrend === 'down' ? 'bg-red-500' : 'bg-gray-500'}
        />
        <MetricCard
          title="Necesitan Atención"
          value={needsAttentionBarbers.length}
          icon={FiAlertTriangle}
          color="bg-orange-500"
          description="Barberos con calificación < 4.0"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Barberos mejor calificados */}
        <div className="bg-white dark:bg-dark-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <FiStar className="h-5 w-5 text-yellow-500 mr-2" />
            Mejores Calificaciones
          </h3>
          <div className="space-y-4">
            {topRatedBarbers.map((barber, index) => (
              <div key={barber.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {barber.name}
                    </p>
                    <div className="flex items-center space-x-2">
                      {renderStars(Math.round(barber.reviewStats.averageRating))}
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {barber.reviewStats.averageRating} ({barber.reviewStats.totalReviews} reseñas)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Barberos que necesitan atención */}
        <div className="bg-white dark:bg-dark-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <FiAlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
            Necesitan Atención
          </h3>
          {needsAttentionBarbers.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-green-600 dark:text-green-400">
                ¡Excelente! Todos los barberos tienen calificaciones altas (≥4.0)
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {needsAttentionBarbers.slice(0, 3).map((barber) => (
                <div key={barber.id} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {barber.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {barber.name}
                      </p>
                      <div className="flex items-center space-x-2">
                        {renderStars(Math.round(barber.reviewStats.averageRating))}
                        <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                          {barber.reviewStats.averageRating} ({barber.reviewStats.totalReviews} reseñas)
                        </span>
                      </div>
                    </div>
                  </div>
                  <FiAlertTriangle className="h-4 w-4 text-orange-500" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reseñas que necesitan respuesta */}
      {recentReviews.length > 0 && (
        <div className="bg-white dark:bg-dark-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <FiMessageSquare className="h-5 w-5 text-red-500 mr-2" />
            Reseñas Pendientes de Respuesta ({recentReviews.length})
          </h3>
          <div className="space-y-3">
            {recentReviews.map((review) => {
              const barber = filteredBarbers.find(b => b.id === review.barberId);
              return (
                <div key={review.id} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {review.clientName}
                        </span>
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                        "{review.comment}"
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
                        <span>Barbero: {barber?.name}</span>
                        <span>Servicio: {review.serviceType}</span>
                      </div>
                    </div>
                    <FiAlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Responder a reseñas negativas puede mejorar la reputación del negocio
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsSummary;