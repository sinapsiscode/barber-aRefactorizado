import { FiCamera, FiStar } from 'react-icons/fi';
import { PORTFOLIO_TEXTS } from '../../constants/portfolio';

const PortfolioList = ({
  user,
  filteredPortfolio,
  onShowPhotoModal,
  onShowRatingModal
}) => {
  if (filteredPortfolio.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {filteredPortfolio.map(item => (
        <PortfolioListItem
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

const PortfolioListItem = ({ item, user, onShowPhotoModal, onShowRatingModal }) => (
  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-dark-600 rounded-lg">
    <div className="flex items-center space-x-4">
      <PhotoThumbnail />
      <ItemInfo item={item} />
    </div>

    <div className="flex items-center space-x-4">
      <RatingDisplay rating={item.rating} />
      <ActionButtons
        item={item}
        user={user}
        onShowPhotoModal={onShowPhotoModal}
        onShowRatingModal={onShowRatingModal}
      />
    </div>
  </div>
);

const PhotoThumbnail = () => (
  <div className="h-16 w-24 bg-gray-200 dark:bg-dark-600 rounded-lg flex items-center justify-center">
    <FiCamera className="h-6 w-6 text-gray-400" />
  </div>
);

const ItemInfo = ({ item }) => (
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

const ActionButtons = ({ item, user, onShowPhotoModal, onShowRatingModal }) => (
  <div className="flex items-center space-x-2">
    {user?.role === 'client' && (
      <RatingButton
        item={item}
        onShowRatingModal={onShowRatingModal}
      />
    )}
    <button
      onClick={() => onShowPhotoModal(item)}
      className="btn-secondary text-sm"
    >
      {PORTFOLIO_TEXTS.VIEW_PHOTOS}
    </button>
  </div>
);

const RatingButton = ({ item, onShowRatingModal }) => (
  <button
    onClick={() => onShowRatingModal(item)}
    className={`text-sm py-1 px-3 rounded transition-colors ${
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

export default PortfolioList;