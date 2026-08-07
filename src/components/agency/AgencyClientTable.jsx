import { useState } from 'react';
import clsx from 'clsx';
import AgencyClientStatus from './AgencyClientStatus';
import AgencyClientCard from './AgencyClientCard';

const formatCurrency = (v) => (v ?? 0).toLocaleString('fr-FR') + ' XAF';
const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const actionGroups = [
  { key: 'view', icon: 'bi-eye', label: 'Voir', action: 'onView' },
  { key: 'edit', icon: 'bi-pencil', label: 'Modifier', action: 'onEdit' },
  { key: 'bookings', icon: 'bi-ticket', label: 'Réservations', action: 'onViewBookings' },
  { key: 'tickets', icon: 'bi-postcard', label: 'Tickets', action: 'onViewTickets' },
  { key: 'payments', icon: 'bi-credit-card', label: 'Paiements', action: 'onViewPayments' },
  { key: 'contact', icon: 'bi-chat-dots', label: 'Contacter', action: 'onContact' },
  { key: 'notes', icon: 'bi-stickies', label: 'Notes', action: 'onAddNote' },
];

export default function AgencyClientTable({
  clients, onView, onEdit, onViewBookings, onViewTickets, onViewPayments,
  onContact, onAddNote, currentPage, totalPages, onPageChange, totalCount, pageSize,
}) {
  const [openMenu, setOpenMenu] = useState(null);

  const getAction = (name) => {
    const map = { onView, onEdit, onViewBookings, onViewTickets, onViewPayments, onContact, onAddNote };
    return map[name];
  };

  const visibleActions = actionGroups.slice(0, 3);
  const overflowActions = actionGroups.slice(3);

  return (
    <>
      <div className="ac-table-wrap">
        <table className="ac-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Nom complet</th>
              <th>Téléphone</th>
              <th>Email</th>
              <th>Ville</th>
              <th>Voyages</th>
              <th>Dernière réservation</th>
              <th>Total dépensé</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="ac-table__row">
                <td>
                  <div className="ac-avatar">{client.firstName?.charAt(0).toUpperCase()}</div>
                </td>
                <td className="ac-table__name">
                  {client.firstName} {client.lastName}
                </td>
                <td>{client.phone}</td>
                <td>{client.email}</td>
                <td>{client.city}</td>
                <td>{client.totalTrips ?? 0}</td>
                <td>{formatDate(client.lastBooking)}</td>
                <td className="ac-table__amount">{formatCurrency(client.totalSpent)}</td>
                <td><AgencyClientStatus status={client.status} /></td>
                <td>
                  <div className="ac-table__actions">
                    {visibleActions.map((a) => {
                      const fn = getAction(a.action);
                      return fn ? (
                        <button key={a.key} className="ac-table__action" onClick={() => fn(client)} title={a.label}>
                          <i className={`bi ${a.icon}`} />
                        </button>
                      ) : null;
                    })}
                    {overflowActions.length > 0 && (
                      <div className="ac-table__dropdown">
                        <button className="ac-table__action" onClick={() => setOpenMenu(openMenu === client.id ? null : client.id)} title="Plus d'actions">
                          <i className="bi bi-three-dots" />
                        </button>
                        {openMenu === client.id && (
                          <div className="ac-table__dropdown-menu">
                            {overflowActions.map((a) => {
                              const fn = getAction(a.action);
                              return fn ? (
                                <button key={a.key} className="ac-table__dropdown-item" onClick={() => { fn(client); setOpenMenu(null); }}>
                                  <i className={`bi ${a.icon}`} />
                                  <span>{a.label}</span>
                                </button>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {clients.length === 0 && (
          <div className="ac-table__empty">
            <i className="bi bi-people" />
            <p>Aucun client trouvé</p>
            <span>Modifiez vos filtres pour voir plus de résultats</span>
          </div>
        )}
      </div>

      <div className="ac-mobile-cards">
        {clients.map((client) => (
          <AgencyClientCard key={client.id} client={client} onView={onView} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="ac-pagination">
          <span className="ac-pagination__info">
            {((currentPage - 1) * pageSize) + 1}–{Math.min(currentPage * pageSize, totalCount)} sur {totalCount}
          </span>
          <div className="ac-pagination__buttons">
            <button className="ac-pagination__btn" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
              <i className="bi bi-chevron-left" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={clsx('ac-pagination__btn', p === currentPage && 'ac-pagination__btn--active')} onClick={() => onPageChange(p)}>
                {p}
              </button>
            ))}
            <button className="ac-pagination__btn" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>
              <i className="bi bi-chevron-right" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
