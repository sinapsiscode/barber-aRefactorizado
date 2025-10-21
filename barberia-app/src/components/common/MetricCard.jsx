import { useEffect, useState } from 'react';

const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'bg-blue-500', 
  change = null, 
  description = null,
  onClick = null,
  className = ''
}) => {
  const CardWrapper = onClick ? 'button' : 'div';
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [value]);
  
  // Color mapping for premium gradients
  const colorMap = {
    'bg-blue-500': 'from-primary-600 to-primary-800',
    'bg-green-500': 'from-emerald-600 to-green-800',
    'bg-yellow-500': 'from-[#D4AF37] to-[#B8860B]',
    'bg-purple-500': 'from-purple-600 to-purple-800',
    'bg-red-500': 'from-red-600 to-red-800',
    'bg-indigo-500': 'from-indigo-600 to-indigo-800'
  };
  
  const gradientColor = colorMap[color] || 'from-gray-600 to-gray-800';
  
  return (
    <CardWrapper 
      onClick={onClick}
      className={`bg-white dark:bg-gray-950 rounded-lg p-6 elevation-2 hover:elevation-4 transition-all duration-300 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </div>
          <div className={`text-3xl font-normal text-gray-900 dark:text-gray-100 mb-2 ${isAnimating ? 'animate-pulse' : ''}`}>
            {value}
          </div>
          {change !== null && (
            <div className="flex items-center space-x-1">
              <div className={`flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                change >= 0 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-orange-500/20 text-orange-400'
              }`}>
                <span className="mr-1">{change >= 0 ? '↑' : '↓'}</span>
                <span>{Math.abs(change)}%</span>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">vs mes anterior</span>
            </div>
          )}
          {description && (
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              {description}
            </div>
          )}
        </div>
        
        {Icon && (
          <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
            <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
          </div>
        )}
      </div>
      
    </CardWrapper>
  );
};

export default MetricCard;