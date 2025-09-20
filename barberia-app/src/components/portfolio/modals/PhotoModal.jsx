import { FiX, FiCamera, FiStar } from 'react-icons/fi';
import { PORTFOLIO_TEXTS } from '../../../constants/portfolio';

const PhotoModal = ({ photo, onClose }) => {
  if (!photo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="max-w-4xl mx-4 bg-white dark:bg-dark-800 rounded-lg overflow-hidden">
        <ModalHeader photo={photo} onClose={onClose} />
        <ModalContent photo={photo} />
      </div>
    </div>
  );
};

const ModalHeader = ({ photo, onClose }) => (
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
);

const ModalContent = ({ photo }) => (
  <div className="p-6">
    <PhotoGrid />

    {photo.notes && (
      <NotesSection notes={photo.notes} />
    )}

    {photo.ratingComment && (
      <CommentSection comment={photo.ratingComment} />
    )}

    <RatingSection rating={photo.rating} />
  </div>
);

const PhotoGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <PhotoPlaceholder title={PORTFOLIO_TEXTS.PHOTO_BEFORE} />
    <PhotoPlaceholder title={PORTFOLIO_TEXTS.PHOTO_AFTER} />
  </div>
);

const PhotoPlaceholder = ({ title }) => (
  <div>
    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {title}
    </h4>
    <div className="aspect-square bg-gray-200 dark:bg-dark-600 rounded-lg flex items-center justify-center">
      <FiCamera className="h-12 w-12 text-gray-400" />
      <span className="ml-2 text-gray-500">{title}</span>
    </div>
  </div>
);

const NotesSection = ({ notes }) => (
  <div className="mt-4 p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
    <p className="text-sm text-gray-600 dark:text-gray-400">
      <strong>Notas del barbero:</strong> {notes}
    </p>
  </div>
);

const CommentSection = ({ comment }) => (
  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
    <p className="text-sm text-blue-700 dark:text-blue-300">
      <strong>Comentario del cliente:</strong> {comment}
    </p>
  </div>
);

const RatingSection = ({ rating }) => (
  <div className="mt-4 flex items-center justify-between">
    <div className="flex items-center space-x-1">
      {rating > 0 ? (
        <>
          {[...Array(5)].map((_, i) => (
            <FiStar
              key={i}
              className={`h-4 w-4 ${
                i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            {rating}/5
          </span>
        </>
      ) : (
        <span className="text-sm text-gray-500 dark:text-gray-400 italic">
          {PORTFOLIO_TEXTS.PENDING_RATING}
        </span>
      )}
    </div>
  </div>
);

export default PhotoModal;