import { useServices } from '../hooks/useServices';
import ServicesHero from '../components/services/ServicesHero';
import ServicesHeader from '../components/services/ServicesHeader';
import CategoryFilter from '../components/services/CategoryFilter';
import ServicesGrid from '../components/services/ServicesGrid';
import ServiceModal from '../components/services/ServiceModal';
import ServicePricingManager from '../components/services/ServicePricingManager';

const Services = () => {
  const {
    // Estado
    selectedCategory,
    selectedService,
    isModalOpen,
    showPricingManager,

    // Datos
    user,
    selectedBranch,
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
    handleShowPricingManager,
    handleClosePricingManager,
    handleCategoryChange,
    isServiceFavorite
  } = useServices();


  return (
    <div className="space-y-8">
      <ServicesHero
        user={user}
        selectedBranch={selectedBranch}
        userPermissions={userPermissions}
        onShowPricingManager={handleShowPricingManager}
      />

      <ServicesHeader
        user={user}
        userPermissions={userPermissions}
        onAddService={handleAddService}
      />

      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <ServicesGrid
        filteredServices={filteredServices}
        isServiceFavorite={isServiceFavorite}
        onServiceClick={handleServiceClick}
        onEditService={handleEditService}
        onToggleFavorite={handleToggleFavorite}
        onViewGallery={handleViewGallery}
      />

      <ServiceModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onBookService={handleBookService}
      />

      {showPricingManager && (
        <ServicePricingManager
          isOpen={showPricingManager}
          onClose={handleClosePricingManager}
        />
      )}
    </div>
  );
};

export default Services;