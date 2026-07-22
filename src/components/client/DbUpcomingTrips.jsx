import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { upcomingTrips } from '@data/clientDashboard';

const statusConfig = {
  confirmed: { label: 'Confirmé', icon: 'bi-check-circle-fill', color: 'success' },
  pending: { label: 'En attente', icon: 'bi-clock-fill', color: 'warning' },
};

const DbUpcomingTrips = () => {
  const formatDate = (d) =>
    new Date(d).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <section className="db-card db-trips">
      <div className="db-card__header">
        <h3 className="db-card__title">
          <i className="bi bi-calendar-event" />
          Prochains trajets
        </h3>
        <Link to="/client/bookings" className="db-card__link">
          Tout voir <i className="bi bi-arrow-right" />
        </Link>
      </div>
      <div className="db-trips__list">
        {upcomingTrips.map((trip) => {
          const st = statusConfig[trip.status] || statusConfig.pending;
          return (
            <div key={trip.id} className="db-trips__item">
              <div className="db-trips__route">
                <div className="db-trips__cities">
                  <span className="db-trips__from">{trip.from}</span>
                  <span className="db-trips__arrow">
                    <i className="bi bi-arrow-right" />
                  </span>
                  <span className="db-trips__to">{trip.to}</span>
                </div>
                <span className="db-trips__company">{trip.company}</span>
              </div>
              <div className="db-trips__meta">
                <div className="db-trips__datetime">
                  <i className="bi bi-calendar3" />
                  <span>{formatDate(trip.date)}</span>
                </div>
                <div className="db-trips__time">
                  <i className="bi bi-clock" />
                  <span>{trip.departure} — {trip.arrival}</span>
                </div>
              </div>
              <div className="db-trips__bottom">
                <span className="db-trips__seat">
                  <i className="bi bi-door-open" /> Siège {trip.seat}
                </span>
                <span className="db-trips__price">{trip.price} FCFA</span>
                <span className={clsx('db-trips__status', `db-trips__status--${st.color}`)}>
                  <i className={clsx('bi', st.icon)} /> {st.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DbUpcomingTrips;
