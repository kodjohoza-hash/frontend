import { useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import EmptyState from './EmptyState';

const ROWS_PER_PAGE = 5;

const ReservationsTable = ({ reservations = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(reservations.length / ROWS_PER_PAGE);
  const startIdx = (currentPage - 1) * ROWS_PER_PAGE;
  const paginatedReservations = reservations.slice(startIdx, startIdx + ROWS_PER_PAGE);

  if (reservations.length === 0) {
    return (
      <EmptyState
        icon="bi-ticket-perforated"
        title="Aucune réservation"
        description="Vous n'avez pas encore fait de réservation. Commencez par réserver votre premier billet !"
        actionLabel="Réserver un billet"
        actionPath="/booking"
      />
    );
  }

  return (
    <div className="btc-reservations-table">
      <div className="table-responsive">
        <table className="table align-middle mb-0">
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-default)' }}>
              <th className="border-0 fw-semibold" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Date
              </th>
              <th className="border-0 fw-semibold" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Trajet
              </th>
              <th className="border-0 fw-semibold d-none d-md-table-cell" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Compagnie
              </th>
              <th className="border-0 fw-semibold text-end d-none d-sm-table-cell" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Montant
              </th>
              <th className="border-0 fw-semibold text-center" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Statut
              </th>
              <th className="border-0 fw-semibold text-end" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Détails
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedReservations.map((reservation) => {
              const date = new Date(reservation.date);
              const formattedDate = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

              return (
                <tr key={reservation.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td className="py-3" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                    {formattedDate}
                  </td>
                  <td className="py-3">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-semibold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                        {reservation.departureCity}
                      </span>
                      <i className="bi bi-arrow-right" style={{ fontSize: '0.7em', color: 'var(--text-muted)' }} />
                      <span className="fw-semibold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                        {reservation.arrivalCity}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 d-none d-md-table-cell" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                    {reservation.company}
                  </td>
                  <td className="py-3 text-end d-none d-sm-table-cell">
                    <span className="fw-semibold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                      {reservation.amount?.toLocaleString()} <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>FCFA</span>
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <StatusBadge status={reservation.status} />
                  </td>
                  <td className="py-3 text-end">
                    <Link
                      to={`/client/reservations/${reservation.id}`}
                      className="btn btn-sm"
                      style={{
                        color: 'var(--color-primary)',
                        background: 'var(--color-primary-50)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--font-size-xs)',
                        padding: '4px 10px',
                      }}
                    >
                      <i className="bi bi-eye me-1" />
                      Voir
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="d-flex align-items-center justify-content-between px-3 py-3 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
            Affichage {startIdx + 1}–{Math.min(startIdx + ROWS_PER_PAGE, reservations.length)} sur {reservations.length}
          </span>
          <div className="d-flex gap-1">
            <button
              className="btn btn-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              style={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
                background: currentPage === 1 ? 'var(--disabled-bg)' : 'var(--bg-surface)',
                color: currentPage === 1 ? 'var(--disabled-text)' : 'var(--text-secondary)',
              }}
            >
              <i className="bi bi-chevron-left" style={{ fontSize: '0.7em' }} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className="btn btn-sm"
                onClick={() => setCurrentPage(page)}
                style={{
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid',
                  borderColor: page === currentPage ? 'var(--color-primary)' : 'var(--border-default)',
                  background: page === currentPage ? 'var(--color-primary)' : 'var(--bg-surface)',
                  color: page === currentPage ? 'var(--color-white)' : 'var(--text-secondary)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: page === currentPage ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                }}
              >
                {page}
              </button>
            ))}
            <button
              className="btn btn-sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              style={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
                background: currentPage === totalPages ? 'var(--disabled-bg)' : 'var(--bg-surface)',
                color: currentPage === totalPages ? 'var(--disabled-text)' : 'var(--text-secondary)',
              }}
            >
              <i className="bi bi-chevron-right" style={{ fontSize: '0.7em' }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationsTable;
