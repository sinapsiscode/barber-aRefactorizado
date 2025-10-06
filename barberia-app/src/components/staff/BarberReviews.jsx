import { useState } from 'react';
import { FiStar, FiMessageSquare, FiEye, FiEyeOff, FiTrendingUp, FiTrendingDown, FiMinus, FiFilter, FiCalendar } from 'react-icons/fi';
import { useReviewStore, useStaffStore } from '../../stores';
import { DataTable } from '../common';

const BarberReviews = ({ barberId, onClose }) => {
  const { getReviewsByBarber, getBarberStats, addResponse, toggleReviewVisibility } = useReviewStore();
  const { barbers } = useStaffStore();

  const [filters, setFilters] = useState({
    rating: '',
    serviceType: '',
    onlyPublic: false,
    dateFrom: '',
    dateTo: ''
  });
  const [showResponse, setShowResponse] = useState({});
  const [responseText, setResponseText] = useState({});

  const barber = barbers.find(b => b.id === barberId);
  const reviews = getReviewsByBarber(barberId);
  const stats = getBarberStats(barberId);

  // Filtrar reseñas
  const filteredReviews = reviews.filter(review => {
    if (filters.rating && review.rating !== parseInt(filters.rating)) return false;
    if (filters.serviceType && review.serviceType !== filters.serviceType) return false;
    if (filters.onlyPublic && !review.isPublic) return false;
    if (filters.dateFrom && new Date(review.date) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(review.date) > new Date(filters.dateTo)) return false;
    return true;
  });

  // Obtener tipos de servicios únicos
  const serviceTypes = [...new Set(reviews.map(r => r.serviceType))];

  const handleAddResponse = (reviewId) => {
    const response = responseText[reviewId];
    if (response && response.trim()) {
      addResponse(reviewId, response.trim());
      setResponseText({ ...responseText, [reviewId]: '' });
      setShowResponse({ ...showResponse, [reviewId]: false });
    }
  };

  const renderStars = (rating, size = 'h-4 w-4') => {
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

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <FiTrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <FiTrendingDown className="h-4 w-4 text-red-500" />;
      default: return <FiMinus className="h-4 w-4 text-gray-500" />;
    }
  };

  const columns = [
    {
      key: 'date',
      label: 'Fecha',
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'clientName',
      label: 'Cliente',
      render: (value) => value
    },
    {
      key: 'serviceType',
      label: 'Servicio',
      render: (value) => (
        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
          {value}
        </span>
      )
    },
    {
      key: 'rating',
      label: 'Calificación',
      render: (value) => (
        <div className="flex items-center space-x-2">
          {renderStars(value)}
          <span className="font-semibold">{value}/5</span>
        </div>
      )
    },
    {
      key: 'isPublic',
      label: 'Visibilidad',
      render: (value, review) => (
        <button
          onClick={() => toggleReviewVisibility(review.id)}
          className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
            value
              ? 'bg-green-100 text-green-800 hover:bg-green-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {value ? <FiEye className="h-3 w-3" /> : <FiEyeOff className="h-3 w-3" />}
          <span>{value ? 'Pública' : 'Privada'}</span>
        </button>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white dark:bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          {/* Header */}
          <div className="bg-white dark:bg-dark-800 px-6 py-4 border-b border-gray-200 dark:border-dark-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {barber?.name?.charAt(0) || 'B'}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Calificaciones de {barber?.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stats.totalReviews} reseñas • Promedio {stats.averageRating}/5
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Estadísticas generales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Total Reseñas</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {stats.totalReviews}
                    </p>
                  </div>
                  <FiMessageSquare className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">Promedio</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                        {stats.averageRating}
                      </p>
                      {renderStars(Math.round(stats.averageRating))}
                    </div>
                  </div>
                  <FiStar className="h-8 w-8 text-yellow-500" />
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-400">Públicas</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {stats.publicReviews}
                    </p>
                  </div>
                  <FiEye className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 dark:text-purple-400">5 Estrellas</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      {stats.ratingDistribution[5]}
                    </p>
                  </div>
                  <div className="text-purple-500">
                    {renderStars(5, 'h-6 w-6')}
                  </div>
                </div>
              </div>
            </div>

            {/* Distribución de calificaciones */}
            <div className="bg-white dark:bg-dark-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Distribución de Calificaciones
              </h4>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = stats.ratingDistribution[rating];
                  const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews * 100) : 0;

                  return (
                    <div key={rating} className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 w-16">
                        <span className="text-sm font-medium">{rating}</span>
                        <FiStar className="h-3 w-3 text-yellow-400 fill-current" />
                      </div>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Filtros */}
            <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
              <div className="flex items-center space-x-4 flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <FiFilter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtros:</span>
                </div>

                <select
                  value={filters.rating}
                  onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-dark-800"
                >
                  <option value="">Todas las calificaciones</option>
                  <option value="5">5 estrellas</option>
                  <option value="4">4 estrellas</option>
                  <option value="3">3 estrellas</option>
                  <option value="2">2 estrellas</option>
                  <option value="1">1 estrella</option>
                </select>

                <select
                  value={filters.serviceType}
                  onChange={(e) => setFilters({ ...filters, serviceType: e.target.value })}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-dark-800"
                >
                  <option value="">Todos los servicios</option>
                  {serviceTypes.map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>

                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.onlyPublic}
                    onChange={(e) => setFilters({ ...filters, onlyPublic: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Solo públicas</span>
                </label>
              </div>
            </div>

            {/* Lista de reseñas */}
            <div className="bg-white dark:bg-dark-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Reseñas Detalladas ({filteredReviews.length})
                </h4>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-600 max-h-96 overflow-y-auto">
                {filteredReviews.map(review => (
                  <div key={review.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {review.clientName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {review.clientName}
                            </span>
                            {renderStars(review.rating)}
                            <span className="text-sm text-gray-500">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                            {review.serviceType}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleReviewVisibility(review.id)}
                        className={`p-1 rounded ${
                          review.isPublic
                            ? 'text-green-600 hover:bg-green-100'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        title={review.isPublic ? 'Hacer privada' : 'Hacer pública'}
                      >
                        {review.isPublic ? <FiEye className="h-4 w-4" /> : <FiEyeOff className="h-4 w-4" />}
                      </button>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {review.comment}
                    </p>

                    {review.response && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border-l-4 border-blue-400">
                        <p className="text-sm text-blue-900 dark:text-blue-100">
                          <strong>Respuesta del negocio:</strong> {review.response}
                        </p>
                      </div>
                    )}

                    {!review.response && (
                      <div className="space-y-2">
                        {!showResponse[review.id] ? (
                          <button
                            onClick={() => setShowResponse({ ...showResponse, [review.id]: true })}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Responder
                          </button>
                        ) : (
                          <div className="space-y-2">
                            <textarea
                              value={responseText[review.id] || ''}
                              onChange={(e) => setResponseText({ ...responseText, [review.id]: e.target.value })}
                              placeholder="Escribe una respuesta profesional..."
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm resize-none bg-white dark:bg-dark-800"
                              rows={3}
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleAddResponse(review.id)}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                              >
                                Enviar
                              </button>
                              <button
                                onClick={() => setShowResponse({ ...showResponse, [review.id]: false })}
                                className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberReviews;