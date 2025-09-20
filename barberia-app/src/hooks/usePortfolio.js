import { useState, useEffect } from 'react';
import { useStaffStore, useAuthStore, useBranchStore } from '../stores';
import {
  SERVICES,
  PORTFOLIO_MOCK_DATA,
  NEW_WORK_INITIAL_STATE,
  RATING_INITIAL_STATE,
  PORTFOLIO_TEXTS
} from '../constants/portfolio';
import {
  filterPortfolio,
  groupPortfolioByBarber,
  createNewPortfolioItem,
  validateNewWork,
  processPhotoUpload,
  simulateAsyncOperation
} from '../utils/portfolioHelpers';

export const usePortfolio = () => {
  const { barbers, loadMockStaff } = useStaffStore();
  const { user } = useAuthStore();
  const { selectedBranch } = useBranchStore();

  // Estado de filtros y vistas
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // Estado de modales
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showAddWorkModal, setShowAddWorkModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedWorkForRating, setSelectedWorkForRating] = useState(null);

  // Estado de formularios
  const [newWork, setNewWork] = useState(NEW_WORK_INITIAL_STATE);
  const [newRating, setNewRating] = useState(RATING_INITIAL_STATE.newRating);
  const [ratingComment, setRatingComment] = useState(RATING_INITIAL_STATE.ratingComment);

  // Estado de datos
  const [portfolioItems, setPortfolioItems] = useState([]);

  // Cargar datos mock si no hay barberos
  useEffect(() => {
    if (!barbers || barbers.length === 0) {
      loadMockStaff();
    }
  }, [barbers, loadMockStaff]);

  // Cargar datos iniciales del portafolio
  useEffect(() => {
    if (portfolioItems.length === 0) {
      setPortfolioItems(PORTFOLIO_MOCK_DATA);
    }
  }, []);

  // Datos computados
  const availableBarbers = barbers || [];
  const services = SERVICES;

  const filteredPortfolio = filterPortfolio(
    portfolioItems,
    user,
    selectedBranch,
    availableBarbers,
    selectedBarber,
    selectedService
  );

  const portfolioByBarber = groupPortfolioByBarber(filteredPortfolio, availableBarbers);

  // Handlers para filtros
  const handleBarberChange = (barberId) => {
    setSelectedBarber(barberId);
  };

  const handleServiceChange = (serviceId) => {
    setSelectedService(serviceId);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  // Handlers para modales
  const handleShowAddWorkModal = () => {
    setShowAddWorkModal(true);
  };

  const handleCloseAddWorkModal = () => {
    setShowAddWorkModal(false);
    setNewWork(NEW_WORK_INITIAL_STATE);
  };

  const handleShowPhotoModal = (photo) => {
    setSelectedPhoto(photo);
  };

  const handleClosePhotoModal = () => {
    setSelectedPhoto(null);
  };

  const handleShowRatingModal = (workItem) => {
    setSelectedWorkForRating(workItem);
    setNewRating(workItem.rating > 0 ? workItem.rating : 5);
    setRatingComment(workItem.ratingComment || '');
    setShowRatingModal(true);
  };

  const handleCloseRatingModal = () => {
    setShowRatingModal(false);
    setSelectedWorkForRating(null);
    setNewRating(RATING_INITIAL_STATE.newRating);
    setRatingComment(RATING_INITIAL_STATE.ratingComment);
  };

  // Handler para subida de fotos
  const handlePhotoUpload = (event, photoType) => {
    const file = event.target.files[0];
    if (file) {
      processPhotoUpload(file, (photoData) => {
        setNewWork({
          ...newWork,
          [photoType]: photoData
        });
      });
    }
  };

  // Handler para cambio en formulario de trabajo
  const handleNewWorkChange = (field, value) => {
    setNewWork({
      ...newWork,
      [field]: value
    });
  };

  const handleServiceSelection = (serviceId) => {
    const selectedService = services.find(s => s.id.toString() === serviceId);
    setNewWork({
      ...newWork,
      serviceId: serviceId,
      service: selectedService?.name || ''
    });
  };

  // Handler para agregar trabajo
  const handleAddWork = async (e) => {
    e.preventDefault();

    if (!validateNewWork(newWork)) {
      alert(PORTFOLIO_TEXTS.REQUIRED_FIELDS_ERROR);
      return;
    }

    try {
      await simulateAsyncOperation();

      const newPortfolioItem = createNewPortfolioItem(newWork, user);
      setPortfolioItems(prev => [newPortfolioItem, ...prev]);

      alert(PORTFOLIO_TEXTS.WORK_ADDED_SUCCESS);
      handleCloseAddWorkModal();

    } catch (error) {
      console.error('Error al guardar el trabajo:', error);
      alert(PORTFOLIO_TEXTS.SAVE_WORK_ERROR);
    }
  };

  // Handler para enviar calificación
  const handleSubmitRating = async (e) => {
    e.preventDefault();

    try {
      await simulateAsyncOperation();

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

      alert(PORTFOLIO_TEXTS.RATING_SAVED_SUCCESS);
      handleCloseRatingModal();

    } catch (error) {
      console.error('Error al guardar la calificación:', error);
      alert(PORTFOLIO_TEXTS.SAVE_RATING_ERROR);
    }
  };

  // Handler para cambio de calificación
  const handleRatingChange = (rating) => {
    setNewRating(rating);
  };

  const handleRatingCommentChange = (comment) => {
    setRatingComment(comment);
  };

  return {
    // Estado
    user,
    selectedBranch,
    selectedBarber,
    selectedService,
    viewMode,
    selectedPhoto,
    showAddWorkModal,
    showRatingModal,
    selectedWorkForRating,
    newWork,
    newRating,
    ratingComment,

    // Datos
    portfolioItems,
    filteredPortfolio,
    portfolioByBarber,
    availableBarbers,
    services,

    // Handlers de filtros
    handleBarberChange,
    handleServiceChange,
    handleViewModeChange,

    // Handlers de modales
    handleShowAddWorkModal,
    handleCloseAddWorkModal,
    handleShowPhotoModal,
    handleClosePhotoModal,
    handleShowRatingModal,
    handleCloseRatingModal,

    // Handlers de formularios
    handlePhotoUpload,
    handleNewWorkChange,
    handleServiceSelection,
    handleAddWork,
    handleSubmitRating,
    handleRatingChange,
    handleRatingCommentChange
  };
};