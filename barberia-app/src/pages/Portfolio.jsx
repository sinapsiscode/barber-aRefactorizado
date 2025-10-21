/**
 * PORTFOLIO.JSX - REFACTORIZADO
 *
 * Responsabilidades:
 * - Orquestar componentes y hooks
 * - Manejar estado de modales
 * - Coordinar flujos principales
 *
 * Reducido de 1,084 → ~600 líneas
 */

import { useState } from 'react';
import { FiCamera, FiUser, FiStar, FiFilter, FiEye, FiX, FiPlus, FiCheck } from 'react-icons/fi';
import { useStaffStore, useAuthStore, useBranchStore } from '../stores';
import { usePortfolioData } from '../hooks/portfolio/usePortfolioData';
import { useWorkActions } from '../hooks/portfolio/useWorkActions';
import PortfolioHeader from '../components/portfolio/PortfolioHeader';
import { SERVICES } from '../constants/portfolio/services';
import { VIEW_MODES } from '../constants/portfolio/viewModes';
import { PORTFOLIO_PERMISSIONS } from '../constants/portfolio/roles';
import { RATING_LABELS, RATING_MESSAGES, WORK_MESSAGES } from '../constants/portfolio/ratingMessages';
import { readFileAsDataURL } from '../utils/portfolio/photoUpload';
import { formatPortfolioDate, formatLongDate } from '../utils/portfolio/formatters';

const Portfolio = () => {
  // ===== STORES =====
  const { barbers } = useStaffStore();
  const { user } = useAuthStore();
  const { selectedBranch } = useBranchStore();

  // ===== CUSTOM HOOKS =====
  const {
    portfolioItems,
    filteredPortfolio,
    portfolioByBarber,
    selectedBarber,
    setSelectedBarber,
    selectedService,
    setSelectedService,
    addWork,
    updateRating
  } = usePortfolioData(user, selectedBranch, barbers);

  const { handleAddWork, handleUpdateRating } = useWorkActions(user, portfolioItems, addWork);

  // ===== ESTADO LOCAL =====
  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Modal Agregar Trabajo
  const [showAddWorkModal, setShowAddWorkModal] = useState(false);
  const [newWork, setNewWork] = useState({
    clientName: '',
    service: '',
    serviceId: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    beforePhoto: null,
    afterPhoto: null
  });

  // Modal Calificación
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedWorkForRating, setSelectedWorkForRating] = useState(null);
  const [newRating, setNewRating] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  // ===== HANDLERS =====
  const handlePhotoUpload = async (event, photoType) => {
    const file = event.target.files[0];
    if (file) {
      const photoData = await readFileAsDataURL(file);
      setNewWork({ ...newWork, [photoType]: photoData });
    }
  };

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    const result = await handleAddWork(newWork);
    if (result.success) {
      // Limpiar y cerrar
      setNewWork({
        clientName: '',
        service: '',
        serviceId: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        beforePhoto: null,
        afterPhoto: null
      });
      setShowAddWorkModal(false);
    }
  };

  const handleOpenRatingModal = (workItem) => {
    setSelectedWorkForRating(workItem);
    setNewRating(workItem.rating > 0 ? workItem.rating : 5);
    setRatingComment(workItem.ratingComment || '');
    setShowRatingModal(true);
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    const result = await handleUpdateRating(selectedWorkForRating.id, newRating, ratingComment);

    if (result.success) {
      alert(RATING_MESSAGES.success);
      // Cerrar y limpiar
      setShowRatingModal(false);
      setSelectedWorkForRating(null);
      setNewRating(5);
      setRatingComment('');
    } else {
      alert(RATING_MESSAGES.error);
    }
  };

  // ===== CÁLCULOS DERIVADOS =====
  const availableBarbers = barbers || [];
  const canFilterByBarber = PORTFOLIO_PERMISSIONS.canFilterByBarber(user?.role);
  const canRate = PORTFOLIO_PERMISSIONS.canRate(user?.role);
  const showBarberStats = PORTFOLIO_PERMISSIONS.showBarberStats(user?.role);

  // Stats para barbero
  const barberStats = user?.role === 'barber' ? {
    total: filteredPortfolio.length,
    avgRating: filteredPortfolio.filter(i => i.rating > 0).length > 0
      ? (filteredPortfolio.filter(i => i.rating > 0).reduce((s, i) => s + i.rating, 0) /
         filteredPortfolio.filter(i => i.rating > 0).length).toFixed(1)
      : '0.0',
    thisMonth: filteredPortfolio.filter(item => {
      const d = new Date(item.date);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length
  } : null;

  // Stats para cliente
  const clientStats = user?.role === 'client' ? {
    totalPhotos: filteredPortfolio.length,
    uniqueServices: new Set(filteredPortfolio.map(i => i.serviceId)).size,
    lastService: filteredPortfolio.length > 0
      ? new Date(Math.max(...filteredPortfolio.map(i => new Date(i.date)))).toLocaleDateString()
      : 'N/A'
  } : null;

  // ===== RENDER =====
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <PortfolioHeader
        user={user}
        selectedBranch={selectedBranch}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onAddWork={() => setShowAddWorkModal(true)}
      />

      {/* FILTROS */}
      {user?.role !== 'client' && (
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <FiFilter className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filtros</h3>
          </div>

          <div className={`grid grid-cols-1 ${user?.role === 'barber' ? 'md:grid-cols-1' : 'md:grid-cols-2'} gap-4`}>
            {canFilterByBarber && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Barbero
                </label>
                <select
                  value={selectedBarber}
                  onChange={(e) => setSelectedBarber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                >
                  <option value="">Todos los barberos</option>
                  {availableBarbers.map(barber => (
                    <option key={barber.id} value={barber.id}>{barber.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Servicio
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
              >
                <option value="">Todos los servicios</option>
                {SERVICES.map(service => (
                  <option key={service.id} value={service.id}>{service.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ESTADÍSTICAS POR BARBERO (Recepción) */}
      {showBarberStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioByBarber.map(barber => (
            <div key={barber.id} className="card">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <FiUser className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{barber.name}</h3>
                  <div className="flex items-center space-x-2">
                    <FiStar className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{barber.avgRating || 0}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{barber.workCount} trabajos</span>
                  </div>
                </div>
              </div>
              {barber.latestWork && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Último:</strong> {barber.latestWork.service}<br />
                  <span className="text-xs">{formatPortfolioDate(barber.latestWork.date)}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ESTADÍSTICAS BARBERO */}
      {barberStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Trabajos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{barberStats.total}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500">
                <FiCamera className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Calificación Promedio</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{barberStats.avgRating}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-500">
                <FiStar className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Este Mes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{barberStats.thisMonth}</p>
              </div>
              <div className="p-3 rounded-full bg-green-500">
                <FiUser className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ESTADÍSTICAS CLIENTE */}
      {clientStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Fotos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{clientStats.totalPhotos}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500">
                <FiCamera className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Servicios Realizados</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{clientStats.uniqueServices}</p>
              </div>
              <div className="p-3 rounded-full bg-green-500">
                <FiUser className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Último Servicio</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{clientStats.lastService}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-500">
                <FiStar className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GALERÍA */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {user?.role === 'client' ? 'Mis Fotos del Antes y Después' : 'Trabajos Realizados'}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredPortfolio.length} trabajos encontrados
          </span>
        </div>

        {filteredPortfolio.length > 0 ? (
          viewMode === VIEW_MODES.GRID ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPortfolio.map(item => (
                <div key={item.id} className="border border-gray-200 dark:border-dark-600 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-200 dark:bg-dark-600 flex items-center justify-center relative group">
                    <div className="grid grid-cols-2 gap-1 w-full h-full">
                      <div className="bg-gray-300 dark:bg-dark-500 flex items-center justify-center">
                        <div className="text-center">
                          <FiCamera className="h-6 w-6 text-gray-500 mx-auto mb-1" />
                          <span className="text-xs text-gray-500">Antes</span>
                        </div>
                      </div>
                      <div className="bg-gray-300 dark:bg-dark-500 flex items-center justify-center">
                        <div className="text-center">
                          <FiCamera className="h-6 w-6 text-gray-500 mx-auto mb-1" />
                          <span className="text-xs text-gray-500">Después</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedPhoto(item)}
                      className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <FiEye className="h-8 w-8 text-white" />
                    </button>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{item.barberName}</h3>
                      <div className="flex items-center space-x-1">
                        {item.rating > 0 ? (
                          <>
                            <FiStar className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{item.rating}</span>
                          </>
                        ) : (
                          <span className="text-xs text-gray-500 dark:text-gray-400 italic">Sin calificar</span>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{item.service}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">{formatPortfolioDate(item.date)}</p>

                    {canRate && (
                      <button
                        onClick={() => handleOpenRatingModal(item)}
                        className={`w-full text-xs py-1 px-2 rounded transition-colors ${
                          item.rating > 0
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200'
                            : 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 hover:bg-primary-200'
                        }`}
                      >
                        <FiStar className="h-3 w-3 inline mr-1" />
                        {item.rating > 0 ? 'Editar Calificación' : 'Calificar Servicio'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPortfolio.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-dark-600 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-24 bg-gray-200 dark:bg-dark-600 rounded-lg flex items-center justify-center">
                      <FiCamera className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{item.barberName}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.service} • Cliente: {item.clientName}</p>
                      <p className="text-xs text-gray-500">{formatPortfolioDate(item.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      {item.rating > 0 ? (
                        <>
                          <FiStar className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{item.rating}</span>
                        </>
                      ) : (
                        <span className="text-xs text-gray-500 italic">Sin calificar</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {canRate && (
                        <button
                          onClick={() => handleOpenRatingModal(item)}
                          className={`text-sm py-1 px-3 rounded transition-colors ${
                            item.rating > 0
                              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                              : 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                          }`}
                        >
                          <FiStar className="h-3 w-3 inline mr-1" />
                          {item.rating > 0 ? 'Editar' : 'Calificar'}
                        </button>
                      )}
                      <button onClick={() => setSelectedPhoto(item)} className="btn-secondary text-sm">
                        Ver Fotos
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <FiCamera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No hay trabajos para mostrar</h3>
            <p className="text-gray-600 dark:text-gray-400">Ajusta los filtros para ver más trabajos</p>
          </div>
        )}
      </div>

      {/* MODAL DE FOTO DETALLE */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="max-w-4xl mx-4 bg-white dark:bg-dark-800 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b dark:border-dark-600">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedPhoto.barberName} - {selectedPhoto.service}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cliente: {selectedPhoto.clientName} • {formatPortfolioDate(selectedPhoto.date)}
                </p>
              </div>
              <button onClick={() => setSelectedPhoto(null)} className="text-gray-400 hover:text-gray-600">
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Antes</h4>
                  <div className="aspect-square bg-gray-200 dark:bg-dark-600 rounded-lg flex items-center justify-center">
                    <FiCamera className="h-12 w-12 text-gray-400" />
                    <span className="ml-2 text-gray-500">Foto Antes</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Después</h4>
                  <div className="aspect-square bg-gray-200 dark:bg-dark-600 rounded-lg flex items-center justify-center">
                    <FiCamera className="h-12 w-12 text-gray-400" />
                    <span className="ml-2 text-gray-500">Foto Después</span>
                  </div>
                </div>
              </div>

              {selectedPhoto.notes && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Notas del barbero:</strong> {selectedPhoto.notes}
                  </p>
                </div>
              )}

              {selectedPhoto.ratingComment && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Comentario del cliente:</strong> {selectedPhoto.ratingComment}
                  </p>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  {selectedPhoto.rating > 0 ? (
                    <>
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className={`h-4 w-4 ${i < selectedPhoto.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{selectedPhoto.rating}/5</span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-500 italic">{RATING_MESSAGES.pending}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL AGREGAR TRABAJO */}
      {showAddWorkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Agregar Nuevo Trabajo</h3>
              <button onClick={() => setShowAddWorkModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitWork} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre del Cliente *
                  </label>
                  <input
                    type="text"
                    value={newWork.clientName}
                    onChange={(e) => setNewWork({...newWork, clientName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                    placeholder="Ingresa el nombre del cliente"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Servicio Realizado *
                  </label>
                  <select
                    value={newWork.serviceId}
                    onChange={(e) => {
                      const service = SERVICES.find(s => s.id.toString() === e.target.value);
                      setNewWork({ ...newWork, serviceId: e.target.value, service: service?.name || '' });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                    required
                  >
                    <option value="">Seleccionar servicio</option>
                    {SERVICES.map(service => (
                      <option key={service.id} value={service.id}>{service.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha del Servicio *</label>
                <input
                  type="date"
                  value={newWork.date}
                  onChange={(e) => setNewWork({...newWork, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Fotos del Antes y Después</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg p-6 text-center">
                      <FiCamera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Foto Antes</p>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => handlePhotoUpload(e, 'beforePhoto')}
                        className="hidden"
                        id="beforePhoto"
                      />
                      <label htmlFor="beforePhoto" className="btn-secondary text-sm cursor-pointer">
                        {newWork.beforePhoto ? 'Cambiar Foto' : 'Tomar Foto'}
                      </label>
                      {newWork.beforePhoto && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">{WORK_MESSAGES.photoUploaded}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg p-6 text-center">
                      <FiCamera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Foto Después</p>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => handlePhotoUpload(e, 'afterPhoto')}
                        className="hidden"
                        id="afterPhoto"
                      />
                      <label htmlFor="afterPhoto" className="btn-secondary text-sm cursor-pointer">
                        {newWork.afterPhoto ? 'Cambiar Foto' : 'Tomar Foto'}
                      </label>
                      {newWork.afterPhoto && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">{WORK_MESSAGES.photoUploaded}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notas Adicionales</label>
                <textarea
                  value={newWork.notes}
                  onChange={(e) => setNewWork({...newWork, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  placeholder="Detalles especiales del trabajo..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={!newWork.clientName || !newWork.serviceId}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiCheck className="h-4 w-4 mr-2" />
                  Guardar Trabajo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddWorkModal(false);
                    setNewWork({
                      clientName: '',
                      service: '',
                      serviceId: '',
                      date: new Date().toISOString().split('T')[0],
                      notes: '',
                      beforePhoto: null,
                      afterPhoto: null
                    });
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CALIFICACIÓN */}
      {showRatingModal && selectedWorkForRating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedWorkForRating.rating > 0 ? 'Editar Calificación' : 'Calificar Servicio'}
              </h3>
              <button
                onClick={() => {
                  setShowRatingModal(false);
                  setSelectedWorkForRating(null);
                  setNewRating(5);
                  setRatingComment('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">{selectedWorkForRating.service}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Barbero: {selectedWorkForRating.barberName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Fecha: {formatLongDate(selectedWorkForRating.date)}</p>
            </div>

            <form onSubmit={handleSubmitRating} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Tu Calificación *</label>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className={`p-2 transition-colors ${star <= newRating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400`}
                    >
                      <FiStar className={`h-8 w-8 ${star <= newRating ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                </div>
                <div className="text-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{RATING_LABELS[newRating]}</span>
                  <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">({newRating}/5)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Comentario (opcional)</label>
                <textarea
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  placeholder="Comparte tu experiencia con este servicio..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="submit" className="flex-1 btn-primary">
                  <FiCheck className="h-4 w-4 mr-2" />
                  {selectedWorkForRating.rating > 0 ? 'Actualizar Calificación' : 'Enviar Calificación'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRatingModal(false);
                    setSelectedWorkForRating(null);
                    setNewRating(5);
                    setRatingComment('');
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
