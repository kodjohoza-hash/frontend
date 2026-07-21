import React from 'react';

const SeatTooltip = React.memo(function SeatTooltip({ seat, position }) {
  if (!seat || !position) return null;

  const stateLabels = {
    available: { text: 'Disponible', color: '#4CAF50' },
    occupied: { text: 'Occupé', color: '#EF5350' },
    reserved: { text: 'Réservé', color: '#FF9800' },
  };

  const legroomLabels = {
    compact: 'Standard',
    standard: 'Confort',
    extended: 'Premium',
  };

  const stateInfo = stateLabels[seat.state] || stateLabels.available;

  const tooltipStyle = {
    position: 'fixed',
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: 'translate(-50%, -110%)',
    backgroundColor: '#1E293B',
    color: '#FFFFFF',
    borderRadius: '10px',
    padding: '12px 16px',
    fontSize: '12px',
    lineHeight: 1.5,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25), 0 2px 8px rgba(0, 0, 0, 0.12)',
    zIndex: 9999,
    pointerEvents: 'none',
    opacity: 1,
    transition: 'opacity 0.15s ease-in-out',
    minWidth: '180px',
    whiteSpace: 'nowrap',
  };

  const arrowStyle = {
    position: 'absolute',
    bottom: '-6px',
    left: '50%',
    transform: 'translateX(-50%) rotate(45deg)',
    width: '12px',
    height: '12px',
    backgroundColor: '#1E293B',
    borderRadius: '2px',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '6px',
    paddingBottom: '6px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  };

  const seatNumStyle = {
    fontSize: '14px',
    fontWeight: 700,
    letterSpacing: '0.02em',
  };

  const stateBadgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    borderRadius: '12px',
    backgroundColor: `${stateInfo.color}22`,
    fontSize: '10px',
    fontWeight: 600,
    color: stateInfo.color,
  };

  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '2px 0',
  };

  const labelStyle = {
    color: '#94A3B8',
    fontSize: '11px',
  };

  const valueStyle = {
    fontWeight: 600,
    fontSize: '12px',
  };

  return (
    <div style={tooltipStyle} role="tooltip" aria-live="polite">
      <div style={arrowStyle} />
      <div style={headerStyle}>
        <span style={seatNumStyle}>Siège {String(seat.number).padStart(2, '0')}</span>
        <span style={stateBadgeStyle}>{stateInfo.text}</span>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>Position</span>
        <span style={valueStyle}>{seat.position === 'window' ? '🪟 Fenêtre' : '🚶 Couloir'}</span>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>Rangée</span>
        <span style={valueStyle}>{seat.row}</span>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>Espace jambes</span>
        <span style={valueStyle}>{legroomLabels[seat.legroom] || 'Standard'}</span>
      </div>
      {seat.state === 'available' && (
        <div style={{ ...rowStyle, marginTop: '4px', paddingTop: '4px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ ...labelStyle, color: '#CBD5E1' }}>Prix</span>
          <span style={{ ...valueStyle, color: '#FBBF24', fontSize: '13px' }}>
            {seat.price?.toLocaleString()} FCFA
          </span>
        </div>
      )}
    </div>
  );
});

export default SeatTooltip;
