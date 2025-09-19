import { FiInbox } from 'react-icons/fi';

const EmptyState = ({ 
  icon: Icon = FiInbox, 
  title = 'No hay datos', 
  description = 'No se encontraron elementos para mostrar.',
  action = null,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
      <div className="mb-6">
        <div className="h-20 w-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <Icon className="h-10 w-10 text-gray-400 dark:text-gray-500" />
        </div>
      </div>
      <h3 className="text-xl font-normal text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6 text-sm">
        {description}
      </p>
      {action && (
        <div className="animate-fadeIn">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;