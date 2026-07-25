import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockBookings as allBookings, bookingStats as statsData } from '@data/bookingData';
import AgencyBookingStats from '@components/agency/AgencyBookingStats';
import AgencyBookingFilters from '@components/agency/AgencyBookingFilters';
import AgencyBookingTable from '@components/agency/AgencyBookingTable';
import AgencyBookingModal from '@components/agency/AgencyBookingModal';
import AgencyBookingSkeleton from '@components/agency/AgencyBookingSkeleton';

const PAGE_SIZE = 10;

export default function AgencyBookings() {
  const navigate = useNavigate();
  const [loading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    channel: '',
    paymentMethod: '',
    dateFrom: '',
    dateTo: '',
    trip: '',
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredBookings = useMemo(() => {
    return allBookings.filter((b) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !b.id.toLowerCase().includes(q) &&
          !b.client.fullName.toLowerCase().includes(q) &&
          !b.client.phone.includes(q) &&
          !b.client.email.toLowerCase().includes(q)
        ) return false;
      }
      if (filters.status && b.payment.status !== filters.status) return false;
      if (filters.channel && b.channel !== filters.channel) return false;
      if (filters.paymentMethod && b.payment.method !== filters.paymentMethod) return false;
      if (filters.dateFrom && new Date(b.date) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(b.date) > new Date(filters.dateTo)) return false;
      if (filters.trip) {
        const t = filters.trip.toLowerCase();
        if (
          !b.trip.route.toLowerCase().includes(t) &&
          !b.trip.departure.toLowerCase().includes(t) &&
          !b.trip.destination.toLowerCase().includes(t)
        ) return false;
      }
      return true;
    });
  }, [filters]);

  const totalPages = Math.ceil(filteredBookings.length / PAGE_SIZE);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleView = (booking) => {
    navigate(`/agency/bookings/${booking.id}`);
  };

  const handleConfirm = (booking) => {
    // Placeholder — confirm logic would go here
  };

  const handleCancel = (booking) => {
    // Placeholder — cancel logic would go here
  };

  const handleRefund = (booking) => {
    // Placeholder — refund logic would go here
  };

  const handleCreateBooking = (data) => {
    setShowCreateModal(false);
    // Placeholder — create logic would go here
  };

  const handleResetFilters = () => {
    setFilters({ search: '', status: '', channel: '', paymentMethod: '', dateFrom: '', dateTo: '', trip: '' });
    setCurrentPage(1);
  };

  if (loading) {
    return <AgencyBookingSkeleton />;
  }

  return (
    <div className="abr-page">
      <div className="abr-page__header">
        <div className="abr-page__title-group">
          <h1 className="abr-page__title">
            <i className="bi bi-ticket-perforated" />
            Réservations
          </h1>
          <span className="abr-page__subtitle">
            {filteredBookings.length} réservation{filteredBookings.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="abr-page__actions">
          <button className="abr-btn abr-btn--outline" type="button">
            <i className="bi bi-download" />
            Exporter
          </button>
          <button className="abr-btn abr-btn--primary" type="button" onClick={() => setShowCreateModal(true)}>
            <i className="bi bi-plus-lg" />
            Nouvelle réservation
          </button>
        </div>
      </div>

      <AgencyBookingStats stats={statsData} />

      <AgencyBookingFilters
        filters={filters}
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1);
        }}
        onReset={handleResetFilters}
        onToggleAdvanced={() => setShowAdvanced((p) => !p)}
        showAdvanced={showAdvanced}
      />

      {filteredBookings.length === 0 ? (
        <div className="abr-page__empty">
          <i className="bi bi-ticket-perforated" />
          <h2>Aucune réservation trouvée</h2>
          <p>Modifiez vos filtres ou créez une nouvelle réservation.</p>
        </div>
      ) : (
        <AgencyBookingTable
          bookings={paginatedBookings}
          onView={handleView}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          onRefund={handleRefund}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalCount={filteredBookings.length}
          pageSize={PAGE_SIZE}
        />
      )}

      <AgencyBookingModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateBooking}
        loading={false}
      />
    </div>
  );
}
