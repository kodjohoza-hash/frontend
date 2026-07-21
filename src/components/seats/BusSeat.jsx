import React from 'react';

const stateConfig = {
  available: { bg: '#E8F5E9', border: '#4CAF50', color: '#2E7D32', label: 'Disponible', icon: null },
  occupied: { bg: '#FFEBEE', border: '#EF5350', color: '#C62828', label: 'Occupé', icon: 'bi-x-lg' },
  reserved: { bg: '#FFF3E0', border: '#FF9800', color: '#E65100', label: 'Réservé', icon: 'bi-clock-fill' },
  selected: { bg: '#0B1D51', border: '#0B1D51', color: '#FFFFFF', label: 'Sélectionné', icon: 'bi-check-lg' },
  vip: { bg: '#F3E5F5', border: '#9C27B0', color: '#6A1B9A', label: 'VIP', icon: 'bi-star-fill' },
  pmr: { bg: '#E3F2FD', border: '#2196F3', color: '#1565C0', label: 'PMR', icon: 'bi-universal-access' },
};

const BusSeat = React.memo(function BusSeat({ seat, isSelected, onToggle, onHover, onLeave, disabled }) {
  const getDisplayState = () => {
    if (isSelected) return 'selected';
    if (seat.isPMR) return 'pmr';
    if (seat.isVIP && seat.state === 'available') return 'vip';
    return seat.state;
  };

  const displayState = getDisplayState();
  const config = stateConfig[displayState] || stateConfig.available;
  const isDisabled = disabled || seat.state === 'occupied' || seat.state === 'reserved';

  const handleClick = () => {
    if (!isDisabled && onToggle) {
      onToggle(seat);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
      e.preventDefault();
      handleClick();
    }
  };

  const seatStyle = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: `${seat.width || 38}px`,
    height: `${seat.height || 34}px`,
    backgroundColor: config.bg,
    border: `2px solid ${config.border}`,
    borderRadius: '6px 6px 10px 10px',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: isDisabled ? 0.55 : 1,
    transform: !isDisabled ? 'scale(1)' : 'none',
    boxShadow: isSelected
      ? '0 0 0 3px rgba(11, 29, 81, 0.25), 0 4px 12px rgba(11, 29, 81, 0.3)'
      : '0 1px 3px rgba(0,0,0,0.08)',
    outline: 'none',
    overflow: 'hidden',
  };

  const seatBackStyle = {
    position: 'absolute',
    top: 0,
    left: '15%',
    right: '15%',
    height: '35%',
    backgroundColor: config.border,
    borderRadius: '4px 4px 0 0',
    opacity: isSelected ? 0.4 : 0.15,
    transition: 'opacity 0.2s ease',
  };

  const numberStyle = {
    fontSize: '11px',
    fontWeight: 700,
    color: config.color,
    lineHeight: 1,
    zIndex: 1,
    userSelect: 'none',
    letterSpacing: '-0.02em',
  };

  const iconStyle = {
    fontSize: '8px',
    color: config.color,
    lineHeight: 1,
    zIndex: 1,
    marginTop: '1px',
  };

  const hoverHandlers = !isDisabled
    ? {
        onMouseEnter: () => onHover && onHover(seat),
        onMouseLeave: () => onLeave && onLeave(),
      }
    : {};

  return (
    <button
      type="button"
      className="bus-seat-btn"
      style={seatStyle}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={isDisabled}
      aria-label={`Siège ${seat.number} - ${seat.position === 'window' ? 'Fenêtre' : 'Couloir'} - ${seat.price} FCFA - ${config.label}`}
      aria-pressed={isSelected}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      {...hoverHandlers}
    >
      <div style={seatBackStyle} />
      <span style={numberStyle}>{String(seat.number).padStart(2, '0')}</span>
      {config.icon && (
        <i className={`bi ${config.icon}`} style={iconStyle} aria-hidden="true" />
      )}
      {isSelected && (
        <style>{`
          .bus-seat-btn[aria-pressed="true"] {
            animation: seatPulse 2s ease-in-out infinite;
          }
        `}</style>
      )}
    </button>
  );
});

export default BusSeat;
