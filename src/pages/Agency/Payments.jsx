import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockPayments, paymentStats } from '@data/paymentData';
import AgencyPaymentStats from '@components/agency/AgencyPaymentStats';
import AgencyPaymentFilters from '@components/agency/AgencyPaymentFilters';
import AgencyPaymentTable from '@components/agency/AgencyPaymentTable';
import AgencyPaymentModal from '@components/agency/AgencyPaymentModal';
import AgencyPaymentSkeleton from '@components/agency/AgencyPaymentSkeleton';

const PAGE_SIZE = 10;

export default function AgencyPayments() {
  const navigate = useNavigate();
  const [loading] = useState(false);
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

  const filteredPayments = useMemo(() => {
    return mockPayments.filter((p) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !p.id.toLowerCase().includes(q) &&
          !p.client.firstName.toLowerCase().includes(q) &&
          !p.client.lastName.toLowerCase().includes(q) &&
          !p.client.phone.includes(q) &&
          !p.route.toLowerCase().includes(q)
        ) return false;
      }
      if (filters.reference && !p.id.toLowerCase().includes(filters.reference.toLowerCase())) return false;
      if (filters.client) {
        const c = filters.client.toLowerCase();
        if (!p.client.firstName.toLowerCase().includes(c) && !p.client.lastName.toLowerCase().includes(c)) return false;
      }
      if (filters.bookingId && !p.bookingId.toLowerCase().includes(filters.bookingId.toLowerCase())) return false;
      if (filters.outlet && !p.outlet.toLowerCase().includes(filters.outlet.toLowerCase())) return false;
      if (filters.agent && !p.agent.toLowerCase().includes(filters.agent.toLowerCase())) return false;
      if (filters.method && p.method !== filters.method) return false;
      if (filters.status && p.status !== filters.status) return false;
      if (filters.dateFrom && new Date(p.createdAt) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(p.createdAt) > new Date(filters.dateTo)) return false;
      if (filters.amountMin && p.totalPaid < Number(filters.amountMin)) return false;
      if (filters.amountMax && p.totalPaid > Number(filters.amountMax)) return false;
      return true;
    });
  }, [filters]);

  const totalPages = Math.ceil(filteredPayments.length / PAGE_SIZE);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleView = (payment) => {
    navigate(`/agency/payments/${payment.id}`);
  };

  const handleEdit = (payment) => {
    // Placeholder — edit logic
  };

  const handleValidate = (payment) => {
    // Placeholder — validate logic
  };

  const handleCancel = (payment) => {
    // Placeholder — cancel logic
  };

  const handleRefund = (payment) => {
    // Placeholder — refund logic
  };

  const handleCreatePayment = (data) => {
    setShowCreateModal(false);
    // Placeholder — create logic
  };

  const handleResetFilters = () => {
    setFilters({
      search: '', reference: '', client: '', bookingId: '',
      outlet: '', agent: '', method: '', status: '',
      dateFrom: '', dateTo: '', amountMin: '', amountMax: '',
    });
    setCurrentPage(1);
  };

  if (loading) {
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

      <AgencyPaymentStats stats={paymentStats} />

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
    </div>
  );
}
