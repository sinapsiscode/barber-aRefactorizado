import { CARD_STYLES, cn } from '../../styles/components';

const Card = ({
  children,
  variant = 'elevated',
  padding = 'md',
  interactive = false,
  className = '',
  onClick,
  ...props
}) => {
  const cardClasses = cn(
    CARD_STYLES.base,
    CARD_STYLES.variants[variant],
    CARD_STYLES.padding[padding],
    interactive && CARD_STYLES.interactive,
    className
  );

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={cardClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;