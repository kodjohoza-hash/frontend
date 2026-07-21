import React from 'react';
import { SERVICES_CONFIG } from '../../data/seatMap';

const JourneyInfoCard = React.memo(function JourneyInfoCard({ trip, availableSeats }) {
  const containerStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    position: 'sticky',
    top: '16px',
  };

  const headerStyle = {
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottom: '1px solid #F1F5F9',
  };

  const avatarStyle = {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    backgroundColor: trip.companyColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: 800,
    letterSpacing: '0.05em',
    flexShrink: 0,
  };

  const companyInfoStyle = {
    flex: 1,
    minWidth: 0,
  };

  const companyNameStyle = {
    fontSize: '13px',
    fontWeight: 700,
    color: '#1E293B',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const tripNumStyle = {
    fontSize: '10px',
    color: '#94A3B8',
    fontWeight: 500,
    fontFamily: 'monospace',
  };

  const photoContainerStyle = {
    position: 'relative',
    width: '100%',
    height: '140px',
    overflow: 'hidden',
  };

  const photoStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const photoOverlayStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
  };

  const busTypeBadgeStyle = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    padding: '3px 10px',
    borderRadius: '20px',
    backgroundColor: trip.busType === 'vip' ? '#7C3AED' : trip.busType === 'premium' ? '#0B1D51' : '#475569',
    color: '#FFFFFF',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  };

  const contentStyle = {
    padding: '16px',
  };

  const routeStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  };

  const routeCityStyle = {
    flex: 1,
  };

  const cityNameStyle = {
    fontSize: '15px',
    fontWeight: 700,
    color: '#1E293B',
  };

  const timeStyle = {
    fontSize: '12px',
    color: '#64748B',
    fontWeight: 500,
    marginTop: '2px',
  };

  const routeLineStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    paddingTop: '4px',
  };

  const routeDashStyle = {
    width: '100%',
    height: '1px',
    borderTop: '2px dashed #CBD5E1',
  };

  const routeDurationStyle = {
    fontSize: '9px',
    color: '#94A3B8',
    fontWeight: 600,
  };

  const infoGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '16px',
  };

  const infoItemStyle = {
    padding: '8px 10px',
    backgroundColor: '#F8FAFC',
    borderRadius: '8px',
    border: '1px solid #F1F5F9',
  };

  const infoLabelStyle = {
    fontSize: '9px',
    color: '#94A3B8',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '2px',
  };

  const infoValueStyle = {
    fontSize: '12px',
    fontWeight: 700,
    color: '#1E293B',
  };

  const seatsIndicatorStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    backgroundColor: availableSeats <= 5 ? '#FEF2F2' : '#F0FDF4',
    borderRadius: '8px',
    border: `1px solid ${availableSeats <= 5 ? '#FECACA' : '#BBF7D0'}`,
    marginBottom: '16px',
  };

  const seatsDotStyle = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: availableSeats <= 5 ? '#EF5350' : '#4CAF50',
    animation: availableSeats <= 5 ? 'seatsPulse 1.5s ease-in-out infinite' : 'none',
    flexShrink: 0,
  };

  const seatsTextStyle = {
    fontSize: '12px',
    fontWeight: 600,
    color: availableSeats <= 5 ? '#C62828' : '#2E7D32',
  };

  const priceStyle = {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
    marginBottom: '12px',
    padding: '10px 12px',
    backgroundColor: '#FFFBEB',
    borderRadius: '8px',
    border: '1px solid #FDE68A',
  };

  const priceAmountStyle = {
    fontSize: '20px',
    fontWeight: 800,
    color: '#D97706',
  };

  const priceCurrencyStyle = {
    fontSize: '11px',
    fontWeight: 600,
    color: '#92400E',
  };

  const baggageStyle = {
    fontSize: '11px',
    color: '#64748B',
    padding: '8px 12px',
    backgroundColor: '#F8FAFC',
    borderRadius: '6px',
    marginBottom: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  const servicesSectionStyle = {
    borderTop: '1px solid #F1F5F9',
    paddingTop: '14px',
  };

  const servicesTitleStyle = {
    fontSize: '11px',
    fontWeight: 700,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '10px',
  };

  const servicesGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '6px',
  };

  const serviceItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 0',
  };

  const serviceIconStyle = {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    backgroundColor: '#EFF6FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    color: '#3B82F6',
    flexShrink: 0,
  };

  const serviceLabelStyle = {
    fontSize: '10px',
    fontWeight: 500,
    color: '#475569',
  };

  const departurePointStyle = {
    fontSize: '10px',
    color: '#94A3B8',
    marginTop: '2px',
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes seatsPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
      `}</style>

      {/* Company Header */}
      <div style={headerStyle}>
        <div style={avatarStyle}>{trip.companyInitial}</div>
        <div style={companyInfoStyle}>
          <div style={companyNameStyle}>{trip.companyName}</div>
          <div style={tripNumStyle}>{trip.tripNumber}</div>
        </div>
      </div>

      {/* Bus Photo */}
      <div style={photoContainerStyle}>
        <img src={trip.busPhoto} alt={`Bus ${trip.busNumber}`} style={photoStyle} />
        <div style={photoOverlayStyle} />
        <div style={busTypeBadgeStyle}>{trip.busType.toUpperCase()}</div>
      </div>

      <div style={contentStyle}>
        {/* Route */}
        <div style={routeStyle}>
          <div style={routeCityStyle}>
            <div style={cityNameStyle}>{trip.departureCity}</div>
            <div style={timeStyle}>{trip.departureTime}</div>
            <div style={departurePointStyle}>{trip.departurePoint}</div>
          </div>
          <div style={routeLineStyle}>
            <div style={routeDashStyle} />
            <span style={routeDurationStyle}>{trip.duration}</span>
            <div style={routeDashStyle} />
          </div>
          <div style={{ ...routeCityStyle, textAlign: 'right' }}>
            <div style={cityNameStyle}>{trip.arrivalCity}</div>
            <div style={timeStyle}>{trip.arrivalTime}</div>
            <div style={departurePointStyle}>{trip.arrivalPoint}</div>
          </div>
        </div>

        {/* Info Grid */}
        <div style={infoGridStyle}>
          <div style={infoItemStyle}>
            <div style={infoLabelStyle}>Date</div>
            <div style={infoValueStyle}>{trip.departureDate}</div>
          </div>
          <div style={infoItemStyle}>
            <div style={infoLabelStyle}>Distance</div>
            <div style={infoValueStyle}>{trip.distance}</div>
          </div>
          <div style={infoItemStyle}>
            <div style={infoLabelStyle}>Bus</div>
            <div style={infoValueStyle}>{trip.busNumber}</div>
          </div>
          <div style={infoItemStyle}>
            <div style={infoLabelStyle}>Type</div>
            <div style={infoValueStyle}>{trip.busType.toUpperCase()}</div>
          </div>
        </div>

        {/* Available Seats */}
        <div style={seatsIndicatorStyle}>
          <div style={seatsDotStyle} />
          <span style={seatsTextStyle}>
            {availableSeats} place{availableSeats > 1 ? 's' : ''} disponible{availableSeats > 1 ? 's' : ''}
          </span>
        </div>

        {/* Price */}
        <div style={priceStyle}>
          <span style={priceAmountStyle}>{trip.pricePerSeat?.toLocaleString()}</span>
          <span style={priceCurrencyStyle}>{trip.currency} / place</span>
        </div>

        {/* Baggage */}
        <div style={baggageStyle}>
          <i className="bi bi-bag" style={{ fontSize: '12px', color: '#64748B' }} />
          <span>{trip.baggagePolicy}</span>
        </div>

        {/* Services */}
        {trip.services && trip.services.length > 0 && (
          <div style={servicesSectionStyle}>
            <div style={servicesTitleStyle}>Services à bord</div>
            <div style={servicesGridStyle}>
              {trip.services.map((serviceId) => {
                const svc = SERVICES_CONFIG[serviceId];
                if (!svc) return null;
                return (
                  <div key={serviceId} style={serviceItemStyle}>
                    <div style={serviceIconStyle}>
                      <i className={`bi ${svc.icon}`} />
                    </div>
                    <span style={serviceLabelStyle}>{svc.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default JourneyInfoCard;
