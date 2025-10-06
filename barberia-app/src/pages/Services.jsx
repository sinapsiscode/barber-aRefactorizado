import { useState, useEffect, useMemo } from 'react';
import { FiScissors, FiClock, FiDollarSign, FiStar, FiTrendingUp, FiGift, FiUsers, FiAward, FiImage, FiPlay, FiCalendar, FiSettings, FiPlus, FiSearch, FiGrid, FiList, FiFilter, FiEdit, FiHeart, FiCheck } from 'react-icons/fi';
import { useAuthStore, useBranchStore, useAppointmentStore } from '../stores';
import ServiceModal from '../components/services/ServiceModal';
import ServicePricingManager from '../components/services/ServicePricingManager';

const Services = () => {
  const { user } = useAuthStore();
  const { selectedBranch } = useBranchStore();
  const { services } = useAppointmentStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPricingManager, setShowPricingManager] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryService, setGalleryService] = useState(null);

  // Categories definitions
  const serviceCategories = [
    { id: 'all', name: 'Todos', icon: FiScissors },
    { id: 'popular', name: 'Populares', icon: FiStar },
    { id: 'cortes', name: 'Cortes', icon: FiScissors },
    { id: 'barba', name: 'Barba', icon: FiScissors },
    { id: 'combos', name: 'Combos', icon: FiGift },
    { id: 'tratamientos', name: 'Tratamientos', icon: FiAward }
  ];

  // Filtrar y ordenar servicios
  const filteredServices = useMemo(() => {
    let filtered = services.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
                            (selectedCategory === 'popular' && service.popular) ||
                            service.category?.toLowerCase() === selectedCategory;
      
      const matchesFilter = filterBy === 'all' || 
                          (filterBy === 'popular' && service.popular) ||
                          (filterBy === 'discounts' && service.discount);
      
      return matchesSearch && matchesCategory && matchesFilter;
    });

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'duration':
          return a.duration - b.duration;
        case 'popular':
          return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [services, searchTerm, selectedCategory, sortBy, filterBy]);

  // Manejar la apertura del modal de servicio
  const handleServiceClick = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  // Manejar reserva de servicio
  const handleBookService = (service) => {
    console.log('Reservar servicio:', service);
    alert(`¡Perfecto! Te redirigiremos para reservar: ${service.name}`);
  };

  const handleAddService = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleToggleFavorite = (serviceId) => {
    setFavorites(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleViewGallery = (service) => {
    setGalleryService(service);
    setShowGallery(true);
  };

  const ServiceCard = ({ service }) => (
    <div 
      onClick={() => handleServiceClick(service)}
      className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-yellow-500/20 overflow-hidden hover:border-yellow-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/20 hover:-translate-y-1 cursor-pointer"
    >
      {/* Service Image */}
      <div className="relative h-48 bg-gradient-to-br from-yellow-500/10 to-transparent overflow-hidden">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const safeName = service.name.replace(/[^\w\s]/g, '');
            const svgContent = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><g transform="translate(200,150)"><circle cx="0" cy="-30" r="25" fill="#d1d5db"/><rect x="-15" y="-10" width="30" height="40" rx="5" fill="#d1d5db"/><text x="0" y="70" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="14">${safeName}</text></g></svg>`;
            e.target.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgContent)))}`;
          }}
        />
        
        {/* Overlay con información adicional */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          {service.popular && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              🔥 Popular
            </span>
          )}
          {service.discount && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              -{service.discount}%
            </span>
          )}
        </div>
        
        {/* Video indicator */}
        {service.videoUrl && (
          <div className="absolute top-4 right-4">
            <div className="bg-black bg-opacity-50 rounded-full p-2">
              <FiPlay className="h-4 w-4 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Service info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
            {service.name}
          </h3>
          <div className="text-right">
            <p className="text-xl font-bold text-primary-600">
              S/{service.price}
            </p>
            <p className="text-xs text-gray-500">{service.duration} min</p>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {service.description}
        </p>
        
        {/* Features */}
        {service.features && service.features.length > 0 && (
          <div className="space-y-2 mb-4">
            {service.features.slice(0, 2).map((feature, index) => (
              <div key={index} className="flex items-center text-xs text-gray-500">
                <FiCheck className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewGallery(service);
            }}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <FiImage className="h-4 w-4" />
            <span className="text-sm">
              {service.gallery?.length || 0} fotos
            </span>
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditService(service);
              }}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <FiEdit className="h-4 w-4" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleFavorite(service.id);
              }}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              {favorites.includes(service.id) ? (
                <FiHeart className="h-4 w-4 fill-current text-red-500" />
              ) : (
                <FiHeart className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Verificar si el usuario puede gestionar precios
  const canManagePricing = user?.role === 'branch_admin' || user?.role === 'super_admin';

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
          Nuestros Servicios
          {canManagePricing && (
            <button
              onClick={() => setShowPricingManager(true)}
              className="ml-4 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-base"
              title="Gestionar precios de la sede"
            >
              <FiSettings className="h-4 w-4 mr-2" />
              Configurar Precios
            </button>
          )}
          {user?.role === 'super_admin' && selectedBranch && (
            <span className="text-2xl font-normal text-gray-500 dark:text-gray-400 block mt-2">
              {selectedBranch.name}
            </span>
          )}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Experimenta el arte de la barbería con nuestros servicios profesionales diseñados para el caballero moderno
        </p>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestión de Servicios
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Administra el catálogo de servicios de barbería
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3">
        {serviceCategories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/30'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-yellow-500/20 hover:border-yellow-500/50 hover:text-yellow-600 dark:hover:text-yellow-400'
              }`}
            >
              <Icon className="mr-2" />
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {/* ServiceModal */}
      <ServiceModal 
        service={selectedService}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedService(null);
        }}
        onBookService={handleBookService}
      />

      {/* Pricing Manager Modal */}
      {showPricingManager && (
        <ServicePricingManager
          isOpen={showPricingManager}
          onClose={() => setShowPricingManager(false)}
        />
      )}
    </div>
  );
};

export default Services;