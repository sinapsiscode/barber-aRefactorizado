/**
 * MODAL INTERACTIVO DE SERVICIOS
 * 
 * Componente modal que muestra información detallada de un servicio
 * incluyendo galería de imágenes, videos, descripción y funcionalidad de reserva
 */

import { useState } from 'react';
import { FiX, FiPlay, FiStar, FiClock, FiDollarSign, FiCamera, FiVideo, FiCalendar } from 'react-icons/fi';

const ServiceModal = ({ service, isOpen, onClose, onBookService }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  if (!isOpen || !service) return null;

  /**
   * Navegar entre imágenes de la galería
   */
  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === service.gallery.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? service.gallery.length - 1 : prev - 1
    );
  };

  /**
   * Alternar vista de video
   */
  const toggleVideo = () => {
    setShowVideo(!showVideo);
  };

  /**
   * Manejar reserva del servicio
   */
  const handleBookService = () => {
    if (onBookService) {
      onBookService(service);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header del Modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {service.name}
            </h2>
            {service.popular && (
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-sm flex items-center">
                <FiStar className="h-4 w-4 mr-1" />
                Popular
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <FiX className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sección de Media - Galería e Info */}
            <div className="space-y-6">
              {/* Galería Principal */}
              <div className="relative">
                {!showVideo ? (
                  <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <img
                      src={service.gallery[currentImageIndex]}
                      alt={`${service.name} - Imagen ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `data:image/svg+xml;base64,${btoa(`<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><g transform="translate(200,150)"><circle cx="0" cy="-30" r="25" fill="#d1d5db"/><rect x="-15" y="-10" width="30" height="40" rx="5" fill="#d1d5db"/><text x="0" y="70" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="14">✂️ ${service.name}</text></g></svg>`)}`;
                      }}
                    />
                    
                    {/* Controles de navegación */}
                    {service.gallery.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                        >
                          ←
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                        >
                          →
                        </button>
                      </>
                    )}

                    {/* Indicador de video disponible */}
                    {service.videoUrl && (
                      <button
                        onClick={toggleVideo}
                        className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                      >
                        <FiVideo className="h-5 w-5" />
                      </button>
                    )}

                    {/* Contador de imágenes */}
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
                      <FiCamera className="h-4 w-4 inline mr-1" />
                      {currentImageIndex + 1}/{service.gallery.length}
                    </div>
                  </div>
                ) : (
                  // Reproductor de Video
                  <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                    <video
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                      onError={() => setShowVideo(false)}
                    >
                      <source src={service.videoUrl} type="video/mp4" />
                      Tu navegador no soporta videos HTML5.
                    </video>
                    <button
                      onClick={toggleVideo}
                      className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Miniaturas de la Galería */}
              {service.gallery.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {service.gallery.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                        currentImageIndex === index
                          ? 'border-yellow-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Miniatura ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = `data:image/svg+xml;base64,${btoa('<svg width="80" height="64" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><g transform="translate(40,32)"><circle cx="0" cy="-10" r="8" fill="#d1d5db"/><rect x="-5" y="-3" width="10" height="12" rx="2" fill="#d1d5db"/></g></svg>')}`;
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Información del Servicio */}
            <div className="space-y-6">
              {/* Información Básica */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-sm font-medium">
                    {service.category}
                  </span>
                  {service.discount && (
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                      -{service.discount}% descuento
                    </span>
                  )}
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                  {service.description}
                </p>

                {/* Información de Precio y Duración */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <FiDollarSign className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Precio</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        S/{service.price}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <FiClock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Duración</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {service.duration} min
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Características del Servicio */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Incluye:
                </h3>
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-gray-700 dark:text-gray-300"
                    >
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nota Especial (si existe) */}
              {service.note && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-amber-800 dark:text-amber-200 text-sm">
                    <strong>Nota:</strong> {service.note}
                  </p>
                </div>
              )}

              {/* Botón de Reserva */}
              <button
                onClick={handleBookService}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <FiCalendar className="h-5 w-5" />
                <span>Reservar Este Servicio</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;