import { FiX } from 'react-icons/fi';
import { cn } from '../../styles/components';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlay = true,
  showCloseButton = true,
  className = '',
  ...props
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'sm:max-w-lg',
    md: 'sm:max-w-2xl',
    lg: 'sm:max-w-4xl',
    xl: 'sm:max-w-6xl',
    full: 'sm:max-w-[95vw]'
  };

  const handleOverlayClick = (e) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      {...props}
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />

        {/* Modal */}
        <div
          className={cn(
            'inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full',
            sizeClasses[size],
            className
          )}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              {title && (
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  type="button"
                >
                  <FiX className="h-6 w-6" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="bg-white dark:bg-gray-800">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;