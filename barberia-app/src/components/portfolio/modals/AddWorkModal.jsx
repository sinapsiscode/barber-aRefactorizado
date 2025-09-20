import { FiX, FiCamera, FiCheck } from 'react-icons/fi';
import { PORTFOLIO_TEXTS } from '../../../constants/portfolio';

const AddWorkModal = ({
  showModal,
  newWork,
  services,
  onClose,
  onSubmit,
  onNewWorkChange,
  onServiceSelection,
  onPhotoUpload
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <ModalHeader onClose={onClose} />

        <form onSubmit={onSubmit} className="space-y-6">
          <ClientServiceFields
            newWork={newWork}
            services={services}
            onNewWorkChange={onNewWorkChange}
            onServiceSelection={onServiceSelection}
          />

          <DateField
            value={newWork.date}
            onChange={(value) => onNewWorkChange('date', value)}
          />

          <PhotoUploadFields
            newWork={newWork}
            onPhotoUpload={onPhotoUpload}
          />

          <NotesField
            value={newWork.notes}
            onChange={(value) => onNewWorkChange('notes', value)}
          />

          <ActionButtons
            newWork={newWork}
            onClose={onClose}
          />
        </form>
      </div>
    </div>
  );
};

const ModalHeader = ({ onClose }) => (
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
      {PORTFOLIO_TEXTS.ADD_WORK_TITLE}
    </h3>
    <button
      onClick={onClose}
      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
    >
      <FiX className="h-6 w-6" />
    </button>
  </div>
);

const ClientServiceFields = ({ newWork, services, onNewWorkChange, onServiceSelection }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {PORTFOLIO_TEXTS.CLIENT_NAME_LABEL}
      </label>
      <input
        type="text"
        value={newWork.clientName}
        onChange={(e) => onNewWorkChange('clientName', e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
        placeholder={PORTFOLIO_TEXTS.CLIENT_NAME_PLACEHOLDER}
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {PORTFOLIO_TEXTS.SERVICE_LABEL_REQUIRED}
      </label>
      <select
        value={newWork.serviceId}
        onChange={(e) => onServiceSelection(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
        required
      >
        <option value="">{PORTFOLIO_TEXTS.SELECT_SERVICE_PLACEHOLDER}</option>
        {services.map(service => (
          <option key={service.id} value={service.id}>
            {service.name}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const DateField = ({ value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {PORTFOLIO_TEXTS.SERVICE_DATE_LABEL}
    </label>
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
      required
    />
  </div>
);

const PhotoUploadFields = ({ newWork, onPhotoUpload }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
      {PORTFOLIO_TEXTS.PHOTOS_LABEL}
    </label>
    <div className="grid grid-cols-2 gap-4">
      <PhotoUploadArea
        photoType="beforePhoto"
        photo={newWork.beforePhoto}
        label={PORTFOLIO_TEXTS.PHOTO_BEFORE}
        onPhotoUpload={onPhotoUpload}
      />
      <PhotoUploadArea
        photoType="afterPhoto"
        photo={newWork.afterPhoto}
        label={PORTFOLIO_TEXTS.PHOTO_AFTER}
        onPhotoUpload={onPhotoUpload}
      />
    </div>
  </div>
);

const PhotoUploadArea = ({ photoType, photo, label, onPhotoUpload }) => (
  <div>
    <div className="border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg p-6 text-center">
      <FiCamera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{label}</p>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => onPhotoUpload(e, photoType)}
        className="hidden"
        id={photoType}
      />
      <label htmlFor={photoType} className="btn-secondary text-sm cursor-pointer">
        {photo ? PORTFOLIO_TEXTS.CHANGE_PHOTO : PORTFOLIO_TEXTS.TAKE_PHOTO}
      </label>
      {photo && (
        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
          {PORTFOLIO_TEXTS.PHOTO_UPLOADED}
        </p>
      )}
    </div>
  </div>
);

const NotesField = ({ value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {PORTFOLIO_TEXTS.NOTES_LABEL}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
      placeholder={PORTFOLIO_TEXTS.NOTES_PLACEHOLDER}
    />
  </div>
);

const ActionButtons = ({ newWork, onClose }) => (
  <div className="flex space-x-3 pt-4">
    <button
      type="submit"
      disabled={!newWork.clientName || !newWork.serviceId}
      className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FiCheck className="h-4 w-4 mr-2" />
      {PORTFOLIO_TEXTS.SAVE_WORK}
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

export default AddWorkModal;