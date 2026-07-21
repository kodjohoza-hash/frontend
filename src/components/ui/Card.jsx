import clsx from 'clsx';

/**
 * Card — Carte réutilisable avec Header/Body/Footer
 */
const Card = ({
  children,
  className = '',
  hoverable = false,
  bordered = true,
  padding = true,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'card',
        hoverable && 'card-hoverable',
        !bordered && 'border-0',
        !padding && 'card-no-padding',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({
  children,
  className = '',
  ...props
}) => (
  <div className={clsx('card-header', className)} {...props}>
    {children}
  </div>
);

const CardBody = ({
  children,
  className = '',
  ...props
}) => (
  <div className={clsx('card-body', className)} {...props}>
    {children}
  </div>
);

const CardFooter = ({
  children,
  className = '',
  ...props
}) => (
  <div className={clsx('card-footer', className)} {...props}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
