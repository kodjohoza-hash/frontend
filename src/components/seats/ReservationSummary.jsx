import React from 'react';

const ReservationSummary = React.memo(function ReservationSummary({
  trip,
  selectedSeats,
  allSeats,
  onContinue,
  onBack,
}) {
  const SERVICE_FEE = 500;
  const selectedSeatObjects = allSeats.filter((s) => selectedSeats.includes(s.number));
  const subtotal = selectedSeatObjects.reduce((sum, s) => sum + (s.price || 0), 0);
  const serviceFee = selectedSeats.length > 0 ? SERVICE_FEE : 0;
  const total = subtotal + serviceFee;

  const containerStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  };

  const headerStyle = {
    padding: '16px',
    borderBottom: '1px solid #F1F5F9',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const headerIconStyle = {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    backgroundColor: '#0B1D51',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontSize: '12px',
  };

  const headerTitleStyle = {
    fontSize: '14px',
    fontWeight: 700,
    color: '#1E293B',
  };

  const bodyStyle = {
    padding: '16px',
  };

  const tripRecapStyle = {
    padding: '10px 12px',
    backgroundColor: '#F8FAFC',
    borderRadius: '8px',
    marginBottom: '16px',
  };

  const routeStyle = {
    fontSize: '13px',
    fontWeight: 700,
    color: '#1E293B',
    marginBottom: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  const dateStyle = {
    fontSize: '11px',
    color: '#64748B',
    fontWeight: 500,
  };

  const seatsSectionStyle = {
    marginBottom: '16px',
  };

  const seatsLabelStyle = {
    fontSize: '11px',
    fontWeight: 700,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '8px',
  };

  const seatsBadgeContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    minHeight: '28px',
  };

  const seatBadgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    borderRadius: '20px',
    backgroundColor: '#0B1D51',
    color: '#FFFFFF',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.02em',
  };

  const emptyStateStyle = {
    fontSize: '12px',
    color: '#94A3B8',
    fontStyle: 'italic',
    padding: '8px 0',
  };

  const priceBreakdownStyle = {
    borderTop: '1px solid #F1F5F9',
    paddingTop: '14px',
    marginBottom: '16px',
  };

  const priceRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '4px 0',
  };

  const priceLabelStyle = {
    fontSize: '12px',
    color: '#64748B',
    fontWeight: 500,
  };

  const priceValueStyle = {
    fontSize: '12px',
    fontWeight: 600,
    color: '#1E293B',
  };

  const totalRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0 0',
    marginTop: '6px',
    borderTop: '2px solid #E2E8F0',
  };

  const totalLabelStyle = {
    fontSize: '13px',
    fontWeight: 700,
    color: '#1E293B',
  };

  const totalValueStyle = {
    fontSize: '18px',
    fontWeight: 800,
    color: '#F59E0B',
  };

  const actionsStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const continueBtnStyle = {
    width: '100%',
    padding: '13px 16px',
    backgroundColor: '#F59E0B',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: 700,
    cursor: selectedSeats.length === 0 ? 'not-allowed' : 'pointer',
    opacity: selectedSeats.length === 0 ? 0.5 : 1,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    letterSpacing: '0.02em',
  };

  const backBtnStyle = {
    width: '100%',
    padding: '10px 16px',
    backgroundColor: 'transparent',
    color: '#64748B',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={headerIconStyle}>
          <i className="bi bi-receipt" />
        </div>
        <span style={headerTitleStyle}>Votre réservation</span>
      </div>

      <div style={bodyStyle}>
        {/* Trip Recap */}
        <div style={tripRecapStyle}>
          <div style={routeStyle}>
            <span>{trip.departureCity}</span>
            <i className="bi bi-arrow-right" style={{ fontSize: '10px', color: '#94A3B8' }} />
            <span>{trip.arrivalCity}</span>
          </div>
          <div style={dateStyle}>
            {trip.departureDate} · {trip.departureTime} - {trip.arrivalTime} · {trip.duration}
          </div>
        </div>

        {/* Selected Seats */}
        <div style={seatsSectionStyle}>
          <div style={seatsLabelStyle}>Sièges sélectionnés</div>
          <div style={seatsBadgeContainerStyle}>
            {selectedSeatObjects.length > 0 ? (
              selectedSeatObjects.map((seat) => (
                <span key={seat.number} style={seatBadgeStyle}>
                  <i className="bi bi-check-circle-fill" style={{ fontSize: '9px' }} />
                  {String(seat.number).padStart(2, '0')}
                </span>
              ))
            ) : (
              <span style={emptyStateStyle}>Aucun siège sélectionné</span>
            )}
          </div>
        </div>

        {/* Price Breakdown */}
        <div style={priceBreakdownStyle}>
          {selectedSeatObjects.map((seat) => (
            <div key={seat.number} style={priceRowStyle}>
              <span style={priceLabelStyle}>
                Siège {String(seat.number).padStart(2, '0')}
              </span>
              <span style={priceValueStyle}>{seat.price?.toLocaleString()} FCFA</span>
            </div>
          ))}
          {selectedSeats.length > 0 && (
            <>
              <div style={priceRowStyle}>
                <span style={priceLabelStyle}>Frais de service</span>
                <span style={priceValueStyle}>{SERVICE_FEE.toLocaleString()} FCFA</span>
              </div>
              <div style={totalRowStyle}>
                <span style={totalLabelStyle}>Total</span>
                <span style={totalValueStyle}>{total.toLocaleString()} FCFA</span>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div style={actionsStyle}>
          <button
            type="button"
            style={continueBtnStyle}
            onClick={onContinue}
            disabled={selectedSeats.length === 0}
            onMouseEnter={(e) => {
              if (selectedSeats.length > 0) {
                e.target.style.backgroundColor = '#D97706';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.35)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#F59E0B';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Continuer vers le paiement
            <i className="bi bi-arrow-right" />
          </button>
          <button
            type="button"
            style={backBtnStyle}
            onClick={onBack}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#F8FAFC';
              e.target.style.borderColor = '#CBD5E1';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderColor = '#E2E8F0';
            }}
          >
            <i className="bi bi-arrow-left" style={{ fontSize: '11px' }} />
            Retour aux résultats
          </button>
        </div>
      </div>
    </div>
  );
});

export default ReservationSummary;
