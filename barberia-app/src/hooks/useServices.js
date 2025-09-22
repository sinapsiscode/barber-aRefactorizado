import { useState, useMemo } from 'react';
import { useAuthStore, useBranchStore, useAppointmentStore } from '../stores';
import {
  INITIAL_FILTERS,
  ROLE_PERMISSIONS,
  SERVICES_TEXTS
} from '../constants/servicesPage';
import {
  getFilteredAndSortedServices,
  getUserPermissions,
  getBookingMessage,
  toggleFavorite
} from '../utils/servicesHelpers';

export const useServices = () => {
  const { user } = useAuthStore();
  const { selectedBranch } = useBranchStore();
  const { services } = useAppointmentStore();

  // Estados del componente
  const [selectedCategory, setSelectedCategory] = useState(INITIAL_FILTERS.selectedCategory);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPricingManager, setShowPricingManager] = useState(false);
  const [searchTerm, setSearchTerm] = useState(INITIAL_FILTERS.searchTerm);
  const [viewMode, setViewMode] = useState(INITIAL_FILTERS.viewMode);
  const [sortBy, setSortBy] = useState(INITIAL_FILTERS.sortBy);
  const [filterBy, setFilterBy] = useState(INITIAL_FILTERS.filterBy);
  const [favorites, setFavorites] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryService, setGalleryService] = useState(null);

  // Datos computados
  const userPermissions = getUserPermissions(user?.role, ROLE_PERMISSIONS);

  const filteredServices = useMemo(() => {
    return getFilteredAndSortedServices(services, {
      searchTerm,
      selectedCategory,
      sortBy,
      filterBy
    });
  }, [services, searchTerm, selectedCategory, sortBy, filterBy]);

  // Handlers para modales
  const handleServiceClick = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const handleAddService = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  // Handler para reservar servicio
  const handleBookService = (service) => {
    console.log('Reservar servicio:', service);
    const message = getBookingMessage(service.name);
    alert(message);
  };

  // Handler para favoritos
  const handleToggleFavorite = (serviceId) => {
    setFavorites(prev => toggleFavorite(serviceId, prev));
  };

  // Handler para galería
  const handleViewGallery = (service) => {
    setGalleryService(service);
    setShowGallery(true);
  };

  const handleCloseGallery = () => {
    setShowGallery(false);
    setGalleryService(null);
  };

  // Handler para gestor de precios
  const handleShowPricingManager = () => {
    setShowPricingManager(true);
  };

  const handleClosePricingManager = () => {
    setShowPricingManager(false);
  };

  // Handlers para filtros
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
  };

  const handleFilterChange = (filterOption) => {
    setFilterBy(filterOption);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  // Función para verificar si es favorito
  const isServiceFavorite = (serviceId) => {
    return favorites.includes(serviceId);
  };

  return {
    // Estado
    selectedCategory,
    selectedService,
    isModalOpen,
    showPricingManager,
    searchTerm,
    viewMode,
    sortBy,
    filterBy,
    favorites,
    showGallery,
    galleryService,

    // Datos
    user,
    selectedBranch,
    services,
    filteredServices,
    userPermissions,

    // Handlers
    handleServiceClick,
    handleCloseModal,
    handleAddService,
    handleEditService,
    handleBookService,
    handleToggleFavorite,
    handleViewGallery,
    handleCloseGallery,
    handleShowPricingManager,
    handleClosePricingManager,
    handleCategoryChange,
    handleSearchChange,
    handleSortChange,
    handleFilterChange,
    handleViewModeChange,
    isServiceFavorite
  };
};