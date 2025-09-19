import { FiInfo, FiCheckCircle, FiAlertTriangle, FiXCircle, FiX } from 'react-icons/fi';
import { ALERT_STYLES, cn } from '../../styles/components';

const Alert = ({
  children,
  variant = 'info',
  title,
  dismissible = false,
  onDismiss,
  icon: CustomIcon = null,
  className = '',
  ...props
}) => {
  const icons = {
    success: FiCheckCircle,
    error: FiXCircle,
    warning: FiAlertTriangle,
    info: FiInfo
  };

  const Icon = CustomIcon || icons[variant];

  const alertClasses = cn(
    ALERT_STYLES.base,
    ALERT_STYLES.variants[variant],
    className
  );

  return (
    <div className={alertClasses} {...props}>
      {Icon && (
        <Icon className="h-5 w-5 flex-shrink-0" />
      )}

      <div className="flex-1">
        {title && (
          <h3 className="text-sm font-medium mb-1">
            {title}
          </h3>
        )}
        <div className="text-sm">
          {children}
        </div>
      </div>

      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className="flex-shrink-0 ml-auto pl-3"
        >
          <FiX className="h-5 w-5 hover:opacity-70 transition-opacity" />
        </button>
      )}
    </div>
  );
};

export default Alert;