import { FiX, FiStar, FiCheck } from 'react-icons/fi';
import { PORTFOLIO_TEXTS } from '../../../constants/portfolio';
import { getRatingText } from '../../../utils/portfolioHelpers';

const RatingModal = ({
  showModal,
  selectedWork,
  newRating,
  ratingComment,
  onClose,
  onSubmit,
  onRatingChange,
  onCommentChange
}) => {
  if (!showModal || !selectedWork) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-800 rounded-lg p-6 max-w-md w-full mx-4">
        <ModalHeader
          selectedWork={selectedWork}
          onClose={onClose}
        />

        <ServiceInfo selectedWork={selectedWork} />

        <form onSubmit={onSubmit} className="space-y-6">
          <RatingSelector
            newRating={newRating}
            onRatingChange={onRatingChange}
          />

          <CommentField
            ratingComment={ratingComment}
            onCommentChange={onCommentChange}
          />

          <ActionButtons
            selectedWork={selectedWork}
            onClose={onClose}
          />
        </form>
      </div>
    </div>
  );
};

const ModalHeader = ({ selectedWork, onClose }) => (
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
      {selectedWork.rating > 0 ? PORTFOLIO_TEXTS.EDIT_RATING_TITLE : PORTFOLIO_TEXTS.RATING_TITLE}
    </h3>
    <button
      onClick={onClose}
      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
    >
      <FiX className="h-6 w-6" />
    </button>
  </div>
);

const ServiceInfo = ({ selectedWork }) => (
  <div className="mb-6 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
      {selectedWork.service}
    </h4>
    <p className="text-sm text-gray-600 dark:text-gray-400">
      Barbero: {selectedWork.barberName}
    </p>
    <p className="text-sm text-gray-600 dark:text-gray-400">
      Fecha: {new Date(selectedWork.date).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
    </p>
  </div>
);

const RatingSelector = ({ newRating, onRatingChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
      {PORTFOLIO_TEXTS.YOUR_RATING}
    </label>
    <div className="flex items-center justify-center space-x-2 mb-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
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
        {getRatingText(newRating)}
      </span>
      <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
        ({newRating}/5)
      </span>
    </div>
  </div>
);

const CommentField = ({ ratingComment, onCommentChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {PORTFOLIO_TEXTS.COMMENT_LABEL}
    </label>
    <textarea
      value={ratingComment}
      onChange={(e) => onCommentChange(e.target.value)}
      rows={3}
      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
      placeholder={PORTFOLIO_TEXTS.COMMENT_PLACEHOLDER}
    />
  </div>
);

const ActionButtons = ({ selectedWork, onClose }) => (
  <div className="flex space-x-3 pt-4">
    <button
      type="submit"
      className="flex-1 btn-primary"
    >
      <FiCheck className="h-4 w-4 mr-2" />
      {selectedWork.rating > 0 ? PORTFOLIO_TEXTS.UPDATE_RATING : PORTFOLIO_TEXTS.SEND_RATING}
    </button>
    <button
      type="button"
      onClick={onClose}
      className="flex-1 btn-secondary"
    >
      {PORTFOLIO_TEXTS.CANCEL}
    </button>
  </div>
);

export default RatingModal;