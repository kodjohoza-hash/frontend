import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import usePaymentStore from '@store/payment.store';
import AgencyPaymentStats from '@components/agency/AgencyPaymentStats';
import AgencyPaymentFilters from '@components/agency/AgencyPaymentFilters';
import AgencyPaymentTable from '@components/agency/AgencyPaymentTable';
import AgencyPaymentModal from '@components/agency/AgencyPaymentModal';
import AgencyPaymentSkeleton from '@components/agency/AgencyPaymentSkeleton';

const PAGE_SIZE = 10;

export default function AgencyPayments() {
  const navigate = useNavigate();
  const {
    payments,
    statsCards,
    loading,
    refresh,
    confirmPayment,
    cancelPayment,
    refundPayment,
  } = usePaymentStore();
  const [filters, setFilters] = useState({
    search: '',
    reference: '',
    client: '',
    bookingId: '',
    outlet: '',
    agent: '',
    method: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    refresh().catch(() => {});
  }, [refresh]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !(p.id || '').toLowerCase().includes(q) &&
          !(p.client?.firstName || '').toLowerCase().includes(q) &&
          !(p.client?.lastName || '').toLowerCase().includes(q) &&
          !(p.clientPhone || '').includes(q) &&
          !(p.route || '').toLowerCase().includes(q)
        ) return false;
      }
      if (filters.reference && !(p.id || '').toLowerCase().includes(filters.reference.toLowerCase())) return false;
      if (filters.client) {
        const c = filters.client.toLowerCase();
        if (!(p.client?.firstName || '').toLowerCase().includes(c) && !(p.client?.lastName || '').toLowerCase().includes(c)) return false;
      }
      if (filters.bookingId && !(p.bookingId || '').toLowerCase().includes(filters.bookingId.toLowerCase())) return false;
      if (filters.outlet && !(p.outlet || '').toLowerCase().includes(filters.outlet.toLowerCase())) return false;
      if (filters.agent && !(p.agent || '').toLowerCase().includes(filters.agent.toLowerCase())) return false;
      if (filters.method && p.method !== filters.method) return false;
      if (filters.status && p.status !== filters.status) return false;
      if (filters.dateFrom && p.createdAt && new Date(p.createdAt) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && p.createdAt && new Date(p.createdAt) > new Date(filters.dateTo)) return false;
      if (filters.amountMin && p.totalPaid < Number(filters.amountMin)) return false;
      if (filters.amountMax && p.totalPaid > Number(filters.amountMax)) return false;
      return true;
    });
  }, [payments, filters]);

  const totalPages = Math.ceil(filteredPayments.length / PAGE_SIZE);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleView = (payment) => {
    navigate(`/agency/payments/${payment.id}`);
  };

  const handleEdit = (payment) => {
    addToast(`Modification de ${payment.reference} non disponible ici`, 'info');
  };

  const handleValidate = async (payment) => {
    const result = await confirmPayment(payment.id);
    if (!result.ok) return addToast(result.error || 'Échec de la validation', 'error');
    addToast(result.message || `Paiement ${payment.reference} validé`);
  };

  const handleCancel = async (payment) => {
    const motif = window.prompt(`Motif d'annulation du paiement ${payment.reference} :`, '');
    if (motif === null) return;
    if (!motif) return addToast('Le motif est requis', 'error');
    const result = await cancelPayment(payment.id, motif);
    if (!result.ok) return addToast(result.error || "Échec de l'annulation", 'error');
    addToast(result.message || `Paiement ${payment.reference} annulé`);
  };

  const handleRefund = async (payment) => {
    const montantStr = window.prompt(`Montant à rembourser (max ${payment.totalPaid} XAF) :`, String(payment.totalPaid));
    if (montantStr === null) return;
    const montant = Number(montantStr);
    if (!Number.isFinite(montant) || montant <= 0 || montant > payment.totalPaid) {
      return addToast('Montant invalide', 'error');
    }
    const motif = window.prompt('Motif du remboursement :', '') || '';
    const result = await refundPayment(payment.id, { montant, motif });
    if (!result.ok) return addToast(result.error || 'Échec du remboursement', 'error');
    addToast(result.message || `Remboursement de ${montant.toLocaleString('fr-FR')} XAF effectué`);
  };

  const handleCreatePayment = () => {
    setShowCreateModal(false);
    addToast('Création gérée depuis la vente ou les réservations', 'info');
  };

  const handleResetFilters = () => {
    setFilters({
      search: '', reference: '', client: '', bookingId: '',
      outlet: '', agent: '', method: '', status: '',
      dateFrom: '', dateTo: '', amountMin: '', amountMax: '',
    });
    setCurrentPage(1);
  };

  if (loading && payments.length === 0) {
    return <AgencyPaymentSkeleton />;
  }

  return (
    <div className="ap-page">
      <div className="ap-page__header">
        <div className="ap-page__title-group">
          <h1 className="ap-page__title">
            <i className="bi bi-credit-card" />
            Paiements
          </h1>
          <span className="ap-page__subtitle">
            {filteredPayments.length} paiement{filteredPayments.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="ap-page__actions">
          <button className="ap-btn ap-btn--outline" type="button">
            <i className="bi bi-download" />
            Exporter
          </button>
          <button className="ap-btn ap-btn--primary" type="button" onClick={() => setShowCreateModal(true)}>
            <i className="bi bi-plus-lg" />
            Nouveau paiement
          </button>
        </div>
      </div>

      <AgencyPaymentStats stats={statsCards} />

      <AgencyPaymentFilters
        filters={filters}
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1);
        }}
        onReset={handleResetFilters}
        onToggleAdvanced={() => setShowAdvanced((p) => !p)}
        showAdvanced={showAdvanced}
      />

      {filteredPayments.length === 0 ? (
        <div className="ap-page__empty">
          <i className="bi bi-credit-card" />
          <h2>Aucun paiement trouvé</h2>
          <p>Modifiez vos filtres ou créez un nouveau paiement.</p>
        </div>
      ) : (
        <AgencyPaymentTable
          payments={paginatedPayments}
          onView={handleView}
          onEdit={handleEdit}
          onValidate={handleValidate}
          onCancel={handleCancel}
          onRefund={handleRefund}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalCount={filteredPayments.length}
          pageSize={PAGE_SIZE}
        />
      )}

      <AgencyPaymentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePayment}
        loading={false}
      />

      {toasts.length > 0 && (
        <div className="ap-toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`ap-toast ap-toast-${toast.type}`}>
              <i className={`bi ${toast.type === 'success' ? 'bi-check-circle-fill' : toast.type === 'error' ? 'bi-x-circle-fill' : 'bi-info-circle-fill'}`} />
              {toast.message}
              <button className="ap-toast-close" onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}>
                <i className="bi bi-x-lg" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
