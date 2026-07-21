import { useState } from 'react';
import clsx from 'clsx';

const FALLBACK_SOURCES = {
  avatar: '/src/assets/images/placeholders/avatar.png',
  bus: '/src/assets/images/placeholders/bus.png',
  destination: '/src/assets/images/placeholders/destination.png',
  company: '/src/assets/images/placeholders/company.png',
  general: '/src/assets/images/placeholders/general.png',
};

const ImageWithFallback = ({
  src,
  alt = '',
  fallbackType = 'general',
  className = '',
  imgClassName = '',
  rounded = false,
  fluid = false,
  width,
  height,
  style,
  onLoad,
  onError,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(FALLBACK_SOURCES[fallbackType] || FALLBACK_SOURCES.general);
      onError?.();
    }
  };

  return (
    <div
      className={clsx(
        'image-fallback-wrapper',
        rounded && 'rounded-circle overflow-hidden',
        className
      )}
      style={{
        width,
        height,
        ...style,
      }}
    >
      <img
        src={imgSrc}
        alt={alt}
        className={clsx(
          'image-fallback-img',
          fluid && 'img-fluid',
          rounded && 'rounded-circle',
          imgClassName
        )}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onLoad={onLoad}
        onError={handleError}
        loading="lazy"
        {...props}
      />
    </div>
  );
};

export default ImageWithFallback;
