import React, { memo } from 'react';

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  tile: (isSelected, brandColor) => ({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 16px',
    background: isSelected
      ? `rgba(255,255,255,0.08)`
      : 'rgba(255,255,255,0.04)',
    border: `2px solid ${isSelected ? brandColor : 'rgba(255,255,255,0.08)'}`,
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'scale(1)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    overflow: 'hidden',
  }),
  tileHover: {
    transform: 'scale(1.03)',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  brandCircle: (brandColor) => ({
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: `rgba(255,255,255,0.06)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '14px',
    boxShadow: `0 0 20px ${brandColor}33, 0 0 40px ${brandColor}11`,
    border: `1px solid ${brandColor}33`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  }),
  brandText: (brandColor) => ({
    color: brandColor,
    fontSize: brandColor.length > 4 ? '11px' : '14px',
    fontWeight: 800,
    letterSpacing: '0.05em',
    fontFamily: "'Inter', sans-serif",
  }),
  methodName: {
    color: '#fff',
    fontSize: '15px',
    fontWeight: 600,
    marginBottom: '4px',
    fontFamily: "'Inter', sans-serif",
    lineHeight: 1.2,
  },
  description: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: '12px',
    fontWeight: 400,
    fontFamily: "'Inter', sans-serif",
    lineHeight: 1.3,
  },
  checkCircle: (brandColor) => ({
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    background: brandColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '13px',
    boxShadow: `0 0 12px ${brandColor}66`,
    animation: 'btcPopIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  }),
  shimmer: {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)',
    animation: 'btcShimmer 3s infinite',
  },
};

const PayMethodGrid = memo(({ methods, selectedMethod, onSelect }) => {
  const [hoveredId, setHoverId] = React.useState(null);

  return (
    <>
      <style>{`
        @keyframes btcPopIn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes btcShimmer {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        @media (max-width: 640px) {
          .btc-method-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div className="btc-method-grid" style={styles.grid} role="radiogroup" aria-label="Méthodes de paiement">
        {methods.filter(m => m.available).map(method => {
          const isSelected = selectedMethod === method.id;
          const isHovered = hoveredId === method.id;

          return (
            <div
              key={method.id}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${method.name} — ${method.description}`}
              tabIndex={0}
              style={{
                ...styles.tile(isSelected, method.brandColor),
                ...(isHovered && !isSelected ? styles.tileHover : {}),
              }}
              onClick={() => onSelect(method.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(method.id); } }}
              onMouseEnter={() => setHoverId(method.id)}
              onMouseLeave={() => setHoverId(null)}
            >
              <div style={styles.shimmer} aria-hidden="true" />

              <div style={{
                ...styles.brandCircle(method.brandColor),
                boxShadow: isSelected || isHovered
                  ? `0 0 28px ${method.brandColor}55, 0 0 56px ${method.brandColor}22`
                  : styles.brandCircle(method.brandColor).boxShadow,
              }}>
                <span style={styles.brandText(method.brandColor)}>{method.brand}</span>
              </div>

              <div style={styles.methodName}>{method.name}</div>
              <div style={styles.description}>{method.description}</div>

              {isSelected && (
                <div style={styles.checkCircle(method.brandColor)} aria-hidden="true">
                  <i className="bi bi-check-lg" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
});

PayMethodGrid.displayName = 'PayMethodGrid';
export default PayMethodGrid;
