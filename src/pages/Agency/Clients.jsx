import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockClients, clientStats } from '@data/clientData';
import AgencyClientStats from '@components/agency/AgencyClientStats';
import AgencyClientFilters from '@components/agency/AgencyClientFilters';
import AgencyClientTable from '@components/agency/AgencyClientTable';
import AgencyClientSkeleton from '@components/agency/AgencyClientSkeleton';

const PAGE_SIZE = 10;

export default function AgencyClients() {
  const navigate = useNavigate();
  const [loading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    city: '',
    status: '',
    isVip: '',
    tripsMin: '',
    tripsMax: '',
    registeredFrom: '',
    registeredTo: '',
    lastBookingFrom: '',
    lastBookingTo: '',
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredClients = useMemo(() => {
    return mockClients.filter((c) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !c.firstName.toLowerCase().includes(q) &&
          !c.lastName.toLowerCase().includes(q) &&
          !c.email.toLowerCase().includes(q) &&
          !c.phone.includes(q) &&
          !c.city.toLowerCase().includes(q)
        ) return false;
      }
      if (filters.firstName && !c.firstName.toLowerCase().includes(filters.firstName.toLowerCase())) return false;
      if (filters.lastName && !c.lastName.toLowerCase().includes(filters.lastName.toLowerCase())) return false;
      if (filters.phone && !c.phone.includes(filters.phone)) return false;
      if (filters.email && !c.email.toLowerCase().includes(filters.email.toLowerCase())) return false;
      if (filters.city && c.city !== filters.city) return false;
      if (filters.status && c.status !== filters.status) return false;
      if (filters.isVip === 'true' && c.status !== 'vip') return false;
      if (filters.isVip === 'false' && c.status === 'vip') return false;
      if (filters.tripsMin && c.totalTrips < Number(filters.tripsMin)) return false;
      if (filters.tripsMax && c.totalTrips > Number(filters.tripsMax)) return false;
      if (filters.registeredFrom && new Date(c.registeredAt) < new Date(filters.registeredFrom)) return false;
      if (filters.registeredTo && new Date(c.registeredAt) > new Date(filters.registeredTo)) return false;
      if (filters.lastBookingFrom && new Date(c.lastBooking) < new Date(filters.lastBookingFrom)) return false;
      if (filters.lastBookingTo && new Date(c.lastBooking) > new Date(filters.lastBookingTo)) return false;
      return true;
    });
  }, [filters]);

  const totalPages = Math.ceil(filteredClients.length / PAGE_SIZE);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleView = (client) => {
    navigate(`/agency/clients/${client.id}`);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '', firstName: '', lastName: '', phone: '', email: '',
      city: '', status: '', isVip: '', tripsMin: '', tripsMax: '',
      registeredFrom: '', registeredTo: '', lastBookingFrom: '', lastBookingTo: '',
    });
    setCurrentPage(1);
  };

  if (loading) {
    return <AgencyClientSkeleton />;
  }

  return (
    <div className="ac-page">
      <div className="ac-page__header">
        <div className="ac-page__title-group">
          <h1 className="ac-page__title">
            <i className="bi bi-people" />
            Clients
          </h1>
          <span className="ac-page__subtitle">
            {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="ac-page__actions">
          <button className="ac-btn ac-btn--outline" type="button">
            <i className="bi bi-download" />
            Exporter
          </button>
          <button className="ac-btn ac-btn--primary" type="button">
            <i className="bi bi-plus-lg" />
            Nouveau client
          </button>
        </div>
      </div>

      <AgencyClientStats stats={clientStats} />

      <AgencyClientFilters
        filters={filters}
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1);
        }}
        onReset={handleResetFilters}
        onToggleAdvanced={() => setShowAdvanced((p) => !p)}
        showAdvanced={showAdvanced}
      />

      {filteredClients.length === 0 ? (
        <div className="ac-page__empty">
          <i className="bi bi-people" />
          <h2>Aucun client trouvé</h2>
          <p>Modifiez vos filtres pour élargir la recherche.</p>
        </div>
      ) : (
        <AgencyClientTable
          clients={paginatedClients}
          onView={handleView}
          onEdit={() => {}}
          onViewBookings={() => {}}
          onViewTickets={() => {}}
          onViewPayments={() => {}}
          onContact={() => {}}
          onAddNote={() => {}}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalCount={filteredClients.length}
          pageSize={PAGE_SIZE}
        />
      )}
    </div>
  );
}
