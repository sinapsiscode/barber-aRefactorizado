import { BADGE_STYLES, cn } from '../../styles/components';

const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const badgeClasses = cn(
    BADGE_STYLES.base,
    BADGE_STYLES.variants[variant],
    BADGE_STYLES.sizes[size],
    className
  );

  return (
    <span className={badgeClasses} {...props}>
      {children}
    </span>
  );
};

export default Badge;