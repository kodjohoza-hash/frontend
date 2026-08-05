import { useState, useCallback, useEffect, useMemo } from 'react';
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
import usePaymentStore from '@store/payment.store';
import {
  filterPayments,
  sortPayments,
  cashSession,
} from '@data/counterPaymentData';

/** Modes backend (minuscules) → clés Counter (capitalisées) pour les filtres. */
const METHOD_TO_COUNTER_KEY = {
  orange_money: 'Orange_Money',
  mtn_money: 'MTN_Mobile_Money',
  carte_bancaire: 'Carte_Bancaire',
  especes: 'Espèces',
  virement_bancaire: 'Virement_Bancaire',
  bon_reduction: 'Bon_Reduction',
  code_promo: 'Code_Promotionnel',
};

/** Paiement du store → forme attendue par les composants Counter. */
const toCounterShape = (p) => ({
  id: p.id,
  reference: p.reference,
  clientName: p.clientName,
  clientPhone: p.clientPhone,
  clientEmail: p.clientEmail,
  bookingRef: p.bookingId,
  ticketRef: p.ticketRef,
  tripFrom: p.tripFrom,
  tripTo: p.tripTo,
  amount: p.amount,
  method: METHOD_TO_COUNTER_KEY[p.method] || p.method,
  methodLabel: p.methodLabel,
  methodIcon: p.methodIcon,
  methodColor: p.methodColor,
  status: p.statusEn,
  agent: p.agent,
  createdAt: p.createdAt,
  notes: p.notes,
  refundAmount: p.remboursement,
  refundReason: p.motifRemboursement,
});

const CounterPaymentsPage = () => {
  const {
    payments: storePayments,
    loading: storeLoading,
    refresh,
    refundPayment,
  } = usePaymentStore();
  const [localExtra, setLocalExtra] = useState([]);
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
    refresh().catch(() => {});
  }, [refresh]);

  /** Paiements du store (forme Counter) + encaissements locaux du wizard. */
  const payments = useMemo(
    () => [...localExtra, ...storePayments.map(toCounterShape)],
    [localExtra, storePayments]
  );

  const filtered = useMemo(() => {
    let result = filterPayments(payments, filters);
    result = sortPayments(result, sortBy);
    return result;
  }, [payments, filters, sortBy]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setFilters({ search: '', method: '', status: '', date: '', amountMin: '', amountMax: '' });
    setPage(1);
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
    setLocalExtra((prev) => [newPayment, ...prev]);
    setShowWizard(false);
    addToast(`Paiement ${newPayment.reference} encaissé avec succès`);
  }, [addToast]);

  const handleRefundConfirm = useCallback(async (refund) => {
    const result = await refundPayment(refund.paymentId, {
      montant: refund.refundAmount,
      motif: refund.reason,
      note: refund.notes,
    });
    if (!result.ok) {
      addToast(result.error || 'Échec du remboursement', 'error');
      return;
    }
    setShowRefund(null);
    addToast(`Remboursement de ${refund.refundAmount.toLocaleString('fr-FR')} FCFA effectué`);
  }, [addToast, refundPayment]);

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

  if (storeLoading && storePayments.length === 0) return <CounterPaymentSkeleton />;

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
        <select className="acp-sort-select" value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }}>
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
