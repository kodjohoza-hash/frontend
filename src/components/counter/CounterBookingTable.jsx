import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import CounterBookingStatus from './CounterBookingStatus';
import CounterBookingCard from './CounterBookingCard';
import { formatCurrency, formatDateShort, formatTime } from '@data/counterBookingData';

const ACTIONS = [
  { key: 'view', icon: 'bi-eye', label: 'Voir', className: 'view' },
  { key: 'edit', icon: 'bi-pencil', label: 'Modifier', className: 'edit' },
  { key: 'confirm', icon: 'bi-check-lg', label: 'Confirmer', className: 'confirm' },
  { key: 'cancel', icon: 'bi-x-lg', label: 'Annuler', className: 'cancel' },
  { key: 'convert', icon: 'bi-ticket-perforated', label: 'Convertir en billet', className: 'convert' },
];

const ITEMS_PER_PAGE = 12;

const CounterBookingTable = ({ bookings, onAction, page, onPageChange }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  const totalPages = Math.max(1, Math.ceil(bookings.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paged = bookings.slice(start, start + ITEMS_PER_PAGE);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleAction = (action, booking) => {
    setOpenMenu(null);
    onAction?.(action, booking);
  };

  const isActionVisible = (action, status) => {
    if (action === 'confirm') return status === 'pending';
    if (action === 'cancel') return !['cancelled', 'expired', 'converted'].includes(status);
    if (action === 'convert') return status === 'confirmed';
    if (action === 'edit') return !['converted'].includes(status);
    return true;
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startP = Math.max(1, currentPage - 2);
    let endP = Math.min(totalPages, startP + maxVisible - 1);
    if (endP - startP < maxVisible - 1) startP = Math.max(1, endP - maxVisible + 1);

    if (currentPage > 1) {
      pages.push(
        <button key="prev" className="acb-page-btn" onClick={() => onPageChange(currentPage - 1)}>
          <i className="bi bi-chevron-left" />
        </button>
      );
    }
    for (let i = startP; i <= endP; i++) {
      pages.push(
        <button key={i} className={clsx('acb-page-btn', { active: i === currentPage })} onClick={() => onPageChange(i)}>
          {i}
        </button>
      );
    }
    if (currentPage < totalPages) {
      pages.push(
        <button key="next" className="acb-page-btn" onClick={() => onPageChange(currentPage + 1)}>
          <i className="bi bi-chevron-right" />
        </button>
      );
    }
    return pages;
  };

  if (bookings.length === 0) {
    return (
      <div className="acb-table-container">
        <div className="acb-empty">
          <div className="acb-empty-icon"><i className="bi bi-inbox" /></div>
          <div className="acb-empty-title">Aucune réservation trouvée</div>
          <div className="acb-empty-text">
            Aucune réservation ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
          </div>
          <button className="acb-empty-btn" onClick={() => onAction?.('new')}>
            <i className="bi bi-plus-lg" /> Nouvelle réservation
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="acb-table-container">
        {/* Desktop Table */}
        <table className="acb-table">
          <thead>
            <tr>
              <th>Numéro</th>
              <th>Client</th>
              <th>Téléphone</th>
              <th>Trajet</th>
              <th>Bus</th>
              <th>Date</th>
              <th>Places</th>
              <th>Montant</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((b) => (
              <tr key={b.id}>
                <td style={{ fontWeight: 600, color: '#0B1D51', fontSize: 12 }}>{b.id}</td>
                <td>
                  <div className="acb-table-client">
                    <div className="acb-table-avatar">{b.clientName.charAt(0)}</div>
                    <div>
                      <div className="acb-table-name">{b.clientName}</div>
                    </div>
                  </div>
                </td>
                <td><span className="acb-table-phone">{b.phone}</span></td>
                <td>
                  <div className="acb-table-route">
                    <span className="acb-table-route-from">{b.from}</span>
                    <span className="acb-table-route-to">{b.to}</span>
                  </div>
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>{b.busPlate}</td>
                <td>
                  <div className="acb-table-date">{formatDateShort(b.createdAt)}</div>
                  <div className="acb-table-time">{formatTime(b.createdAt)}</div>
                </td>
                <td className="acb-table-seats">{b.seats.join(', ')}</td>
                <td className="acb-table-amount">{formatCurrency(b.amount)}</td>
                <td><CounterBookingStatus status={b.status} /></td>
                <td>
                  <div className="acb-table-actions">
                    <button className="acb-action-btn view" title="Voir" onClick={() => handleAction('view', b)}>
                      <i className="bi bi-eye" />
                    </button>
                    <div className="acb-actions-dropdown" ref={menuRef}>
                      <button
                        className="acb-action-btn"
                        title="Actions"
                        onClick={() => setOpenMenu(openMenu === b.id ? null : b.id)}
                      >
                        <i className="bi bi-three-dots-vertical" />
                      </button>
                      {openMenu === b.id && (
                        <div className="acb-actions-menu">
                          {ACTIONS.filter((a) => isActionVisible(a.key, b.status)).map((a) => (
                            <button key={a.key} className="acb-actions-menu-item" onClick={() => handleAction(a.key, b)}>
                              <i className={clsx('bi', a.icon)} />
                              <span>{a.label}</span>
                            </button>
                          ))}
                          <div className="acb-actions-divider" />
                          <button className="acb-actions-menu-item" onClick={() => handleAction('print', b)}>
                            <i className="bi bi-printer" /> <span>Imprimer</span>
                          </button>
                          <button className="acb-actions-menu-item" onClick={() => handleAction('download', b)}>
                            <i className="bi bi-download" /> <span>Télécharger</span>
                          </button>
                          <button className="acb-actions-menu-item" onClick={() => handleAction('history', b)}>
                            <i className="bi bi-clock-history" /> <span>Historique</span>
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

        {/* Mobile Cards */}
        <div className="acb-table-mobile">
          {paged.map((b) => (
            <CounterBookingCard key={b.id} booking={b} onAction={onAction} />
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="acb-pagination">
          {renderPageNumbers()}
          <span className="acb-page-info">
            Page {currentPage} sur {totalPages} ({bookings.length} réservations)
          </span>
        </div>
      )}
    </>
  );
};

export default CounterBookingTable;
