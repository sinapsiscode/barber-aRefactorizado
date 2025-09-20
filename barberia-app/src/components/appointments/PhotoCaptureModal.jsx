import { FiCamera } from 'react-icons/fi';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { PHOTO_MODAL_TEXTS, BUTTON_TEXTS } from '../../constants/barberAppointments';

const PhotoCaptureModal = ({ isOpen, onClose, onSavePhotos }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={PHOTO_MODAL_TEXTS.TITLE}
      size="sm"
    >
      <div className="p-6 space-y-4">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {PHOTO_MODAL_TEXTS.SUBTITLE}
        </p>

        <div className="grid grid-cols-2 gap-4">
          <PhotoCaptureBox label={PHOTO_MODAL_TEXTS.BEFORE_PHOTO} />
          <PhotoCaptureBox label={PHOTO_MODAL_TEXTS.AFTER_PHOTO} />
        </div>

        <div className="flex space-x-3 pt-4">
          <Button
            onClick={onSavePhotos}
            variant="primary"
            className="flex-1"
          >
            {BUTTON_TEXTS.SAVE_AND_COMPLETE}
          </Button>
          <Button
            onClick={onClose}
            variant="secondary"
            className="flex-1"
          >
            {BUTTON_TEXTS.CANCEL}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const PhotoCaptureBox = ({ label }) => (
  <div className="border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg p-8 text-center">
    <FiCamera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    <Button variant="secondary" size="sm" className="mt-2 w-full text-xs">
      {BUTTON_TEXTS.CAPTURE}
    </Button>
  </div>
);

export default PhotoCaptureModal;