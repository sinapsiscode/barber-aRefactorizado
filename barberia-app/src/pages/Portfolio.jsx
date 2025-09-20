import { usePortfolio } from '../hooks/usePortfolio';
import { PORTFOLIO_TEXTS, VIEW_MODES } from '../constants/portfolio';

import PortfolioHeader from '../components/portfolio/PortfolioHeader';
import PortfolioFilters from '../components/portfolio/PortfolioFilters';
import PortfolioStats from '../components/portfolio/PortfolioStats';
import PortfolioGrid from '../components/portfolio/PortfolioGrid';
import PortfolioList from '../components/portfolio/PortfolioList';
import PhotoModal from '../components/portfolio/modals/PhotoModal';
import AddWorkModal from '../components/portfolio/modals/AddWorkModal';
import RatingModal from '../components/portfolio/modals/RatingModal';

const Portfolio = () => {
  const {
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
    filteredPortfolio,
    portfolioByBarber,
    availableBarbers,
    services,

    // Handlers
    handleBarberChange,
    handleServiceChange,
    handleViewModeChange,
    handleShowAddWorkModal,
    handleCloseAddWorkModal,
    handleShowPhotoModal,
    handleClosePhotoModal,
    handleShowRatingModal,
    handleCloseRatingModal,
    handlePhotoUpload,
    handleNewWorkChange,
    handleServiceSelection,
    handleAddWork,
    handleSubmitRating,
    handleRatingChange,
    handleRatingCommentChange
  } = usePortfolio();

  return (
    <div className="space-y-6">
      <PortfolioHeader
        user={user}
        selectedBranch={selectedBranch}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onShowAddWorkModal={handleShowAddWorkModal}
      />

      <PortfolioFilters
        user={user}
        selectedBarber={selectedBarber}
        selectedService={selectedService}
        availableBarbers={availableBarbers}
        services={services}
        onBarberChange={handleBarberChange}
        onServiceChange={handleServiceChange}
      />

      <PortfolioStats
        user={user}
        filteredPortfolio={filteredPortfolio}
        portfolioByBarber={portfolioByBarber}
      />

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {user?.role === 'client' ? PORTFOLIO_TEXTS.MY_PHOTOS : PORTFOLIO_TEXTS.WORKS_DONE}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {PORTFOLIO_TEXTS.WORKS_FOUND.replace('{count}', filteredPortfolio.length)}
          </span>
        </div>

        {viewMode === VIEW_MODES.GRID ? (
          <PortfolioGrid
            user={user}
            filteredPortfolio={filteredPortfolio}
            onShowPhotoModal={handleShowPhotoModal}
            onShowRatingModal={handleShowRatingModal}
          />
        ) : (
          <PortfolioList
            user={user}
            filteredPortfolio={filteredPortfolio}
            onShowPhotoModal={handleShowPhotoModal}
            onShowRatingModal={handleShowRatingModal}
          />
        )}
      </div>

      <PhotoModal
        photo={selectedPhoto}
        onClose={handleClosePhotoModal}
      />

      <AddWorkModal
        showModal={showAddWorkModal}
        newWork={newWork}
        services={services}
        onClose={handleCloseAddWorkModal}
        onSubmit={handleAddWork}
        onNewWorkChange={handleNewWorkChange}
        onServiceSelection={handleServiceSelection}
        onPhotoUpload={handlePhotoUpload}
      />

      <RatingModal
        showModal={showRatingModal}
        selectedWork={selectedWorkForRating}
        newRating={newRating}
        ratingComment={ratingComment}
        onClose={handleCloseRatingModal}
        onSubmit={handleSubmitRating}
        onRatingChange={handleRatingChange}
        onCommentChange={handleRatingCommentChange}
      />
    </div>
  );
};

export default Portfolio;