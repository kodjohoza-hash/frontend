import React, { memo } from 'react';

const styles = {
  container: {
    width: '100%',
    maxWidth: '340px',
    aspectRatio: '16 / 10',
    borderRadius: '16px',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)',
    fontFamily: "'Inter', sans-serif",
    marginBottom: '24px',
  },
  background: (cardType) => ({
    position: 'absolute',
    inset: 0,
    background: cardType === 'visa'
      ? 'linear-gradient(135deg, #1A1F71 0%, #2d35a0 50%, #4338ca 100%)'
      : cardType === 'mastercard'
        ? 'linear-gradient(135deg, #1a0003 0%, #7f1d1d 50%, #991b1b 100%)'
        : 'linear-gradient(135deg, #0B1D51 0%, #1e3a8a 50%, #3730a3 100%)',
    transition: 'background 0.6s ease',
  }),
  shine: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.03) 50%, transparent 55%)',
    pointerEvents: 'none',
  },
  chipContainer: {
    position: 'absolute',
    top: '18%',
    left: '8%',
    width: '36px',
    height: '28px',
    borderRadius: '6px',
    background: 'linear-gradient(135deg, #d4af37 0%, #f0d78c 40%, #d4af37 60%, #b8960c 100%)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipLine: (top, width) => ({
    position: 'absolute',
    top,
    left: '50%',
    transform: 'translateX(-50%)',
    height: '1px',
    width,
    background: 'rgba(0,0,0,0.15)',
  }),
  number: {
    position: 'absolute',
    bottom: '42%',
    left: '8%',
    color: 'rgba(255,255,255,0.9)',
    fontSize: '17px',
    fontWeight: 500,
    letterSpacing: '0.12em',
    fontFamily: "'Courier New', monospace",
    textShadow: '0 1px 3px rgba(0,0,0,0.3)',
  },
  name: {
    position: 'absolute',
    bottom: '14%',
    left: '8%',
    color: 'rgba(255,255,255,0.75)',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    fontFamily: "'Inter', sans-serif",
  },
  expiry: {
    position: 'absolute',
    bottom: '14%',
    right: '8%',
    color: 'rgba(255,255,255,0.75)',
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.06em',
    fontFamily: "'Inter', sans-serif",
  },
  brandLogo: (cardType) => ({
    position: 'absolute',
    top: '18%',
    right: '8%',
    color: '#fff',
    fontSize: '18px',
    fontWeight: 800,
    letterSpacing: '0.06em',
    fontFamily: "'Inter', sans-serif",
    opacity: 0.9,
  }),
  dots: {
    position: 'absolute',
    bottom: '40%',
    left: '8%',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '18px',
    letterSpacing: '0.2em',
    fontFamily: "'Courier New', monospace",
  },
  placeholder: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  placeholderText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    fontFamily: "'Inter', sans-serif",
  },
  contactless: {
    position: 'absolute',
    top: '18%',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '2px',
    opacity: 0.4,
  },
  wave: (i) => ({
    width: `${8 + i * 4}px`,
    height: `${8 + i * 4}px`,
    border: '1.5px solid rgba(255,255,255,0.5)',
    borderRadius: '50%',
    borderRight: 'none',
    borderBottom: 'none',
    transform: `rotate(-45deg)`,
    marginTop: `${-i * 2}px`,
    marginLeft: `${i * 2}px`,
  }),
};

const PayCardPreview = memo(({ cardData = {}, cardType = null }) => {
  const { name = '', number = '', expiry = '' } = cardData;

  const displayNumber = number
    ? number.padEnd(16, '•').replace(/(.{4})/g, '$1 ').trim()
    : '•••• •••• •••• ••••';

  const displayName = name || 'VOTRE NOM';
  const displayExpiry = expiry || 'MM/YY';

  const hasData = name || number || expiry;

  return (
    <div style={styles.container} aria-label="Aperçu de la carte de crédit">
      <div style={styles.background(cardType)} />
      <div style={styles.shine} />

      {!hasData ? (
        <div style={styles.placeholder}>
          <i className="bi bi-credit-card" style={{ fontSize: '32px', color: 'rgba(255,255,255,0.2)' }} />
          <span style={styles.placeholderText}>Bus Tix Connect</span>
        </div>
      ) : (
        <>
          <div style={styles.chipContainer}>
            <div style={styles.chipLine('30%', '70%')} />
            <div style={styles.chipLine('50%', '50%')} />
            <div style={styles.chipLine('70%', '70%')} />
          </div>

          <div style={styles.contactless} aria-hidden="true">
            {[0, 1, 2].map(i => (
              <div key={i} style={styles.wave(i)} />
            ))}
          </div>

          {number ? (
            <div style={styles.number}>{displayNumber}</div>
          ) : (
            <div style={styles.dots}>•••• •••• •••• ••••</div>
          )}

          <div style={styles.name}>{displayName}</div>
          <div style={styles.expiry}>{displayExpiry}</div>

          {cardType && (
            <div style={styles.brandLogo(cardType)}>
              {cardType === 'visa' ? 'VISA' : 'MC'}
            </div>
          )}
        </>
      )}
    </div>
  );
});

PayCardPreview.displayName = 'PayCardPreview';
export default PayCardPreview;
