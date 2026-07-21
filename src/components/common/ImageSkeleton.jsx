import clsx from 'clsx';

const ImageSkeleton = ({
  width = '100%',
  height = 200,
  className = '',
  variant = 'rect',
  ...props
}) => {
  const variantClass = {
    rect: '',
    circle: 'rounded-circle',
    avatar: 'rounded-circle',
  };

  return (
    <div
      className={clsx(
        'animate-shimmer',
        variantClass[variant],
        className
      )}
      style={{
        width,
        height,
        backgroundColor: 'var(--color-gray-200)',
        borderRadius: variant === 'rect' ? 'var(--radius-lg)' : undefined,
      }}
      aria-hidden="true"
      {...props}
    />
  );
};

export default ImageSkeleton;
