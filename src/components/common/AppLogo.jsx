import logoPng from '@assets/logos/bus-tix-connect-logo.png';

/**
 * AppLogo — Reusable brand logo component
 * Sizes: sm (24px), md (32px), lg (40px), xl (56px)
 * Variants: icon-only, horizontal (icon + text)
 */
const SIZES = {
  xs: 20,
  sm: 24,
  md: 32,
  lg: 40,
  xl: 56,
};

const AppLogo = ({
  size = 'md',
  variant = 'horizontal',
  className = '',
  textClassName = '',
  text,
}) => {
  const px = typeof size === 'number' ? size : SIZES[size] || SIZES.md;
  const showText = variant === 'horizontal';

  return (
    <span className={`app-logo ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: px * 0.3 }}>
      <img
        src={logoPng}
        alt="BUS TIX CONNECT"
        width={px}
        height={px}
        style={{ display: 'block', flexShrink: 0 }}
        loading="eager"
      />
      {showText && (
        <span
          className={textClassName}
          style={{
            fontWeight: 700,
            fontSize: Math.max(px * 0.5, 14),
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
          }}
        >
          {text || 'BUS TIX CONNECT'}
        </span>
      )}
    </span>
  );
};

export default AppLogo;
