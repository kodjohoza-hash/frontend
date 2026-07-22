import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { recentBookings } from '@data/clientDashboard';

const statusConfig = {
  completed: { label: 'Terminé', icon: 'bi-check-circle-fill', color: 'success' },
  cancelled: { label: 'Annulé', icon: 'bi-x-circle-fill', color: 'danger' },
  pending: { label: 'En attente', icon: 'bi-clock-fill', color: 'warning' },
};

const DbRecentBookings = () => {
  const formatDate = (d) =>
    new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <section className="db-card db-bookings">
      <div className="db-card__header">
        <h3 className="db-card__title">
          <i className="bi bi-ticket-perforated" />
          Réservations récentes
        </h3>
        <Link to="/client/bookings" className="db-card__link">
          Tout voir <i className="bi bi-arrow-right" />
        </Link>
      </div>
      <div className="db-bookings__table-wrap">
        <table className="db-bookings__table">
          <thead>
            <tr>
              <th>Réf.</th>
              <th>Trajet</th>
              <th>Date</th>
              <th>Compagnie</th>
              <th>Sièges</th>
              <th>Montant</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.map((bk) => {
              const st = statusConfig[bk.status] || statusConfig.pending;
              return (
                <tr key={bk.id}>
                  <td className="db-bookings__ref">{bk.id}</td>
                  <td className="db-bookings__route">{bk.route}</td>
                  <td>{formatDate(bk.date)}</td>
                  <td>{bk.company}</td>
                  <td className="db-bookings__seats">{bk.seats}</td>
                  <td className="db-bookings__amount">{bk.amount} FCFA</td>
                  <td>
                    <span className={clsx('db-bookings__status', `db-bookings__status--${st.color}`)}>
                      <i className={clsx('bi', st.icon)} /> {st.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default DbRecentBookings;
