import { forwardRef } from 'react';
import { BUTTON_STYLES, cn } from '../../styles/components';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon: LeftIcon = null,
  rightIcon: RightIcon = null,
  className = '',
  onClick,
  type = 'button',
  ...props
}, ref) => {
  const baseClasses = cn(
    BUTTON_STYLES.base,
    BUTTON_STYLES.variants[variant],
    BUTTON_STYLES.sizes[size],
    className
  );

  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={handleClick}
      className={baseClasses}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {!loading && LeftIcon && (
        <LeftIcon className="w-4 h-4 mr-2" />
      )}

      {children}

      {!loading && RightIcon && (
        <RightIcon className="w-4 h-4 ml-2" />
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;