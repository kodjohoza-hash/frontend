const PiTripSummary = ({ trip, selectedSeats = [] }) => {
  if (!trip) return null;

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="pi-summary">
      <h4 className="pi-summary__title">
        <i className="bi bi-map" />
        Résumé du voyage
      </h4>

      <div className="pi-summary__route">
        <div className="pi-summary__city">{trip.from}</div>
        <div className="pi-summary__arrow">
          <div className="pi-summary__arrow-line" />
          <i className="bi bi-arrow-right" />
          <div className="pi-summary__arrow-line" />
        </div>
        <div className="pi-summary__city">{trip.to}</div>
      </div>

      <div className="pi-summary__details">
        <div className="pi-summary__detail">
          <i className="bi bi-calendar3" />
          <span>{formatDate(trip.date)}</span>
        </div>
        <div className="pi-summary__detail">
          <i className="bi bi-clock" />
          <span>{trip.departure} — {trip.arrival}</span>
        </div>
        <div className="pi-summary__detail">
          <i className="bi bi-bus-front" />
          <span>{trip.company}</span>
        </div>
        <div className="pi-summary__detail">
          <i className="bi bi-door-open" />
          <span>Sièges : {selectedSeats.join(', ')}</span>
        </div>
      </div>

      <div className="pi-summary__divider" />

      <div className="pi-summary__price">
        <span className="pi-summary__price-label">Total</span>
        <span className="pi-summary__price-value">{trip.price} FCFA</span>
      </div>

      <div className="pi-summary__info">
        <div className="pi-summary__info-item">
          <i className="bi bi-shield-check" />
          <span>Noms exacts requis sur la pièce d'identité</span>
        </div>
        <div className="pi-summary__info-item">
          <i className="bi bi-shield-check" />
          <span>Pièce d'identité valide au moment du voyage</span>
        </div>
        <div className="pi-summary__info-item">
          <i className="bi bi-shield-check" />
          <span>{selectedSeats.length} place(s) sélectionnée(s)</span>
        </div>
      </div>
    </div>
  );
};

export default PiTripSummary;
