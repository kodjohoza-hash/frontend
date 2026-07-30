import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { formatCurrency, formatDate, formatTime, getPaymentMethodIcon, getPaymentMethodColor } from '@data/counterPaymentData';

const ITEMS_PER_PAGE = 12;

const PaymentStatus = ({ status }) => {
  const labels = {
    paid: 'Payé', pending: 'En attente', failed: 'Échoué',
    cancelled: 'Annulé', refunded: 'Remboursé', partially_refunded: 'Partiel',
  };
  return <span className={clsx('acp-status', `acp-status-${status}`)}>{labels[status] || status}</span>;
};

const CounterPaymentTable = ({ payments, onAction, page, onPageChange }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  const totalPages = Math.max(1, Math.ceil(payments.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paged = payments.slice(start, start + ITEMS_PER_PAGE);

  useEffect(() => {
    const handle = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenu(null);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  if (payments.length === 0) {
    return (
      <div className="acp-table-container">
        <div className="acp-empty">
          <div className="acp-empty-icon"><i className="bi bi-inbox" /></div>
          <div className="acp-empty-title">Aucun paiement trouvé</div>
          <div className="acp-empty-text">Modifiez vos filtres ou effectuez un nouvel encaissement.</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="acp-table-container">
        <table className="acp-table">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Client</th>
              <th>Montant</th>
              <th>Mode</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Agent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((p) => (
              <tr key={p.id}>
                <td style={{ fontFamily: 'Courier New', fontWeight: 600, color: '#0B1D51', fontSize: 12 }}>{p.reference}</td>
                <td>
                  <div style={{ fontWeight: 500 }}>{p.clientName}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF' }}>{p.clientPhone}</div>
                </td>
                <td className="acp-table-amount">{formatCurrency(p.amount)}</td>
                <td>
                  <span className="acp-table-method" style={{ background: `${p.methodColor}12`, color: p.methodColor }}>
                    <i className={`bi ${p.methodIcon}`} /> {p.methodLabel}
                  </span>
                </td>
                <td>
                  <div className="acp-table-date">{formatDate(p.createdAt)}</div>
                  <div className="acp-table-time">{formatTime(p.createdAt)}</div>
                </td>
                <td><PaymentStatus status={p.status} /></td>
                <td style={{ fontSize: 12 }}>{p.agent}</td>
                <td>
                  <div className="acp-table-actions">
                    <button className="acp-action-btn view" title="Voir" onClick={() => onAction?.('view', p)}>
                      <i className="bi bi-eye" />
                    </button>
                    <button className="acp-action-btn receipt" title="Reçu" onClick={() => onAction?.('receipt', p)}>
                      <i className="bi bi-receipt" />
                    </button>
                    {p.status === 'paid' && (
                      <button className="acp-action-btn refund" title="Rembourser" onClick={() => onAction?.('refund', p)}>
                        <i className="bi bi-arrow-return-left" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="acp-mobile">
          {paged.map((p) => (
            <div key={p.id} className="acp-mobile-card">
              <div className="acp-mobile-card-header">
                <span className="acp-mobile-card-ref">{p.reference}</span>
                <PaymentStatus status={p.status} />
              </div>
              <div className="acp-mobile-card-body">
                <div className="acp-mobile-card-field">
                  <span className="acp-mobile-card-label">Client</span>
                  <span className="acp-mobile-card-value">{p.clientName}</span>
                </div>
                <div className="acp-mobile-card-field">
                  <span className="acp-mobile-card-label">Montant</span>
                  <span className="acp-mobile-card-value" style={{ fontWeight: 700, color: '#0B1D51' }}>{formatCurrency(p.amount)}</span>
                </div>
                <div className="acp-mobile-card-field">
                  <span className="acp-mobile-card-label">Mode</span>
                  <span className="acp-mobile-card-value">{p.methodLabel}</span>
                </div>
                <div className="acp-mobile-card-field">
                  <span className="acp-mobile-card-label">Date</span>
                  <span className="acp-mobile-card-value">{formatDate(p.createdAt)}</span>
                </div>
              </div>
              <div className="acp-mobile-card-footer">
                <button className="acp-action-btn view" title="Voir" onClick={() => onAction?.('view', p)}><i className="bi bi-eye" /></button>
                <button className="acp-action-btn receipt" title="Reçu" onClick={() => onAction?.('receipt', p)}><i className="bi bi-receipt" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="acp-pagination">
          {currentPage > 1 && (
            <button className="acp-page-btn" onClick={() => onPageChange(currentPage - 1)}>
              <i className="bi bi-chevron-left" />
            </button>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((i) => (
            <button key={i} className={clsx('acp-page-btn', { active: i === currentPage })} onClick={() => onPageChange(i)}>
              {i}
            </button>
          ))}
          {currentPage < totalPages && (
            <button className="acp-page-btn" onClick={() => onPageChange(currentPage + 1)}>
              <i className="bi bi-chevron-right" />
            </button>
          )}
          <span className="acp-page-info">Page {currentPage}/{totalPages} ({payments.length} paiements)</span>
        </div>
      )}
    </>
  );
};

export default CounterPaymentTable;
