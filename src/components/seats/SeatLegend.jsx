import React from 'react';

const legendItems = [
  { key: 'available', label: 'Disponible', bg: '#E8F5E9', border: '#4CAF50', icon: null },
  { key: 'selected', label: 'Sélectionné', bg: '#0B1D51', border: '#0B1D51', icon: 'bi-check-lg' },
  { key: 'occupied', label: 'Occupé', bg: '#FFEBEE', border: '#EF5350', icon: 'bi-x-lg' },
  { key: 'reserved', label: 'Réservé', bg: '#FFF3E0', border: '#FF9800', icon: 'bi-clock-fill' },
  { key: 'vip', label: 'VIP', bg: '#F3E5F5', border: '#9C27B0', icon: 'bi-star-fill' },
  { key: 'pmr', label: 'PMR', bg: '#E3F2FD', border: '#2196F3', icon: 'bi-universal-access' },
];

const SeatLegend = React.memo(function SeatLegend({ availableCount = 0 }) {
  const isLow = availableCount > 0 && availableCount <= 5;

  const containerStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    padding: '16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  };

  const titleStyle = {
    fontSize: '13px',
    fontWeight: 700,
    color: '#1E293B',
    marginBottom: '12px',
    letterSpacing: '0.02em',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  };

  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const labelStyle = {
    fontSize: '11px',
    fontWeight: 500,
    color: '#475569',
  };

  const counterStyle = {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #F1F5F9',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const counterDotStyle = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: isLow ? '#EF5350' : '#4CAF50',
    animation: isLow ? 'counterPulse 1.5s ease-in-out infinite' : 'none',
  };

  const counterTextStyle = {
    fontSize: '12px',
    fontWeight: 600,
    color: isLow ? '#C62828' : '#2E7D32',
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes counterPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
      <div style={titleStyle}>Légende</div>
      <div style={gridStyle}>
        {legendItems.map((item) => (
          <div key={item.key} style={itemStyle}>
            <div
              style={{
                width: '20px',
                height: '18px',
                borderRadius: '4px',
                backgroundColor: item.bg,
                border: `2px solid ${item.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {item.icon && (
                <i
                  className={`bi ${item.icon}`}
                  style={{ fontSize: '7px', color: item.key === 'selected' ? '#FFF' : item.border }}
                />
              )}
            </div>
            <span style={labelStyle}>{item.label}</span>
          </div>
        ))}
      </div>
      {availableCount > 0 && (
        <div style={counterStyle}>
          <div style={counterDotStyle} />
          <span style={counterTextStyle}>
            {availableCount} place{availableCount > 1 ? 's' : ''} disponible{availableCount > 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
});

export default SeatLegend;
