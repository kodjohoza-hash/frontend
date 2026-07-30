import CounterCashTimeline from './CounterCashTimeline';
import { formatCurrency, formatDateTime } from '@data/counterPaymentData';

const CounterCashReport = ({ session, payments, onClose, onAction }) => {
  const paidPayments = payments.filter((p) => p.status === 'paid');
  const refundPayments = payments.filter((p) => p.status === 'refunded' || p.status === 'partially_refunded');
  const cancelledPayments = payments.filter((p) => p.status === 'cancelled');

  const totalPaid = paidPayments.reduce((s, p) => s + p.amount, 0);
  const totalRefunded = refundPayments.reduce((s, p) => s + (p.refundAmount || p.amount), 0);
  const totalCancelled = cancelledPayments.reduce((s, p) => s + p.amount, 0);
  const netTotal = totalPaid - totalRefunded;

  const timelineItems = [
    { action: 'Ouverture de caisse', icon: 'bi-box-arrow-in-right', user: session?.agent || 'Kodjo Jojo', timestamp: session?.openedAt, completed: true },
    { action: `${paidPayments.length} paiement${paidPayments.length > 1 ? 's' : ''} effectué${paidPayments.length > 1 ? 's' : ''}`, icon: 'bi-cash-stack', user: 'Kodjo Jojo', timestamp: new Date().toISOString(), completed: true },
    ...(refundPayments.length > 0 ? [{ action: `${refundPayments.length} remboursement${refundPayments.length > 1 ? 's' : ''}`, icon: 'bi-arrow-return-left', user: 'Kodjo Jojo', timestamp: new Date().toISOString(), completed: true }] : []),
    ...(cancelledPayments.length > 0 ? [{ action: `${cancelledPayments.length} annulation${cancelledPayments.length > 1 ? 's' : ''}`, icon: 'bi-x-circle', user: 'Kodjo Jojo', timestamp: new Date().toISOString(), completed: true }] : []),
    { action: 'Clôture de caisse', icon: 'bi-box-arrow-left', user: session?.agent || 'Kodjo Jojo', timestamp: session?.closedAt || new Date().toISOString(), completed: true },
  ];

  return (
    <div className="acp-modal-overlay" onClick={onClose}>
      <div className="acp-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 680 }}>
        <div className="acp-modal-header">
          <h2 className="acp-modal-title"><i className="bi bi-file-text" /> Rapport de caisse</h2>
          <button className="acp-modal-close" onClick={onClose}><i className="bi bi-x-lg" /></button>
        </div>
        <div className="acp-modal-body">
          <div className="acp-report-highlight">
            <div>
              <div className="acp-report-highlight-label">Solde net de la journée</div>
              <div style={{ fontSize: 13, color: '#9CA3AF' }}>
                {paidPayments.length} transaction{paidPayments.length > 1 ? 's' : ''}
              </div>
            </div>
            <div className="acp-report-highlight-value">{formatCurrency(netTotal)}</div>
          </div>

          <div className="acp-report-grid" style={{ marginBottom: 0 }}>
            <div className="acp-report-card">
              <div className="acp-report-title"><i className="bi bi-cash-stack" /> Encaissements</div>
              <div className="acp-report-row">
                <span className="acp-report-label">Nombre de transactions</span>
                <span className="acp-report-value">{paidPayments.length}</span>
              </div>
              <div className="acp-report-row">
                <span className="acp-report-label">Total encaissé</span>
                <span className="acp-report-value" style={{ fontWeight: 700, color: '#10B981' }}>{formatCurrency(totalPaid)}</span>
              </div>
            </div>

            <div className="acp-report-card">
              <div className="acp-report-title"><i className="bi bi-arrow-return-left" /> Remboursements</div>
              <div className="acp-report-row">
                <span className="acp-report-label">Nombre de remboursements</span>
                <span className="acp-report-value">{refundPayments.length}</span>
              </div>
              <div className="acp-report-row">
                <span className="acp-report-label">Total remboursé</span>
                <span className="acp-report-value" style={{ fontWeight: 700, color: '#EF4444' }}>-{formatCurrency(totalRefunded)}</span>
              </div>
            </div>

            <div className="acp-report-card">
              <div className="acp-report-title"><i className="bi bi-x-circle" /> Annulations</div>
              <div className="acp-report-row">
                <span className="acp-report-label">Nombre d'annulations</span>
                <span className="acp-report-value">{cancelledPayments.length}</span>
              </div>
              <div className="acp-report-row">
                <span className="acp-report-label">Total annulé</span>
                <span className="acp-report-value" style={{ fontWeight: 700, color: '#6B7280' }}>{formatCurrency(totalCancelled)}</span>
              </div>
            </div>

            <div className="acp-report-card">
              <div className="acp-report-title"><i className="bi bi-person" /> Agent</div>
              <div className="acp-report-row"><span className="acp-report-label">Nom</span><span className="acp-report-value">Kodjo Jojo</span></div>
              <div className="acp-report-row"><span className="acp-report-label">Ouverture</span><span className="acp-report-value">{session?.openedAt ? formatDateTime(session.openedAt) : '—'}</span></div>
              <div className="acp-report-row"><span className="acp-report-label">Clôture</span><span className="acp-report-value">{session?.closedAt ? formatDateTime(session.closedAt) : '—'}</span></div>
            </div>
          </div>

          <div className="acp-report-card full" style={{ marginBottom: 20 }}>
            <div className="acp-report-title"><i className="bi bi-clock-history" /> Journal de caisse</div>
            <CounterCashTimeline items={timelineItems} />
          </div>

          {session?.notes && (
            <div className="acp-report-card full" style={{ marginBottom: 20 }}>
              <div className="acp-report-title"><i className="bi bi-chat" /> Observations</div>
              <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>{session.notes}</p>
            </div>
          )}
        </div>
        <div className="acp-modal-footer">
          <button className="acp-btn acp-btn-secondary acp-btn-sm" onClick={() => onAction?.('print')}>
            <i className="bi bi-printer" /> Imprimer
          </button>
          <button className="acp-btn acp-btn-secondary acp-btn-sm" onClick={() => onAction?.('export')}>
            <i className="bi bi-download" /> Exporter PDF
          </button>
          <button className="acp-btn acp-btn-primary" onClick={onClose}>
            <i className="bi bi-check-lg" /> Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CounterCashReport;
