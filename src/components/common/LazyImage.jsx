import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

const LazyImage = ({
  src,
  alt = '',
  className = '',
  fallbackSrc,
  skeletonClassName = '',
  width,
  height,
  ratio,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    const currentRef = imgRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const ratioClass = ratio ? `ratio ratio-${ratio}` : undefined;

  const skeletonStyle = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  };

  return (
    <div ref={imgRef} className={clsx('position-relative', ratioClass)} style={skeletonStyle}>
      {!isLoaded && !hasError && (
        <div
          className={clsx(
            'position-absolute top-0 start-0 w-100 h-100',
            'animate-shimmer rounded',
            skeletonClassName
          )}
          style={{ backgroundColor: 'var(--color-gray-200)' }}
        />
      )}

      {hasError && fallbackSrc ? (
        <img
          src={fallbackSrc}
          alt={alt}
          className={clsx(
            'w-100 h-100',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          style={{ objectFit: 'cover', transition: 'opacity 0.3s ease' }}
          onLoad={handleLoad}
          {...props}
        />
      ) : isInView ? (
        <img
          src={src}
          alt={alt}
          className={clsx(
            'w-100 h-100',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          style={{ objectFit: 'cover', transition: 'opacity 0.3s ease' }}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          width={width}
          height={height}
          {...props}
        />
      ) : null}
    </div>
  );
};

export default LazyImage;
