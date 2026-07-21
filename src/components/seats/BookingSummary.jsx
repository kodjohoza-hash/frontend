import { Link } from 'react-router-dom';

const BookingSummary = ({ trip, selectedSeats, seats, onContinue, onBack }) => {
  const selectedSeatData = seats.filter((s) => selectedSeats.includes(s.id));
  const subtotal = selectedSeatData.reduce((sum, s) => sum + (s.price || 0), 0);
  const fees = selectedSeatData.length > 0 ? 500 : 0;
  const total = subtotal + fees;

  return (
    <div className="btc-booking-summary card border-0" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
      <div className="card-body p-4">
        <h6 className="fw-bold mb-3" style={{ fontSize: 'var(--font-size-base)', color: 'var(--text-primary)' }}>
          <i className="bi bi-receipt me-2" style={{ color: 'var(--color-accent)' }} />
          Resume de reservation
        </h6>

        {/* Trip Summary */}
        <div className="p-3 mb-3" style={{ borderRadius: 'var(--radius-lg)', background: 'var(--color-gray-50)' }}>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="fw-semibold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
              {trip.departureCity}
            </span>
            <i className="bi bi-arrow-right" style={{ fontSize: '0.7rem', color: 'var(--color-accent)' }} />
            <span className="fw-semibold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
              {trip.arrivalCity}
            </span>
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
            {trip.departureDate && new Date(trip.departureDate + 'T00:00:00').toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
            {' · '}
            {trip.departureTime} — {trip.arrivalTime}
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
            {trip.companyName} · {trip.busType === 'vip' ? 'VIP' : trip.busType === 'business' ? 'Business' : 'Economique'}
          </div>
        </div>

        {/* Selected Seats */}
        <div className="mb-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Sieges selectionnes</span>
            <span className="fw-semibold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
              {selectedSeatData.length}
            </span>
          </div>

          {selectedSeatData.length === 0 ? (
            <div className="text-center py-3" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
              <i className="bi bi-cursor me-1" />
              Cliquez sur un siege pour le selectionner
            </div>
          ) : (
            <div className="d-flex flex-wrap gap-1 mb-2">
              {selectedSeatData.map((seat) => (
                <span
                  key={seat.id}
                  className="d-inline-flex align-items-center justify-content-center"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-primary)',
                    color: 'var(--color-white)',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 'var(--font-weight-bold)',
                  }}
                >
                  {seat.number}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="btc-summary-prices mb-3">
          <div className="d-flex justify-content-between mb-1">
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              {trip.pricePerSeat?.toLocaleString()} FCFA × {selectedSeatData.length}
            </span>
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
              {subtotal.toLocaleString()} FCFA
            </span>
          </div>
          {fees > 0 && (
            <div className="d-flex justify-content-between mb-1">
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                Frais de service
              </span>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                {fees.toLocaleString()} FCFA
              </span>
            </div>
          )}
          <div className="d-flex justify-content-between pt-2 mt-2" style={{ borderTop: '2px solid var(--border-default)' }}>
            <span className="fw-bold" style={{ fontSize: 'var(--font-size-base)', color: 'var(--text-primary)' }}>Total</span>
            <span className="fw-bold" style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-accent)' }}>
              {total.toLocaleString()} <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>FCFA</span>
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="d-flex flex-column gap-2">
          <button
            onClick={onContinue}
            disabled={selectedSeatData.length === 0}
            className="btn btn-accent w-100"
            style={{
              borderRadius: 'var(--radius-lg)',
              padding: '12px',
              fontWeight: 'var(--font-weight-semibold)',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            <i className="bi bi-arrow-right-circle me-2" />
            Continuer
          </button>
          <button
            onClick={onBack}
            className="btn btn-outline-secondary w-100"
            style={{
              borderRadius: 'var(--radius-lg)',
              padding: '10px',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            <i className="bi bi-arrow-left me-2" />
            Retour aux resultats
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
