import { AVATAR_STYLES, cn } from '../../styles/components';

const Avatar = ({
  src,
  alt,
  name,
  size = 'md',
  className = '',
  onClick,
  showBadge = false,
  badgeColor = 'green',
  fallbackIcon: FallbackIcon = null,
  ...props
}) => {
  // Generar iniciales del nombre
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  // Generar color de fondo basado en el nombre
  const getBackgroundColor = (name) => {
    if (!name) return AVATAR_STYLES.colors[0];
    const hash = name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return AVATAR_STYLES.colors[Math.abs(hash) % AVATAR_STYLES.colors.length];
  };

  const avatarClasses = cn(
    AVATAR_STYLES.base,
    AVATAR_STYLES.sizes[size],
    !src && getBackgroundColor(name),
    onClick && 'cursor-pointer hover:opacity-80',
    className
  );

  const badgeClasses = cn(
    'absolute -bottom-0 -right-0 border-2 border-white dark:border-gray-800 rounded-full',
    {
      'w-2 h-2': size === 'xs' || size === 'sm',
      'w-3 h-3': size === 'md',
      'w-4 h-4': size === 'lg' || size === 'xl' || size === '2xl'
    },
    {
      'bg-green-400': badgeColor === 'green',
      'bg-red-400': badgeColor === 'red',
      'bg-yellow-400': badgeColor === 'yellow',
      'bg-blue-400': badgeColor === 'blue',
      'bg-gray-400': badgeColor === 'gray'
    }
  );

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className="relative inline-block"
      onClick={onClick}
      {...props}
    >
      <div className={avatarClasses}>
        {src ? (
          <img
            src={src}
            alt={alt || `Avatar de ${name}`}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}

        {/* Fallback content */}
        <div
          className={cn(
            "w-full h-full flex items-center justify-center rounded-full",
            src ? "hidden" : "flex"
          )}
        >
          {FallbackIcon ? (
            <FallbackIcon className="w-1/2 h-1/2" />
          ) : (
            <span className="font-medium">
              {getInitials(name)}
            </span>
          )}
        </div>
      </div>

      {showBadge && (
        <span className={badgeClasses} />
      )}
    </Component>
  );
};

export default Avatar;