import { useState, useEffect } from 'react';
import { FiCamera, FiUser, FiStar, FiFilter, FiGrid, FiList, FiEye, FiX, FiPlus, FiCheck } from 'react-icons/fi';
import { useStaffStore, useAuthStore, useBranchStore } from '../stores';

const Portfolio = () => {
  const { barbers, loadStaff } = useStaffStore();
  const { user } = useAuthStore();
  const { selectedBranch } = useBranchStore();
  
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showAddWorkModal, setShowAddWorkModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedWorkForRating, setSelectedWorkForRating] = useState(null);
  const [newRating, setNewRating] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [newWork, setNewWork] = useState({
    clientName: '',
    service: '',
    serviceId: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    beforePhoto: null,
    afterPhoto: null
  });

  // Cargar datos mock si no hay barberos
  useEffect(() => {
    if (!barbers || barbers.length === 0) {
      loadStaff();
    }
  }, [barbers, loadStaff]);

  // Cargar datos iniciales del portafolio
  useEffect(() => {
    if (portfolioItems.length === 0) {
      setPortfolioItems(portfolioData);
    }
  }, []);

  // Manejar subida de fotos
  const handlePhotoUpload = (event, photoType) => {
    const file = event.target.files[0];
    if (file) {
      // En una implementación real, aquí subirías la imagen a un servidor
      // Por ahora, solo simulamos que se guardó la foto
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewWork({
          ...newWork,
          [photoType]: {
            file: file,
            preview: e.target.result,
            name: file.name
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Manejar envío del formulario
  const handleAddWork = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!newWork.clientName || !newWork.serviceId) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Crear nuevo elemento para el portafolio
      const newPortfolioItem = {
        id: Date.now(), // En producción usar un ID real del servidor
        barberId: user.id,
        barberName: user.name,
        clientId: null, // En una implementación real, buscarías el ID del cliente
        clientName: newWork.clientName,
        service: newWork.service,
        serviceId: parseInt(newWork.serviceId),
        beforePhoto: newWork.beforePhoto ? `/images/portfolio/before_${Date.now()}.jpg` : '/images/portfolio/default_before.jpg',
        afterPhoto: newWork.afterPhoto ? `/images/portfolio/after_${Date.now()}.jpg` : '/images/portfolio/default_after.jpg',
        date: newWork.date,
        rating: 0, // Sin calificación inicial - será asignada por el cliente
        notes: newWork.notes
      };
      
      // Agregar el nuevo trabajo al portafolio
      setPortfolioItems(prev => [newPortfolioItem, ...prev]);
      
      // Mostrar mensaje de éxito
      alert('Trabajo agregado exitosamente al portafolio');
      
      // Limpiar formulario y cerrar modal
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
      
    } catch (error) {
      console.error('Error al guardar el trabajo:', error);
      alert('Error al guardar el trabajo. Por favor intenta nuevamente.');
    }
  };

  // Manejar apertura del modal de calificación
  const handleOpenRatingModal = (workItem) => {
    setSelectedWorkForRating(workItem);
    setNewRating(workItem.rating > 0 ? workItem.rating : 5);
    setRatingComment(workItem.ratingComment || '');
    setShowRatingModal(true);
  };

  // Manejar envío de calificación
  const handleSubmitRating = async (e) => {
    e.preventDefault();
    
    try {
      // Simular guardado de calificación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Actualizar el trabajo con la nueva calificación
      setPortfolioItems(prev => prev.map(item => 
        item.id === selectedWorkForRating.id 
          ? { 
              ...item, 
              rating: newRating, 
              ratingComment: ratingComment,
              ratedAt: new Date().toISOString()
            }
          : item
      ));
      
      // Mostrar mensaje de éxito
      alert('¡Calificación guardada exitosamente!');
      
      // Cerrar modal y limpiar estado
      setShowRatingModal(false);
      setSelectedWorkForRating(null);
      setNewRating(5);
      setRatingComment('');
      
    } catch (error) {
      console.error('Error al guardar la calificación:', error);
      alert('Error al guardar la calificación. Por favor intenta nuevamente.');
    }
  };

  // Los barberos están directamente disponibles desde el store
  const availableBarbers = barbers || [];

  // Servicios disponibles
  const services = [
    { id: 1, name: 'Corte Clásico' },
    { id: 2, name: 'Corte + Barba' },
    { id: 3, name: 'Barba' },
    { id: 4, name: 'Corte Premium' },
    { id: 5, name: 'Diseño de Barba' },
    { id: 6, name: 'Fade Moderno' },
    { id: 7, name: 'Tinte' },
    { id: 8, name: 'Tratamiento Capilar' }
  ];

  // Mock data para el portafolio (normalmente vendría de una API)
  const portfolioData = [
    {
      id: 1,
      barberId: 2,
      barberName: 'Miguel Barbero',
      clientId: 3, // Cliente que puede hacer login
      clientName: 'Juan Cliente',
      service: 'Corte + Barba',
      serviceId: 2,
      beforePhoto: '/images/portfolio/before1.jpg',
      afterPhoto: '/images/portfolio/after1.jpg',
      date: '2024-01-15',
      rating: 5,
      notes: 'Cliente muy satisfecho con el resultado'
    },
    {
      id: 2,
      barberId: 2,
      barberName: 'Miguel Barbero',
      clientId: 1, // Cliente del sistema
      clientName: 'Juan Carlos Pérez',
      service: 'Fade Moderno',
      serviceId: 2,
      beforePhoto: '/images/portfolio/before2.jpg',
      afterPhoto: '/images/portfolio/after2.jpg',
      date: '2024-01-14',
      rating: 5,
      notes: 'Corte moderno, cliente joven'
    },
    {
      id: 3,
      barberId: 2,
      barberName: 'Luis Martínez',
      clientId: 2, // Cliente del sistema
      clientName: 'María Fernanda López',
      service: 'Diseño de Barba',
      serviceId: 5,
      beforePhoto: '/images/portfolio/before3.jpg',
      afterPhoto: '/images/portfolio/after3.jpg',
      date: '2024-01-13',
      rating: 5,
      notes: 'Diseño especial con detalles'
    },
    {
      id: 4,
      barberId: 2,
      barberName: 'Miguel Barbero',
      clientId: 3, // Cliente que puede hacer login
      clientName: 'Juan Cliente',
      service: 'Corte Clásico',
      serviceId: 1,
      beforePhoto: '/images/portfolio/before4.jpg',
      afterPhoto: '/images/portfolio/after4.jpg',
      date: '2024-01-12',
      rating: 4,
      notes: 'Estilo clásico elegante'
    },
    {
      id: 5,
      barberId: 3,
      barberName: 'Carlos Sánchez',
      clientId: 3, // Cliente que puede hacer login
      clientName: 'Juan Cliente',
      service: 'Tinte',
      serviceId: 7,
      beforePhoto: '/images/portfolio/before5.jpg',
      afterPhoto: '/images/portfolio/after5.jpg',
      date: '2024-01-11',
      rating: 5,
      notes: 'Cambio de color exitoso'
    }
  ];

  // Filtrar portafolio según el rol y sede seleccionada
  const filteredPortfolio = portfolioItems.filter(item => {
    // Si es barbero, solo mostrar sus propios trabajos
    if (user?.role === 'barber' && item.barberId !== user.id) return false;
    
    // Si es cliente, solo mostrar sus propias fotos
    if (user?.role === 'client' && item.clientId !== user.id) return false;
    
    // Para super admin y reception, filtrar por sede seleccionada si hay una
    if ((user?.role === 'super_admin' || user?.role === 'reception') && selectedBranch) {
      const barber = availableBarbers.find(b => b.id === item.barberId);
      if (barber && barber.branchId !== selectedBranch.id) return false;
    }
    
    // Aplicar filtros generales
    if (selectedBarber && item.barberId.toString() !== selectedBarber) return false;
    if (selectedService && item.serviceId.toString() !== selectedService) return false;
    return true;
  });

  // Agrupar por barbero para estadísticas
  const portfolioByBarber = availableBarbers.map(barber => {
    const barberWork = filteredPortfolio.filter(item => item.barberId === barber.id);
    const ratedWork = barberWork.filter(item => item.rating > 0);
    const avgRating = ratedWork.length > 0 
      ? (ratedWork.reduce((sum, item) => sum + item.rating, 0) / ratedWork.length).toFixed(1)
      : 0;
    
    return {
      ...barber,
      workCount: barberWork.length,
      avgRating: parseFloat(avgRating),
      latestWork: barberWork.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
    };
  });

  const PhotoModal = ({ photo, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="max-w-4xl mx-4 bg-white dark:bg-dark-800 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b dark:border-dark-600">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {photo.barberName} - {photo.service}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Cliente: {photo.clientName} • {new Date(photo.date).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
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
          
          {photo.notes && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Notas del barbero:</strong> {photo.notes}
              </p>
            </div>
          )}
          
          {photo.ratingComment && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Comentario del cliente:</strong> {photo.ratingComment}
              </p>
            </div>
          )}
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {photo.rating > 0 ? (
                <>
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`h-4 w-4 ${
                        i < photo.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {photo.rating}/5
                  </span>
                </>
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Pendiente de calificación por el cliente
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {user?.role === 'barber' ? 'Mi Portafolio' : 
             user?.role === 'client' ? 'Mis Fotos Antes y Después' : 
             'Portafolio de Barberos'}
            {(user?.role === 'super_admin' || user?.role === 'reception') && selectedBranch && (
              <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-2">
                - {selectedBranch.name}
              </span>
            )}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {user?.role === 'barber' 
              ? 'Gestiona tus trabajos y fotos del antes y después'
              : user?.role === 'client'
              ? 'Ve las fotos de tus servicios realizados por nuestros barberos'
              : (user?.role === 'super_admin' || user?.role === 'reception') && selectedBranch
              ? `Muestra los trabajos realizados en ${selectedBranch.city} a nuevos clientes`
              : 'Muestra los trabajos realizados a nuevos clientes'
            }
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {user?.role === 'barber' && (
            <button 
              onClick={() => setShowAddWorkModal(true)}
              className="btn-primary"
            >
              <FiPlus className="h-4 w-4 mr-2" />
              Agregar Trabajo
            </button>
          )}
          <div className="flex items-center bg-gray-100 dark:bg-dark-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-dark-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <FiGrid className="h-4 w-4 mr-1" />
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-dark-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <FiList className="h-4 w-4 mr-1" />
              Lista
            </button>
          </div>
        </div>
      </div>

      {/* Filtros - Solo para barberos y recepción */}
      {user?.role !== 'client' && (
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <FiFilter className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filtros</h3>
          </div>
        
        <div className={`grid grid-cols-1 ${user?.role === 'barber' ? 'md:grid-cols-1' : 'md:grid-cols-2'} gap-4`}>
          {user?.role !== 'barber' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Barbero
              </label>
              <select
                value={selectedBarber}
                onChange={(e) => setSelectedBarber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              >
                <option value="">Todos los barberos</option>
                {availableBarbers.map(barber => (
                  <option key={barber.id} value={barber.id}>
                    {barber.name}
                  </option>
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            >
              <option value="">Todos los servicios</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        </div>
      )}

      {/* Estadísticas por Barbero - Solo para recepción */}
      {user?.role === 'reception' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioByBarber.map(barber => (
            <div key={barber.id} className="card">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <FiUser className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {barber.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <FiStar className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {barber.avgRating || 0}
                      </span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {barber.workCount} trabajos
                    </span>
                  </div>
                </div>
              </div>
              
              {barber.latestWork && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Último trabajo:</strong> {barber.latestWork.service}
                  <br />
                  <span className="text-xs">
                    {new Date(barber.latestWork.date).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Estadísticas para barbero */}
      {user?.role === 'barber' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Trabajos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredPortfolio.length}</p>
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
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {filteredPortfolio.filter(item => item.rating > 0).length > 0 
                    ? (filteredPortfolio.filter(item => item.rating > 0).reduce((sum, item) => sum + item.rating, 0) / filteredPortfolio.filter(item => item.rating > 0).length).toFixed(1)
                    : '0.0'
                  }
                </p>
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
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {filteredPortfolio.filter(item => {
                    const itemDate = new Date(item.date);
                    const now = new Date();
                    return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-500">
                <FiUser className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas para cliente */}
      {user?.role === 'client' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Fotos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredPortfolio.length}</p>
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
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Set(filteredPortfolio.map(item => item.serviceId)).size}
                </p>
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
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {filteredPortfolio.length > 0 
                    ? new Date(Math.max(...filteredPortfolio.map(item => new Date(item.date)))).toLocaleDateString()
                    : 'N/A'
                  }
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-500">
                <FiStar className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Portafolio */}
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
          viewMode === 'grid' ? (
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
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.barberName}
                      </h3>
                      <div className="flex items-center space-x-1">
                        {item.rating > 0 ? (
                          <>
                            <FiStar className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {item.rating}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                            Sin calificar
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {item.service}
                    </p>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                    
                    {/* Botón de calificación para clientes */}
                    {user?.role === 'client' && (
                      <button
                        onClick={() => handleOpenRatingModal(item)}
                        className={`w-full text-xs py-1 px-2 rounded transition-colors ${
                          item.rating > 0
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
                            : 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800'
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
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.barberName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.service} • Cliente: {item.clientName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      {item.rating > 0 ? (
                        <>
                          <FiStar className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {item.rating}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                          Sin calificar
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* Botón de calificación para clientes */}
                      {user?.role === 'client' && (
                        <button
                          onClick={() => handleOpenRatingModal(item)}
                          className={`text-sm py-1 px-3 rounded transition-colors ${
                            item.rating > 0
                              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
                              : 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800'
                          }`}
                        >
                          <FiStar className="h-3 w-3 inline mr-1" />
                          {item.rating > 0 ? 'Editar' : 'Calificar'}
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedPhoto(item)}
                        className="btn-secondary text-sm"
                      >
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
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hay trabajos para mostrar
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Ajusta los filtros para ver más trabajos del portafolio
            </p>
          </div>
        )}
      </div>

      {/* Modal de foto */}
      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}

      {/* Modal Agregar Trabajo */}
      {showAddWorkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Agregar Nuevo Trabajo
              </h3>
              <button
                onClick={() => setShowAddWorkModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddWork} className="space-y-6">
              {/* Información del Cliente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre del Cliente *
                  </label>
                  <input
                    type="text"
                    value={newWork.clientName}
                    onChange={(e) => setNewWork({...newWork, clientName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
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
                      const selectedService = services.find(s => s.id.toString() === e.target.value);
                      setNewWork({
                        ...newWork, 
                        serviceId: e.target.value,
                        service: selectedService?.name || ''
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                    required
                  >
                    <option value="">Seleccionar servicio</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fecha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fecha del Servicio *
                </label>
                <input
                  type="date"
                  value={newWork.date}
                  onChange={(e) => setNewWork({...newWork, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                  required
                />
              </div>

              {/* Fotos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Fotos del Antes y Después
                </label>
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
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">Foto cargada</p>
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
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">Foto cargada</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notas Adicionales
                </label>
                <textarea
                  value={newWork.notes}
                  onChange={(e) => setNewWork({...newWork, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                  placeholder="Detalles especiales del trabajo, técnicas utilizadas, comentarios del cliente..."
                />
              </div>

              {/* Botones */}
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

      {/* Modal de Calificación para Clientes */}
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
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            
            {/* Información del servicio */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                {selectedWorkForRating.service}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Barbero: {selectedWorkForRating.barberName}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Fecha: {new Date(selectedWorkForRating.date).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <form onSubmit={handleSubmitRating} className="space-y-6">
              {/* Calificación con estrellas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Tu Calificación *
                </label>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className={`p-2 transition-colors ${
                        star <= newRating ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400`}
                    >
                      <FiStar className={`h-8 w-8 ${
                        star <= newRating ? 'fill-current' : ''
                      }`} />
                    </button>
                  ))}
                </div>
                <div className="text-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {newRating === 1 ? 'Muy malo' :
                     newRating === 2 ? 'Malo' :
                     newRating === 3 ? 'Regular' :
                     newRating === 4 ? 'Bueno' : 'Excelente'}
                  </span>
                  <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                    ({newRating}/5)
                  </span>
                </div>
              </div>

              {/* Comentario opcional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Comentario (opcional)
                </label>
                <textarea
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                  placeholder="Comparte tu experiencia con este servicio..."
                />
              </div>

              {/* Botones */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
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