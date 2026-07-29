import clsx from 'clsx';

const statusConfig = {
  bientot_complet: { label: 'Bientôt complet', className: 'soon' },
  disponible: { label: 'Disponible', className: 'available' },
  complet: { label: 'Complet', className: 'full' },
};

const CounterUpcomingTrips = ({ trips }) => (
  <div className="act-card">
    <div className="act-card__header">
      <h3 className="act-card__title">
        <i className="bi bi-signpost-2" />
        Prochains départs
      </h3>
      <span className="act-card__badge">{trips.length}</span>
    </div>
    <div className="act-trips__list">
      {trips.map((trip) => {
        const st = statusConfig[trip.status] || statusConfig.disponible;
        const seatsLeft = trip.seats.total - trip.sold;
        const seatsLow = seatsLeft <= 5;
        const seatsFull = trip.sold === trip.seats.total;

        return (
          <div key={trip.id} className="act-trip-item">
            <div className="act-trip-item__route">
              <span className="act-trip-item__city">{trip.from}</span>
              <i className="bi bi-arrow-right act-trip-item__arrow" />
              <span className="act-trip-item__city">{trip.to}</span>
            </div>

            <div className="act-trip-item__meta">
              <span className="act-trip-item__time">
                <i className="bi bi-clock" /> {trip.departure}
              </span>
              <span className="act-trip-item__bus">
                <i className="bi bi-bus-front" /> {trip.bus}
              </span>
              <span className={clsx('act-trip-item__seats', seatsLow && 'act-trip-item__seats--low', seatsFull && 'act-trip-item__seats--full')}>
                {trip.seats.sold}/{trip.seats.total}
              </span>
              <span className={clsx('act-trip-item__status', `act-trip-item__status--${st.className}`)}>
                {st.label}
              </span>
            </div>

            <button type="button" className="act-trip-item__btn" onClick={() => {}}>
              Voir les détails
            </button>
          </div>
        );
      })}
    </div>
  </div>
);

export default CounterUpcomingTrips;
