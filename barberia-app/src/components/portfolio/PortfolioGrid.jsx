import { FiCamera, FiStar, FiEye } from 'react-icons/fi';
import { PORTFOLIO_TEXTS } from '../../constants/portfolio';

const PortfolioGrid = ({
  user,
  filteredPortfolio,
  onShowPhotoModal,
  onShowRatingModal
}) => {
  if (filteredPortfolio.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredPortfolio.map(item => (
        <PortfolioCard
          key={item.id}
          item={item}
          user={user}
          onShowPhotoModal={onShowPhotoModal}
          onShowRatingModal={onShowRatingModal}
        />
      ))}
    </div>
  );
};

const PortfolioCard = ({ item, user, onShowPhotoModal, onShowRatingModal }) => (
  <div className="border border-gray-200 dark:border-dark-600 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
    <PhotoPreview item={item} onShowPhotoModal={onShowPhotoModal} />
    <CardContent
      item={item}
      user={user}
      onShowRatingModal={onShowRatingModal}
    />
  </div>
);

const PhotoPreview = ({ item, onShowPhotoModal }) => (
  <div className="aspect-video bg-gray-200 dark:bg-dark-600 flex items-center justify-center relative group">
    <div className="grid grid-cols-2 gap-1 w-full h-full">
      <PhotoPlaceholder label={PORTFOLIO_TEXTS.PHOTO_BEFORE} />
      <PhotoPlaceholder label={PORTFOLIO_TEXTS.PHOTO_AFTER} />
    </div>
    <button
      onClick={() => onShowPhotoModal(item)}
      className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
    >
      <FiEye className="h-8 w-8 text-white" />
    </button>
  </div>
);

const PhotoPlaceholder = ({ label }) => (
  <div className="bg-gray-300 dark:bg-dark-500 flex items-center justify-center">
    <div className="text-center">
      <FiCamera className="h-6 w-6 text-gray-500 mx-auto mb-1" />
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  </div>
);

const CardContent = ({ item, user, onShowRatingModal }) => (
  <div className="p-4">
    <div className="flex items-center justify-between mb-2">
      <h3 className="font-semibold text-gray-900 dark:text-white">
        {item.barberName}
      </h3>
      <RatingDisplay rating={item.rating} />
    </div>

    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
      {item.service}
    </p>

    <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
      {new Date(item.date).toLocaleDateString()}
    </p>

    {user?.role === 'client' && (
      <RatingButton
        item={item}
        onShowRatingModal={onShowRatingModal}
      />
    )}
  </div>
);

const RatingDisplay = ({ rating }) => (
  <div className="flex items-center space-x-1">
    {rating > 0 ? (
      <>
        <FiStar className="h-4 w-4 text-yellow-400 fill-current" />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {rating}
        </span>
      </>
    ) : (
      <span className="text-xs text-gray-500 dark:text-gray-400 italic">
        {PORTFOLIO_TEXTS.NO_RATING}
      </span>
    )}
  </div>
);

const RatingButton = ({ item, onShowRatingModal }) => (
  <button
    onClick={() => onShowRatingModal(item)}
    className={`w-full text-xs py-1 px-2 rounded transition-colors ${
      item.rating > 0
        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
        : 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800'
    }`}
  >
    <FiStar className="h-3 w-3 inline mr-1" />
    {item.rating > 0 ? PORTFOLIO_TEXTS.EDIT_RATING : PORTFOLIO_TEXTS.RATE_SERVICE}
  </button>
);

const EmptyState = () => (
  <div className="text-center py-12">
    <FiCamera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
      {PORTFOLIO_TEXTS.EMPTY_STATE_TITLE}
    </h3>
    <p className="text-gray-600 dark:text-gray-400">
      {PORTFOLIO_TEXTS.EMPTY_STATE_DESCRIPTION}
    </p>
  </div>
);

export default PortfolioGrid;