import { useState } from 'react';
import clsx from 'clsx';
import AgencyBookingStatus from './AgencyBookingStatus';
import AgencyBookingCard from './AgencyBookingCard';
import {
  BOOKING_STATUS_LABELS,
  BOOKING_CHANNEL_LABELS,
  PAYMENT_METHOD_LABELS,
} from '@data/bookingData';

function formatAmount(n) {
  return (n || 0).toLocaleString('fr-FR') + ' XAF';
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AgencyBookingTable({
  bookings,
  onView,
  onConfirm,
  onCancel,
  onRefund,
  currentPage,
  totalPages,
  onPageChange,
  totalCount,
  pageSize,
}) {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (id) => {
    setOpenMenu((prev) => (prev === id ? null : id));
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="abr-table-section">
      <div className="abr-table-wrap">
        <table className="abr-table">
          <thead>
            <tr>
              <th>Numéro</th>
              <th>Client</th>
              <th>Téléphone</th>
              <th>Voyage</th>
              <th>Départ</th>
              <th>Destination</th>
              <th>Date</th>
              <th>Places</th>
              <th>Montant</th>
              <th>Paiement</th>
              <th>Statut</th>
              <th>Canal</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="abr-table__row">
                <td>
                  <span className="abr-table__id">{b.id}</span>
                </td>
                <td>
                  <div className="abr-table__client">
                    <span className="abr-table__client-name">
                      {b.client.firstName} {b.client.lastName}
                    </span>
                  </div>
                </td>
                <td>
                  <span className="abr-table__phone">
                    <i className="bi bi-telephone" /> {b.client.phone}
                  </span>
                </td>
                <td>
                  <div className="abr-table__route">
                    <span className="abr-table__city">{b.trip.from}</span>
                    <i className="bi bi-arrow-right" />
                    <span className="abr-table__city">{b.trip.to}</span>
                  </div>
                </td>
                <td>
                  <div className="abr-table__time">
                    <i className="bi bi-clock" />
                    <span>{b.trip.departure}</span>
                  </div>
                </td>
                <td>
                  <span className="abr-table__dest">{b.trip.to}</span>
                </td>
                <td>
                  <div className="abr-table__date">
                    <i className="bi bi-calendar3" />
                    <span>{formatDate(b.trip.date)}</span>
                  </div>
                </td>
                <td>
                  <span className="abr-table__seats">
                    {b.seatCount} {b.seatCount > 1 ? 'places' : 'place'}
                  </span>
                </td>
                <td>
                  <span className="abr-table__amount">{formatAmount(b.amount)}</span>
                </td>
                <td>
                  <span className="abr-table__payment">
                    {b.paymentMethod ? PAYMENT_METHOD_LABELS[b.paymentMethod] || b.paymentMethod : '—'}
                  </span>
                </td>
                <td>
                  <AgencyBookingStatus status={b.status} />
                </td>
                <td>
                  <span className="abr-table__channel">
                    {BOOKING_CHANNEL_LABELS[b.channel] || b.channel}
                  </span>
                </td>
                <td>
                  <div className="abr-table__actions">
                    <button
                      className="abr-table__action"
                      onClick={() => onView(b)}
                      title="Voir les détails"
                    >
                      <i className="bi bi-eye" />
                    </button>
                    {(b.status === 'en_attente' || b.status === 'partiellement_payee') && (
                      <button
                        className="abr-table__action abr-table__action--success"
                        onClick={() => onConfirm(b)}
                        title="Confirmer"
                      >
                        <i className="bi bi-check-lg" />
                      </button>
                    )}
                    {b.status !== 'annulee' && b.status !== 'remboursee' && b.status !== 'expiree' && (
                      <button
                        className="abr-table__action abr-table__action--danger"
                        onClick={() => onCancel(b)}
                        title="Annuler"
                      >
                        <i className="bi bi-x-lg" />
                      </button>
                    )}
                    {b.status === 'annulee' && (
                      <button
                        className="abr-table__action abr-table__action--primary"
                        onClick={() => onRefund(b)}
                        title="Rembourser"
                      >
                        <i className="bi bi-arrow-counterclockwise" />
                      </button>
                    )}
                    <div className="abr-table__dropdown">
                      <button
                        className="abr-table__action abr-table__action--more"
                        onClick={(e) => { e.stopPropagation(); toggleMenu(b.id); }}
                        title="Plus d'actions"
                      >
                        <i className="bi bi-three-dots" />
                      </button>
                      {openMenu === b.id && (
                        <div className="abr-table__dropdown-menu">
                          <button className="abr-table__dropdown-item" onClick={() => { setOpenMenu(null); }}>
                            <i className="bi bi-printer" /> Imprimer
                          </button>
                          <button className="abr-table__dropdown-item" onClick={() => { setOpenMenu(null); }}>
                            <i className="bi bi-download" /> Télécharger
                          </button>
                          <button className="abr-table__dropdown-item" onClick={() => { setOpenMenu(null); }}>
                            <i className="bi bi-envelope" /> Email
                          </button>
                          <button className="abr-table__dropdown-item" onClick={() => { setOpenMenu(null); }}>
                            <i className="bi bi-phone" /> SMS
                          </button>
                          <button className="abr-table__dropdown-item" onClick={() => { setOpenMenu(null); }}>
                            <i className="bi bi-clock-history" /> Historique
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <div className="abr-table__empty">
            <i className="bi bi-ticket-perforated" />
            <p>Aucune réservation trouvée</p>
            <span>Modifiez vos filtres pour voir plus de résultats</span>
          </div>
        )}
      </div>

      <div className="abr-mobile-cards">
        {bookings.map((b) => (
          <AgencyBookingCard key={b.id} booking={b} onView={onView} />
        ))}
        {bookings.length === 0 && (
          <div className="abr-table__empty">
            <i className="bi bi-ticket-perforated" />
            <p>Aucune réservation trouvée</p>
          </div>
        )}
      </div>

      {totalCount > 0 && (
        <div className="abr-pagination">
          <span className="abr-pagination__info">
            Affichage de {startItem} à {endItem} sur {totalCount} réservation{totalCount > 1 ? 's' : ''}
          </span>
          <div className="abr-pagination__controls">
            <button
              className="abr-pagination__btn"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              <i className="bi bi-chevron-double-left" />
            </button>
            <button
              className="abr-pagination__btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <i className="bi bi-chevron-left" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
              .reduce((acc, p, i, arr) => {
                if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="abr-pagination__ellipsis">...</span>
                ) : (
                  <button
                    key={p}
                    className={clsx('abr-pagination__btn', 'abr-pagination__btn--page', {
                      'abr-pagination__btn--active': p === currentPage,
                    })}
                    onClick={() => handlePageChange(p)}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              className="abr-pagination__btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <i className="bi bi-chevron-right" />
            </button>
            <button
              className="abr-pagination__btn"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              <i className="bi bi-chevron-double-right" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
