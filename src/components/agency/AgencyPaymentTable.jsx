import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import AgencyPaymentStatus from './AgencyPaymentStatus';
import AgencyPaymentCard from './AgencyPaymentCard';
import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHOD_ICONS,
} from '@data/paymentData';

function formatAmount(n) {
  return (n || 0).toLocaleString('fr-FR') + ' FCFA';
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AgencyPaymentTable({
  payments,
  onView,
  onEdit,
  onValidate,
  onCancel,
  onRefund,
  currentPage,
  totalPages,
  onPageChange,
  totalCount,
  pageSize,
}) {
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  const toggleMenu = (id) => {
    setOpenMenu((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="ap-table-section">
      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Client</th>
              <th>Réservation</th>
              <th>Montant</th>
              <th>Devise</th>
              <th>Mode</th>
              <th>Date</th>
              <th>Point de vente</th>
              <th>Agent</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="ap-table__row">
                <td>
                  <span className="ap-table__id">{p.id}</span>
                </td>
                <td>
                  <div className="ap-table__client">
                    <span className="ap-table__client-name">
                      {p.client.firstName} {p.client.lastName}
                    </span>
                  </div>
                </td>
                <td>
                  <span className="ap-table__booking">{p.bookingId}</span>
                </td>
                <td>
                  <span className="ap-table__amount">{formatAmount(p.totalPaid)}</span>
                </td>
                <td>
                  <span className="ap-table__currency">{p.currency}</span>
                </td>
                <td>
                  <div className="ap-table__method">
                    <span className={`ap-table__method-icon ap-table__method-icon--${p.method}`}>
                      {PAYMENT_METHOD_ICONS[p.method]}
                    </span>
                    <span className="ap-table__method-label">{PAYMENT_METHOD_LABELS[p.method]}</span>
                  </div>
                </td>
                <td>
                  <div className="ap-table__date">
                    <i className="bi bi-calendar3" />
                    <span>{formatDate(p.createdAt)}</span>
                  </div>
                </td>
                <td>
                  <span className="ap-table__outlet">{p.outlet || '—'}</span>
                </td>
                <td>
                  <span className="ap-table__agent">{p.agent || '—'}</span>
                </td>
                <td>
                  <AgencyPaymentStatus status={p.status} />
                </td>
                <td>
                  <div className="ap-table__actions">
                    <button
                      className="ap-table__action"
                      onClick={() => onView(p)}
                      title="Voir les détails"
                    >
                      <i className="bi bi-eye" />
                    </button>
                    {p.status === 'en_attente' && (
                      <>
                        <button
                          className="ap-table__action ap-table__action--warning"
                          onClick={() => onEdit(p)}
                          title="Modifier"
                        >
                          <i className="bi bi-pencil" />
                        </button>
                        <button
                          className="ap-table__action ap-table__action--success"
                          onClick={() => onValidate(p)}
                          title="Valider"
                        >
                          <i className="bi bi-check-lg" />
                        </button>
                        <button
                          className="ap-table__action ap-table__action--danger"
                          onClick={() => onCancel(p)}
                          title="Annuler"
                        >
                          <i className="bi bi-x-lg" />
                        </button>
                      </>
                    )}
                    {p.status === 'paye' && (
                      <button
                        className="ap-table__action ap-table__action--primary"
                        onClick={() => onRefund(p)}
                        title="Rembourser"
                      >
                        <i className="bi bi-arrow-counterclockwise" />
                      </button>
                    )}
                    <div className="ap-table__dropdown" ref={openMenu === p.id ? menuRef : undefined}>
                      <button
                        className="ap-table__action ap-table__action--more"
                        onClick={(e) => { e.stopPropagation(); toggleMenu(p.id); }}
                        title="Plus d'actions"
                      >
                        <i className="bi bi-three-dots" />
                      </button>
                      {openMenu === p.id && (
                        <div className="ap-table__dropdown-menu">
                          <button className="ap-table__dropdown-item" onClick={() => { setOpenMenu(null); }}>
                            <i className="bi bi-download" /> Télécharger le reçu
                          </button>
                          <button className="ap-table__dropdown-item" onClick={() => { setOpenMenu(null); }}>
                            <i className="bi bi-printer" /> Imprimer le reçu
                          </button>
                          <button className="ap-table__dropdown-item" onClick={() => { setOpenMenu(null); }}>
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

        {payments.length === 0 && (
          <div className="ap-table__empty">
            <i className="bi bi-credit-card" />
            <p>Aucun paiement trouvé</p>
            <span>Modifiez vos filtres pour voir plus de résultats</span>
          </div>
        )}
      </div>

      <div className="ap-mobile-cards">
        {payments.map((p) => (
          <AgencyPaymentCard key={p.id} payment={p} onView={onView} />
        ))}
        {payments.length === 0 && (
          <div className="ap-table__empty">
            <i className="bi bi-credit-card" />
            <p>Aucun paiement trouvé</p>
          </div>
        )}
      </div>

      {totalCount > 0 && (
        <div className="ap-pagination">
          <span className="ap-pagination__info">
            Affichage de {startItem} à {endItem} sur {totalCount} paiement{totalCount > 1 ? 's' : ''}
          </span>
          <div className="ap-pagination__controls">
            <button
              className="ap-pagination__btn"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              <i className="bi bi-chevron-double-left" />
            </button>
            <button
              className="ap-pagination__btn"
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
                  <span key={`ellipsis-${i}`} className="ap-pagination__ellipsis">...</span>
                ) : (
                  <button
                    key={p}
                    className={clsx('ap-pagination__btn', 'ap-pagination__btn--page', {
                      'ap-pagination__btn--active': p === currentPage,
                    })}
                    onClick={() => handlePageChange(p)}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              className="ap-pagination__btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <i className="bi bi-chevron-right" />
            </button>
            <button
              className="ap-pagination__btn"
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
