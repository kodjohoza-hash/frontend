import { useState, useCallback, useEffect } from 'react';
import CounterCashStats from '@components/counter/CounterCashStats';
import CounterPaymentFilters from '@components/counter/CounterPaymentFilters';
import CounterPaymentTable from '@components/counter/CounterPaymentTable';
import CounterPaymentWizard from '@components/counter/CounterPaymentWizard';
import CounterReceiptPreview from '@components/counter/CounterReceiptPreview';
import CounterRefundModal from '@components/counter/CounterRefundModal';
import CounterCashOpening from '@components/counter/CounterCashOpening';
import CounterCashClosing from '@components/counter/CounterCashClosing';
import CounterCashReport from '@components/counter/CounterCashReport';
import CounterPaymentSkeleton from '@components/counter/CounterPaymentSkeleton';
import {
  payments as allPayments,
  filterPayments,
  sortPayments,
  cashSession,
} from '@data/counterPaymentData';

const CounterPaymentsPage = () => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({ search: '', method: '', status: '', date: '', amountMin: '', amountMax: '' });
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [session, setSession] = useState(cashSession);
  const [showWizard, setShowWizard] = useState(false);
  const [showReceipt, setShowReceipt] = useState(null);
  const [showRefund, setShowRefund] = useState(null);
  const [showOpening, setShowOpening] = useState(false);
  const [showClosing, setShowClosing] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPayments(allPayments);
      setFiltered(allPayments);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let result = filterPayments(payments, filters);
    result = sortPayments(result, sortBy);
    setFiltered(result);
    setPage(1);
  }, [payments, filters, sortBy]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleReset = useCallback(() => {
    setFilters({ search: '', method: '', status: '', date: '', amountMin: '', amountMax: '' });
  }, []);

  const handleAction = useCallback((action, payment) => {
    switch (action) {
      case 'view':
        addToast(`Paiement ${payment.reference} — ${payment.clientName}`, 'info');
        break;
      case 'receipt':
        setShowReceipt(payment);
        break;
      case 'refund':
        setShowRefund(payment);
        break;
      case 'print':
        addToast('Impression en cours', 'info');
        break;
      case 'export':
        addToast('Export PDF en cours', 'info');
        break;
      default: break;
    }
  }, [addToast]);

  const handleWizardComplete = useCallback((newPayment) => {
    setPayments((prev) => [newPayment, ...prev]);
    setShowWizard(false);
    addToast(`Paiement ${newPayment.reference} encaissé avec succès`);
  }, [addToast]);

  const handleRefundConfirm = useCallback((refund) => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === refund.paymentId
          ? {
              ...p,
              status: refund.isPartial ? 'partially_refunded' : 'refunded',
              refundAmount: refund.refundAmount,
              refundReason: refund.reason,
              notes: refund.notes,
            }
          : p
      )
    );
    setShowRefund(null);
    addToast(`Remboursement de ${refund.refundAmount.toLocaleString('fr-FR')} FCFA effectué`);
  }, [addToast]);

  const handleOpenCash = useCallback((data) => {
    setSession((prev) => ({
      ...prev,
      isOpen: true,
      openedAt: data.openedAt,
      openingBalance: data.openingBalance,
      agent: data.agent,
      notes: data.notes,
    }));
    setShowOpening(false);
    addToast('Caisse ouverte avec succès');
  }, [addToast]);

  const handleCloseCash = useCallback((data) => {
    setSession((prev) => ({
      ...prev,
      isOpen: false,
      closedAt: data.closedAt,
      closingBalance: data.closingBalance,
      closingData: data,
    }));
    setShowClosing(false);
    setShowReport(true);
    addToast('Caisse clôturée avec succès');
  }, [addToast]);

  if (loading) return <CounterPaymentSkeleton />;

  return (
    <div className="acp-wrapper">
      <div className="acp-header">
        <div className="acp-header-left">
          <h1 className="acp-title">Gestion des encaissements</h1>
          <p className="acp-subtitle">
            Gérez les paiements et la caisse de votre guichet — <strong>{payments.length}</strong> transactions
          </p>
        </div>
        <div className="acp-header-actions">
          <button className="acp-btn acp-btn-primary" onClick={() => setShowWizard(true)}>
            <i className="bi bi-plus-lg" /> Nouvel encaissement
          </button>
        </div>
      </div>

      {/* Cash Status Bar */}
      <div className="acp-cash-bar">
        <div className="acp-cash-bar-info">
          <div className={`acp-cash-bar-dot ${session.isOpen ? 'open' : 'closed'}`} />
          <div className="acp-cash-bar-text">
            <strong>Caisse {session.isOpen ? 'ouverte' : 'fermée'}</strong>
            {session.isOpen
              ? ` · Ouverte à ${session.openedAt ? new Date(session.openedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}`
              : ' · Aucune session en cours'}
          </div>
        </div>
        <div className="acp-cash-bar-actions">
          {!session.isOpen ? (
            <button className="acp-btn acp-btn-success acp-btn-sm" onClick={() => setShowOpening(true)}>
              <i className="bi bi-box-arrow-in-right" /> Ouvrir la caisse
            </button>
          ) : (
            <>
              <button className="acp-btn acp-btn-secondary acp-btn-sm" onClick={() => setShowClosing(true)}>
                <i className="bi bi-box-arrow-left" /> Clôturer la caisse
              </button>
              <button className="acp-btn acp-btn-secondary acp-btn-sm" onClick={() => setShowReport(true)}>
                <i className="bi bi-file-text" /> Rapport
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <CounterCashStats />

      {/* Filters */}
      <CounterPaymentFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Results Info */}
      <div className="acp-results">
        <span className="acp-results-count">
          <strong>{filtered.length}</strong> paiement{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
          {filtered.length !== payments.length && ` (sur ${payments.length})`}
        </span>
        <select className="acp-sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Plus récents</option>
          <option value="oldest">Plus anciens</option>
          <option value="amount_asc">Montant ↑</option>
          <option value="amount_desc">Montant ↓</option>
        </select>
      </div>

      {/* Table */}
      <CounterPaymentTable
        payments={filtered}
        onAction={handleAction}
        page={page}
        onPageChange={setPage}
      />

      {/* Modals */}
      {showWizard && (
        <CounterPaymentWizard
          onClose={() => setShowWizard(false)}
          onComplete={handleWizardComplete}
        />
      )}

      {showReceipt && (
        <CounterReceiptPreview
          payment={showReceipt}
          onClose={() => setShowReceipt(null)}
        />
      )}

      {showRefund && (
        <CounterRefundModal
          payment={showRefund}
          onClose={() => setShowRefund(null)}
          onConfirm={handleRefundConfirm}
        />
      )}

      {showOpening && (
        <CounterCashOpening
          onClose={() => setShowOpening(false)}
          onConfirm={handleOpenCash}
        />
      )}

      {showClosing && (
        <CounterCashClosing
          session={session}
          payments={payments}
          onClose={() => setShowClosing(false)}
          onConfirm={handleCloseCash}
        />
      )}

      {showReport && (
        <CounterCashReport
          session={session}
          payments={payments}
          onClose={() => setShowReport(false)}
          onAction={handleAction}
        />
      )}

      {/* Toasts */}
      {toasts.length > 0 && (
        <div className="acp-toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`acp-toast acp-toast-${toast.type}`}>
              <i className={`bi ${toast.type === 'success' ? 'bi-check-circle-fill' : toast.type === 'error' ? 'bi-x-circle-fill' : 'bi-info-circle-fill'} acp-toast-icon`} />
              {toast.message}
              <button className="acp-toast-close" onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}>
                <i className="bi bi-x" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CounterPaymentsPage;
