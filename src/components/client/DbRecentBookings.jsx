import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import bookingService from '@services/booking.service';

const statusConfig = {
  completed: { label: 'Terminé', icon: 'bi-check-circle-fill', color: 'success' },
  cancelled: { label: 'Annulé', icon: 'bi-x-circle-fill', color: 'danger' },
  pending: { label: 'En attente', icon: 'bi-clock-fill', color: 'warning' },
  confirmed: { label: 'Confirmée', icon: 'bi-check-circle-fill', color: 'success' },
};

const mapBooking = (r) => {
  const d = r.depart || {};
  const past = d.dateDepart && new Date(`${d.dateDepart}T${d.heureDepart || '00:00'}`) < new Date();
  let status = 'pending';
  if (['annulee', 'expiree', 'remboursee'].includes(r.statut)) status = 'cancelled';
  else if (['payee', 'confirmee', 'partiellement_payee'].includes(r.statut)) status = past ? 'completed' : 'confirmed';
  return {
    id: r.reference || r.id,
    route: `${d.trajet?.departureCity || '—'} → ${d.trajet?.arrivalCity || '—'}`,
    date: d.dateDepart || '',
    company: d.compagnie?.nom || 'Compagnie',
    seats: r.nbPlaces || (r.places || []).length || 1,
    amount: Number(r.montant || 0).toLocaleString('fr-FR'),
    status,
  };
};

const DbRecentBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    bookingService
      .listBookings({ limit: 4, sort: 'newest' })
      .then((data) => {
        if (!mounted) return;
        setBookings((data.items || []).map(mapBooking));
      })
      .catch(() => { if (mounted) setBookings([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

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
      {loading ? (
        <div className="db-bookings__table-wrap"><span className="db-bookings__empty">Chargement…</span></div>
      ) : bookings.length === 0 ? (
        <div className="db-bookings__table-wrap"><span className="db-bookings__empty">Aucune réservation.</span></div>
      ) : (
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
              {bookings.map((bk) => {
                const st = statusConfig[bk.status] || statusConfig.pending;
                return (
                  <tr key={bk.id}>
                    <td className="db-bookings__ref">{bk.id}</td>
                    <td className="db-bookings__route">{bk.route}</td>
                    <td>{formatDate(bk.date)}</td>
                    <td>{bk.company}</td>
                    <td className="db-bookings__seats">{bk.seats}</td>
                    <td className="db-bookings__amount">{bk.amount} XAF</td>
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
      )}
    </section>
  );
};

export default DbRecentBookings;
